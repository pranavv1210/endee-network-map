"""
Device Graph Store
Manages isolated knowledge graphs per device/user
Each device gets its own graph - complete data isolation
"""

import logging
from typing import Dict, Optional
from services.graph_builder import GraphBuilder
from services.endee_client import EndeeClient
from services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)


class DeviceGraphStore:
    """
    Manages multiple graph builders - one per device
    Ensures data isolation: each device has a private graph
    """
    
    def __init__(
        self,
        endee_client: EndeeClient,
        embedding_service: EmbeddingService
    ):
        self.endee_client = endee_client
        self.embedding_service = embedding_service
        
        # Dictionary to store graph builders per device
        # Key: device_id, Value: GraphBuilder instance
        self.device_graphs: Dict[str, GraphBuilder] = {}
    
    def get_graph_builder(self, device_id: str) -> GraphBuilder:
        """
        Get or create a graph builder for a specific device
        
        Args:
            device_id: Unique device identifier
            
        Returns:
            GraphBuilder instance for this device
        """
        if device_id not in self.device_graphs:
            logger.info(f"Creating new graph for device: {device_id}")
            
            # Create device-specific index name
            index_name = f"nexus_{device_id}"
            
            # Create new graph builder for this device
            graph_builder = GraphBuilder(
                endee_client=self.endee_client,
                embedding_service=self.embedding_service,
                index_name=index_name
            )
            
            self.device_graphs[device_id] = graph_builder
        
        return self.device_graphs[device_id]
    
    def get_device_count(self) -> int:
        """Get number of active devices with graphs"""
        return len(self.device_graphs)
    
    def list_devices(self) -> list:
        """List all device IDs with active graphs"""
        return list(self.device_graphs.keys())
    
    def clear_device_graph(self, device_id: str) -> bool:
        """
        Clear a specific device's graph
        
        Args:
            device_id: Device to clear
            
        Returns:
            True if cleared, False if device not found
        """
        if device_id in self.device_graphs:
            logger.info(f"Clearing graph for device: {device_id}")
            # Remove from dictionary (garbage collection handles cleanup)
            del self.device_graphs[device_id]
            return True
        return False
