"""
Embedding Service
Generates vector embeddings for text using simple hashing (no ML library dependencies)
"""

import hashlib
import logging
from typing import List, Union

logger = logging.getLogger(__name__)

class EmbeddingService:
    """
    Service for generating embeddings using deterministic hashing
    No external ML dependencies - pure Python implementation
    Dimension: 384 (compatible with Endee)
    """
    
    def __init__(self, model_name: str = "hash-based", dimension: int = 384):
        """
        Initialize embedding model
        
        Args:
            model_name: Name of the model (not used, for API compatibility)
            dimension: Embedding dimension output (default: 384)
        """
        self.model_name = model_name
        self.dimension = dimension
        logger.info(f"Embedding model initialized: {model_name} (dim={dimension})")
    
    def _hash_to_vector(self, text: str) -> List[float]:
        """Convert text to deterministic embedding vector via hashing"""
        # Generate hash
        hash_obj = hashlib.sha256(text.encode())
        hash_bytes = hash_obj.digest()
        
        # Convert 32 bytes to 384-dim vector by repeating and interpolating
        vector = []
        for i in range(self.dimension):
            byte_idx = i % len(hash_bytes)
            next_byte_idx = (i + 1) % len(hash_bytes)
            
            # Blend adjacent bytes for smooth interpolation
            byte_val = hash_bytes[byte_idx]
            next_byte_val = hash_bytes[next_byte_idx]
            t = (i % len(hash_bytes)) / len(hash_bytes)
            
            blended = byte_val * (1 - t) + next_byte_val * t
            # Normalize to [-1, 1] range
            normalized = (blended / 255.0) * 2 - 1
            vector.append(normalized)
        
        # Apply normalization for cosine similarity
        norm = sum(x**2 for x in vector) ** 0.5
        if norm > 0:
            vector = [x / norm for x in vector]
        
        return vector
    
    def encode(
        self,
        texts: Union[str, List[str]],
        batch_size: int = 32,
        show_progress: bool = False
    ) -> Union[List[float], List[List[float]]]:
        """
        Generate embeddings for text(s)
        
        Args:
            texts: Single text string or list of texts
            batch_size: Batch size (not used, for API compatibility)
            show_progress: Show progress (not used, for API compatibility)
        
        Returns:
            Single embedding vector or list of vectors
        """
        try:
            is_single = isinstance(texts, str)
            
            if is_single:
                texts = [texts]
            
            # Generate embeddings via hashing
            embeddings_list = [self._hash_to_vector(text) for text in texts]
            
            # Return single vector if input was single text
            if is_single:
                return embeddings_list[0]
            
            return embeddings_list
            
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            raise
    
    def encode_batch(
        self,
        texts: List[str],
        batch_size: int = 32
    ) -> List[List[float]]:
        """
        Optimized batch encoding
        
        Args:
            texts: List of texts to encode
            batch_size: Batch size for processing
        
        Returns:
            List of embedding vectors
        """
        return self.encode(texts, batch_size=batch_size, show_progress=True)
    
    def compute_similarity(
        self,
        embedding1: List[float],
        embedding2: List[float]
    ) -> float:
        """
        Compute cosine similarity between two embeddings
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
        
        Returns:
            Similarity score (0-1, higher is more similar)
        """
        try:
            # Cosine similarity using pure Python
            dot_product = sum(a * b for a, b in zip(embedding1, embedding2))
            norm1 = sum(x**2 for x in embedding1) ** 0.5
            norm2 = sum(x**2 for x in embedding2) ** 0.5
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            similarity = dot_product / (norm1 * norm2)
            # Convert to 0-1 range (from -1 to 1)
            return float((similarity + 1) / 2)
            
        except Exception as e:
            logger.error(f"Error computing similarity: {e}")
            raise
    
    def get_dimension(self) -> int:
        """Return embedding dimension"""
        return self.dimension
    
    def get_model_info(self) -> dict:
        """Return model information"""
        return {
            "model_name": self.model_name,
            "dimension": self.dimension,
            "type": "Deterministic Hash-based Embeddings",
            "implementation": "Pure Python, no dependencies"
        }
