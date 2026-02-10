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
            
            <div className="bg-dark-800/30 backdrop-blur border border-dark-700 rounded-lg p-8 overflow-x-auto">
              <pre className="text-xs lg:text-sm text-gray-400 font-mono leading-relaxed min-w-max">
{`┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│  TypeScript • React • Next.js • React Flow Visualization   │
└────────────────┬────────────────────────────────────────────┘
                 │ REST API (HTTP)
┌────────────────▼────────────────────────────────────────────┐
│             BACKEND (FastAPI - Python 3.13)                │
│  • Document Processing (PDF, DOCX, MD, TXT)               │
│  • Text Chunking & Embedding Generation                    │
│  • Semantic Relationship Discovery                         │
│  • Knowledge Graph Construction                            │
│  • Learning Path Generation                                │
└────────────────┬────────────────────────────────────────────┘
                 │ Vector Operations
┌────────────────▼────────────────────────────────────────────┐
│           VECTOR DATABASE (Endee - C++)                     │
│  • High-performance HNSW indexing                          │
│  • Sub-10ms semantic search                                │
│  • Device-isolated indices                                 │
│  • Cosine similarity scoring                               │
└─────────────────────────────────────────────────────────────┘`}
              </pre>
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
