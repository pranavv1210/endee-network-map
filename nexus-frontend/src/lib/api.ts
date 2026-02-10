import axios from 'axios'
import { GraphData, QueryResult, DocumentUploadResponse, NodeDetails } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

/**
 * Get or generate a unique device ID from localStorage
 * Ensures data isolation: each device has its own private graph
 */
function getDeviceId(): string {
  if (typeof window === 'undefined') {
    return 'default' // Server-side fallback
  }
  
  const DEVICE_ID_KEY = 'nexus_device_id'
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  
  if (!deviceId) {
    // Generate new device ID: timestamp + random string
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
    console.log(`Created new device ID: ${deviceId}`)
  }
  
  return deviceId
}

export const apiClient = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health')
    return response.data
  },

  // Initialize system
  async initialize() {
    const response = await api.post('/api/initialize')
    return response.data
  },

  // Upload document
  async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        device_id: getDeviceId(),
      },
    })

    return response.data
  },

  // Get knowledge graph
  async getGraph(
    similarityThreshold: number = 0.7,
    maxNodes: number = 100
  ): Promise<GraphData> {
    const response = await api.get('/api/graph', {
      params: {
        device_id: getDeviceId(),
        similarity_threshold: similarityThreshold,
        max_nodes: maxNodes,
      },
    })

    return response.data
  },

  // Semantic query
  async query(
    query: string,
    topK: number = 10,
    similarityThreshold: number = 0.7
  ): Promise<QueryResult> {
    const response = await api.post('/api/query', {
      device_id: getDeviceId(),
      query,
      top_k: topK,
      similarity_threshold: similarityThreshold,
    })

    return response.data
  },

  // Get node details
  async getNodeDetails(nodeId: string): Promise<NodeDetails> {
    const response = await api.get(`/api/node/${nodeId}`, {
      params: {
        device_id: getDeviceId(),
      },
    })
    return response.data
  },

  // Get statistics
  async getStats() {
    const response = await api.get('/api/stats', {
      params: {
        device_id: getDeviceId(),
      },
    })
    return response.data
  },

  // Delete document
  async deleteDocument(documentId: string) {
    const response = await api.delete(`/api/documents/${documentId}`, {
      params: {
        device_id: getDeviceId(),
      },
    })
    return response.data
  },

  // Get learning paths
  async getLearningPaths(
    similarityThreshold: number = 0.7,
    maxNodes: number = 100
  ) {
    const response = await api.get('/api/learning-paths', {
      params: {
        device_id: getDeviceId(),
        similarity_threshold: similarityThreshold,
        max_nodes: maxNodes,
      },
    })
    return response.data
  },

  // Get recommendations
  async getRecommendations(nodeId?: string) {
    const response = await api.get('/api/recommendations', {
      params: {
        device_id: getDeviceId(),
        node_id: nodeId,
      },
    })
    return response.data
  },
}
