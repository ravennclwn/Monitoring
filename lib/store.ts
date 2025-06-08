"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CPUData {
  id: string;
  name: string;
  temperature: number;
  maxTemp: number;
  cores: number;
  usage: number;
  status: string;
}

export interface CPUMetrics {
  totalCPUs: number;
  avgTemp: number;
  maxTemp: number;
  dataSource: string;
}

interface CPUStore {
  // Data state
  cpuData: CPUData[];
  metrics: CPUMetrics;
  uploadedCsvContent: string | null;
  isConnected: boolean;
  autoRefresh: boolean;
  lastUpdate: Date | null;
  
  // Actions
  setCpuData: (data: CPUData[]) => void;
  setMetrics: (metrics: CPUMetrics) => void;
  setUploadedCsvContent: (content: string | null) => void;
  setIsConnected: (connected: boolean) => void;
  setAutoRefresh: (autoRefresh: boolean) => void;
  setLastUpdate: (date: Date) => void;
  
  // Computed getters
  getMaxCpuTemp: () => number;
  getCpuCount: () => number;
  getHighestTempCpuName: () => string;
}

export const useCPUStore = create<CPUStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cpuData: [],
      metrics: {
        totalCPUs: 5,
        avgTemp: 0,
        maxTemp: 0,
        dataSource: 'Mock Data'
      },
      uploadedCsvContent: null,
      isConnected: false,
      autoRefresh: false,
      lastUpdate: null,
      
      // Actions
      setCpuData: (data) => set({ cpuData: data }),
      setMetrics: (metrics) => set({ metrics }),
      setUploadedCsvContent: (content) => set({ uploadedCsvContent: content }),
      setIsConnected: (connected) => set({ isConnected: connected }),
      setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
      setLastUpdate: (date) => set({ lastUpdate: date }),
      
      // Computed getters
      getMaxCpuTemp: () => {
        const { cpuData } = get();
        if (cpuData.length === 0) return 0;
        return Math.max(...cpuData.map(cpu => cpu.temperature));
      },
      
      getCpuCount: () => {
        return 5; // Fixed as requested
      },
      
      getHighestTempCpuName: () => {
        const { cpuData } = get();
        if (cpuData.length === 0) return 'CPU-01';
        
        const maxTemp = Math.max(...cpuData.map(cpu => cpu.temperature));
        const hottest = cpuData.find(cpu => cpu.temperature === maxTemp);
        return hottest ? hottest.name : 'CPU-01';
      }
    }),
    {
      name: 'cpu-monitoring-storage',
      partialize: (state) => ({
        cpuData: state.cpuData,
        metrics: state.metrics,
        uploadedCsvContent: state.uploadedCsvContent,
        isConnected: state.isConnected,
        autoRefresh: state.autoRefresh,
        lastUpdate: state.lastUpdate,
      }),
    }
  )
);