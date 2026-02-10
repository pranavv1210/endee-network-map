"""
Nexus Backend - FastAPI Application
Vector-native knowledge intelligence system powered by Endee
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
import httpx
import os
from pathlib import Path
import logging
from datetime import datetime

from services.document_processor import DocumentProcessor
from services.embedding_service import EmbeddingService
from services.endee_client import EndeeClient
from services.graph_builder import GraphBuilder
from services.query_engine import QueryEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
graph_builder = GraphBuilder(endee_client, embedding_service)
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
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Upload a document and process it into knowledge chunks
    Supports: PDF, TXT, MD, DOCX
    """
    try:
        logger.info(f"Receiving document: {file.filename}")
        
        # Validate file type
        allowed_extensions = {'.pdf', '.txt', '.md', '.docx'}
        file_ext = Path(file.filename).suffix.lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file_ext}. Allowed: {allowed_extensions}"
            )
        
        # Save uploaded file
        file_path = UPLOAD_DIR / f"{datetime.utcnow().timestamp()}_{file.filename}"
        content = await file.read()
        file_path.write_bytes(content)
        
        # Process document
        document_id = await document_processor.process_document(
            file_path=file_path,
            filename=file.filename
        )
        
        # Extract chunks and create embeddings
        chunks = await document_processor.extract_chunks(document_id)
        
        # Store in Endee (background task for performance)
        background_tasks.add_task(
            graph_builder.add_document_to_graph,
            document_id=document_id,
            chunks=chunks
        )
        
        return {
            "document_id": document_id,
            "filename": file.filename,
            "chunks_created": len(chunks),
            "status": "processing"
        }
        
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/graph")
async def get_knowledge_graph(
    similarity_threshold: float = 0.7,
    max_nodes: int = 100
):
    """
    Retrieve the complete knowledge graph
    Nodes represent concepts, edges represent semantic relationships
    """
    try:
        logger.info("Building knowledge graph")
        
        graph = await graph_builder.build_graph(
            similarity_threshold=similarity_threshold,
            max_nodes=max_nodes
        )
        
        return {
            "nodes": graph["nodes"],
            "edges": graph["edges"],
            "stats": graph["stats"]
        }
        
    except Exception as e:
        logger.error(f"Error building graph: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/query")
async def semantic_query(body: Dict[str, Any] = Body(...)):
    """
    Perform semantic query on the knowledge graph
    Returns relevant nodes and their relationships
    """
    try:
        start_time = datetime.utcnow()
        
        query_text = body.get("query", "")
        top_k = body.get("top_k", 10)
        similarity_threshold = body.get("similarity_threshold", 0.7)
        
        logger.info(f"Processing query: {query_text}")
        
        result = await query_engine.execute_query(
            query=query_text,
            top_k=top_k,
            similarity_threshold=similarity_threshold
        )
        
        execution_time = (datetime.utcnow() - start_time).total_seconds() * 1000
        
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
async def get_node_details(node_id: str):
    """
    Retrieve detailed information about a specific node
    Includes summary, sources, and related concepts
    """
    try:
        details = await graph_builder.get_node_details(node_id)
        
        if not details:
            raise HTTPException(status_code=404, detail="Node not found")
        
        return details
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving node details: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
async def get_system_stats():
    """
    Retrieve system statistics
    Documents, concepts, relationships, clusters
    """
    try:
        stats = await graph_builder.get_statistics()
        return stats
        
    except Exception as e:
        logger.error(f"Error retrieving stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/documents/{document_id}")
async def delete_document(document_id: str):
    """
    Delete a document and its associated knowledge chunks
    """
    try:
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
