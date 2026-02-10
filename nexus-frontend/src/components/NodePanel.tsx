'use client'

import { useState, useEffect } from 'react'
import { GraphNode } from '@/types'
import { X, FileText, Link as LinkIcon, Loader2, BookOpen, Lightbulb, Network, ArrowRight } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface NodePanelProps {
  node: GraphNode
  onClose: () => void
}

export default function NodePanel({ node, onClose }: NodePanelProps) {
  const [nodeDetails, setNodeDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true)
      try {
        const details = await apiClient.getNodeDetails(node.id)
        setNodeDetails(details)
      } catch (error) {
        console.error('Failed to fetch node details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetails()
  }, [node.id])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-dark-700 p-4 flex items-start justify-between sticky top-0 bg-dark-800 z-10">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white mb-1">Node Details</h2>
          <p className="text-sm text-dark-400 line-clamp-2">{node.label}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 p-2 hover:bg-dark-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-dark-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* FEATURE 2: Smart Summaries */}
            <div>
              <h3 className="text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Summary
              </h3>
              <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                <p className="text-sm text-dark-200 leading-relaxed whitespace-pre-wrap">
                  {node.summary || 'No summary available'}
                </p>
              </div>
            </div>

            {/* Source Document Info */}
            <div>
              <h3 className="text-sm font-medium text-dark-300 mb-2">Source</h3>
              <div className="bg-dark-700 rounded-lg p-4 border border-dark-600 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-400">Document:</span>
                  <span className="text-dark-200 font-medium">{node.metadata.filename || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Chunk:</span>
                  <span className="text-dark-200">#{node.metadata.chunk_index || 0}</span>
                </div>
              </div>
            </div>

            {/* FEATURE 2: Prerequisites & Requirements */}
            {nodeDetails?.prerequisites && nodeDetails.prerequisites.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Prerequisites
                </h3>
                <div className="space-y-2">
                  {nodeDetails.prerequisites.map((prereq: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-3"
                    >
                      <p className="text-sm text-emerald-200 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        {prereq}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FEATURE 1: Related Concepts with Relationship Discovery */}
            {nodeDetails?.related_nodes && nodeDetails.related_nodes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-cyan-400" />
                  Related Concepts ({nodeDetails.related_nodes.length})
                </h3>
                <div className="space-y-2">
                  {nodeDetails.related_nodes.slice(0, 5).map((related: any) => (
                    <div
                      key={related.node_id}
                      className="bg-dark-700 rounded-lg p-3 hover:bg-dark-600/70 transition-colors border border-dark-600 group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm text-dark-200 flex-1 group-hover:text-white transition-colors">{related.label}</p>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"></div>
                          <span className="text-xs text-cyan-400 font-semibold">
                            {(related.similarity * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          style={{ width: `${related.similarity * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FEATURE 4: Cross-Document Knowledge */}
            {nodeDetails?.cross_document_concepts && nodeDetails.cross_document_concepts.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-400" />
                  Cross-Document Links
                </h3>
                <div className="space-y-2">
                  {nodeDetails.cross_document_concepts.map((concept: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-3"
                    >
                      <p className="text-sm text-purple-200 font-medium mb-1">{concept.concept}</p>
                      <p className="text-xs text-purple-300">
                        From: <span className="font-mono">{concept.source_document?.slice(0, 20)}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connection Stats */}
            {nodeDetails?.connection_count !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-dark-300 mb-2">Connection Stats</h3>
                <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                  <div className="flex items-center justify-between">
                    <span className="text-dark-400">Total Connections:</span>
                    <span className="text-2xl font-bold text-cyan-400">
                      {nodeDetails.connection_count}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* FEATURE 3: Learning Recommendations */}
            <div>
              <h3 className="text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Learning Insights
              </h3>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                  <p className="text-sm text-dark-200">
                    <strong>Connections:</strong> {nodeDetails?.connection_count || 0} related concepts found
                  </p>
                </div>
                {nodeDetails?.prerequisites && nodeDetails.prerequisites.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-dark-200">
                      <strong>Prerequisites:</strong> Learn {nodeDetails.prerequisites[0]} first
                    </p>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                  <p className="text-sm text-dark-200">
                    <strong>Next Steps:</strong> Explore related concepts to deepen knowledge
                  </p>
                </div>
                {nodeDetails?.cross_document_concepts && nodeDetails.cross_document_concepts.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-dark-200">
                      <strong>Multi-Source:</strong> Also discussed in other documents (+{nodeDetails.cross_document_concepts.length})
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
