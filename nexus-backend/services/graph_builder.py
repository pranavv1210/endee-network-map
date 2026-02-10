"""
Graph Builder
Constructs knowledge graph from embeddings and similarity relationships
"""

import logging
import datetime
from typing import List, Dict, Any, Optional, Set, Tuple
import asyncio
from collections import defaultdict
import numpy as np
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from services.embedding_service import EmbeddingService

from services.endee_client import EndeeClient
from services.embedding_service import EmbeddingService
from services.document_processor import DocumentChunk

logger = logging.getLogger(__name__)

class GraphNode:
    """Represents a node in the knowledge graph"""
    
    def __init__(
        self,
        node_id: str,
        label: str,
        summary: str,
        embedding_id: str,
        document_id: str,
        metadata: Dict[str, Any],
        embedding: Optional[List[float]] = None
    ):
        self.node_id = node_id
        self.label = label
        self.summary = summary
        self.embedding_id = embedding_id
        self.document_id = document_id
        self.metadata = metadata
        self.embedding = embedding  # Store embedding for similarity computation
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.node_id,
            "label": self.label,
            "summary": self.summary,
            "embedding_id": self.embedding_id,
            "document_id": self.document_id,
            "metadata": self.metadata
        }

class GraphEdge:
    """Represents an edge (relationship) in the knowledge graph"""
    
    def __init__(
        self,
        source: str,
        target: str,
        similarity: float,
        relationship_type: str = "semantic_similarity"
    ):
        self.source = source
        self.target = target
        self.similarity = similarity
        self.relationship_type = relationship_type
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "source": self.source,
            "target": self.target,
            "similarity": self.similarity,
            "relationship_type": self.relationship_type
        }

