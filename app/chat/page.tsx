"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAgent } from "@/app/hooks/useAgent";
import ReactMarkdown from 'react-markdown';
import ChatDrawer from '@/app/components/ChatDrawer/page';
import WalletButton from '@/app/components/WalletButton/page';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  id?: string;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  messages: Message[];
}

const MESSAGE_LIMIT = 400;

const getDailyMessageCount = () => {
  const today = new Date().toDateString();
  const storedData = localStorage.getItem('chatMessageCount');
  if (storedData) {
    const data = JSON.parse(storedData);
    if (data.date === today) {
      return data.count;
    }
  }
  return 0;
};

const incrementDailyMessageCount = () => {
  const today = new Date().toDateString();
  const currentCount = getDailyMessageCount();
  localStorage.setItem('chatMessageCount', JSON.stringify({
    date: today,
    count: currentCount + 1
  }));
};

/**
 * Home page for the AgentKit Quickstart
 *
 * @returns {React.ReactNode} The home page
 */
export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const { messages: agentMessages, sendMessage, isThinking, resetMessages } = useAgent();
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const lastScrollTime = useRef<number>(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Memoize the messages array to prevent unnecessary re-renders with proper typing
  const messages = useMemo<Message[]>(() => agentMessages.map(msg => ({
    role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.text,
    timestamp: new Date().toISOString(),
    id: `${msg.sender}-${msg.text}-${Date.now()}`
  })), [agentMessages]);

  // Add a function to create a new chat
  const createNewChat = useCallback(() => {
    setCurrentChatId(undefined);
    setDisplayedMessages([]);
    resetMessages?.();
  }, [resetMessages]);

  // Load chat histories from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('chatHistories');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats) as ChatHistory[];
      setChatHistories(parsedChats);
      
      // If there's a current chat ID in localStorage, load it
      const savedCurrentChatId = localStorage.getItem('currentChatId');
      if (savedCurrentChatId && parsedChats.find((chat: ChatHistory) => chat.id === savedCurrentChatId)) {
        setCurrentChatId(savedCurrentChatId);
        const selectedChat = parsedChats.find((chat: ChatHistory) => chat.id === savedCurrentChatId);
        if (selectedChat) {
          setDisplayedMessages(selectedChat.messages);
        }
      }
    }
  }, []); // Empty dependency array since this should only run once on mount

  // Update displayed messages and chat history when agent messages change
  useEffect(() => {
    if (messages.length === 0) return; // Skip if no messages

    // Get the latest message
    const latestMessage = messages[messages.length - 1];
    
    // Check if the message is already in displayed messages
    const isDuplicate = displayedMessages.some(msg => 
      msg.content === latestMessage.content && 
      msg.role === latestMessage.role &&
      Math.abs(new Date(msg.timestamp).getTime() - new Date(latestMessage.timestamp).getTime()) < 1000
    );

    if (isDuplicate) return; // Skip if this is a duplicate message

    // Update displayed messages by appending only the latest message
    setDisplayedMessages(prev => {
      // If this is a new chat and it's the first message, start fresh
      if (!currentChatId && prev.length === 0) {
        return [latestMessage];
      }
      // Otherwise, append the latest message
      return [...prev, latestMessage];
    });

    // Handle chat creation or update
    if (!currentChatId) {
      // Create new chat if none exists
      const newChat: ChatHistory = {
        id: Date.now().toString(),
        title: latestMessage.content.slice(0, 30) + '...',
        timestamp: new Date().toISOString(),
        preview: latestMessage.content,
        messages: [latestMessage] // Only use the latest message for new chats
      };
      setChatHistories(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
    } else {
      // Update existing chat by appending the latest message
      setChatHistories(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, latestMessage],
              preview: latestMessage.content // Update preview with latest message
            }
          : chat
      ));
    }
  }, [messages, currentChatId, displayedMessages]);

  // Handle chat selection
  const handleSelectChat = useCallback((chatId: string) => {
    const selectedChat = chatHistories.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setDisplayedMessages(selectedChat.messages);
      // Don't reset messages when selecting a chat, as it causes duplication
      // resetMessages?.();
    }
  }, [chatHistories]);

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    if (messageCount >= MESSAGE_LIMIT) {
      alert('You have reached your daily message limit. Please try again tomorrow.');
      return;
    }

    const message = input;
    setInput('');
    incrementDailyMessageCount();
    setMessageCount(prev => prev + 1);
    
    // Send message to agent and wait for response
    try {
      // Clear displayed messages if this is a new chat
      if (!currentChatId) {
        setDisplayedMessages([]);
      }
      await sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Update message count on mount
  useEffect(() => {
    const count = getDailyMessageCount();
    setMessageCount(count);
  }, []);

  // Save chat histories to localStorage
  useEffect(() => {
    if (chatHistories.length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [chatHistories]);

  // Save current chat ID
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentChatId) {
        localStorage.setItem('currentChatId', currentChatId);
      } else {
        localStorage.removeItem('currentChatId');
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [currentChatId]);

  // Modify scroll event handler
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const now = Date.now();
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set user scrolling state
      setIsUserScrolling(true);
      lastScrollTime.current = now;

      // Reset user scrolling state after 1 second of no scrolling
      scrollTimeout.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 1000);

      // Only enable auto-scroll if user is near bottom
      setShouldAutoScroll(isNearBottom);
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Modify scroll to bottom function to use useCallback
  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && !isUserScrolling && (Date.now() - lastScrollTime.current > 1000)) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [shouldAutoScroll, isUserScrolling]);

  // Modify the messages effect to be more strict about when to scroll
  useEffect(() => {
    const scrollIfNeeded = () => {
      if (displayedMessages.length > 0) {
        const lastMessage = displayedMessages[displayedMessages.length - 1];
        const isNewMessage = Date.now() - new Date(lastMessage.timestamp).getTime() < 500;
        
        if (isNewMessage && !isUserScrolling && shouldAutoScroll) {
          scrollToBottom();
        }
      }
    };
    scrollIfNeeded();
  }, [displayedMessages, isUserScrolling, shouldAutoScroll, scrollToBottom]);

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat history?')) {
      setChatHistories(prev => prev.filter(chat => chat.id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(undefined);
        setDisplayedMessages([]);
        resetMessages?.(); // Reset the agent messages if the function exists
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] relative">
      {/* Background Pattern - adjusted opacity and z-index */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23311b92' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Wallet Button */}
      <WalletButton />

      {/* Chat Drawer with New Chat Button */}
      <div className="fixed top-0 left-0 h-full z-10">
        <ChatDrawer
          chatHistories={chatHistories}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          currentChatId={currentChatId}
          isCollapsed={isDrawerCollapsed}
          onToggleCollapse={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
          onCreateNewChat={createNewChat}
        />
      </div>

      {/* Content - adjusted margin and padding */}
      <main 
        className={`flex flex-col h-screen relative transition-all duration-300 ease-in-out`} 
        style={{ 
          zIndex: 1,
          marginLeft: isDrawerCollapsed ? '4rem' : '20rem',
          paddingTop: '5rem'
        }}
      >
        {/* Add New Chat Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={createNewChat}
            className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] focus:outline-none transition-all duration-200 flex items-center space-x-2"
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 space-y-6 py-4 max-w-4xl mx-auto w-full flex flex-col items-end"
        >
          {displayedMessages.length === 0 ? (
            <p className="text-center text-gray-500 w-full">Start chatting with AgentKit...</p>
          ) : (
            displayedMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } w-full max-w-[calc(100%-8rem)]`}
              >
                {message.role === 'assistant' && (
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center overflow-hidden">
                      <img 
                        src="/lo-go.png" 
                        alt="AI Assistant" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-gray-200 text-gray-700 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]'
                      : 'bg-gray-100 text-gray-700 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="text-base font-medium" {...props} />,
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-4 mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-2" {...props} />,
                        li: ({ node, ...props }) => <li className="my-1" {...props} />,
                        code: ({ children, className, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return !match ? (
                            <code className="bg-gray-200 rounded px-1 py-0.5 text-sm" {...props}>
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-gray-200 rounded p-2 my-2 text-sm overflow-x-auto" {...props}>
                              {children}
                            </code>
                          );
                        },
                        pre: ({ node, ...props }) => <pre className="bg-gray-200 rounded p-2 my-2 overflow-x-auto" {...props} />,
                        a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic" {...props} />,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="ml-3 flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
          {isThinking && (
            <div className="flex justify-start w-full">
              <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 text-gray-700 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                <div className="flex space-x-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="text-center text-sm text-gray-500 mb-2">
            Messages remaining today: {MESSAGE_LIMIT - messageCount}
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-100 p-4 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]"
          >
            <div className="w-full px-4 flex space-x-2 max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={messageCount >= MESSAGE_LIMIT ? "Daily message limit reached" : "Type your message..."}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-3 shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] text-gray-700 placeholder-gray-500 focus:outline-none focus:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition-all duration-200 text-base font-medium"
                disabled={isThinking || messageCount >= MESSAGE_LIMIT}
              />
              <button
                type="submit"
                disabled={isThinking || messageCount >= MESSAGE_LIMIT}
                className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:shadow-[2px_2px_5px_#d1d9e6,-2px_-2px_5px_#ffffff]"
              >
                <PaperAirplaneIcon className="h-6 w-6" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
