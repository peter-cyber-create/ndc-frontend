'use client'

import React, { useState, useEffect } from 'react'
import {
  Users, FileText, CreditCard, Building, Mail,
  Award, LogOut
} from 'lucide-react'

interface DashboardData {
  registrations: {
    total: number
    approved: number
    submitted: number
    underReview: number
    rejected: number
    newThisWeek: number
  }
  abstracts: {
    total: number
    approved: number
    submitted: number
    underReview: number
    accepted: number
    rejected: number
    newThisWeek: number
  }
  contacts: {
    total: number
    responded: number
    pending: number
    newThisWeek: number
  }
  sponsorships: {
    total: number
    approved: number
    pending: number
    newThisWeek: number
  }
  exhibitors: {
    total: number
    approved: number
    pending: number
    newThisWeek: number
  }
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API URL for frontend-only architecture
  const API_URL = typeof window !== 'undefined' && window.location.hostname === 'conference.health.go.ug' 
    ? 'https://conference.health.go.ug' 
    : 'http://localhost:3000'

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log('Starting to load dashboard data...')
      setIsLoading(true)
      setError(null)

      console.log('Fetching from:', `${API_URL}/admin/dashboard`)
      
      // Fetch dashboard data from admin API endpoint
      const dashboardResponse = await fetch(`${API_URL}/api/admin/dashboard`)

      console.log('Response received:', dashboardResponse.status)

      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json()

        console.log('Dashboard data received:', data)

        // Use the data directly from the admin dashboard API
        const dashboardStats: DashboardData = {
          registrations: {
            total: data.data.totalRegistrations || 0,
            approved: data.data.totalRegistrations || 0,
            submitted: data.data.totalRegistrations || 0,
            underReview: 0,
            rejected: 0,
            newThisWeek: data.data.totalRegistrations || 0
          },
          abstracts: {
            total: data.data.totalAbstracts || 0,
            approved: data.data.totalAbstracts || 0,
            submitted: data.data.totalAbstracts || 0,
            underReview: 0,
            accepted: data.data.totalAbstracts || 0,
            rejected: 0,
            newThisWeek: data.data.totalAbstracts || 0
          },
          contacts: {
            total: data.data.totalContacts || 0,
            responded: data.data.totalContacts || 0,
            pending: data.data.totalContacts || 0,
            newThisWeek: data.data.totalContacts || 0
          },
          sponsorships: {
            total: data.data.totalSponsorships || 0,
            approved: data.data.totalSponsorships || 0,
            pending: data.data.totalSponsorships || 0,
            newThisWeek: data.data.totalSponsorships || 0
          },
          exhibitors: {
            total: data.data.totalExhibitors || 0,
            approved: data.data.totalExhibitors || 0,
            pending: data.data.totalExhibitors || 0,
            newThisWeek: data.data.totalExhibitors || 0
          }
        }

        console.log('Dashboard stats processed:', dashboardStats)
        setDashboardData(dashboardStats)
      } else {
        console.error('Failed to load dashboard data:', dashboardResponse.status)
        setError('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      console.log('Setting loading to false')
      setIsLoading(false)
    }
  }

  const refreshDashboard = () => {
    loadDashboardData()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comprehensive dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Dashboard</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshDashboard}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">No data available</div>
        </div>
      </div>
    )
  }

  const totalRecords = dashboardData.registrations.total + 
                     dashboardData.abstracts.total + 
                     dashboardData.contacts.total + 
                     dashboardData.sponsorships.total +
                     dashboardData.exhibitors.total

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <button
            onClick={refreshDashboard}
            className="ml-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            🔄 Refresh
          </button>
        </div>
        <p className="text-gray-600">NACNDC & JASHConference 2025 - Conference Management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Registrations */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.registrations.total}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">✓ {dashboardData.registrations.approved} Approved</span>
              <span className="text-yellow-600">⏳ {dashboardData.registrations.submitted} Pending</span>
            </div>
          </div>
        </div>

        {/* Abstracts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Abstracts</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.abstracts.total}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">✓ {dashboardData.abstracts.approved} Approved</span>
              <span className="text-yellow-600">⏳ {dashboardData.abstracts.submitted} Pending</span>
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Mail className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.contacts.total}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">✓ {dashboardData.contacts.responded} Responded</span>
              <span className="text-yellow-600">⏳ {dashboardData.contacts.pending} Pending</span>
            </div>
          </div>
        </div>

        {/* Sponsorships */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sponsorships</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.sponsorships.total}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">✓ {dashboardData.sponsorships.approved} Approved</span>
              <span className="text-yellow-600">⏳ {dashboardData.sponsorships.pending} Pending</span>
            </div>
          </div>
        </div>

        {/* Exhibitors */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Exhibitors</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.exhibitors.total}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">✓ {dashboardData.exhibitors.approved} Approved</span>
              <span className="text-yellow-600">⏳ {dashboardData.exhibitors.pending} Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">�� Data Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{dashboardData.registrations.newThisWeek}</p>
            <p className="text-sm text-gray-600">New Registrations This Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{dashboardData.abstracts.newThisWeek}</p>
            <p className="text-sm text-gray-600">New Abstracts This Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{dashboardData.contacts.newThisWeek}</p>
            <p className="text-sm text-gray-600">New Contacts This Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{dashboardData.sponsorships.total}</p>
            <p className="text-sm text-gray-600">Total Sponsorships</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{dashboardData.exhibitors.total}</p>
            <p className="text-sm text-gray-600">Total Exhibitors</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            View All Registrations
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            Review Abstracts
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            Check Messages
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            Manage Sponsorships
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Dashboard last updated: {new Date().toLocaleString()}</p>
        <p className="mt-1">Total records in system: {totalRecords}</p>
      </div>
    </div>
  )
}
