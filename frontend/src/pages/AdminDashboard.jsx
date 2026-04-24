import React, { useState } from 'react';
import AdminList from './AdminList';
import { Users, History, MessageSquare, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('history');

  return (
    <div className="flex min-h-screen bg-gray-100 mt-1">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md border-r">
        <div className="p-6 border-b flex items-center gap-2 font-bold text-blue-600 text-xl">
          <Shield size={24} /> Admin Panel
        </div>
        <nav className="mt-4">
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${activeTab === 'history' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <History size={20} /> Login History
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${activeTab === 'users' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users size={20} /> All Users
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${activeTab === 'messages' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MessageSquare size={20} /> Contact Messages
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">{activeTab} Management</h1>
          <p className="text-gray-500">Welcome back, Admin. Here is the latest system data.</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <AdminList type={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;