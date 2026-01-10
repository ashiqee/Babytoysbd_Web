'use client';

import React, { useState } from 'react';
import { Search, Pencil, Save, X, User, ShieldCheck, UserRound, Briefcase } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Customer' | 'Manager';
  status: 'Active' | 'Inactive' | 'Banned';
  createdAt: string;
}

const dummyUsers: UserData[] = new Array(50).fill(0).map((_, i) => ({
  id: `USR-${1000 + i}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@shop.com`,
  role: ['Admin', 'Customer', 'Manager'][i % 3] as UserData['role'],
  status: ['Active', 'Inactive', 'Banned'][i % 3] as UserData['status'],
  createdAt: `2025-06-${(i % 30) + 1}`,
}));

const getStatusStyle = (status: UserData['status']) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-700';
    case 'Inactive': return 'bg-yellow-100 text-yellow-700';
    case 'Banned': return 'bg-red-100 text-red-700';
  }
};

const getRoleIcon = (role: UserData['role']) => {
  const classes = 'inline mr-1 w-4 h-4';
  switch (role) {
    case 'Admin': return <ShieldCheck className={classes} />;
    case 'Customer': return <UserRound className={classes} />;
    case 'Manager': return <Briefcase className={classes} />;
  }
};

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>(dummyUsers);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserData>>({});
  const [sortRole, setSortRole] = useState('');
  const [sortStatus, setSortStatus] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const startEdit = (user: UserData) => {
    setEditingId(user.id);
    setEditData({ ...user });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingId ? { ...u, ...editData } as UserData : u))
    );
    cancelEdit();
  };

  const handleChange = (field: keyof UserData, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const filtered = users
    .filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toLowerCase().includes(search.toLowerCase())
    )
    .filter((user) =>
      sortRole ? user.role === sortRole : true
    )
    .filter((user) =>
      sortStatus ? user.status === sortStatus : true
    );

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-6 h-6" /> Manage Users
          </h1>
          <p className="text-sm text-gray-500">View, edit, and manage users</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute top-2.5 left-2.5 w-5 h-5 text-gray-500" />
            <input
              placeholder="Search by name, email, or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <select
            value={sortRole}
            onChange={(e) => setSortRole(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
            <option value="Manager">Manager</option>
          </select>
          <select
            value={sortStatus}
            onChange={(e) => setSortStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Banned">Banned</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{user.id}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  {editingId === user.id ? (
                    <select className="border rounded px-2 py-1" value={editData.role} onChange={(e) => handleChange('role', e.target.value)}>
                      {["Admin", "Customer", "Manager"].map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="flex items-center">{getRoleIcon(user.role)}{user.role}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === user.id ? (
                    <select className="border rounded px-2 py-1" value={editData.status} onChange={(e) => handleChange('status', e.target.value)}>
                      {["Active", "Inactive", "Banned"].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(user.status)}`}>{user.status}</span>
                  )}
                </td>
                <td className="px-4 py-3">{user.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  {editingId === user.id ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={saveEdit} className="text-green-600 hover:underline">
                        <Save size={16} />
                      </button>
                      <button onClick={cancelEdit} className="text-red-600 hover:underline">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(user)} className="text-blue-600 hover:underline">
                      <Pencil size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">
          Prev
        </button>
        <span className="px-4 py-1">Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageUsersPage;