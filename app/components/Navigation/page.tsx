'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { WalletConnectButton } from './WalletConnectButton';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  showAgentInfo?: {
    name: string;
    icon: string;
  };
}

export default function Navigation({ showAgentInfo }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsChatLoading(true);
    router.push('/chat');
  };

  return (
    <header className="bg-[#f0f0f0] p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23311b92' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-gray-100 p-4 rounded-2xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-12 h-12 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center">
                  <img src="/lo-go.png" alt="Web3 Docs Agent Hub" className="w-8 h-8" />
                </div>
                <h1 className="text-xl font-bold text-[#311b92]">Agentic Web3</h1>
              </Link>
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200"
            >
              <svg
                className="w-6 h-6 text-[#333]"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/" className="px-6 py-3 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#333] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200 text-lg font-semibold">
                Home
              </Link>
              <Link href="/roadmap" className="px-6 py-3 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#333] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200 text-lg font-semibold">
                Roadmap
              </Link>
              <button
                onClick={handleChatClick}
                disabled={isChatLoading}
                className="px-6 py-3 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#333] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200 text-lg font-semibold flex items-center space-x-2 disabled:opacity-50"
              >
                {isChatLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#311b92] border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Launch Agent</span>
                )}
              </button>
              {isMounted && <WalletConnectButton />}
            </nav>
          </div>

          {/* Mobile Navigation */}
          <nav
            className={`md:hidden mt-4 space-y-2 transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            <Link
              href="/"
              className="block w-full px-6 py-3 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#333] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200 text-lg font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            <Link
              href="./components/Roadmap/page"
              className="block w-full px-6 py-3 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#333] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200 text-lg font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Roadmap
            </Link>

            <button
              onClick={(e) => {
                handleChatClick(e);
                setIsMenuOpen(false);
              }}
              disabled={isChatLoading}
              className="w-full px-6 py-3 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#333] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200 text-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isChatLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#311b92] border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <span>Launch Agent</span>
              )}
            </button>

            <div className="w-full px-6 py-3">
              {isMounted && <WalletConnectButton />}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
} 