'use client';

import { motion } from 'framer-motion';
import Navigation from '../components/Navigation/page';
import { useState } from 'react';

const roadmapItems = [
  {
    phase: "Phase 1: Foundation",
    title: "Core Infrastructure & Agent zero.",
    description: "Building expert agents tailored for specific blockchain ecosystems/protocols.",
    status: "Completed",
    progress: 100,
    items: [
      "Agent can handle questions about ecosystem.",
      "Agent can explain and guide new users through the ecosystem.",
      "Agent can query the docs of blockchain ecosystems/protocols to guide developers on how to get starting with building.",
      "Agent can generate and explain codes to helps developers get started quickly.",
      "Agent can help users navigate the ecosystem and find the best tools and resources.",
      "Agent will be up to date with the latest news and events in the ecosystem."
    ],
    timeline: "Q2 2025",
    color: "#311b92"
  },
  {
    phase: "Phase 2: Onchain",
    title: "Enhanced Agent Capabilities.",
    description: "Agents can now perform onchain tasks.",
    status: "Completed",
    progress: 100,
    items: [
      "Agent can create tokens based on prompts.",
      "Agent can deploy tokens onchain.",
      "Agent can execute onchain transactions.",
      "Agent can read onchain data.",
      "Agent can carry out onchain analysis for users.",
    ],
    timeline: "Q2 2025",
    color: "#1a237e"
  },
  {
    phase: "Phase 3: MCP",
    title: "MCP Implementation.",
    description: "Implementing MCP to provide game changing web3 tools for agents.",
    status: "Planned",
    progress: 0,
    items: [
      "Create multiple MCP servers to provide more advance tools for agents.",
      "Multi-chain asset management and tracking.",
      "Every new MCP tool will provide more capabilities to agents."
    ],
    timeline: "Q3 2025",
    color: "#0d47a1"
  },
  {
    phase: "Mobile and Desktop",
    title: "Take your agent anywhere with you.",
    description: "Launch mobile and desktop app.",
    status: "Planned",
    progress: 0,
    items: [
      "Agentic web3 can be accessed on mobile and desktops."
    ],
    timeline: "Q4 2025",
    color: "#01579b"
  },
  {
    phase: "Super Agents",
    title: "Multichain Agentic Manager.",
    description: "Super agents will bridge the gap between blockchain ecosystems.",
    // REMINDER:: Super agents will bridge the gap between blockchain ecosystems by managing other subagents for each eco systems
    status: "Planned",
    progress: 0,
    items: [
      "Super agents can now perform multichain operations accross different chains, expanding it's capabilities to perform tasks as prompted by users."
    ],
    timeline: "2026",
    color: "#004d40"
  }
/** 
  {
    phase: "Agentic Wallet",
    title: "Multichain Agentic Wallet.",
    description: "An agentic wallet that can manage multiple chains and assets.",
    status: "Planned",
    progress: 0,
    items: [
      "An agentic wallet that can manage multiple chains and assets from user prompts.",
    ],
    timeline: "2026",
    color: "#004d40"
  }
    **/
];

export default function RoadmapPage() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

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
        
        <div className="max-w-6xl mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl font-bold text-[#333] mb-6">Platform Roadmap</h1>
            <p className="text-xl text-[#333] mb-12 max-w-3xl mx-auto">
              Our journey to build the most advanced web3 AI agents.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 rounded-full"></div>

            <div className="space-y-16">
              {roadmapItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div 
                    className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] border-4"
                    style={{ borderColor: item.color }}
                  ></div>

                  <div className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-8 w-full`}>
                    <div className="w-1/2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-100 p-8 rounded-2xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] cursor-pointer"
                        onClick={() => setExpandedPhase(expandedPhase === index ? null : index)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-sm font-semibold" style={{ color: item.color }}>{item.phase}</span>
                            <h2 className="text-2xl font-bold text-[#333] mt-1">{item.title}</h2>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`px-3 py-1 rounded-xl text-xs font-semibold mb-2 ${
                              item.status === "Completed" ? "bg-green-100 text-green-800" :
                              item.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-sm text-[#333]">{item.timeline}</span>
                          </div>
                        </div>
                        <p className="text-[#333] mb-4">{item.description}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${item.progress}%`,
                              backgroundColor: item.color
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-center items-center">
                          <motion.div
                            animate={{ rotate: expandedPhase === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-[#333]"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </div>
                        {expandedPhase === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                          >
                            <ul className="space-y-2">
                              {item.items.map((listItem, itemIndex) => (
                                <li key={itemIndex} className="flex items-start">
                                  <span className="text-[#333] mr-2">•</span>
                                  <span className="text-[#333]">{listItem}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 