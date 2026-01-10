// lib/sidebarMenu.ts

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
  Tags,
  Store,
  ClipboardList,
  Truck,
  CreditCard,
  Star,
  User,
  UserPen,
  DollarSign,
  FileText,
  FileUp,
  CassetteTape,
} from 'lucide-react';

export const roleBasedSidebarMenu: Record<
  'admin' | 'manager' | 'salesman' | 'customer',
  {
    title: string;
    collapsible?: boolean;
    items: { label: string; href: string; icon?: any }[];
  }[]
> = {
  admin: [
    {
      title: 'Dashboard',
      items: [{ label: 'Admin Panel', href: '/admin/dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Products',
      collapsible: true,
      items: [
        { label: 'All Products', href: '/admin/products', icon: Package },
        { label: 'Add Product', href: '/admin/products/add', icon: Package },
        { label: 'Categories', href: '/admin/categories', icon: CassetteTape },
        { label: 'Tags', href: '/admin/tags', icon: Tags },
        { label: 'Inventory', href: '/admin/inventory', icon: ClipboardList },
        { label: 'Export/Import', href: '/admin/export-import', icon: FileUp  },
      ],
    },
    {
      title: 'Orders',
      collapsible: true,
      items: [
        { label: 'All Orders', href: '/admin/orders', icon: ShoppingCart },
        { label: 'Shipping', href: '/admin/shipping', icon: Truck },
        { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
      ],
    },
    {
      title: 'Users',
      collapsible: true,
      items: [
        { label: 'Manage Users', href: '/admin/users', icon: Users },
        { label: 'Roles', href: '/admin/roles', icon: User },
      ],
    },
    {
      title: 'Reports',
      collapsible: true,
      items: [
        { label: 'Sales', href: '/admin/reports/sales', icon: BarChart },
        { label: 'Products', href: '/admin/reports/products', icon: FileText },
      ],
    },
    {
      title: 'Landing Pages',
      collapsible: true,
      items: [
        { label: 'Create New page', href: '/admin/landing-page/create', icon: BarChart },
        { label: 'Landing pages', href: '/admin/landing-page', icon: FileText },
      ],
    },
    {
      title: 'Settings',
      collapsible: true,
      items: [
        { label: 'Store Settings', href: '/admin/settings/store', icon: Store },
        { label: 'Preferences', href: '/admin/settings/preferences', icon: Settings },
        { label: 'Profile', href: '/admin/settings/profile', icon: UserPen  },
      ],
    },
  ],

  manager: [
    {
      title: 'Dashboard',
      items: [{ label: 'Manager View', href: '/manager/dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Products',
      collapsible: true,
      items: [
        { label: 'Product List', href: '/manager/products', icon: Package },
        { label: 'Stock Overview', href: '/manager/inventory', icon: ClipboardList },
      ],
    },
    {
      title: 'Orders',
      collapsible: true,
      items: [
        { label: 'Manage Orders', href: '/manager/orders', icon: ShoppingCart },
        { label: 'Shipping Info', href: '/manager/shipping', icon: Truck },
      ],
    },
    {
      title: 'Reports',
      collapsible: true,
      items: [
        { label: 'Sales Reports', href: '/manager/reports', icon: BarChart },
      ],
    },
  ],

  salesman: [
    {
      title: 'Dashboard',
      items: [{ label: 'Sales Panel', href: '/salesman/dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Orders',
      collapsible: true,
      items: [
        { label: 'New Orders', href: '/salesman/orders/new', icon: ShoppingCart },
        { label: 'Order History', href: '/salesman/orders/history', icon: FileText },
      ],
    },
    {
      title: 'Customers',
      items: [
        { label: 'My Customers', href: '/salesman/customers', icon: Users },
      ],
    },
    {
      title: 'Targets',
      items: [
        { label: 'Sales Targets', href: '/salesman/targets', icon: DollarSign },
      ],
    },
  ],

  customer: [
    {
      title: 'My Account',
      items: [{ label: 'Dashboard', href: '/customer/dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Orders',
      collapsible: true,
      items: [
        { label: 'My Orders', href: '/customer/orders', icon: ShoppingCart },
        { label: 'Track Order', href: '/customer/orders/track', icon: Truck },
      ],
    },
    {
      title: 'Wishlist',
      items: [{ label: 'My Wishlist', href: '/customer/wishlist', icon: Star }],
    },
    {
      title: 'Settings',
      items: [{ label: 'Profile Settings', href: '/customer/settings', icon: Settings }],
    },
  ],
};
