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
        <section className="max-w-6xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Transform Documents Into
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Living Intelligence Networks
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Upload documents and explore semantic relationships. Nexus automatically discovers concept connections and creates interactive knowledge graphs.
            </p>
            
            <button
              onClick={handleTryNow}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Start Exploring Now →
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
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
                className="p-6 bg-dark-800/50 backdrop-blur border border-dark-700 rounded-lg hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <div className="text-blue-400 mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Architecture Section */}
          <section className="mb-20">
            <h3 className="text-3xl font-bold mb-8 text-center">System Architecture</h3>
            
            {/* Visual Architecture Diagram */}
            <div className="bg-dark-800/30 backdrop-blur border border-dark-700 rounded-lg p-8 mb-8">
              <svg className="w-full h-auto" viewBox="0 0 1200 500" xmlns="http://www.w3.org/2000/svg">
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

                {/* Browser/Client Box */}
                <rect x="30" y="30" width="280" height="140" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="2" rx="8" />
                <text x="170" y="60" textAnchor="middle" className="text-base font-bold" fill="#06b6d4">BROWSER</text>
                <text x="170" y="85" textAnchor="middle" className="text-xs" fill="#94a3b8">React • Next.js</text>
                <text x="170" y="105" textAnchor="middle" className="text-xs" fill="#94a3b8">React Flow Visualization</text>
                <text x="170" y="125" textAnchor="middle" className="text-xs" fill="#94a3b8">TypeScript • Tailwind CSS</text>
                <text x="170" y="145" textAnchor="middle" className="text-xs" fill="#94a3b8">Device Isolation</text>

                {/* Arrow 1: Browser to Backend */}
                <line x1="310" y1="100" x2="390" y2="100" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <text x="350" y="95" textAnchor="middle" className="text-xs" fill="#06b6d4">HTTP/REST API</text>

                {/* FastAPI Backend Box */}
                <rect x="390" y="30" width="280" height="140" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="2" rx="8" />
                <text x="530" y="60" textAnchor="middle" className="text-base font-bold" fill="#06b6d4">BACKEND</text>
                <text x="530" y="85" textAnchor="middle" className="text-xs" fill="#94a3b8">FastAPI • Python 3.13</text>
                <text x="530" y="105" textAnchor="middle" className="text-xs" fill="#94a3b8">Document Processing</text>
                <text x="530" y="125" textAnchor="middle" className="text-xs" fill="#94a3b8">Embeddings & Graph Building</text>
                <text x="530" y="145" textAnchor="middle" className="text-xs" fill="#94a3b8">Relationship Discovery</text>

                {/* Arrow 2: Backend to Endee */}
                <line x1="670" y1="100" x2="750" y2="100" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <text x="710" y="95" textAnchor="middle" className="text-xs" fill="#06b6d4">Vector Ops</text>

                {/* Endee Vector DB Box */}
                <rect x="750" y="30" width="280" height="140" fill="url(#gradOrange)" stroke="#f97316" strokeWidth="2" rx="8" />
                <text x="890" y="60" textAnchor="middle" className="text-base font-bold" fill="#f97316">ENDEE DB</text>
                <text x="890" y="85" textAnchor="middle" className="text-xs" fill="#fed7aa">High-Performance C++</text>
                <text x="890" y="105" textAnchor="middle" className="text-xs" fill="#fed7aa">HNSW Indexing</text>
                <text x="890" y="125" textAnchor="middle" className="text-xs" fill="#fed7aa">Semantic Search &lt;10ms</text>
                <text x="890" y="145" textAnchor="middle" className="text-xs" fill="#fed7aa">Device-Isolated Indices</text>

                {/* Features section below */}
                <text x="600" y="220" textAnchor="middle" className="text-sm font-bold" fill="#06b6d4">✨ FEATURES FLOW</text>

                {/* Feature boxes */}
                <g>
                  {/* Upload */}
                  <rect x="50" y="250" width="140" height="100" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="1.5" rx="6" />
                  <text x="120" y="275" textAnchor="middle" className="text-sm font-semibold" fill="#06b6d4">📤 UPLOAD</text>
                  <text x="120" y="295" textAnchor="middle" className="text-xs" fill="#94a3b8">PDF, DOCX,</text>
                  <text x="120" y="310" textAnchor="middle" className="text-xs" fill="#94a3b8">TXT, MD</text>
                  <text x="120" y="330" textAnchor="middle" className="text-xs" fill="#94a3b8">Multi-doc support</text>
                </g>

                {/* Relationships */}
                <g>
                  <rect x="240" y="250" width="140" height="100" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="1.5" rx="6" />
                  <text x="310" y="275" textAnchor="middle" className="text-sm font-semibold" fill="#06b6d4">🔗 RELATIONSHIPS</text>
                  <text x="310" y="295" textAnchor="middle" className="text-xs" fill="#94a3b8">Semantic edges</text>
                  <text x="310" y="310" textAnchor="middle" className="text-xs" fill="#94a3b8">Similarity scores</text>
                  <text x="310" y="330" textAnchor="middle" className="text-xs" fill="#94a3b8">0.5+ threshold</text>
                </g>

                {/* Smart Summaries */}
                <g>
                  <rect x="430" y="250" width="140" height="100" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="1.5" rx="6" />
                  <text x="500" y="275" textAnchor="middle" className="text-sm font-semibold" fill="#06b6d4">💡 SUMMARIES</text>
                  <text x="500" y="295" textAnchor="middle" className="text-xs" fill="#94a3b8">Context-aware</text>
                  <text x="500" y="310" textAnchor="middle" className="text-xs" fill="#94a3b8">Prerequisites</text>
                  <text x="500" y="330" textAnchor="middle" className="text-xs" fill="#94a3b8">Rich metadata</text>
                </g>

                {/* Learning Paths */}
                <g>
                  <rect x="620" y="250" width="140" height="100" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="1.5" rx="6" />
                  <text x="690" y="275" textAnchor="middle" className="text-sm font-semibold" fill="#06b6d4">🎯 LEARNING PATHS</text>
                  <text x="690" y="295" textAnchor="middle" className="text-xs" fill="#94a3b8">Auto-generated</text>
                  <text x="690" y="310" textAnchor="middle" className="text-xs" fill="#94a3b8">Recommended order</text>
                  <text x="690" y="330" textAnchor="middle" className="text-xs" fill="#94a3b8">Concept sequences</text>
                </g>

                {/* Multi-Document */}
                <g>
                  <rect x="810" y="250" width="140" height="100" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="1.5" rx="6" />
                  <text x="880" y="275" textAnchor="middle" className="text-sm font-semibold" fill="#06b6d4">📚 UNIFIED GRAPH</text>
                  <text x="880" y="295" textAnchor="middle" className="text-xs" fill="#94a3b8">Cross-document</text>
                  <text x="880" y="310" textAnchor="middle" className="text-xs" fill="#94a3b8">Common concepts</text>
                  <text x="880" y="330" textAnchor="middle" className="text-xs" fill="#94a3b8">Knowledge gaps</text>
                </g>

                {/* Isolated Graphs */}
                <g>
                  <rect x="1000" y="250" width="140" height="100" fill="url(#gradOrange)" stroke="#f97316" strokeWidth="1.5" rx="6" />
                  <text x="1070" y="275" textAnchor="middle" className="text-sm font-semibold" fill="#f97316">🔒 PRIVACY</text>
                  <text x="1070" y="295" textAnchor="middle" className="text-xs" fill="#fed7aa">Device isolation</text>
                  <text x="1070" y="310" textAnchor="middle" className="text-xs" fill="#fed7aa">No auth needed</text>
                  <text x="1070" y="330" textAnchor="middle" className="text-xs" fill="#fed7aa">Session persistent</text>
                </g>

                {/* Output */}
                <rect x="350" y="400" width="500" height="70" fill="url(#gradBlue)" stroke="#3b82f6" strokeWidth="2" rx="8" />
                <text x="600" y="425" textAnchor="middle" className="text-base font-bold" fill="#06b6d4">OUTPUT: Interactive Knowledge Graph</text>
                <text x="600" y="450" textAnchor="middle" className="text-xs" fill="#94a3b8">Nodes = Concepts | Edges = Relationships | Real-time Updates</text>
              </svg>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
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
                <div key={idx} className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 text-blue-400">{stack.title}</h4>
                  <ul className="space-y-2">
                    {stack.techs.map((tech, i) => (
                      <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
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
          <section className="mb-20">
            <h3 className="text-3xl font-bold mb-8 text-center">How It Works</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: 1, title: 'Upload', desc: 'Add your document' },
                { step: 2, title: 'Process', desc: 'Extract & chunk text' },
                { step: 3, title: 'Embed', desc: 'Generate embeddings' },
                { step: 4, title: 'Visualize', desc: 'Interactive graph' }
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-dark-900 font-bold text-lg mx-auto mb-4">
                      {item.step}
                    </div>
                    <h4 className="font-semibold mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 text-cyan-400 text-2xl">→</div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Credits Section */}
          <section className="mb-16 border-t border-dark-700 pt-16">
            <h3 className="text-3xl font-bold mb-8 text-center">Built With ⚡</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${tech.color} text-dark-900 text-sm font-semibold mb-3`}>
                    {tech.name}
                  </div>
                  <p className="text-gray-400 text-sm">{tech.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center py-8 border-t border-dark-700">
              <p className="text-gray-400 mb-2">Made by Pranav Venu</p>
              <p className="text-sm text-gray-500">
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
        <section className="border-t border-dark-700 py-16">
          <div className="max-w-3xl mx-auto text-center px-6">
            <h3 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Explore Your Knowledge?
            </h3>
            <p className="text-gray-400 mb-8">
              Start building your semantic knowledge graph in seconds. No authentication required, completely private per device.
            </p>
            <button
              onClick={handleTryNow}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Launch Nexus →
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-dark-700 py-8 text-center text-gray-500 text-sm">
          <p>© 2026 Nexus. Where knowledge becomes intelligence.</p>
        </footer>
      </div>
    </div>
  )
}
