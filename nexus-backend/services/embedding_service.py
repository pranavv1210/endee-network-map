"""
Embedding Service
Generates vector embeddings for text using TF-IDF + PCA
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import PCA
import numpy as np
import logging
from typing import List, Union

logger = logging.getLogger(__name__)

class EmbeddingService:
    """
    Service for generating embeddings using TF-IDF + PCA
    Fast, lightweight, no compilation needed
    Dimension: 384 (compatible with Endee)
    """
    
    def __init__(self, model_name: str = "tfidf-pca", dimension: int = 384):
        """
        Initialize embedding model
        
        Args:
            model_name: Name of the model (not used, for API compatibility)
            dimension: Embedding dimension output (default: 384)
        """
        self.model_name = model_name
        self.dimension = dimension
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            min_df=1,
            lowercase=True,
            strip_accents='unicode'
        )
        self.pca = None
        self.fitted = False
        logger.info(f"Embedding model initialized: {model_name} (dim={dimension})")
    
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
            
            # Generate TF-IDF vectors
            if not self.fitted:
                # First time: fit on these texts
                tfidf_matrix = self.vectorizer.fit_transform(texts)
                self.fitted = True
                
                # Initialize PCA
                self.pca = PCA(n_components=self.dimension, random_state=42)
                embeddings = self.pca.fit_transform(tfidf_matrix.toarray())
            else:
                # Transform using existing vectorizer
                tfidf_matrix = self.vectorizer.transform(texts)
                embeddings = self.pca.transform(tfidf_matrix.toarray())
            
            # Normalize embeddings
            norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
            embeddings = embeddings / (norms + 1e-9)
            
            # Convert to list format
            embeddings_list = embeddings.tolist()
            
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
            vec1 = np.array(embedding1)
            vec2 = np.array(embedding2)
            
            # Cosine similarity
            similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
            
            return float(similarity)
            
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
            "type": "TF-IDF with PCA",
            "fitted": self.fitted
        }
