'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, Filter, Eye, Trash2, CheckCircle, XCircle, 
  Clock, AlertCircle, User, Mail, Building, Phone, Calendar,
  Package, Star, Award, Shield, Zap, Download
} from 'lucide-react'

interface Sponsorship {
  id: number
  company_name: string
  contact_person: string
  email: string
  phone: string
  selected_package: string
  status: string
  submitted_at: string
  created_at: string
  payment_proof_url?: string
}

export default function SponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [packageFilter, setPackageFilter] = useState('all')
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedSponsorship, setSelectedSponsorship] = useState<Sponsorship | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  // API URL
  const API_URL = typeof window !== 'undefined' && window.location.hostname === 'conference.health.go.ug' 
    ? 'https://conference.health.go.ug' 
    : 'http://localhost:3000'

  useEffect(() => {
    loadSponsorships()
  }, [])

  const loadSponsorships = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/api/admin/sponsorships?t=${Date.now()}`, { cache: "no-store" })
      
      if (response.ok) {
        const data = await response.json()
        setSponsorships(data.data || [])
      } else {
        setError('Failed to load sponsorships')
      }
    } catch (err) {
      setError('Failed to load sponsorships')
    } finally {
      setLoading(false)
    }
  }

  const filteredSponsorships = sponsorships.filter(sponsorship => {
    const matchesSearch = 
      sponsorship.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsorship.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsorship.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || sponsorship.status === statusFilter
    const matchesPackage = packageFilter === 'all' || sponsorship.selected_package === packageFilter
    
    return matchesSearch && matchesStatus && matchesPackage
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPackageIcon = (packageType: string) => {
    switch (packageType) {
      case 'platinum':
        return <Star className="h-5 w-5 text-yellow-500" />
      case 'gold':
        return <Award className="h-5 w-5 text-yellow-600" />
      case 'silver':
        return <Shield className="h-5 w-5 text-gray-500" />
      case 'bronze':
        return <Zap className="h-5 w-5 text-orange-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getPackageColor = (packageType: string) => {
    switch (packageType) {
      case 'platinum':
        return 'bg-gray-100 text-gray-800'
      case 'gold':
        return 'bg-yellow-100 text-yellow-800'
      case 'silver':
        return 'bg-gray-100 text-gray-700'
      case 'bronze':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = async (id: number) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/sponsorships/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSponsorships(sponsorships.filter(sponsorship => sponsorship.id !== id))
        setDeleteConfirm(null)
        alert('Sponsorship deleted successfully')
      } else {
        alert('Failed to delete sponsorship')
      }
    } catch (error) {
      console.error('Error deleting sponsorship:', error)
      alert('Failed to delete sponsorship')
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/sponsorships/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setSponsorships(sponsorships.map(sponsorship => 
          sponsorship.id === id ? { ...sponsorship, status: newStatus } : sponsorship
        ))
        alert(`Sponsorship status updated to ${newStatus}?t=${Date.now()}`)
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const viewSponsorship = (sponsorship: Sponsorship) => {
    setSelectedSponsorship(sponsorship)
    setViewOpen(true)
  }

  const handleDownloadPaymentProof = async (paymentProofUrl: string, sponsorship: Sponsorship) => {
    try {
      console.log('Downloading payment proof for sponsorship:', sponsorship.id)
      console.log('Payment proof URL:', paymentProofUrl)
      
      // Create meaningful parameters for download
      const personName = `${sponsorship.contact_person}_${sponsorship.company_name}`
      const paymentType = 'Sponsorship'
      
      // Use the frontend file download endpoint with person name and payment type
      const response = await fetch(`/api/uploads/payment-proof/download?file=${encodeURIComponent(paymentProofUrl)}&name=${encodeURIComponent(personName)}&type=${encodeURIComponent(paymentType)}?t=${Date.now()}`)

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}?t=${Date.now()}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      // The filename is now set by the API response headers
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading payment proof:', error);
      setError('Failed to download payment proof');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sponsorships...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Sponsorships</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadSponsorships}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sponsorships</h1>
        <p className="text-gray-600">Manage sponsorship applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by company, contact, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Packages</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Proof
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSponsorships.map((sponsorship) => (
                <tr key={sponsorship.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Building className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{sponsorship.company_name}</div>
                        <div className="text-sm text-gray-500">{sponsorship.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{sponsorship.contact_person}</div>
                    <div className="text-sm text-gray-500">{sponsorship.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPackageIcon(sponsorship.selected_package)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPackageColor(sponsorship.selected_package)}`}>
                        {sponsorship.selected_package}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(sponsorship.status)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sponsorship.status)}`}>
                        {sponsorship.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sponsorship.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sponsorship.payment_proof_url ? (
                      <button
                        onClick={() => handleDownloadPaymentProof(sponsorship.payment_proof_url!, sponsorship)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">No proof uploaded</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewSponsorship(sponsorship)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {sponsorship.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(sponsorship.id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve Sponsorship"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(sponsorship.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject Sponsorship"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDelete(sponsorship.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Sponsorship"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Sponsorship</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this sponsorship? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Sponsorship Modal */}
      {viewOpen && selectedSponsorship && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Sponsorship Details</h3>
                <button
                  onClick={() => setViewOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSponsorship.company_name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSponsorship.contact_person}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSponsorship.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSponsorship.phone}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Selected Package</label>
                  <div className="flex items-center mt-1">
                    {getPackageIcon(selectedSponsorship.selected_package)}
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPackageColor(selectedSponsorship.selected_package)}`}>
                      {selectedSponsorship.selected_package}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSponsorship.status)}`}>
                    {selectedSponsorship.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
