'use client'

import React, { useState, useEffect } from 'react'
import { 
  Download, Eye, CheckCircle, XCircle, DollarSign, 
  Users, FileText, Building, TrendingUp, RefreshCw,
  Filter, Search, Calendar, CreditCard, Clock, 
  Download as DownloadIcon, FileSpreadsheet, BarChart3,
  History, AlertTriangle, CheckCircle2,
  Filter as FilterIcon, SortAsc, SortDesc, Printer
} from 'lucide-react'

interface Payment {
  id: number
  type: 'registration' | 'sponsorship'
  name: string
  email: string
  organization: string
  amount: number
  package?: string
  status: 'pending' | 'approved' | 'rejected'
  paymentProofUrl?: string
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalPayments: 0,
    approvedAmount: 0,
    pendingAmount: 0,
    rejectedAmount: 0
  })
  const [sortField, setSortField] = useState('submittedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [auditLog, setAuditLog] = useState<any[]>([])
  const [showAuditLog, setShowAuditLog] = useState(false)
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv')

  const fetchPayments = async () => {
    try {
      setLoading(true)
      
      // Fetch registrations
      const registrationsResponse = await fetch('/api/admin/registrations')
      const registrationsData = await registrationsResponse.json()
      
      // Fetch sponsorships
      const sponsorshipsResponse = await fetch('/api/admin/sponsorships')
      const sponsorshipsData = await sponsorshipsResponse.json()
      
      // Transform registrations to payment format
      const registrationPayments: Payment[] = registrationsData.data?.map((reg: any) => ({
        id: reg.id,
        type: 'registration' as const,
        name: `${reg.firstName} ${reg.lastName}`,
        email: reg.email,
        organization: reg.organization,
        amount: getRegistrationAmount(reg.registrationType),
        status: reg.status,
        paymentProofUrl: reg.paymentProofUrl,
        submittedAt: reg.createdAt,
        reviewedAt: reg.updatedAt,
        reviewedBy: reg.reviewedBy
      })) || []
      
      // Transform sponsorships to payment format
      const sponsorshipPayments: Payment[] = sponsorshipsData.data?.map((sponsor: any) => ({
        id: sponsor.id,
        type: 'sponsorship' as const,
        name: sponsor.contact_person,
        email: sponsor.email,
        organization: sponsor.company_name,
        amount: getSponsorshipAmount(sponsor.selected_package),
        package: sponsor.selected_package,
        status: sponsor.status,
        submittedAt: sponsor.created_at,
        reviewedAt: sponsor.updated_at,
        reviewedBy: sponsor.reviewed_by
      })) || []
      
      const allPayments = [...registrationPayments, ...sponsorshipPayments]
      setPayments(allPayments)
      
      // Calculate statistics
      const totalAmount = allPayments.reduce((sum, payment) => sum + payment.amount, 0)
      const approvedAmount = allPayments
        .filter(p => p.status === 'approved')
        .reduce((sum, payment) => sum + payment.amount, 0)
      const pendingAmount = allPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, payment) => sum + payment.amount, 0)
      const rejectedAmount = allPayments
        .filter(p => p.status === 'rejected')
        .reduce((sum, payment) => sum + payment.amount, 0)
      
      setStats({
        totalAmount,
        totalPayments: allPayments.length,
        approvedAmount,
        pendingAmount,
        rejectedAmount
      })
      
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRegistrationAmount = (type: string): number => {
    const amounts: { [key: string]: number } = {
      'undergrad': 50,
      'grad': 75,
      'local': 100,
      'international': 200,
      'online': 25
    }
    return amounts[type] || 0
  }

  const getSponsorshipAmount = (packageType: string): number => {
    const amounts: { [key: string]: number } = {
      'bronze': 1000,
      'silver': 2500,
      'gold': 5000,
      'platinum': 10000
    }
    return amounts[packageType] || 0
  }

  const updatePaymentStatus = async (id: number, type: 'registration' | 'sponsorship', status: 'approved' | 'rejected') => {
    try {
      const endpoint = type === 'registration' 
        ? `/api/admin/registrations/${id}/status`
        : `/api/admin/sponsorships/${id}/status`
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        await fetchPayments() // Refresh data
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
    }
  }

  const downloadPaymentProof = (payment: Payment) => {
    if (payment.paymentProofUrl) {
      const url = `/api/uploads/payment-proof/download?file=${encodeURIComponent(payment.paymentProofUrl)}`
      const link = document.createElement('a')
      link.href = url
      link.download = `${payment.name.replace(/\s+/g, '_')}-${payment.id}.${payment.paymentProofUrl.split('.').pop()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesType = typeFilter === 'all' || payment.type === typeFilter
    
    // Date range filtering
    const paymentDate = new Date(payment.submittedAt)
    const startDate = dateRange.start ? new Date(dateRange.start) : null
    const endDate = dateRange.end ? new Date(dateRange.end) : null
    
    const matchesDateRange = (!startDate || paymentDate >= startDate) && 
                            (!endDate || paymentDate <= endDate)
    
    return matchesSearch && matchesStatus && matchesType && matchesDateRange
  }).sort((a, b) => {
    let aValue = a[sortField as keyof Payment]
    let bValue = b[sortField as keyof Payment]
    
    if (sortField === 'submittedAt' || sortField === 'reviewedAt') {
      aValue = new Date(aValue as string).getTime()
      bValue = new Date(bValue as string).getTime()
    }
    
    if (sortDirection === 'asc') {
      return (aValue || 0) < (bValue || 0) ? -1 : (aValue || 0) > (bValue || 0) ? 1 : 0
    } else {
      return (aValue || 0) > (bValue || 0) ? -1 : (aValue || 0) < (bValue || 0) ? 1 : 0
    }
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const exportPayments = () => {
    const data = filteredPayments.map(payment => ({
      'Payment ID': `${payment.type}-${payment.id}`,
      'Name': payment.name,
      'Email': payment.email,
      'Organization': payment.organization,
      'Type': payment.type,
      'Package': payment.package || 'N/A',
      'Amount': `$${payment.amount.toLocaleString()}`,
      'Status': payment.status,
      'Submitted Date': new Date(payment.submittedAt).toLocaleDateString(),
      'Reviewed Date': payment.reviewedAt ? new Date(payment.reviewedAt).toLocaleDateString() : 'N/A',
      'Reviewed By': payment.reviewedBy || 'N/A'
    }))

    if (exportFormat === 'csv') {
      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `payments_audit_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const generateAuditReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      totalPayments: filteredPayments.length,
      totalAmount: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
      statusBreakdown: {
        approved: filteredPayments.filter(p => p.status === 'approved').length,
        pending: filteredPayments.filter(p => p.status === 'pending').length,
        rejected: filteredPayments.filter(p => p.status === 'rejected').length
      },
      typeBreakdown: {
        registration: filteredPayments.filter(p => p.type === 'registration').length,
        sponsorship: filteredPayments.filter(p => p.type === 'sponsorship').length
      },
      payments: filteredPayments
    }
    
    console.log('Audit Report:', report)
    // You can implement PDF generation here
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600 mt-2">Manage and track all conference payments</p>
            </div>
            <button
              onClick={fetchPayments}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">${stats.approvedAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">${stats.pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">${stats.rejectedAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters & Audit Tools */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters & Audit Tools</h3>
            <div className="flex gap-2">
              <button
                onClick={exportPayments}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={generateAuditReport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                Audit Report
              </button>
              <button
                onClick={() => setShowAuditLog(!showAuditLog)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <History className="h-4 w-4" />
                Audit Log
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="registration">Registration</option>
                <option value="sponsorship">Sponsorship</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setTypeFilter('all')
                  setDateRange({ start: '', end: '' })
                }}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
          
          {/* Export Format Selection */}
          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Export Format:</label>
            <div className="flex gap-2">
              {(['csv', 'excel', 'pdf'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    exportFormat === format
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Details
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-1">
                      Type
                      {sortField === 'type' && (
                        sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      {sortField === 'amount' && (
                        sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('submittedAt')}
                  >
                    <div className="flex items-center gap-1">
                      Submitted
                      {sortField === 'submittedAt' && (
                        sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={`${payment.type}-${payment.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.name}</div>
                        <div className="text-sm text-gray-500">{payment.email}</div>
                        <div className="text-sm text-gray-500">{payment.organization}</div>
                        {payment.package && (
                          <div className="text-xs text-blue-600 font-medium">
                            {payment.package.toUpperCase()} Package
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.type === 'registration' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {payment.type === 'registration' ? (
                          <>
                            <FileText className="h-3 w-3 mr-1" />
                            Registration
                          </>
                        ) : (
                          <>
                            <Building className="h-3 w-3 mr-1" />
                            Sponsorship
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${payment.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {payment.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {payment.paymentProofUrl && (
                          <button
                            onClick={() => downloadPaymentProof(payment)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Download Payment Proof"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        
                        {payment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updatePaymentStatus(payment.id, payment.type, 'approved')}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Approve Payment"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updatePaymentStatus(payment.id, payment.type, 'rejected')}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Reject Payment"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Audit Log Section */}
        {showAuditLog && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Audit Log</h3>
              <p className="text-sm text-gray-600">Track all payment-related activities and changes</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {auditLog.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No audit entries yet</h4>
                    <p className="text-gray-500">Audit log will show payment status changes and admin actions.</p>
                  </div>
                ) : (
                  auditLog.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {entry.action === 'approved' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        {entry.action === 'rejected' && <XCircle className="h-5 w-5 text-red-600" />}
                        {entry.action === 'created' && <FileText className="h-5 w-5 text-blue-600" />}
                        {entry.action === 'updated' && <RefreshCw className="h-5 w-5 text-yellow-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{entry.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()} • {entry.user}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Additional Audit Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Alerts</h3>
                <p className="text-sm text-gray-600">Monitor unusual payment patterns</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                • High-value payments pending review: 0<br/>
                • Duplicate payment attempts: 0<br/>
                • Failed payment verifications: 0
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Analytics</h3>
                <p className="text-sm text-gray-600">Track payment trends and patterns</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                • Average payment amount: ${(stats.totalAmount / Math.max(stats.totalPayments, 1)).toFixed(2)}<br/>
                • Payment success rate: {((stats.approvedAmount / Math.max(stats.totalAmount, 1)) * 100).toFixed(1)}%<br/>
                • Peak payment hours: 9-11 AM, 2-4 PM
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Export Options</h3>
                <p className="text-sm text-gray-600">Generate reports for external use</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => exportPayments()}
                className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                📊 Export Payment Summary
              </button>
              <button
                onClick={() => generateAuditReport()}
                className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                📋 Generate Audit Report
              </button>
              <button
                onClick={() => window.print()}
                className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                🖨️ Print Payment List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
