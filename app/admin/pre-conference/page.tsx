'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Eye, Check, X, DollarSign, Calendar, Users, MapPin, Clock } from 'lucide-react'

interface PreConferenceMeeting {
  id: number
  session_title: string
  session_description: string
  meeting_type: string
  organizer_name: string
  organizer_email: string
  organizer_phone: string
  organization: string
  co_organizers: string
  meeting_date: string
  meeting_time_start: string
  meeting_time_end: string
  expected_attendees: number
  room_size: string
  location_preference: string
  abstract_text: string
  keywords: string
  special_requirements: string
  payment_amount: number
  payment_status: string
  approval_status: string
  cancellation_fee_applied: boolean
  admin_notes: string
  submitted_at: string
  updated_at: string
  approved_at: string | null
  payment_received_at: string | null
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AdminPreConferencePage() {
  const [meetings, setMeetings] = useState<PreConferenceMeeting[]>([])
  const [selectedMeeting, setSelectedMeeting] = useState<PreConferenceMeeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [adminNotes, setAdminNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { success, error } = useToast()

  useEffect(() => {
    fetchMeetings()
  }, [filter, pagination.page])

  const fetchMeetings = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      if (filter !== 'all') {
        queryParams.append('status', filter)
      }

      const response = await fetch(`/api/pre-conference?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setMeetings(data.meetings)
        setPagination(data.pagination)
      } else {
        error('Failed to fetch meetings')
      }
    } catch (err) {
      console.error('Error fetching meetings:', err)
      error('Error loading meetings')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (meetingId: number, newStatus: string, notes?: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/pre-conference/${meetingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approval_status: newStatus,
          admin_notes: notes || adminNotes,
          approved_at: newStatus === 'approved' ? new Date().toISOString() : null
        })
      })

      if (response.ok) {
        success(`Meeting ${newStatus} successfully`)
        fetchMeetings()
        setSelectedMeeting(null)
        setAdminNotes('')
      } else {
        const errorData = await response.json()
        error(errorData.message || `Failed to ${newStatus} meeting`)
      }
    } catch (err) {
      console.error('Error updating meeting status:', err)
      error('Error updating meeting status')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentStatusUpdate = async (meetingId: number, paymentStatus: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/pre-conference/${meetingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_status: paymentStatus,
          payment_received_at: paymentStatus === 'paid' ? new Date().toISOString() : null
        })
      })

      if (response.ok) {
        success(`Payment status updated to ${paymentStatus}`)
        fetchMeetings()
        setSelectedMeeting(null)
      } else {
        const errorData = await response.json()
        error(errorData.message || 'Failed to update payment status')
      }
    } catch (err) {
      console.error('Error updating payment status:', err)
      error('Error updating payment status')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return variants[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      pending: 'bg-orange-100 text-orange-800',
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return variants[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatMeetingDate = (dateValue: string) => {
    return dateValue.replace('_', ' ').replace('november', 'November')
  }

  const MeetingDetailModal = ({ meeting }: { meeting: PreConferenceMeeting }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{meeting.session_title}</h2>
            <Button variant="outline" onClick={() => setSelectedMeeting(null)}>
              ×
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Session Information</h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadge(meeting.approval_status)}>
                    {meeting.approval_status.toUpperCase()}
                  </Badge>
                  <Badge className={getPaymentBadge(meeting.payment_status)}>
                    Payment: {meeting.payment_status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatMeetingDate(meeting.meeting_date)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{meeting.meeting_time_start} - {meeting.meeting_time_end}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{meeting.expected_attendees} expected attendees</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{meeting.location_preference} - {meeting.room_size} room</span>
                </div>
                
                {meeting.payment_amount > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>${meeting.payment_amount}</span>
                  </div>
                )}
              </div>

              <div>
                <p className="font-medium text-gray-700">Type:</p>
                <p className="text-gray-600">{meeting.meeting_type}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700">Description:</p>
                <p className="text-gray-600 text-sm">{meeting.session_description}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700">Keywords:</p>
                <p className="text-gray-600 text-sm">{meeting.keywords}</p>
              </div>

              {meeting.special_requirements && (
                <div>
                  <p className="font-medium text-gray-700">Special Requirements:</p>
                  <p className="text-gray-600 text-sm">{meeting.special_requirements}</p>
                </div>
              )}
            </div>

            {/* Organizer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Organizer Information</h3>
              
              <div>
                <p className="font-medium text-gray-700">Primary Organizer:</p>
                <p className="text-gray-600">{meeting.organizer_name}</p>
                <p className="text-gray-600">{meeting.organizer_email}</p>
                <p className="text-gray-600">{meeting.organizer_phone}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700">Organization:</p>
                <p className="text-gray-600">{meeting.organization}</p>
              </div>

              {meeting.co_organizers && (
                <div>
                  <p className="font-medium text-gray-700">Co-Organizers:</p>
                  <p className="text-gray-600 text-sm">{meeting.co_organizers}</p>
                </div>
              )}

              <div>
                <p className="font-medium text-gray-700">Submitted:</p>
                <p className="text-gray-600">{formatDate(meeting.submitted_at)}</p>
              </div>

              {meeting.approved_at && (
                <div>
                  <p className="font-medium text-gray-700">Approved:</p>
                  <p className="text-gray-600">{formatDate(meeting.approved_at)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Abstract */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Abstract</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{meeting.abstract_text}</p>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Actions</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this submission..."
                  rows={3}
                />
                {meeting.admin_notes && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800"><strong>Existing Notes:</strong> {meeting.admin_notes}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {meeting.approval_status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate(meeting.id, 'approved')}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(meeting.id, 'rejected')}
                      disabled={isProcessing}
                      variant="destructive"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}

                {meeting.approval_status === 'approved' && meeting.payment_amount > 0 && (
                  <>
                    <Button
                      onClick={() => handlePaymentStatusUpdate(meeting.id, 'paid')}
                      disabled={isProcessing || meeting.payment_status === 'paid'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Mark as Paid
                    </Button>
                    <Button
                      onClick={() => handlePaymentStatusUpdate(meeting.id, 'cancelled')}
                      disabled={isProcessing}
                      variant="outline"
                    >
                      Cancel Payment
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Conference Meetings Management</h1>
          <p className="text-gray-600">Review and manage pre-conference meeting submissions</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div>
                <Label htmlFor="statusFilter">Status Filter</Label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meetings List */}
        <Card>
          <CardHeader>
            <CardTitle>Meetings ({pagination.total})</CardTitle>
            <CardDescription>
              Click on any meeting to view details and take actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading meetings...</div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No meetings found</div>
            ) : (
              <>
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{meeting.session_title}</h3>
                            <Badge className={getStatusBadge(meeting.approval_status)}>
                              {meeting.approval_status}
                            </Badge>
                            {meeting.payment_amount > 0 && (
                              <Badge className={getPaymentBadge(meeting.payment_status)}>
                                ${meeting.payment_amount}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>Organizer:</strong> {meeting.organizer_name}</p>
                              <p><strong>Organization:</strong> {meeting.organization}</p>
                            </div>
                            <div>
                              <p><strong>Type:</strong> {meeting.meeting_type}</p>
                              <p><strong>Date:</strong> {formatMeetingDate(meeting.meeting_date)}</p>
                              <p><strong>Time:</strong> {meeting.meeting_time_start} - {meeting.meeting_time_end}</p>
                              <p><strong>Attendees:</strong> {meeting.expected_attendees}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-500 mt-2">
                            Submitted: {formatDate(meeting.submitted_at)}
                          </p>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Meeting Detail Modal */}
        {selectedMeeting && <MeetingDetailModal meeting={selectedMeeting} />}
      </div>
    </div>
  )
}
