import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, Settings, FileText, ChevronRight, LogOut, Menu, X } from 'lucide-react';
import { cn } from '../../libs/utils';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout, walletAddress } = useAuth();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024); // Open by default only on desktop
  const [chatFiles, setChatFiles] = useState<string[]>([]);

  const navItems = [
    { icon: Bot, label: 'Chat Bot', to: '/dashboard' },
    { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
  ];

  // Fetch chat history files
  const fetchChatHistoryFiles = async () => {
    try {
      const response = await fetch('http://localhost:3000/chat-files');
      const data = await response.json();
      setChatFiles(data.reverse()); // Reverse the order so the latest files appear first
    } catch (error) {
      console.error('Error fetching chat history files:', error);
    }
  };

  // Periodically check for new chat files
  useEffect(() => {
    fetchChatHistoryFiles(); // Initial fetch

    const interval = setInterval(() => {
      fetchChatHistoryFiles();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-white shadow-md"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-10 transition-all duration-300 transform',
          'bg-gradient-to-br from-white via-gray-50 to-gray-100 border-r border-gray-200/80 -z-0',
          'shadow-[4px_0_24px_-2px_rgba(0,0,0,0.05)] flex flex-col h-screen',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isOpen ? 'w-72 lg:w-64' : 'w-0 lg:w-20',
          !isOpen && 'lg:block hidden' // Hide on mobile when closed
        )}
      >
        {/* Logo/Brand Area */}
        <div className="p-6 border-b border-gray-200">
          <h1
            className={cn(
              'font-bold text-xl text-gray-900 transition-all duration-200',
              !isOpen && 'lg:hidden'
            )}
          >
            Dashboard
          </h1>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-6 space-y-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center">
                    <item.icon
                      className={cn(
                        'h-5 w-5 transition-colors duration-200',
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600',
                        !isOpen && 'lg:mx-auto'
                      )}
                    />
                    <span
                      className={cn(
                        'ml-3 transition-all duration-200',
                        !isOpen && 'lg:hidden'
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isActive ? 'text-white/80' : 'text-gray-400 group-hover:text-gray-600',
                      'opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0',
                      !isOpen && 'lg:hidden'
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}

          {/* Chat History */}
          <h2 className="font-bold text-sm mt-4">Chat History</h2>
          {chatFiles.map((fileName) => (
            <NavLink
              key={fileName}
              to={`/dashboard/chat-history/${fileName}`}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 text-gray-700"
            >
              <FileText className="h-5 w-5 text-gray-500 mr-2" />
              {fileName.replace('.json', '')}
            </NavLink>
          ))}
        </nav>

        {/* Wallet & Logout */}
        <div className={cn('border-t border-gray-200 p-4 -z-10', !isOpen && 'lg:p-2')}>
          <div className="space-y-3">
            <div
              className={cn('flex items-center', isOpen ? 'justify-between' : 'lg:justify-center')}
            >
              <h1
                className={cn('text-sm font-medium text-gray-900', !isOpen && 'lg:hidden')}
              >
                Wallet
              </h1>
              <button
                onClick={logout}
                className={cn(
                  'inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors',
                  isOpen ? 'px-2 py-1' : 'lg:p-2'
                )}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className={cn('ml-1', !isOpen && 'lg:hidden')}>Logout</span>
              </button>
            </div>
            {walletAddress && (
              <p className={cn('text-xs text-gray-500', isOpen ? 'break-all' : 'lg:hidden')}>
                {isOpen ? walletAddress : null}
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
