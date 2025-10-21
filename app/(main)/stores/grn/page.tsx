'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface GRN {
  id: number;
  grn_number: string;
  procurement_reference: string;
  lpo_number: string;
  delivery_note_number: string;
  tax_invoice_number: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  receiving_officer_name: string;
  issuing_officer_name: string;
  approving_officer_name: string;
  item_count: number;
  total_value: number;
  created_at: string;
}

export default function GRNPage() {
  const [grns, setGrns] = useState<GRN[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchGRNs();
  }, [currentPage, statusFilter]);

  const fetchGRNs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/stores/grn?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setGrns(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching GRNs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = async (grnId: number) => {
    try {
      const response = await fetch(`/api/stores/grn/${grnId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approval_status: 'approved' }),
      });

      if (response.ok) {
        fetchGRNs(); // Refresh the list
      }
    } catch (error) {
      console.error('Error approving GRN:', error);
    }
  };

  const handleReject = async (grnId: number) => {
    try {
      const response = await fetch(`/api/stores/grn/${grnId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approval_status: 'rejected' }),
      });

      if (response.ok) {
        fetchGRNs(); // Refresh the list
      }
    } catch (error) {
      console.error('Error rejecting GRN:', error);
    }
  };

  const handleDelete = async (grnId: number) => {
    if (confirm('Are you sure you want to delete this GRN?')) {
      try {
        const response = await fetch(`/api/stores/grn/${grnId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchGRNs(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting GRN:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goods Received Notes (GRN)</h1>
          <p className="text-gray-600">Manage incoming inventory and track deliveries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/stores/grn/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New GRN
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search GRN number, LPO, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* GRN List */}
      <Card>
        <CardHeader>
          <CardTitle>GRN List</CardTitle>
          <CardDescription>
            {grns.length} GRN{grns.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : grns.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No GRNs found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first GRN</p>
              <Link href="/stores/grn/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create GRN
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {grns.map((grn) => (
                <div key={grn.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{grn.grn_number}</h3>
                        <Badge className={getStatusColor(grn.approval_status)}>
                          {getStatusIcon(grn.approval_status)}
                          <span className="ml-1 capitalize">{grn.approval_status}</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">LPO No:</span> {grn.lpo_number || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Items:</span> {grn.item_count}
                        </div>
                        <div>
                          <span className="font-medium">Value:</span> UGX {grn.total_value?.toLocaleString() || '0'}
                        </div>
                        <div>
                          <span className="font-medium">Receiving Officer:</span> {grn.receiving_officer_name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Issuing Officer:</span> {grn.issuing_officer_name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {new Date(grn.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/stores/grn/${grn.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      {grn.approval_status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(grn.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(grn.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Link href={`/stores/grn/${grn.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      {grn.approval_status !== 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(grn.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
