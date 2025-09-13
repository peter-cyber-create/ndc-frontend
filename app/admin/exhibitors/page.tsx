'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, Filter, Download, Eye, Trash2, CheckCircle, XCircle, 
  Clock, AlertCircle, User, Mail, Building, Phone, Calendar,
  Package, ExternalLink, DollarSign, Award
} from 'lucide-react'

interface Exhibitor {
  id: number
  company_name: string
  contact_person: string
  email: string
  phone: string
  selected_package: string
  booth_preference?: string
  special_requirements?: string
  additional_info?: string
  address?: string
  city?: string
  country?: string
  payment_proof_url?: string
  status: string
  submitted_at: string
  created_at: string
  updated_at: string
}

// Helper function to get exhibition amount based on package
const getExhibitionAmount = (packageType: string): number => {
  const amounts: { [key: string]: number } = {
    'platinum': 5000,
    'gold': 3000,
    'silver': 2000,
    'bronze': 1000,
    'non-profit': 500
  }
  return amounts[packageType] || 0
}

export default function ExhibitorsPage() {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [packageFilter, setPackageFilter] = useState('all')
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  // API URL
  const API_URL = typeof window !== 'undefined' && window.location.hostname === 'conference.health.go.ug' 
    ? 'https://conference.health.go.ug' 
    : 'http://localhost:3000'

  useEffect(() => {
    loadExhibitors()
  }, [])

  const loadExhibitors = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/api/admin/exhibitors?t=${Date.now()}?t=${Date.now()}`, { cache: "no-store" })
      
      if (response.ok) {
        const data = await response.json()
        setExhibitors(data.exhibitors || [])
      } else {
        setError('Failed to load exhibitors')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/exhibitors/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setExhibitors(exhibitors.map(exhibitor => 
          exhibitor.id === id ? { ...exhibitor, status: newStatus } : exhibitor
        ))
      } else {
        alert('Failed to update status')
      }
    } catch (err) {
      alert('Network error occurred')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/exhibitors/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setExhibitors(exhibitors.filter(exhibitor => exhibitor.id !== id))
        setDeleteConfirm(null)
      } else {
        alert('Failed to delete exhibitor')
      }
    } catch (err) {
      alert('Network error occurred')
    }
  }

  const handleDownloadPaymentProof = async (paymentProofUrl: string, exhibitor: Exhibitor) => {
    try {
      const personName = `${exhibitor.contact_person}_${exhibitor.company_name}`
      const paymentType = 'Exhibition'
      
      const response = await fetch(`${API_URL}/uploads/payment-proof/download?file=${encodeURIComponent(paymentProofUrl)}&name=${encodeURIComponent(personName)}&type=${encodeURIComponent(paymentType)}?t=${Date.now()}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        alert('Failed to download payment proof')
      }
    } catch (err) {
      alert('Network error occurred')
    }
  }

  const viewExhibitor = (exhibitor: Exhibitor) => {
    setSelectedExhibitor(exhibitor)
    setViewOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'submitted':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getPackageColor = (packageType: string) => {
    switch (packageType) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800'
      case 'gold':
        return 'bg-yellow-100 text-yellow-800'
      case 'silver':
        return 'bg-gray-100 text-gray-800'
      case 'bronze':
        return 'bg-orange-100 text-orange-800'
      case 'nonprofit':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredExhibitors = exhibitors.filter(exhibitor => {
    const matchesSearch = exhibitor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibitor.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibitor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || exhibitor.status === statusFilter
    const matchesPackage = packageFilter === 'all' || exhibitor.selected_package === packageFilter
    
    return matchesSearch && matchesStatus && matchesPackage
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exhibitors...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadExhibitors}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exhibition Management</h1>
          <p className="text-gray-600 mt-2">Manage and review exhibition applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{exhibitors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exhibitors.filter(e => e.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exhibitors.filter(e => e.status === 'submitted').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${exhibitors.filter(e => e.status === 'approved').reduce((sum, e) => sum + getExhibitionAmount(e.selected_package), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exhibitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
              <select
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Packages</option>
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
                <option value="nonprofit">Non-Profit</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={loadExhibitors}
                className="w-full btn-primary"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Results - Table Layout */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExhibitors.map((exhibitor) => (
                  <tr key={exhibitor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exhibitor.company_name}</div>
                      <div className="text-sm text-gray-500">{exhibitor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exhibitor.contact_person}</div>
                      <div className="text-sm text-gray-500">{exhibitor.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPackageColor(exhibitor.selected_package)}`}>
                        {exhibitor.selected_package}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exhibitor.status)}`}>
                        {getStatusIcon(exhibitor.status)}
                        <span className="ml-1">{exhibitor.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(exhibitor.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => viewExhibitor(exhibitor)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {exhibitor.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(exhibitor.id, 'approved')}
                              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(exhibitor.id, 'rejected')}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {exhibitor.payment_proof_url && (
                          <button
                            onClick={() => handleDownloadPaymentProof(exhibitor.payment_proof_url, exhibitor)}
                            className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Download Payment Proof"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteConfirm(exhibitor.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredExhibitors.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exhibitors found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* View Modal */}
        {viewOpen && selectedExhibitor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Exhibition Application Details</h2>
                  <button
                    onClick={() => setViewOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Organization</h3>
                      <p className="text-gray-700">{selectedExhibitor.company_name}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Person</h3>
                      <p className="text-gray-700">{selectedExhibitor.contact_person}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-700">{selectedExhibitor.email}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                      <p className="text-gray-700">{selectedExhibitor.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Package</h3>
                      <p className="text-gray-700 capitalize">{selectedExhibitor.selected_package}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Information</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedExhibitor.additional_info || 'Not provided'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Booth Preference</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedExhibitor.booth_preference || 'Not specified'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Requirements</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedExhibitor.special_requirements || 'None'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedExhibitor.address ? (
                        <>
                          {selectedExhibitor.address}<br />
                          {selectedExhibitor.city}, {selectedExhibitor.country}
                        </>
                      ) : 'Not provided'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedExhibitor.status)}`}>
                        {getStatusIcon(selectedExhibitor.status)}
                        <span className="ml-2">{selectedExhibitor.status}</span>
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPackageColor(selectedExhibitor.selected_package)}`}>
                        {selectedExhibitor.selected_package}
                      </span>
                      <span className="text-sm text-gray-500">
                        Applied: {new Date(selectedExhibitor.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">${getExhibitionAmount(selectedExhibitor.selected_package).toLocaleString()}</span>
                      {selectedExhibitor.payment_proof_url && (
                        <button
                          onClick={() => handleDownloadPaymentProof(selectedExhibitor.payment_proof_url, selectedExhibitor)}
                          className="btn-primary"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Payment Proof
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this exhibition application? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

