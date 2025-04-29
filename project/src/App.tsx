import React from 'react';
import { Layers } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import { ModelProvider } from './context/ModelContext';

function App() {
  return (
    <ModelProvider>
      <div className="flex flex-col md:flex-row h-screen bg-gray-50">
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 md:hidden">
          <div className="flex items-center">
            <Layers className="h-6 w-6 text-teal-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">DeepSeek R1</h1>
          </div>
        </header>
        
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface />
        </main>
      </div>
    </ModelProvider>
  );
}

export default App;