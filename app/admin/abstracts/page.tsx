'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, Filter, Download, Eye, Trash2, CheckCircle, XCircle, 
  Clock, AlertCircle, User, Mail, Building, Phone, Calendar,
  FileText, ExternalLink
} from 'lucide-react'

interface Abstract {
  id: number
  title: string
  author: string
  email: string
  organization: string
  abstract: string
  keywords: string
  category: string
  status: string
  submittedAt: string
  file_url?: string
}

export default function AbstractsPage() {
  const [abstracts, setAbstracts] = useState<Abstract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedAbstract, setSelectedAbstract] = useState<Abstract | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  // API URL
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`

  useEffect(() => {
    loadAbstracts()
  }, [])

  const loadAbstracts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/admin/abstracts`)
      
      if (response.ok) {
        const data = await response.json()
        setAbstracts(data.data || [])
      } else {
        setError('Failed to load abstracts')
      }
    } catch (err) {
      setError('Failed to load abstracts')
    } finally {
      setLoading(false)
    }
  }

  const filteredAbstracts = abstracts.filter(abstract => {
    const matchesSearch = 
      abstract.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abstract.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abstract.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abstract.organization?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || abstract.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || abstract.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'submitted':
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
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDownloadAbstract = async (fileUrl: string, abstract: Abstract) => {
    try {
      console.log('Downloading abstract file for abstract:', abstract.id)
      console.log('File URL:', fileUrl)
      
      // Create a meaningful filename
      const authorName = abstract.author.replace(/[^a-zA-Z0-9]/g, '_')
      const fileExtension = fileUrl.split('.').pop() || 'pdf'
      
      const filename = `Abstract_${authorName}_${abstract.id}.${fileExtension}`
      
      // Use the abstract download endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/abstracts/download/${abstract.id}`);

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
      
      alert('Abstract file downloaded successfully')
    } catch (error) {
      console.error('Error downloading abstract file:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to download abstract file: ${errorMessage}`)
    }
  }

  const handleDelete = async (id: number) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/admin/abstracts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAbstracts(abstracts.filter(abs => abs.id !== id))
        setDeleteConfirm(null)
        alert('Abstract deleted successfully')
      } else {
        alert('Failed to delete abstract')
      }
    } catch (error) {
      console.error('Error deleting abstract:', error)
      alert('Failed to delete abstract')
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/abstracts/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setAbstracts(abstracts.map(abs => 
          abs.id === id ? { ...abs, status: newStatus } : abs
        ))
        alert(`Abstract status updated to ${newStatus}`)
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const viewAbstract = (abstract: Abstract) => {
    setSelectedAbstract(abstract)
    setViewOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading abstracts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Abstracts</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAbstracts}
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
        <h1 className="text-3xl font-bold text-gray-900">Abstracts</h1>
        <p className="text-gray-600">Manage conference abstracts</p>
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
                placeholder="Search by title, author, or organization..."
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
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="research">Research</option>
              <option value="policy">Policy</option>
              <option value="practice">Practice</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results - Original table layout */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAbstracts.map((abstract) => (
                <tr key={abstract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={abstract.title}>
                      {abstract.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{abstract.author}</div>
                    <div className="text-sm text-gray-500">{abstract.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={abstract.organization}>
                      {abstract.organization}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {abstract.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(abstract.status)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(abstract.status)}`}>
                        {abstract.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {abstract.file_url ? (
                      <button
                        onClick={() => handleDownloadAbstract(abstract.file_url!, abstract)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">No file</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewAbstract(abstract)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {abstract.status === 'submitted' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(abstract.id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve Abstract"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(abstract.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject Abstract"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDelete(abstract.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Abstract"
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
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Abstract</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this abstract? This action cannot be undone.
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

      {/* View Abstract Modal */}
      {viewOpen && selectedAbstract && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Abstract Details</h3>
                <button
                  onClick={() => setViewOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAbstract.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Author</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAbstract.author}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAbstract.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAbstract.organization}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAbstract.category}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAbstract.status)}`}>
                    {selectedAbstract.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Keywords</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAbstract.keywords}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Abstract</label>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedAbstract.abstract}</p>
                </div>
                
                {selectedAbstract.file_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Abstract File</label>
                    <button
                      onClick={() => handleDownloadAbstract(selectedAbstract.file_url!, selectedAbstract)}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download Abstract File
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
