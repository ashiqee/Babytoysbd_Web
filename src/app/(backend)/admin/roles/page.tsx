'use client';

import React, { useState } from 'react';
import { Pencil, Save, X, ShieldCheck, PlusCircle, Search } from 'lucide-react';

interface RoleData {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

const dummyRoles: RoleData[] = [
  {
    id: 'ROLE-001',
    name: 'Admin',
    description: 'Full access to all features and settings.',
    permissions: ['manage_users', 'view_reports', 'edit_settings'],
    createdAt: '2025-06-01',
  },
  {
    id: 'ROLE-002',
    name: 'Manager',
    description: 'Can manage products, orders, and view reports.',
    permissions: ['manage_orders', 'manage_products'],
    createdAt: '2025-06-02',
  },
  {
    id: 'ROLE-003',
    name: 'Customer',
    description: 'Basic access to place and manage orders.',
    permissions: ['place_orders', 'track_orders'],
    createdAt: '2025-06-03',
  },
];

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleData[]>(dummyRoles);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<RoleData>>({});

  const startEdit = (role: RoleData) => {
    setEditingId(role.id);
    setEditData({ ...role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    setRoles((prev) =>
      prev.map((r) => (r.id === editingId ? { ...r, ...editData } as RoleData : r))
    );
    cancelEdit();
  };

  const handleChange = (field: keyof RoleData, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase()) ||
    role.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" /> Manage Roles
          </h1>
          <p className="text-sm text-gray-500">View and manage role-based permissions</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute top-2.5 left-2.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700">
            <PlusCircle size={16} /> Add Role
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3">Role ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Permissions</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{role.id}</td>
                <td className="px-4 py-3">
                  {editingId === role.id ? (
                    <input
                      value={editData.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    role.name
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === role.id ? (
                    <input
                      value={editData.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    role.description
                  )}
                </td>
                <td className="px-4 py-3">
                  <ul className="list-disc ml-5 text-xs">
                    {role.permissions.map((perm, idx) => (
                      <li key={idx}>{perm}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3">{role.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  {editingId === role.id ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={saveEdit} className="text-green-600 hover:underline">
                        <Save size={16} />
                      </button>
                      <button onClick={cancelEdit} className="text-red-600 hover:underline">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(role)} className="text-blue-600 hover:underline">
                      <Pencil size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredRoles.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">No roles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesPage;