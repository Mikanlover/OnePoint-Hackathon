import React from 'react';
import { Layers, Sliders, History, Settings, X } from 'lucide-react';
import { useModelContext } from '../context/ModelContext';

const Sidebar: React.FC = () => {
  const { 
    modelSettings, 
    updateModelSettings, 
    isSidebarOpen, 
    toggleSidebar 
  } = useModelContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    updateModelSettings({
      ...modelSettings,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside 
        className={`
          fixed md:static inset-y-0 left-0 w-80 bg-white border-r border-gray-200 z-20
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Layers className="h-6 w-6 text-teal-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">DeepSeek R1</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Sliders className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Model Parameters</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature: {modelSettings.temperature}
                </label>
                <input
                  type="range"
                  id="temperature"
                  name="temperature"
                  min="0"
                  max="1"
                  step="0.1"
                  value={modelSettings.temperature}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-teal-600"
                />
              </div>
              
              <div>
                <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Tokens
                </label>
                <input
                  type="number"
                  id="maxTokens"
                  name="maxTokens"
                  value={modelSettings.maxTokens}
                  onChange={handleChange}
                  min="10"
                  max="2048"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label htmlFor="simplifyThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                  Simplify Threshold
                </label>
                <select
                  id="simplifyThreshold"
                  name="simplifyThreshold"
                  value={modelSettings.simplifyThreshold}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  <option value="low">Low (Rarely redirect)</option>
                  <option value="medium">Medium (Balance)</option>
                  <option value="high">High (Often redirect)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-3">
              <History className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Session</h2>
            </div>
            
            <button 
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              New Chat
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;