'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Zap, Brain, Network, FileText } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  const handleTryNow = () => {
    router.push('/app')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-dark-700 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-dark-900" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Nexus
              </h1>
            </div>
            
            <button
              onClick={handleTryNow}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 group"
            >
              Try Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-32">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Transform Documents Into
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Living Intelligence Networks
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Upload documents and explore semantic relationships. Nexus automatically discovers concept connections and creates interactive knowledge graphs.
            </p>
            
            <button
              onClick={handleTryNow}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
            >
              Start Exploring Now →
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
            {[
              {
                icon: <FileText className="w-6 h-6" />,
                title: 'Smart Upload',
                desc: 'Support PDF, TXT, MD, DOCX formats'
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Instant Processing',
                desc: 'Real-time semantic analysis'
              },
              {
                icon: <Network className="w-6 h-6" />,
                title: 'Auto Relationships',
                desc: 'Discover concept connections'
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: 'Smart Shortcuts',
                desc: 'Learning paths & recommendations'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-6 bg-dark-800/50 backdrop-blur border border-dark-700 rounded-lg hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <div className="text-blue-400 mb-3 text-lg">{feature.icon}</div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">{feature.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Architecture Section */}
          <section className="mb-16 sm:mb-20">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">System Architecture</h3>
            
            {/* Visual Architecture Diagram */}
            <div className="bg-dark-800/30 backdrop-blur border border-dark-700 rounded-lg p-4 md:p-8 mb-8 overflow-x-auto">
              <svg className="w-full h-auto min-h-[400px] md:min-h-[600px]" viewBox="0 0 1400 650" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#06b6d4" />
                  </marker>
                  <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="gradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Top Layer: Browser, Backend, Endee */}
                {/* Browser/Client Box */}
                <rect x="50" y="20" width="280" height="140" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="2" rx="10" />
                <text x="190" y="50" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#06b6d4">BROWSER</text>
                <text x="190" y="75" textAnchor="middle" fontSize="13" fill="#94a3b8">React • Next.js</text>
                <text x="190" y="93" textAnchor="middle" fontSize="13" fill="#94a3b8">React Flow</text>
                <text x="190" y="111" textAnchor="middle" fontSize="13" fill="#94a3b8">TypeScript • Tailwind</text>
                <text x="190" y="129" textAnchor="middle" fontSize="13" fill="#94a3b8">Device Isolation</text>

                {/* Arrow 1: Browser to Backend */}
                <line x1="330" y1="90" x2="410" y2="90" stroke="#06b6d4" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
                <text x="370" y="80" textAnchor="middle" fontSize="12" fill="#06b6d4" fontWeight="500">HTTP/REST</text>

                {/* FastAPI Backend Box */}
                <rect x="410" y="20" width="280" height="140" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="2" rx="10" />
                <text x="550" y="50" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#06b6d4">BACKEND</text>
                <text x="550" y="75" textAnchor="middle" fontSize="13" fill="#94a3b8">FastAPI • Python</text>
                <text x="550" y="93" textAnchor="middle" fontSize="13" fill="#94a3b8">Document Processing</text>
                <text x="550" y="111" textAnchor="middle" fontSize="13" fill="#94a3b8">Embeddings & Graph</text>
                <text x="550" y="129" textAnchor="middle" fontSize="13" fill="#94a3b8">Relationship Discovery</text>

                {/* Arrow 2: Backend to Endee */}
                <line x1="690" y1="90" x2="770" y2="90" stroke="#06b6d4" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
                <text x="730" y="80" textAnchor="middle" fontSize="12" fill="#06b6d4" fontWeight="500">Vector Ops</text>

                {/* Endee Vector DB Box */}
                <rect x="770" y="20" width="280" height="140" fill="url(#gradOrange)" stroke="#f97316" strokeWidth="2" rx="10" />
                <text x="910" y="50" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#f97316">ENDEE DB</text>
                <text x="910" y="75" textAnchor="middle" fontSize="13" fill="#fed7aa">High-Performance C++</text>
                <text x="910" y="93" textAnchor="middle" fontSize="13" fill="#fed7aa">HNSW Indexing</text>
                <text x="910" y="111" textAnchor="middle" fontSize="13" fill="#fed7aa">Semantic &lt;10ms</text>
                <text x="910" y="129" textAnchor="middle" fontSize="13" fill="#fed7aa">Device-Isolated</text>

                {/* Separator */}
                <line x1="50" y1="200" x2="1350" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />

                {/* Features Title */}
                <text x="700" y="235" textAnchor="middle" fontSize="16" fontWeight="600" fill="#06b6d4">✨ CORE FEATURES</text>

                {/* Feature Box 1: Upload */}
                <rect x="50" y="260" width="160" height="130" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="1.5" rx="8" />
                <text x="130" y="290" textAnchor="middle" fontSize="14" fontWeight="600" fill="#06b6d4">📤 UPLOAD</text>
                <line x1="70" y1="305" x2="190" y2="305" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
                <text x="130" y="325" textAnchor="middle" fontSize="12" fill="#94a3b8">PDF, DOCX</text>
                <text x="130" y="343" textAnchor="middle" fontSize="12" fill="#94a3b8">TXT, MD</text>
                <text x="130" y="361" textAnchor="middle" fontSize="12" fill="#94a3b8">Multi-doc</text>
                <text x="130" y="379" textAnchor="middle" fontSize="12" fill="#94a3b8">support</text>

                {/* Feature Box 2: Relationships */}
                <rect x="260" y="260" width="160" height="130" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="1.5" rx="8" />
                <text x="340" y="290" textAnchor="middle" fontSize="14" fontWeight="600" fill="#06b6d4">🔗 RELATIONSHIPS</text>
                <line x1="280" y1="305" x2="400" y2="305" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
                <text x="340" y="325" textAnchor="middle" fontSize="12" fill="#94a3b8">Semantic</text>
                <text x="340" y="343" textAnchor="middle" fontSize="12" fill="#94a3b8">edges</text>
                <text x="340" y="361" textAnchor="middle" fontSize="12" fill="#94a3b8">Similarity</text>
                <text x="340" y="379" textAnchor="middle" fontSize="12" fill="#94a3b8">scores</text>

                {/* Feature Box 3: Summaries */}
                <rect x="470" y="260" width="160" height="130" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="1.5" rx="8" />
                <text x="550" y="290" textAnchor="middle" fontSize="14" fontWeight="600" fill="#06b6d4">💡 SUMMARIES</text>
                <line x1="490" y1="305" x2="610" y2="305" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
                <text x="550" y="325" textAnchor="middle" fontSize="12" fill="#94a3b8">Context-</text>
                <text x="550" y="343" textAnchor="middle" fontSize="12" fill="#94a3b8">aware</text>
                <text x="550" y="361" textAnchor="middle" fontSize="12" fill="#94a3b8">Prerequisites</text>
                <text x="550" y="379" textAnchor="middle" fontSize="12" fill="#94a3b8">Rich metadata</text>

                {/* Feature Box 4: Learning Paths */}
                <rect x="680" y="260" width="160" height="130" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="1.5" rx="8" />
                <text x="760" y="290" textAnchor="middle" fontSize="14" fontWeight="600" fill="#06b6d4">🎯 LEARNING PATHS</text>
                <line x1="700" y1="305" x2="820" y2="305" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
                <text x="760" y="325" textAnchor="middle" fontSize="12" fill="#94a3b8">Auto-</text>
                <text x="760" y="343" textAnchor="middle" fontSize="12" fill="#94a3b8">generated</text>
                <text x="760" y="361" textAnchor="middle" fontSize="12" fill="#94a3b8">Concept</text>
                <text x="760" y="379" textAnchor="middle" fontSize="12" fill="#94a3b8">sequences</text>

                {/* Feature Box 5: Unified Graph */}
                <rect x="890" y="260" width="160" height="130" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="1.5" rx="8" />
                <text x="970" y="290" textAnchor="middle" fontSize="14" fontWeight="600" fill="#06b6d4">📚 UNIFIED GRAPH</text>
                <line x1="910" y1="305" x2="1030" y2="305" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
                <text x="970" y="325" textAnchor="middle" fontSize="12" fill="#94a3b8">Cross-doc</text>
                <text x="970" y="343" textAnchor="middle" fontSize="12" fill="#94a3b8">concepts</text>
                <text x="970" y="361" textAnchor="middle" fontSize="12" fill="#94a3b8">Knowledge</text>
                <text x="970" y="379" textAnchor="middle" fontSize="12" fill="#94a3b8">gaps</text>

                {/* Feature Box 6: Privacy */}
                <rect x="1100" y="260" width="160" height="130" fill="url(#gradOrange)" stroke="#f97316" strokeWidth="1.5" rx="8" />
                <text x="1180" y="290" textAnchor="middle" fontSize="14" fontWeight="600" fill="#f97316">🔒 PRIVACY</text>
                <line x1="1120" y1="305" x2="1240" y2="305" stroke="#f97316" strokeWidth="0.5" opacity="0.3" />
                <text x="1180" y="325" textAnchor="middle" fontSize="12" fill="#fed7aa">Device</text>
                <text x="1180" y="343" textAnchor="middle" fontSize="12" fill="#fed7aa">isolation</text>
                <text x="1180" y="361" textAnchor="middle" fontSize="12" fill="#fed7aa">No auth</text>
                <text x="1180" y="379" textAnchor="middle" fontSize="12" fill="#fed7aa">needed</text>

                {/* Another Separator */}
                <line x1="50" y1="420" x2="1350" y2="420" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />

                {/* Output Box */}
                <rect x="250" y="450" width="900" height="100" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="2" rx="10" />
                <text x="700" y="490" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#06b6d4">OUTPUT: Interactive Knowledge Graph</text>
                <text x="700" y="518" textAnchor="middle" fontSize="13" fill="#94a3b8">Nodes = Concepts  |  Edges = Relationships  |  Real-time Updates</text>
              </svg>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  title: 'Frontend',
                  techs: ['Next.js 14', 'React Flow', 'TypeScript', 'Tailwind CSS']
                },
                {
                  title: 'Backend',
                  techs: ['FastAPI', 'Python 3.13', 'Sentence-Transformers', 'HNSW']
                },
                {
                  title: 'Vector DB',
                  techs: ['Endee', 'C++', '384-dim embeddings', 'Cosine similarity']
                }
              ].map((stack, idx) => (
                <div key={idx} className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-lg p-4 sm:p-6">
                  <h4 className="font-semibold mb-4 text-blue-400 text-sm sm:text-base">{stack.title}</h4>
                  <ul className="space-y-2">
                    {stack.techs.map((tech, i) => (
                      <li key={i} className="text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16 sm:mb-20">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">How It Works</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { step: 1, title: 'Upload', desc: 'Add your document' },
                { step: 2, title: 'Process', desc: 'Extract & chunk text' },
                { step: 3, title: 'Embed', desc: 'Generate embeddings' },
                { step: 4, title: 'Visualize', desc: 'Interactive graph' }
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-lg p-4 sm:p-6 text-center">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-dark-900 font-bold text-sm sm:text-lg mx-auto mb-3 sm:mb-4">
                      {item.step}
                    </div>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">{item.title}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">{item.desc}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 text-cyan-400 text-2xl">→</div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Credits Section */}
          <section className="mb-12 sm:mb-16 border-t border-dark-700 pt-12 sm:pt-16">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Built With ⚡</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {[
                {
                  name: 'FastAPI',
                  desc: 'Modern async Python web framework',
                  color: 'from-emerald-400 to-teal-400'
                },
                {
                  name: 'Endee',
                  desc: 'High-performance vector database',
                  color: 'from-blue-400 to-cyan-400'
                },
                {
                  name: 'React Flow',
                  desc: 'Interactive graph visualization',
                  color: 'from-purple-400 to-pink-400'
                },
                {
                  name: 'Sentence-Transformers',
                  desc: 'State-of-the-art embeddings',
                  color: 'from-orange-400 to-red-400'
                }
              ].map((tech, idx) => (
                <div
                  key={idx}
                  className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-lg p-4 sm:p-6 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className={`inline-block px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r ${tech.color} text-dark-900 text-xs sm:text-sm font-semibold mb-3`}>
                    {tech.name}
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm">{tech.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center py-6 sm:py-8 border-t border-dark-700">
              <p className="text-gray-400 mb-2 text-sm sm:text-base">Made by Pranav Venu</p>
              <p className="text-xs sm:text-sm text-gray-500">
                <a href="https://github.com/pranavv1210/endee-network-map" className="text-blue-400 hover:text-cyan-400 transition-colors">
                  View on GitHub
                </a>
                {' • '}
                <a href="#" className="text-blue-400 hover:text-cyan-400 transition-colors">
                  MIT License
                </a>
              </p>
            </div>
          </section>
        </section>

        {/* Final CTA */}
        <section className="border-t border-dark-700 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center px-4 sm:px-6">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Explore Your Knowledge?
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-6 sm:mb-8">
              Start building your semantic knowledge graph in seconds. No authentication required, completely private per device.
            </p>
            <button
              onClick={handleTryNow}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
            >
              Launch Nexus →
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-dark-700 py-6 sm:py-8 text-center text-gray-500 text-xs sm:text-sm px-4">
          <p>© 2026 Nexus. Where knowledge becomes intelligence.</p>
        </footer>
      </div>
    </div>
  )
}
