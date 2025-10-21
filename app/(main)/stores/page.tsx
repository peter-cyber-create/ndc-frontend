'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  FileText, 
  BarChart3, 
  Plus, 
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import { useStores, useCanCreateGRN, useCanCreateIssuance } from '@/contexts/StoresContext';

export default function StoresPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, loading: permissionsLoading } = useStores();
  const canCreateGRN = useCanCreateGRN();
  const canCreateIssuance = useCanCreateIssuance();

  const stats = {
    totalItems: 156,
    lowStockItems: 12,
    pendingGRNs: 8,
    pendingIssuances: 15,
    totalValue: 2450000
  };

  const recentGRNs = [
    { id: 1, grnNumber: 'GRN202412001', status: 'approved', items: 5, value: 125000, date: '2024-12-15' },
    { id: 2, grnNumber: 'GRN202412002', status: 'pending', items: 3, value: 75000, date: '2024-12-14' },
    { id: 3, grnNumber: 'GRN202412003', status: 'rejected', items: 2, value: 45000, date: '2024-12-13' }
  ];

  const recentIssuances = [
    { id: 1, serialNumber: 'ISS202412001', department: 'Laboratory', status: 'issued', items: 8, date: '2024-12-15' },
    { id: 2, serialNumber: 'ISS202412002', department: 'Pharmacy', status: 'pending', items: 12, date: '2024-12-14' },
    { id: 3, serialNumber: 'ISS202412003', department: 'Surgery', status: 'approved', items: 6, date: '2024-12-13' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stores Management</h1>
          <p className="text-gray-600">Ministry of Health Uganda - Assets Management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'grn', name: 'GRN', icon: Package },
            { id: 'issuance', name: 'Issuance', icon: FileText },
            { id: 'ledger', name: 'Ledger', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalItems}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.lowStockItems}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending GRNs</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingGRNs}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Issuances</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingIssuances}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">UGX {stats.totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Inventory value</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent GRNs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent GRNs
                  <Link href="/stores/grn">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardTitle>
                <CardDescription>Latest Goods Received Notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGRNs.map((grn) => (
                    <div key={grn.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{grn.grnNumber}</p>
                        <p className="text-sm text-gray-500">{grn.items} items • UGX {grn.value.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(grn.status)}>
                          {grn.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{grn.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Issuances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Issuances
                  <Link href="/stores/issuance">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardTitle>
                <CardDescription>Latest Requisition/Issue Vouchers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentIssuances.map((issuance) => (
                    <div key={issuance.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{issuance.serialNumber}</p>
                        <p className="text-sm text-gray-500">{issuance.department} • {issuance.items} items</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(issuance.status)}>
                          {issuance.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{issuance.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* GRN Tab */}
      {activeTab === 'grn' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Goods Received Notes (GRN)</h2>
            {canCreateGRN && (
              <Link href="/stores/grn/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New GRN
                </Button>
              </Link>
            )}
          </div>
          <p className="text-gray-600">Manage goods received notes and track incoming inventory</p>
          {/* GRN content will be loaded here */}
        </div>
      )}

      {/* Issuance Tab */}
      {activeTab === 'issuance' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Requisition/Issue Vouchers</h2>
            {canCreateIssuance && (
              <Link href="/stores/issuance/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Issuance
                </Button>
              </Link>
            )}
          </div>
          <p className="text-gray-600">Manage requisitions and track outgoing inventory</p>
          {/* Issuance content will be loaded here */}
        </div>
      )}

      {/* Ledger Tab */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Stock Ledger</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          <p className="text-gray-600">Track stock movements and inventory levels for all items</p>
          {/* Ledger content will be loaded here */}
        </div>
      )}
    </div>
  );
}