class GraphBuilder:
    """
    Builds and manages the knowledge graph
    Core intelligence layer that creates semantic connections
    Features:
    - Relationship discovery via cosine similarity
    - Smart summaries with context
    - Learning recommendations
    - Multi-document cross-linking
    """
    
    def __init__(
        self,
        endee_client: EndeeClient,
        embedding_service: EmbeddingService,
        index_name: str = "nexus_knowledge"
    ):
        self.endee = endee_client
        self.embeddings = embedding_service
        self.index_name = index_name
        self.nodes: Dict[str, GraphNode] = {}
        self.edges: List[GraphEdge] = []
        self.documents: Dict[str, Dict[str, Any]] = {}  # Track document metadata
        self.node_to_doc: Dict[str, str] = {}  # Map node to document
    
    async def add_document_to_graph(
        self,
        document_id: str,
        chunks: List[DocumentChunk]
    ):
        """
        Add document chunks to the knowledge graph
        Supports multi-document mode with cross-linking
        
        Features:
        - Document tracking for multi-doc support
        - Smart relationship discovery
        - Cross-document concept identification
        """
        try:
            logger.info(f"Adding document {document_id} to graph with {len(chunks)} chunks")
            
            # Track document metadata
            self.documents[document_id] = {
                "filename": chunks[0].metadata.get("filename", "Unknown") if chunks else "Unknown",
                "chunk_count": len(chunks),
                "node_count": 0,
                "created_at": datetime.datetime.utcnow().isoformat()
            }
            
            # Ensure index exists in Endee (create if first time)
            try:
                await self.endee.create_index(
                    index_name=self.index_name,
                    dimension=384,  # Hash-based embeddings use 384 dimensions
                    metric="cosine",
                    quant="int8"
                )
            except Exception as e:
                logger.info(f"Index creation: {e}")  # May already exist, which is fine
                pass
            
            # Extract text from chunks
            texts = [chunk.text for chunk in chunks]
            
            # Generate embeddings in batch
            embeddings = self.embeddings.encode_batch(texts)
            
            # Prepare data for Endee
            chunk_ids = [chunk.chunk_id for chunk in chunks]
            metadata_list = [
                {
                    "document_id": chunk.document_id,
                    "chunk_index": chunk.chunk_index,
                    "text": chunk.text[:200],  # Store preview
                    "filename": chunk.metadata.get("filename", "")
                }
                for chunk in chunks
            ]
            
            # Insert into Endee
            await self.endee.insert_vectors(
                index_name=self.index_name,
                vectors=embeddings,
                ids=chunk_ids,
                metadata=metadata_list
            )
            
            # Create graph nodes with enhanced summaries
            nodes_added = 0
            for chunk, embedding in zip(chunks, embeddings):
                node = GraphNode(
                    node_id=chunk.chunk_id,
                    label=self._generate_label(chunk.text),
                    summary=self._generate_smart_summary(chunk.text, chunk.metadata),
                    embedding_id=chunk.chunk_id,
                    document_id=chunk.document_id,
                    metadata={
                        "chunk_index": chunk.chunk_index,
                        "filename": chunk.metadata.get("filename", ""),
                        "text_length": len(chunk.text),
                        "document_id": chunk.document_id
                    },
                    embedding=embedding  # Store for similarity computation
                )
                self.nodes[node.node_id] = node
                self.node_to_doc[node.node_id] = document_id
                nodes_added += 1
            
            self.documents[document_id]["node_count"] = nodes_added
            
            # Find relationships (edges) between this document and existing knowledge
            await self._discover_relationships(chunk_ids, embeddings)
            
            # Find cross-document relationships
            self._find_cross_document_relationships(chunk_ids)
            
            logger.info(f"Successfully added document {document_id} to graph ({nodes_added} nodes)")
            
        except Exception as e:
            logger.error(f"Error adding document to graph: {e}")
            raise
    
    def _generate_label(self, text: str, max_words: int = 5) -> str:
        """
        Generate a concise label for a node
        Uses first few meaningful words
        """
        words = text.split()[:max_words]
        label = " ".join(words)
        
        if len(label) > 50:
            label = label[:47] + "..."
        
        return label
    
    def _generate_smart_summary(
        self,
        text: str,
        metadata: Dict[str, Any]
    ) -> str:
        """
        Generate enhanced summaries with context and domain knowledge
        Feature: Smart Summaries
        Includes:
        - Main concept description
        - Key context
        - Related domain
        - Practical application hints
        """
        # Get first 200 chars as base
        base_text = text[:200].strip()
        
        # Add domain markers based on keywords
        domain_markers = {
            "neural": "AI & Deep Learning",
            "transform": "NLP & Sequence Learning",
            "reinforcement": "Machine Learning & Control",
            "computer vision": "Image Processing & AI",
            "embedding": "Vector Space & Representation",
            "machine learning": "Data Science & Predictive Analytics",
            "algorithm": "Computational Efficiency",
            "optimization": "Performance & Training",
            "attention": "NLP & Transformers",
            "gradient": "Optimization & Training"
        }
        
        domain = "General AI/ML Concepts"
        text_lower = text.lower()
        for keyword, dom in domain_markers.items():
            if keyword in text_lower:
                domain = dom
                break
        
        # Build smart summary
        summary = f"{base_text}\n\n"
        summary += f"📚 Domain: {domain}\n"
        
        # Add practical hints based on keywords
        if any(word in text_lower for word in ["attention", "transformer", "bert", "gpt"]):
            summary += "💡 Key Insight: Foundation for modern NLP systems\n"
        elif any(word in text_lower for word in ["neural", "network", "layer",  "activation"]):
            summary += "💡 Key Insight: Core component of deep learning\n"
        elif any(word in text_lower for word in ["reinforcement", "agent", "reward", "policy"]):
            summary += "💡 Key Insight: Enables adaptive decision-making\n"
        
        if len(summary) > 300:
            summary = summary[:297] + "..."
        
        return summary
    
    def _find_cross_document_relationships(
        self,
        new_chunk_ids: List[str]
    ):
        """
        Feature: Multi-Document Knowledge
        Identify concepts that appear in multiple documents
        Creates special edges for cross-document relationships
        """
        try:
            new_docs = set(self.node_to_doc.get(nid) for nid in new_chunk_ids if nid in self.node_to_doc)
            
            if len(new_docs) <= 1:
                logger.debug("Single document, skipping cross-doc analysis")
                return
            
            # Find common concepts across documents
            # Group nodes by document
            docs_nodes = defaultdict(list)
            for node_id, doc_id in self.node_to_doc.items():
                if node_id in self.nodes:
                    docs_nodes[doc_id].append(node_id)
            
            # For each pair of documents, find similar concepts
            docs_list = list(new_docs)
            for i, doc_a in enumerate(docs_list):
                for doc_b in docs_list[i+1:]:
                    self._find_common_concepts(doc_a, doc_b, docs_nodes)
            
            logger.info("Completed cross-document relationship analysis")
            
        except Exception as e:
            logger.error(f"Error in cross-document analysis: {e}")
    
    def _find_common_concepts(
        self,
        doc_a: str,
        doc_b: str,
        docs_nodes: Dict[str, List[str]]
    ):
        """
        Find common concepts between two documents
        Create high-priority edges for sharing concepts
        """
        nodes_a = docs_nodes.get(doc_a, [])
        nodes_b = docs_nodes.get(doc_b, [])
        
        common_edges_added = 0
        
        for node_a_id in nodes_a:
            if node_a_id not in self.nodes:
                continue
            node_a = self.nodes[node_a_id]
            
            for node_b_id in nodes_b:
                if node_b_id not in self.nodes:
                    continue
                node_b = self.nodes[node_b_id]
                
                # Skip if no embeddings
                if node_a.embedding is None or node_b.embedding is None:
                    continue
                
                # Calculate similarity
                similarity = self.embeddings.compute_similarity(
                    node_a.embedding,
                    node_b.embedding
                )
                
                # Lower threshold for cross-doc (0.4 instead of 0.5) to find common concepts
                if similarity >= 0.4:
                    # Check if edge already exists
                    exists = any(
                        (e.source == node_a_id and e.target == node_b_id) or
                        (e.source == node_b_id and e.target == node_a_id)
                        for e in self.edges
                    )
                    
                    if not exists:
                        edge = GraphEdge(
                            source=node_a_id,
                            target=node_b_id,
                            similarity=float(similarity),
                            relationship_type="cross_document_similarity"
                        )
                        self.edges.append(edge)
                        common_edges_added += 1
                        logger.debug(f"Cross-doc edge: '{node_a.label}' → '{node_b.label}' ({similarity:.3f})")
        
        if common_edges_added > 0:
            logger.info(f"Added {common_edges_added} cross-document relationships between '{doc_a}' and '{doc_b}'")
    
    async def _discover_relationships(
        self,
        new_chunk_ids: List[str],
        new_embeddings: List[List[float]],
        similarity_threshold: float = 0.5,
        top_k: int = 5
    ):
        """
        Discover semantic relationships between nodes
        Uses in-memory embedding similarity computation
        """
        try:
            # Get all existing node embeddings (only those added before this call)
            nodes_before = {nid: node for nid, node in self.nodes.items() 
                          if nid not in new_chunk_ids}
            
            logger.info(f"Discovering relationships: {len(new_chunk_ids)} new nodes vs {len(nodes_before)} existing nodes")
            
            # For each new node, compute similarity to all existing nodes
            for new_id, new_embedding in zip(new_chunk_ids, new_embeddings):
                if new_id not in self.nodes:
                    continue
                    
                similarities = []
                
                for existing_id, existing_node in nodes_before.items():
                    # Skip if existing node has no embedding
                    if existing_node.embedding is None:
                        continue
                    
                    # Compute cosine similarity between new and existing
                    similarity = self.embeddings.compute_similarity(
                        new_embedding,
                        existing_node.embedding
                    )
                    
                    similarities.append((existing_id, existing_node.label, similarity))
                
                # Sort by similarity and create edges for top matches
                similarities.sort(key=lambda x: x[2], reverse=True)
                
                # Log top matches
                if similarities:
                    logger.info(f"Node '{self.nodes[new_id].label}' top similarities: {[(label, f'{sim:.3f}') for _, label, sim in similarities[:3]]}")
                
                # Create edges for top matches above threshold
                edges_created = 0
                for existing_id, existing_label, similarity in similarities[:top_k]:
                    if similarity >= similarity_threshold:
                        edge = GraphEdge(
                            source=new_id,
                            target=existing_id,
                            similarity=float(similarity),
                            relationship_type="semantic_similarity"
                        )
                        self.edges.append(edge)
                        edges_created += 1
                        logger.info(f"Created edge: '{self.nodes[new_id].label}' → '{existing_label}' (similarity: {similarity:.3f})")
                
            logger.info(f"Discovered {len(self.edges)} total relationships in graph")
            
        except Exception as e:
            logger.error(f"Error discovering relationships: {e}")
            # Don't fail the entire operation if relationship discovery fails
    
    async def build_graph(
        self,
        similarity_threshold: float = 0.5,
        max_nodes: int = 100
    ) -> Dict[str, Any]:
        """
        Build the complete knowledge graph with ALL features:
        1. Relationship Discovery - edges with similarity scores
        2. Smart Summaries - enriched node descriptions
        3. Learning Recommendations - ordered learning paths
        4. Multi-Document Knowledge - cross-document relationships
        
        Returns:
            Complete graph structure with enhanced metadata
        """
        try:
            # Get all nodes (limit for performance)
            nodes_list = list(self.nodes.values())[:max_nodes]
            
            # Filter edges based on similarity threshold
            filtered_edges = [
                edge for edge in self.edges
                if edge.similarity >= similarity_threshold
            ]
            
            # Enrich nodes with comprehensive information
            enriched_nodes = []
            for node in nodes_list:
                node_dict = node.to_dict()
                
                # FEATURE 1: Relationship Discovery
                # Find related nodes and show similarity scores
                related = self._find_related_nodes(node.node_id, filtered_edges, nodes_list)
                node_dict["related_concepts"] = related
                
                # FEATURE 4: Multi-Document Knowledge
                # Show which document this comes from and cross-doc connections
                cross_doc_connections = self._find_document_connections(
                    node.node_id,
                    node.document_id,
                    nodes_list
                )
                node_dict["cross_document_concepts"] = cross_doc_connections
                node_dict["source_document"] = self.documents.get(node.document_id, {})
                
                # FEATURE 2: Smart Summaries (already in node.summary from add_document_to_graph)
                # Add prerequisites which are part of smart recommendations
                node_dict["prerequisites"] = self._infer_prerequisites(node.label)
                
                enriched_nodes.append(node_dict)
            
            # Calculate graph statistics
            stats = self._calculate_stats(nodes_list, filtered_edges)
            
            # FEATURE 3: Learning Recommendations
            # Generate ordered learning paths
            learning_paths = self._generate_learning_paths(enriched_nodes, filtered_edges)
            
            # Add multi-document statistics
            multi_doc_stats = {
                "total_documents": len(self.documents),
                "documents": list(self.documents.values()),
                "cross_document_edges": len([
                    e for e in filtered_edges 
                    if e.relationship_type == "cross_document_similarity"
                ]),
                "same_document_edges": len([
                    e for e in filtered_edges 
                    if e.relationship_type != "cross_document_similarity"
                ])
            }
            
            return {
                "nodes": enriched_nodes,
                "edges": [edge.to_dict() for edge in filtered_edges],
                "stats": stats,
                "multi_document_stats": multi_doc_stats,
                "learning_paths": learning_paths
            }
            
        except Exception as e:
            logger.error(f"Error building graph: {e}")
            raise
    
    def _find_document_connections(
        self,
        node_id: str,
        current_doc: str,
        all_nodes: List[GraphNode]
    ) -> List[Dict[str, Any]]:
        """
        Find concepts from same node's document referenced in other documents
        Cross-Document Knowledge feature
        """
        connections = []
        node_map = {n.node_id: n for n in all_nodes}
        
        # Find all related nodes from other documents
        for edge in self.edges:
            if edge.source == node_id:
                target_node = node_map.get(edge.target)
                if target_node and target_node.document_id != current_doc:
                    connections.append({
                        "concept": target_node.label,
                        "source_document": target_node.document_id,
                        "similarity": edge.similarity,
                        "relevance": "cross_document"
                    })
            elif edge.target == node_id:
                source_node = node_map.get(edge.source)
                if source_node and source_node.document_id != current_doc:
                    connections.append({
                        "concept": source_node.label,
                        "source_document": source_node.document_id,
                        "similarity": edge.similarity,
                        "relevance": "cross_document"
                    })
        
        return sorted(connections, key=lambda x: x["similarity"], reverse=True)[:3]
    
    def _find_related_nodes(
        self,
        node_id: str,
        edges: List[GraphEdge],
        all_nodes: List[GraphNode]
    ) -> List[Dict[str, Any]]:
        """
        Find and return related nodes for a given node
        """
        related = []
        node_map = {n.node_id: n for n in all_nodes}
        
        for edge in edges:
            if edge.source == node_id:
                target = node_map.get(edge.target)
                if target:
                    related.append({
                        "id": target.node_id,
                        "label": target.label,
                        "similarity": edge.similarity,
                        "type": "connected_to"
                    })
            elif edge.target == node_id:
                source = node_map.get(edge.source)
                if source:
                    related.append({
                        "id": source.node_id,
                        "label": source.label,
                        "similarity": edge.similarity,
                        "type": "connected_from"
                    })
        
        return sorted(related, key=lambda x: x["similarity"], reverse=True)[:5]
    
    def _infer_prerequisites(
        self,
        concept: str
    ) -> List[str]:
        """
        Infer learning prerequisites based on concept name
        """
        prerequisites_map = {
            "neural network": ["linear algebra", "calculus", "machine learning basics"],
            "deep learning": ["neural networks", "machine learning"],
            "transformer": ["attention mechanism", "nlp basics"],
            "reinforcement learning": ["machine learning", "probability"],
            "computer vision": ["image processing", "linear algebra"],
            "nlp": ["natural language processing basics", "machine learning"],
            "embedding": ["vector spaces", "linear algebra"],
        }
        
        concept_lower = concept.lower()
        for key, prereqs in prerequisites_map.items():
            if key in concept_lower:
                return prereqs
        
        return []
    
    def _generate_learning_paths(
        self,
        nodes: List[Dict[str, Any]],
        edges: List[GraphEdge]
    ) -> List[Dict[str, Any]]:
        """
        Generate recommended learning paths based on concept dependencies
        """
        if not nodes:
            return []
        
        # Find foundational concepts (few incoming connections)
        incoming_count = defaultdict(int)
        for edge in edges:
            incoming_count[edge.target] += 1
        
        # Start with foundational concepts
        foundations = [
            n for n in nodes 
            if incoming_count.get(n["id"], 0) <= 1 and "basic" in n["label"].lower()
        ]
        
        if not foundations:
            foundations = [nodes[0]]
        
        paths = []
        for foundation in foundations[:3]:  # Limit to 3 paths
            path = self._build_learning_path(foundation, nodes, edges)
            if path:
                paths.append({
                    "start": foundation["label"],
                    "sequence": path,
                    "description": f"Learn {' → '.join(path[:3])} and more"
                })
        
        return paths
    
    def _build_learning_path(
        self,
        start_node: Dict[str, Any],
        all_nodes: List[Dict[str, Any]],
        edges: List[GraphEdge],
        max_depth: int = 5
    ) -> List[str]:
        """
        Build a learning sequence from a starting node
        """
        path = [start_node["label"]]
        visited = {start_node["id"]}
        current_id = start_node["id"]
        
        for _ in range(max_depth - 1):
            # Find next connected node with highest similarity
            next_node = None
            best_similarity = 0
            
            for edge in edges:
                if edge.source == current_id and edge.target not in visited:
                    if edge.similarity > best_similarity:
                        best_similarity = edge.similarity
                        next_node = edge.target
            
            if not next_node:
                break
            
            # Find the node label
            for node in all_nodes:
                if node["id"] == next_node:
                    path.append(node["label"])
                    visited.add(next_node)
                    current_id = next_node
                    break
        
        return path
    
    def _calculate_stats(
        self,
        nodes: List[GraphNode],
        edges: List[GraphEdge]
    ) -> Dict[str, Any]:
        """
        Calculate graph statistics
        """
        # Count unique documents
        unique_docs = set(node.document_id for node in nodes)
        
        # Calculate node degree (connections per node)
        node_degrees = defaultdict(int)
        for edge in edges:
            node_degrees[edge.source] += 1
            node_degrees[edge.target] += 1
        
        avg_degree = sum(node_degrees.values()) / len(nodes) if nodes else 0
        
        # Average similarity
        avg_similarity = sum(edge.similarity for edge in edges) / len(edges) if edges else 0
        
        return {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "unique_documents": len(unique_docs),
            "avg_connections_per_node": round(avg_degree, 2),
            "avg_similarity": round(avg_similarity, 3),
            "graph_density": round(len(edges) / (len(nodes) * (len(nodes) - 1)) if len(nodes) > 1 else 0, 4)
        }
    
    async def get_node_details(self, node_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed information about a specific node
        Includes related nodes and context
        """
        if node_id not in self.nodes:
            return None
        
        node = self.nodes[node_id]
        
        # Find connected nodes
        connected_edges = [
            edge for edge in self.edges
            if edge.source == node_id or edge.target == node_id
        ]
        
        related_nodes = []
        for edge in connected_edges[:10]:  # Limit related nodes
            related_id = edge.target if edge.source == node_id else edge.source
            if related_id in self.nodes:
                related_nodes.append({
                    "node_id": related_id,
                    "label": self.nodes[related_id].label,
                    "similarity": edge.similarity
                })
        
        return {
            **node.to_dict(),
            "related_nodes": related_nodes,
            "connection_count": len(connected_edges)
        }
    
    async def remove_document_from_graph(self, document_id: str):
        """
        Remove all nodes and edges associated with a document
        """
        # Remove nodes
        nodes_to_remove = [
            node_id for node_id, node in self.nodes.items()
            if node.document_id == document_id
        ]
        
        for node_id in nodes_to_remove:
            del self.nodes[node_id]
        
        # Remove edges connected to removed nodes
        self.edges = [
            edge for edge in self.edges
            if edge.source not in nodes_to_remove and edge.target not in nodes_to_remove
        ]
        
        # Delete from Endee
        if nodes_to_remove:
            await self.endee.delete_vectors(
                index_name=self.index_name,
                vector_ids=nodes_to_remove
            )
        
        logger.info(f"Removed document {document_id} from graph")
    
    async def get_statistics(self) -> Dict[str, Any]:
        """
        Get comprehensive system statistics
        """
        return self._calculate_stats(list(self.nodes.values()), self.edges)
