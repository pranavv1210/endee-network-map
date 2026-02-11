"""
Nexus Backend - FastAPI Application
Vector-native knowledge intelligence system powered by Endee
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
import httpx
import os
from pathlib import Path
import logging
import json
import time
from datetime import datetime
from functools import wraps

from services.document_processor import DocumentProcessor
from services.embedding_service import EmbeddingService
from services.endee_client import EndeeClient
from services.graph_builder import GraphBuilder
from services.query_engine import QueryEngine
from services.device_graph_store import DeviceGraphStore

# Configure structured logging with JSON format
class JSONFormatter(logging.Formatter):
    """JSON log formatter for structured logging"""
    def format(self, record):
        log_obj = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
        }
        if record.exc_info:
            log_obj['exception'] = self.formatException(record.exc_info)
        return json.dumps(log_obj)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger.handlers = [handler]

# Initialize FastAPI app
app = FastAPI(
    title="Nexus - AI Knowledge Network",
    description="Transform static knowledge into a living intelligence graph",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
        "https://endee-network-map.vercel.app",
        "https://nexus-backend-qmn5.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
ENDEE_URL = os.getenv("ENDEE_URL", "http://localhost:3001")
ENDEE_INDEX = "nexus_knowledge"
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Initialize services
endee_client = EndeeClient(ENDEE_URL)
embedding_service = EmbeddingService()
document_processor = DocumentProcessor()

# Device-based graph isolation: each device gets its own private graph
device_graph_manager = DeviceGraphStore(endee_client, embedding_service)

query_engine = QueryEngine(endee_client, embedding_service)

# --- API Endpoints (using native dict responses, no Pydantic models) ---

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Nexus AI Knowledge Network",
        "status": "operational",
        "endee_connected": await endee_client.health_check(),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    """Comprehensive health check"""
    endee_status = await endee_client.health_check()
    
    return {
        "status": "healthy" if endee_status else "degraded",
        "services": {
            "endee": "connected" if endee_status else "disconnected",
            "embedding": "operational",
            "graph_builder": "operational"
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    device_id: str = None
):
    """
    Upload a document and process it into knowledge chunks
    Supports: PDF, TXT, MD, DOCX
    
    Args:
        file: Document file to upload
        device_id: Unique device identifier (optional, will use default if not provided)
    """
    start_time = time.time()
    try:
        logger.info(json.dumps({
            'event': 'document_upload_started',
            'filename': file.filename,
            'file_size_bytes': file.size or 'unknown'
        }))
        
        # Validate file type
        allowed_extensions = {'.pdf', '.txt', '.md', '.docx'}
        file_ext = Path(file.filename).suffix.lower()
        
        if file_ext not in allowed_extensions:
            logger.warning(json.dumps({
                'event': 'invalid_file_type',
                'filename': file.filename,
                'file_ext': file_ext
            }))
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file_ext}. Allowed: {allowed_extensions}"
            )
        
        # Save uploaded file
        file_path = UPLOAD_DIR / f"{datetime.utcnow().timestamp()}_{file.filename}"
        content = await file.read()
        file_path.write_bytes(content)
        
        # Use device_id from query param (for device isolation)
        if not device_id:
            device_id = "default"
        
        logger.info(json.dumps({
            'event': 'document_processing_started',
            'device_id': device_id,
            'filename': file.filename
        }))
        
        # Process document
        document_id = await document_processor.process_document(
            file_path=file_path,
            filename=file.filename
        )
        
        # Extract chunks and create embeddings
        chunks = await document_processor.extract_chunks(document_id)
        
        logger.info(json.dumps({
            'event': 'chunks_extracted',
            'document_id': document_id,
            'chunk_count': len(chunks)
        }))
        
        # Get device-specific graph builder
        graph_builder = device_graph_manager.get_graph_builder(device_id)
        
        # Build graph inline so nodes are available immediately
        await graph_builder.add_document_to_graph(
            document_id=document_id,
            chunks=chunks
        )
        
        elapsed_time = time.time() - start_time
        logger.info(json.dumps({
            'event': 'document_upload_completed',
            'document_id': document_id,
            'filename': file.filename,
            'chunks_created': len(chunks),
            'elapsed_seconds': round(elapsed_time, 2),
            'device_id': device_id
        }))
        
        return {
            "document_id": document_id,
            "filename": file.filename,
            "chunks_created": len(chunks),
            "status": "completed",
            "processing_time_seconds": round(elapsed_time, 2)
        }
        
    except Exception as e:
        elapsed_time = time.time() - start_time
        logger.error(json.dumps({
            'event': 'document_upload_failed',
            'error': str(e),
            'filename': file.filename,
            'elapsed_seconds': round(elapsed_time, 2)
        }))
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/graph")
async def get_knowledge_graph(
    device_id: str = "default",
    similarity_threshold: float = 0.7,
    max_nodes: int = 100
):
    """
    Retrieve the complete knowledge graph for a specific device
    Nodes represent concepts, edges represent semantic relationships
    
    Args:
        device_id: Unique device identifier
        similarity_threshold: Minimum similarity score for edges
        max_nodes: Maximum number of nodes to return
    """
    start_time = time.time()
    try:
        logger.info(json.dumps({
            'event': 'graph_build_started',
            'device_id': device_id,
            'similarity_threshold': similarity_threshold,
            'max_nodes': max_nodes
        }))
        
        # Get device-specific graph builder
        graph_builder = device_graph_manager.get_graph_builder(device_id)
        
        graph = await graph_builder.build_graph(
            similarity_threshold=similarity_threshold,
            max_nodes=max_nodes
        )
        
        elapsed_time = time.time() - start_time
        node_count = len(graph.get("nodes", []))
        edge_count = len(graph.get("edges", []))
        
        logger.info(json.dumps({
            'event': 'graph_build_completed',
            'device_id': device_id,
            'node_count': node_count,
            'edge_count': edge_count,
            'elapsed_seconds': round(elapsed_time, 2)
        }))
        
        return {
            "nodes": graph["nodes"],
            "edges": graph["edges"],
            "stats": {
                **graph.get("stats", {}),
                "build_time_seconds": round(elapsed_time, 2)
            }
        }
        
    except Exception as e:
        elapsed_time = time.time() - start_time
        logger.error(json.dumps({
            'event': 'graph_build_failed',
            'device_id': device_id,
            'error': str(e),
            'elapsed_seconds': round(elapsed_time, 2)
        }))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/query")
async def semantic_query(body: Dict[str, Any] = Body(...)):
    """
    Perform semantic query on the knowledge graph
    Returns relevant nodes and their relationships from user's private graph
    """
    start_time = time.time()
    try:
        device_id = body.get("device_id", "default")
        query_text = body.get("query", "")
        top_k = body.get("top_k", 10)
        similarity_threshold = body.get("similarity_threshold", 0.7)
        
        logger.info(json.dumps({
            'event': 'semantic_query_started',
            'device_id': device_id,
            'query_length': len(query_text),
            'top_k': top_k
        }))
        
        # Get device-specific graph builder
        graph_builder = device_graph_manager.get_graph_builder(device_id)
        
        result = await query_engine.execute_query(
            query=query_text,
            top_k=top_k,
            similarity_threshold=similarity_threshold
        )

        # Fallback: if Endee returns no results, search in-memory graph nodes
        result_count = len(result.get("nodes", []))
        elapsed_time = time.time() - start_time
        
        logger.info(json.dumps({
            'event': 'semantic_query_completed',
            'device_id': device_id,
            'result_count': result_count,
            'elapsed_seconds': round(elapsed_time, 2)
        }))
        
        if query_text and not result.get("nodes"):
            query_terms = [term for term in query_text.lower().split() if term]
            fallback_nodes = []

            for node in graph_builder.nodes.values():
                haystack = f"{node.label} {node.summary}".lower()
                if any(term in haystack for term in query_terms):
                    fallback_nodes.append(node.to_dict())

            result = {
                "nodes": fallback_nodes[:top_k],
                "edges": [],
                "result_count": len(fallback_nodes)
            }
        
        execution_time = (time.time() - start_time) * 1000
        
        return {
            "query": query_text,
            "nodes": result["nodes"],
            "edges": result["edges"],
            "execution_time_ms": execution_time
        }
        
    except Exception as e:
        logger.error(f"Error executing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/node/{node_id}")
async def get_node_details(node_id: str, device_id: str = "default"):
    """
    Retrieve detailed information about a specific node
    Includes summary, sources, and related concepts
    """
    try:
        # Get device-specific graph builder
        graph_builder = device_graph_manager.get_graph_builder(device_id)
        details = await graph_builder.get_node_details(node_id)
        
        if not details:
            raise HTTPException(status_code=404, detail="Node not found")
        
        return details
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving node details: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/learning-paths")
async def get_learning_paths(
    device_id: str = "default",
    similarity_threshold: float = 0.7,
    max_nodes: int = 100
):
    """
    Retrieve recommended learning paths through the knowledge graph
    Shows optimal sequence to learn concepts from user's private graph
    """
    try:
        # Get device-specific graph builder
        graph_builder = device_graph_manager.get_graph_builder(device_id)
        
        graph = await graph_builder.build_graph(
            similarity_threshold=similarity_threshold,
            max_nodes=max_nodes
        )
        
        return {
            "learning_paths": graph.get("learning_paths", []),
            "total_concepts": graph["stats"]["total_nodes"],
            "total_connections": graph["stats"]["total_edges"]
        }
        
    except Exception as e:
        logger.error(f"Error retrieving learning paths: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recommendations")
async def get_recommendations(device_id: str = "default", node_id: str = None):
    """
    Get personalized recommendations based on current learning
    If node_id provided, recommends next concepts to learn from user's private graph
    """
    try:
        # Get device-specific graph builder
        graph_builder = device_graph_manager.get_graph_builder(device_id)
        
        if node_id and node_id in graph_builder.nodes:
            node = graph_builder.nodes[node_id]
            related = graph_builder._find_related_nodes(
                node_id,
                graph_builder.edges,
                list(graph_builder.nodes.values())
            )
            
            return {
                "current": node.to_dict(),
                "next_to_learn": related,
                "prerequisites": graph_builder._infer_prerequisites(node.label)
            }
        else:
            # Return general recommendations (learning paths)
            graph = await graph_builder.build_graph()
            return {
                "recommendation_type": "learning_paths",
                "paths": graph.get("learning_paths", [])
            }
        
    except Exception as e:
        logger.error(f"Error generating recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
async def get_system_stats(device_id: str = "default"):
    """
    Retrieve system statistics for a device
    Documents, concepts, relationships, clusters
    """
    try:
        # Get device-specific graph builder
        graph_builder = device_graph_manager.get_graph_builder(device_id)
        stats = await graph_builder.get_statistics()
        return stats
        
    except Exception as e:
        logger.error(f"Error retrieving stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/documents/{document_id}")
async def delete_document(document_id: str, device_id: str = "default"):
    """
    Delete a document and its associated knowledge chunks from user's private graph
    """
    try:
        # Get device-specific graph builder
        graph_builder = device_graph_manager.get_graph_builder(device_id)
        
        await document_processor.delete_document(document_id)
        await graph_builder.remove_document_from_graph(document_id)
        
        return {"status": "deleted", "document_id": document_id}
        
    except Exception as e:
        logger.error(f"Error deleting document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/initialize")
async def initialize_system():
    """
    Initialize Endee index and system resources
    Should be called once on first startup
    """
    try:
        await endee_client.create_index(
            index_name=ENDEE_INDEX,
            dimension=384,  # all-MiniLM-L6-v2 embedding dimension
            metric="cosine"
        )
        
        return {
            "status": "initialized",
            "index": ENDEE_INDEX,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Initialization error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
