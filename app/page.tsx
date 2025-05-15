'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from './components/Navigation/page';
import Footer from './components/Footer/page';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23311b92' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]"
            >
              <img 
                src="/hero0.jpg" 
                alt="Web3 Development" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-5xl font-bold mb-6 text-white">
                    Your AI Agent for Web3 Tasks.
                  </h1>
                  <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
                    From Web3 onboarding, Education, onchain address analysis, realtime market insights and beyond - our AI agents can execute multiple onchain tasks with great precision and reliability.
                  </p>
                  <Link 
                    href="/chat"
                    className="inline-block px-8 py-4 rounded-xl bg-white text-[#333] hover:bg-opacity-90 transition-all duration-200 text-lg font-semibold"
                  >
                    Talk to our Agent
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-3xl font-bold text-[#333] text-center mb-4">Why Choose Our Web3 Agents?</h1>
              <p className="text-xl text-[#333] text-center">
                Experience the power of agentic web3 Agent with powerful chat interfaces.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Any Task, Any Time",
                  description: "Execute web3 onchain tasks from simple transactions to complex operations.",
                  icon: "🤖"
                },
                {
                  title: "Expert Execution", 
                  description: "Our agents are trained to handle tasks with precision, ensuring low latency on chats",
                  icon: "🎓"
                },
                {
                  title: "Real-Time Market updates",
                  description: "Our agents can provide real-time web3 news and insights.",
                  icon: "📈"
                },
                {
                  title: "Multi-Chain Support",
                  description: "Our agents are active on multiple blockchain ecosystems.",
                  icon: "⛓️"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-100 p-6 rounded-2xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-[#333] mb-2">{feature.title}</h3>
                  <p className="text-[#333]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-100 p-12 rounded-2xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-center relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-[#333] mb-6">
                  Ready to Execute Any Web3 Task?
                </h2>
                <p className="text-xl text-[#333] mb-8 max-w-2xl mx-auto">
                  Start engaging with our advance agent to handle your web3 tasks with precision and reliability.
                </p>
                
                <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                  <Link 
                    href="/chat"
                    className="w-full md:w-auto px-8 py-4 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#333] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200 text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <span>Talk to our Agent</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link 
                    href="/roadmap"
                    className="w-full md:w-auto px-8 py-4 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#333] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200 text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <span>View Roadmap</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-100 p-4 rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                    <div className="text-2xl mb-2">⚡</div>
                    <h3 className="font-semibold text-[#333] mb-1">Fast Execution</h3>
                    <p className="text-sm text-[#333]">Execute tasks with minimal latency</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                    <div className="text-2xl mb-2">🔒</div>
                    <h3 className="font-semibold text-[#333] mb-1">Secure</h3>
                    <p className="text-sm text-[#333]">Tight security</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                    <div className="text-2xl mb-2">🤖</div>
                    <h3 className="font-semibold text-[#333] mb-1">AI-Powered</h3>
                    <p className="text-sm text-[#333]">Advanced AI capabilities</p>
                  </div>
                </div>
              </div>
            </motion.div>
        </div>
        </section>

        {/* Agent Capabilities Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-[#333] text-center mb-4">What Our Agents Can Do</h2>
              <p className="text-xl text-[#333] text-center">
                From simple to complex, Agents can handle web3 tasks flawlessly.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  id: "price-analysis",
                  title: "Token Price Analysis",
                  description: "Get detailed price data and market analysis for any token, including price changes across multiple timeframes (1h, 24h, 7d, 14d, 30d) and comprehensive market metrics.",
                  icon: "📊"
                },
                {
                  id: "wallet-tracking",
                  title: "Wallet Activity Tracking",
                  description: "Analyze wallet addresses for recent activity, transaction history, and balance information. Track DeFi, NFT, and token transfer activities with detailed insights.",
                  icon: "👛"
                },
                {
                  id: "risk-assessment",
                  title: "Risk Assessment",
                  description: "Detect potential rug pulls and fraud tokens through advanced analysis of holder concentration, transaction patterns, and liquidity metrics.",
                  icon: "🔍"
                },
                {
                  id: "crypto-news",
                  title: "Crypto News & Insights",
                  description: "Stay informed with real-time cryptocurrency and Web3 news, including trending topics, sentiment analysis, and market updates across different categories.",
                  icon: "📰"
                },
                {
                  id: "onchain-analytics",
                  title: "On-Chain Analytics",
                  description: "Access comprehensive on-chain data analysis including token holder distribution, transaction patterns, and liquidity metrics for informed decision making.",
                  icon: "⛓️"
                },
                {
                  id: "wallet-integration",
                  title: "Wallet Integration",
                  description: "The agent is can be equipped with a wallet to execute transactions onchain.",
                  icon: "🔐"
                },
                {
                  id: "defi-operations",
                  title: "DeFi Operations",
                  description: "Execute DeFi operations through Jupiter integration, enabling token swaps and liquidity management on Solana.",
                  icon: "💱"
                },
                {
                  id: "token-management",
                  title: "Token Management",
                  description: "Create, deploy and managetokens with comprehensive tools for token transfers, balance checks, and token management.",
                  icon: "🪙"
                }
              ].map((capability, index) => (
                <motion.div
                  key={capability.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-100 p-6 rounded-2xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200"
                >
                  <div className="text-4xl mb-4">{capability.icon}</div>
                  <h3 className="text-xl font-semibold text-[#333] mb-2">{capability.title}</h3>
                  <p className="text-[#333]">{capability.description}</p>
                </motion.div>
              ))}
            </div>
        </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}