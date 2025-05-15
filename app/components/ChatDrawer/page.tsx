"use client";

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

interface ChatDrawerProps {
  chatHistories: ChatHistory[];
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  currentChatId?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCreateNewChat: () => void;
}

export default function ChatDrawer({
  chatHistories,
  onSelectChat,
  onDeleteChat,
  currentChatId,
  isCollapsed,
  onToggleCollapse,
  onCreateNewChat
}: ChatDrawerProps) {
  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] transition-all duration-300 ease-in-out z-20`}
      style={{ width: isCollapsed ? '4rem' : '20rem' }}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-4 bg-gray-100 rounded-full p-1 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200"
      >
        {isCollapsed ? (
          <Bars3Icon className="h-4 w-4 text-gray-600" />
        ) : (
          <XMarkIcon className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* Drawer Content */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className={`text-lg font-semibold text-gray-700 transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            Chat History
          </h2>
          {!isCollapsed && (
            <button
              onClick={onCreateNewChat}
              className="bg-gray-200 text-gray-700 rounded-lg px-3 py-1.5 text-sm shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-200"
            >
              New Chat
            </button>
          )}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {chatHistories.length === 0 ? (
            <p className={`text-sm text-gray-500 text-center p-4 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              No chat history yet
            </p>
          ) : (
            chatHistories.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`relative group cursor-pointer rounded-lg p-3 transition-all duration-200 ${
                  currentChatId === chat.id
                    ? 'bg-gray-200 shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff]'
                    : 'hover:bg-gray-200 hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff]'
                }`}
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => onDeleteChat(chat.id, e)}
                  className={`absolute right-2 top-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    isCollapsed ? 'hidden' : 'block'
                  } hover:bg-gray-300`}
                  title="Delete chat"
                >
                  <TrashIcon className="h-4 w-4 text-gray-600" />
                </button>

                {/* Chat Preview */}
                <div className={`space-y-1 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                  <h3 className="text-sm font-medium text-gray-700 truncate">
                    {chat.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {new Date(chat.timestamp).toLocaleDateString()} {new Date(chat.timestamp).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {chat.preview}
                  </p>
                  <div className="text-xs text-gray-500">
                    {chat.messages.length} messages
                  </div>
                </div>

                {/* Collapsed State Icon */}
                {isCollapsed && (
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {chat.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 