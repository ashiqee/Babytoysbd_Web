'use client'
import { useState, useEffect } from "react";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  revenue: number;
  pendingOrders: number;
  products: number;
  newUsersToday: number;
}

const dummyStats: Stats = {
  totalUsers: 12450,
  activeUsers: 8420,
  totalOrders: 5320,
  revenue: 1234567,
  pendingOrders: 320,
  products: 230,
  newUsersToday: 120,
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setStats(dummyStats);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="p-8  min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard Statistics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon="👥" />
        <StatCard title="Active Users" value={stats.activeUsers.toLocaleString()} icon="🟢" />
        <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon="📦" />
        <StatCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon="💰" />
        <StatCard title="Pending Orders" value={stats.pendingOrders.toLocaleString()} icon="⏳" />
        <StatCard title="Products" value={stats.products.toLocaleString()} icon="🛒" />
        <StatCard title="New Users Today" value={stats.newUsersToday.toLocaleString()} icon="✨" />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white/15 p-6 rounded-lg shadow flex items-center space-x-4 hover:shadow-lg transition-shadow cursor-default">
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="dark:text-gray-300 font-semibold">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
