import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ModelSettings } from '../types';

interface ModelContextType {
  modelSettings: ModelSettings;
  updateModelSettings: (settings: ModelSettings) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const defaultSettings: ModelSettings = {
  temperature: 0.7,
  maxTokens: 512,
  simplifyThreshold: 'medium',
};

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const useModelContext = () => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModelContext must be used within a ModelProvider');
  }
  return context;
};

interface ModelProviderProps {
  children: ReactNode;
}

export const ModelProvider: React.FC<ModelProviderProps> = ({ children }) => {
  const [modelSettings, setModelSettings] = useState<ModelSettings>(defaultSettings);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const updateModelSettings = (settings: ModelSettings) => {
    setModelSettings(settings);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <ModelContext.Provider 
      value={{ 
        modelSettings, 
        updateModelSettings, 
        isSidebarOpen, 
        toggleSidebar 
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};