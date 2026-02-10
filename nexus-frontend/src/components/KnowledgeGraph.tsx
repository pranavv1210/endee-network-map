'use client'

import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
  useReactFlow,
} from 'reactflow'
import { GraphNode, GraphEdge } from '@/types'
import { Loader2, Brain, ZoomIn, Info } from 'lucide-react'

interface KnowledgeGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick: (node: GraphNode) => void
  isLoading: boolean
}

export default function KnowledgeGraph({
  nodes: graphNodes,
  edges: graphEdges,
  onNodeClick,
  isLoading,
}: KnowledgeGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [showLegend, setShowLegend] = useState(true)
  const { fitView } = useReactFlow()

  // Transform graph data to React Flow format with better styling
  const transformToReactFlowNodes = useCallback((graphNodes: GraphNode[]): Node[] => {
    return graphNodes.map((node, index) => ({
      id: node.id,
      type: 'default',
      position: {
        // Simple force-directed layout approximation
        x: Math.cos(index / graphNodes.length * Math.PI * 2) * 300 + 400,
        y: Math.sin(index / graphNodes.length * Math.PI * 2) * 300 + 300,
      },
      data: {
        ...node,
      },
      style: {
        background: hoveredNode === node.id 
          ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
          : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        color: 'white',
        border: hoveredNode === node.id ? '3px solid #06b6d4' : '2px solid #0ea5e9',
        borderRadius: '10px',
        padding: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        width: 160,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: hoveredNode === node.id 
          ? '0 20px 25px -5px rgba(6, 182, 212, 0.3)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      },
      className: 'cursor-pointer',
    }))
  }, [hoveredNode])

  const transformToReactFlowEdges = useCallback((graphEdges: GraphEdge[]): Edge[] => {
    return graphEdges.map((edge) => {
      const isHighSimilarity = edge.similarity > 0.8
      const isMediumSimilarity = edge.similarity > 0.6
      
      return {
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: isHighSimilarity,
        style: {
          stroke: isHighSimilarity 
            ? '#06b6d4'
            : isMediumSimilarity 
            ? '#3b82f6'
            : '#64748b',
          strokeWidth: Math.max(1.5, Math.min(edge.similarity * 4, 3)),
          opacity: Math.min(0.3 + edge.similarity * 0.7, 1),
        },
        label: `${(edge.similarity * 100).toFixed(0)}%`,
        labelStyle: {
          fontSize: '10px',
          fontWeight: '600',
          fill: '#94a3b8',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          padding: '4px 8px',
          borderRadius: '4px',
        },
      }
    })
  }, [])

  // Update React Flow nodes and edges when graph data changes
  useEffect(() => {
    if (graphNodes.length > 0) {
      const flowNodes = transformToReactFlowNodes(graphNodes)
      const flowEdges = transformToReactFlowEdges(graphEdges)
      setNodes(flowNodes)
      setEdges(flowEdges)
    }
  }, [graphNodes, graphEdges, transformToReactFlowNodes, transformToReactFlowEdges, setNodes, setEdges])

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const graphNode = graphNodes.find((n) => n.id === node.id)
      if (graphNode) {
        onNodeClick(graphNode)
      }
    },
    [graphNodes, onNodeClick]
  )

  const handleNodeMouseEnter = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setHoveredNode(node.id)
    },
    []
  )

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNode(null)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Building knowledge graph...</p>
        </div>
      </div>
    )
  }

  if (graphNodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-900">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-dark-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Knowledge Yet
          </h3>
          <p className="text-dark-400">
            Upload documents to begin building your intelligence graph.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#334155" gap={16} />
        <Controls 
          className="bg-dark-800 border border-dark-700 rounded-lg shadow-lg"
          style={{
            button: {
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              color: '#94a3b8',
            },
          } as any}
        />
        <MiniMap
          nodeColor={(node) => {
            if (hoveredNode === node.id) return '#06b6d4'
            return '#3b82f6'
          }}
          maskColor="rgba(0, 0, 0, 0.6)"
          className="bg-dark-800 border border-dark-700 rounded-lg shadow-lg"
        />

        {/* Info Panel - Top Left */}
        <Panel position="top-left" className="bg-dark-800 border border-dark-700 rounded-lg p-4 text-sm space-y-3 shadow-lg max-w-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <Brain className="w-4 h-4" />
            <span>Knowledge Graph</span>
          </div>
          <div className="space-y-2 text-dark-300 text-xs">
            <div className="flex justify-between">
              <span>Concepts:</span>
              <span className="font-bold text-cyan-400">{graphNodes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Connections:</span>
              <span className="font-bold text-blue-400">{graphEdges.length}</span>
            </div>
            <div className="pt-2 border-t border-dark-700">
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="text-dark-400 hover:text-cyan-400 transition-colors"
              >
                {showLegend ? '✕' : '▾'} Legend
              </button>
            </div>
          </div>
        </Panel>

        {/* Legend Panel */}
        {showLegend && (
          <Panel position="top-right" className="bg-dark-800 border border-dark-700 rounded-lg p-4 text-xs space-y-3 shadow-lg max-w-xs">
            <h3 className="font-semibold text-cyan-400 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Edge Legend
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-cyan-400" style={{ opacity: 1 }}></div>
                <span className="text-dark-300">&gt; 80% Similarity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-blue-400" style={{ opacity: 0.7 }}></div>
                <span className="text-dark-300">&gt; 60% Similarity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-slate-500" style={{ opacity: 0.5 }}></div>
                <span className="text-dark-300">&lt; 60% Similarity</span>
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}
