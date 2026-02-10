'use client'

import { useState, useEffect } from 'react'
import { GraphNode } from '@/types'
import { X, FileText, Link as LinkIcon, Loader2, BookOpen, Lightbulb, Network } from 'lucide-react'
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
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold text-white">Node Details</h2>
            <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-xs font-semibold text-cyan-300">
              concept
            </span>
          </div>
          <p className="text-sm text-dark-400 line-clamp-2 leading-tight">{node.label}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 p-2 hover:bg-dark-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-dark-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary Section */}
            <div>
              <h3 className="text-xs font-semibold text-dark-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Summary
              </h3>
              <div className="bg-gradient-to-br from-dark-700/60 to-dark-700/30 rounded-lg p-4 border border-dark-600 hover:border-dark-500 transition-colors">
                <p className="text-sm text-dark-100 leading-relaxed">
                  {node.summary || 'No summary available'}
                </p>
              </div>
            </div>

            {/* Source Information Badges */}
            <div>
              <h3 className="text-xs font-semibold text-dark-300 mb-3 uppercase tracking-wider">Source</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-dark-700/50 rounded-lg px-3 py-2 border border-dark-600">
                  <span className="text-xs text-dark-400">Document</span>
                  <span className="text-sm font-medium text-cyan-300 truncate">{node.metadata.filename || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between bg-dark-700/50 rounded-lg px-3 py-2 border border-dark-600">
                  <span className="text-xs text-dark-400">Chunk ID</span>
                  <span className="text-sm font-mono text-blue-300">#{node.metadata.chunk_index || 0}</span>
                </div>
              </div>
            </div>


            {/* Prerequisites Section */}
            {nodeDetails?.prerequisites && nodeDetails.prerequisites.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-dark-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Prerequisites ({nodeDetails.prerequisites.length})
                </h3>
                <div className="space-y-2">
                  {nodeDetails.prerequisites.map((prereq: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 hover:bg-emerald-500/15 transition-colors"
                    >
                      <p className="text-sm text-emerald-200 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></div>
                        {prereq}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Concepts with Similarity Bars */}
            {nodeDetails?.related_nodes && nodeDetails.related_nodes.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-dark-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-cyan-400" />
                  Related Concepts ({nodeDetails.related_nodes.length})
                </h3>
                <div className="space-y-2.5">
                  {nodeDetails.related_nodes.slice(0, 6).map((related: any) => {
                    const similarity = related.similarity
                    const similarityPercent = Math.round(similarity * 100)
                    const isHighSimilarity = similarity > 0.8
                    const isMediumSimilarity = similarity > 0.6
                    
                    return (
                      <div
                        key={related.node_id}
                        className="bg-dark-700/40 rounded-lg p-3 border border-dark-600 hover:border-cyan-500/40 transition-all hover:bg-dark-700/60 group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-sm text-dark-200 flex-1 group-hover:text-white transition-colors truncate">
                            {related.label}
                          </p>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
                            isHighSimilarity 
                              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                              : isMediumSimilarity
                              ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                              : 'bg-slate-500/30 text-slate-300 border border-slate-500/50'
                          }`}>
                            {similarityPercent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-dark-800/70 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isHighSimilarity 
                                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400'
                                : isMediumSimilarity
                                ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                                : 'bg-gradient-to-r from-slate-500 to-slate-400'
                            }`}
                            style={{ width: `${similarityPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Cross-Document Knowledge */}
            {nodeDetails?.cross_document_concepts && nodeDetails.cross_document_concepts.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-dark-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-400" />
                  Cross-Document Links ({nodeDetails.cross_document_concepts.length})
                </h3>
                <div className="space-y-2">
                  {nodeDetails.cross_document_concepts.slice(0, 4).map((concept: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 hover:bg-purple-500/15 transition-colors"
                    >
                      <p className="text-sm text-purple-200 font-medium mb-1">{concept.concept}</p>
                      <p className="text-xs text-purple-300 flex items-center gap-1">
                        📄 <span className="truncate">{concept.source_document?.slice(0, 24)}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connection Stats & Insights */}
            <div>
              <h3 className="text-xs font-semibold text-dark-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Intelligence Metrics
              </h3>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-400">Connections</span>
                  <span className="text-lg font-bold text-cyan-400">{nodeDetails?.connection_count || 0}</span>
                </div>
                {nodeDetails?.related_nodes?.length && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400">Related Concepts</span>
                    <span className="text-lg font-bold text-blue-400">{nodeDetails.related_nodes.length}</span>
                  </div>
                )}
                {nodeDetails?.prerequisites?.length && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400">Prerequisites</span>
                    <span className="text-lg font-bold text-emerald-400">{nodeDetails.prerequisites.length}</span>
                  </div>
                )}
              </div>
            </div></div>
          </>
        )}
      </div>
    </div>
  )
}
