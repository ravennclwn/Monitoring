"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { MetricCard } from '@/components/metric-card';
import { TemperatureChart } from '@/components/temperature-chart';
import { TemperatureScale } from '@/components/temperature-scale';
import { CPUMonitoringTable } from '@/components/cpu-monitoring-table';
import { Footer } from '@/components/footer';
import { useCPUStore } from '@/lib/store';
import { 
  Cpu, 
  Thermometer, 
  Monitor, 
  AlertTriangle 
} from 'lucide-react';

export default function HomePage() {
  const { 
    cpuData, 
    metrics, 
    isConnected,
    getMaxCpuTemp, 
    getCpuCount, 
    getHighestTempCpuName 
  } = useCPUStore();

  const [dashboardMetrics, setDashboardMetrics] = useState({
    cpuCount: 5,
    roomTemp: 24.5,
    totalComputers: 1,
    maxCpuTemp: 78.2,
    maxCpuName: 'CPU-01'
  });

  // Update dashboard metrics based on CPU store data
  useEffect(() => {
    const maxTemp = getMaxCpuTemp();
    const cpuName = getHighestTempCpuName();
    
    setDashboardMetrics(prev => ({
      ...prev,
      cpuCount: getCpuCount(),
      maxCpuTemp: maxTemp > 0 ? maxTemp : prev.maxCpuTemp,
      maxCpuName: cpuName
    }));
  }, [cpuData, getMaxCpuTemp, getCpuCount, getHighestTempCpuName]);

  // Simulate room temperature updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardMetrics(prev => ({
        ...prev,
        roomTemp: 24.5 + (Math.random() - 0.5) * 2, // Room temp with slight variation
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Monitoring Suhu & CPU</h1>
              <p className="text-muted-foreground mt-2">
                Real-time monitoring dashboard for CPU temperature and room environment
              </p>
              {isConnected && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Connected to AIDA64 CSV data from CPU Monitoring page
                </p>
              )}
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="CPU yang Dimonitor"
                value={dashboardMetrics.cpuCount}
                status={isConnected ? "AIDA64" : "PRTG"}
                statusColor="blue"
                icon={Cpu}
                iconColor="blue"
              />
              
              <MetricCard
                title="Suhu Ruangan Lab"
                value={`${dashboardMetrics.roomTemp.toFixed(1)}°C`}
                status="Normal"
                statusColor="orange"
                icon={Thermometer}
                iconColor="orange"
              />
              
              <MetricCard
                title="Total Komputer"
                value={dashboardMetrics.totalComputers}
                status="Aktif"
                statusColor="green"
                icon={Monitor}
                iconColor="green"
              />
              
              <MetricCard
                title="Suhu Tertinggi CPU"
                value={`${dashboardMetrics.maxCpuTemp.toFixed(1)}°C`}
                status={dashboardMetrics.maxCpuName}
                statusColor="red"
                icon={AlertTriangle}
                iconColor="red"
              />
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <TemperatureChart cpuData={cpuData} />
              <TemperatureScale />
            </div>

            {/* CPU Monitoring Table */}
            <div className="grid grid-cols-1 gap-6">
              <CPUMonitoringTable cpuData={cpuData} />
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}