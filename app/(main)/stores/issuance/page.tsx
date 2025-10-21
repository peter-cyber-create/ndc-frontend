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
  CheckCircle,
  XCircle,
  Clock,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface Issuance {
  id: number;
  serial_number: string;
  from_department: string;
  issuance_date: string;
  approval_status: 'pending' | 'approved' | 'issued' | 'rejected';
  requisition_officer_name: string;
  issuing_officer_name: string;
  receiving_officer_name: string;
  head_of_department_name: string;
  approving_officer_name: string;
  item_count: number;
  total_quantity_ordered: number;
  total_quantity_approved: number;
  total_quantity_issued: number;
  created_at: string;
}

export default function IssuancePage() {
  const [issuances, setIssuances] = useState<Issuance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchIssuances();
  }, [currentPage, statusFilter, departmentFilter]);

  const fetchIssuances = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (departmentFilter !== 'all') {
        params.append('department', departmentFilter);
      }

      const response = await fetch(`/api/stores/issuance?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setIssuances(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching issuances:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
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
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = async (issuanceId: number) => {
    try {
      const response = await fetch(`/api/stores/issuance/${issuanceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approval_status: 'approved' }),
      });

      if (response.ok) {
        fetchIssuances(); // Refresh the list
      }
    } catch (error) {
      console.error('Error approving issuance:', error);
    }
  };

  const handleIssue = async (issuanceId: number) => {
    try {
      const response = await fetch(`/api/stores/issuance/${issuanceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approval_status: 'issued' }),
      });

      if (response.ok) {
        fetchIssuances(); // Refresh the list
      }
    } catch (error) {
      console.error('Error issuing items:', error);
    }
  };

  const handleReject = async (issuanceId: number) => {
    try {
      const response = await fetch(`/api/stores/issuance/${issuanceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approval_status: 'rejected' }),
      });

      if (response.ok) {
        fetchIssuances(); // Refresh the list
      }
    } catch (error) {
      console.error('Error rejecting issuance:', error);
    }
  };

  const handleDelete = async (issuanceId: number) => {
    if (confirm('Are you sure you want to delete this issuance?')) {
      try {
        const response = await fetch(`/api/stores/issuance/${issuanceId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchIssuances(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting issuance:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Requisition/Issue Vouchers</h1>
          <p className="text-gray-600">Manage outgoing inventory and track requisitions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/stores/issuance/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Issuance
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
                  placeholder="Search serial number, department..."
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
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Laboratory">Laboratory</SelectItem>
                <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                <SelectItem value="Surgery">Surgery</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Issuance List */}
      <Card>
        <CardHeader>
          <CardTitle>Issuance List</CardTitle>
          <CardDescription>
            {issuances.length} Issuance{issuances.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : issuances.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No issuances found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first issuance</p>
              <Link href="/stores/issuance/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Issuance
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {issuances.map((issuance) => (
                <div key={issuance.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{issuance.serial_number}</h3>
                        <Badge className={getStatusColor(issuance.approval_status)}>
                          {getStatusIcon(issuance.approval_status)}
                          <span className="ml-1 capitalize">{issuance.approval_status}</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Department:</span> {issuance.from_department}
                        </div>
                        <div>
                          <span className="font-medium">Items:</span> {issuance.item_count}
                        </div>
                        <div>
                          <span className="font-medium">Ordered:</span> {issuance.total_quantity_ordered}
                        </div>
                        <div>
                          <span className="font-medium">Issued:</span> {issuance.total_quantity_issued}
                        </div>
                        <div>
                          <span className="font-medium">Requisition Officer:</span> {issuance.requisition_officer_name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Issuing Officer:</span> {issuance.issuing_officer_name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(issuance.issuance_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {new Date(issuance.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/stores/issuance/${issuance.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      {issuance.approval_status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(issuance.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(issuance.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {issuance.approval_status === 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIssue(issuance.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Link href={`/stores/issuance/${issuance.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      {issuance.approval_status !== 'issued' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(issuance.id)}
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
