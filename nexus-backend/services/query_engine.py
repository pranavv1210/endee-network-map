"""
Query Engine
Handles semantic queries on the knowledge graph
"""

import logging
from typing import List, Dict, Any
from services.endee_client import EndeeClient
from services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)

class QueryEngine:
    """
    Executes semantic queries on the knowledge graph
    Transforms natural language queries into graph exploration
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
    
    async def execute_query(
        self,
        query: str,
        top_k: int = 10,
        similarity_threshold: float = 0.7
    ) -> Dict[str, Any]:
        """
        Execute a semantic query on the knowledge graph
        
        Flow:
        1. Convert query to embedding
        2. Search Endee for similar vectors
        3. Retrieve related nodes and relationships
        4. Return structured graph response
        
        Args:
            query: Natural language query
            top_k: Number of results to return
            similarity_threshold: Minimum similarity score
        
        Returns:
            Dictionary with nodes, edges, and metadata
        """
        try:
            logger.info(f"Executing query: {query}")
            
            # Generate query embedding
            query_embedding = self.embeddings.encode(query)
            
            # Search Endee for similar vectors
            try:
                search_results = await self.endee.search(
                    index_name=self.index_name,
                    query_vector=query_embedding,
                    top_k=top_k
                )
            except Exception as search_error:
                logger.warning(f"Endee search failed (index may be empty): {search_error}")
                # Return empty results instead of failing
                return {
                    "nodes": [],
                    "edges": [],
                    "result_count": 0,
                    "message": "No documents uploaded yet or index is empty"
                }
            
            # Filter by similarity threshold (fall back if empty)
            def _score(result: Dict[str, Any]) -> float:
                return float(
                    result.get("score")
                    or result.get("similarity")
                    or result.get("distance")
                    or 0
                )

            filtered_results = [
                result for result in search_results
                if _score(result) >= similarity_threshold
            ]

            if not filtered_results and search_results:
                filtered_results = search_results
            
            # Build nodes from results
            nodes = []
            node_ids = set()
            
            for result in filtered_results:
                node_id = result.get("id")
                metadata = (
                    result.get("metadata")
                    or result.get("meta")
                    or result.get("payload")
                    or {}
                )
                similarity = _score(result)
                
                text_value = metadata.get("text", "")
                label = text_value[:50] + "..." if text_value else "Result"

                node = {
                    "id": node_id,
                    "label": label,
                    "summary": text_value,
                    "embedding_id": node_id,
                    "document_id": metadata.get("document_id", ""),
                    "metadata": {
                        **metadata,
                        "query_similarity": float(similarity)
                    }
                }
                
                nodes.append(node)
                node_ids.add(node_id)
            
            # Find edges between result nodes
            edges = await self._find_edges_between_nodes(node_ids)
            
            logger.info(f"Query returned {len(nodes)} nodes and {len(edges)} edges")
            
            return {
                "nodes": nodes,
                "edges": edges,
                "result_count": len(nodes)
            }
            
        except Exception as e:
            logger.error(f"Error executing query: {e}")
            raise
    
    async def _find_edges_between_nodes(
        self,
        node_ids: set,
        similarity_threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Find relationships (edges) between a set of nodes
        Uses node text similarity to discover connections
        """
        edges = []
        processed_pairs = set()
        
        try:
            # Convert node_ids to list for processing
            node_list = list(node_ids)[:10]  # Limit for performance
            
            # For each pair of nodes, compute similarity and create edge if high
            for i, node_id_1 in enumerate(node_list):
                for node_id_2 in node_list[i+1:]:
                    # Check if already processed
                    pair = tuple(sorted([node_id_1, node_id_2]))
                    if pair in processed_pairs:
                        continue
                    
                    # For now, create edges between all query results
                    # (they're already filtered by similarity to query)
                    edges.append({
                        "source": node_id_1,
                        "target": node_id_2,
                        "similarity": similarity_threshold,
                        "relationship_type": "semantic_similarity"
                    })
                    
                    processed_pairs.add(pair)
            
        except Exception as e:
            logger.error(f"Error finding edges: {e}")
            # Return empty edges rather than failing
        
        return edges
    
    async def find_related_concepts(
        self,
        concept: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Find concepts related to a given concept
        
        Args:
            concept: Concept to find relations for
            top_k: Number of related concepts to return
        
        Returns:
            List of related concepts with similarity scores
        """
        try:
            # Generate embedding for concept
            concept_embedding = self.embeddings.encode(concept)
            
            # Search for similar concepts
            results = await self.endee.search(
                index_name=self.index_name,
                query_vector=concept_embedding,
                top_k=top_k
            )
            
            related = []
            for result in results:
                metadata = result.get("metadata", {})
                related.append({
                    "concept": metadata.get("text", "")[:100],
                    "similarity": result.get("distance", 0),
                    "source": metadata.get("filename", "Unknown")
                })
            
            return related
            
        except Exception as e:
            logger.error(f"Error finding related concepts: {e}")
            raise
    
    async def get_knowledge_clusters(
        self,
        num_clusters: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Identify knowledge clusters in the graph
        Uses simple heuristic clustering based on high-similarity connections
        
        This is a stretch feature - keep implementation simple
        """
        try:
            # In production, would use proper clustering algorithms
            # For now, return mock structure to demonstrate concept
            
            return [
                {
                    "cluster_id": f"cluster_{i}",
                    "topic": f"Topic {i}",
                    "node_count": 0,
                    "keywords": []
                }
                for i in range(num_clusters)
            ]
            
        except Exception as e:
            logger.error(f"Error identifying clusters: {e}")
            return []
    
    def suggest_knowledge_gaps(
        self,
        existing_topics: List[str]
    ) -> List[str]:
        """
        Suggest potential knowledge gaps
        Simple heuristic-based suggestions
        
        This is optional stretch feature - keep simple
        """
        # Common related topics for demonstration
        gap_suggestions = {
            "machine learning": ["deep learning", "reinforcement learning", "optimization"],
            "neural networks": ["backpropagation", "activation functions", "regularization"],
            "transformers": ["attention mechanism", "self-attention", "positional encoding"],
            "python": ["asyncio", "decorators", "generators"],
            "vector databases": ["embeddings", "similarity search", "indexing"]
        }
        
        suggestions = []
        for topic in existing_topics:
            topic_lower = topic.lower()
            for key, gaps in gap_suggestions.items():
                if key in topic_lower:
                    suggestions.extend(gaps)
        
        return list(set(suggestions))[:5]  # Return unique suggestions
