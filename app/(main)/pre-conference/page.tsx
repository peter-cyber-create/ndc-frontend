
'use client'

import { useState, useEffect, useRef } from 'react'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface FormData {
  sessionTitle: string
  sessionDescription: string
  meetingType: string
  organizerName: string
  organizerEmail: string
  organizerPhone: string
  organization: string
  coOrganizers: string
  meetingDate: string
  meetingTimeStart: string
  meetingTimeEnd: string
  sessionDuration: string
  expectedAttendees: string
  roomSize: string
  locationPreference: string
  keywords: string
  specialRequirements: string
  paymentAmount: number
  abstractFile: File | null
}

const initialFormData: FormData = {
  sessionTitle: '',
  sessionDescription: '',
  meetingType: '',
  organizerName: '',
  organizerEmail: '',
  organizerPhone: '',
  organization: '',
  coOrganizers: '',
  meetingDate: '',
  meetingTimeStart: '',
  meetingTimeEnd: '',
  sessionDuration: '3',
  expectedAttendees: '',
  roomSize: '',
  locationPreference: '',
  keywords: '',
  specialRequirements: '',
  paymentAmount: 0,
  abstractFile: null,
}


export default function PreConferencePage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(0)
  const { success, error } = useToast()

  // Calculate initial payment amount and days until deadline
  useEffect(() => {
    calculatePaymentAmount(formData.sessionDuration)
    
    // Calculate days until deadline (September 30, 2025)
    const deadline = new Date('2025-09-30T23:59:59')
    const today = new Date()
    const timeDiff = deadline.getTime() - today.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    setDaysUntilDeadline(daysDiff)
  }, [])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] || null
      setFormData(prev => ({ ...prev, abstractFile: file }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Calculate payment amount based on session duration
    if (name === 'sessionDuration') {
      calculatePaymentAmount(value)
    }
  }

  const calculatePaymentAmount = (duration: string) => {
    // New pricing model: USD $2000 per hour
    const hours = parseInt(duration) || 3
    const hourlyRate = 2000
    const totalAmount = hours * hourlyRate
    
    setFormData(prev => ({ ...prev, paymentAmount: totalAmount }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      error('Please agree to the terms and conditions')
      return
    }
    // Check submission deadline (September 30, 2025)
    const submissionDeadline = new Date('2025-09-30T23:59:59')
    const currentDate = new Date()
    if (currentDate > submissionDeadline) {
      error('Submission deadline has passed. The deadline was September 30th, 2025.')
      return
    }
    setIsSubmitting(true)
    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'abstractFile' && value) {
          form.append('abstractFile', value as File)
        } else if (value !== null && value !== undefined) {
          form.append(key, value as string)
        }
      })
      const response = await fetch('/api/pre-conference', {
        method: 'POST',
        body: form,
      })
      if (response.ok) {
        success('Pre-conference meeting submission successful! You will receive a confirmation email shortly.')
        setFormData(initialFormData)
        setAgreedToTerms(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        const errorData = await response.json()
        error(errorData.message || 'Failed to submit pre-conference meeting request')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pre-Conference Meetings / Organized Sessions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pre-Conference is on 3rd and 4th November 2025 | Location: Munyonyo Speke Resort / Virtual
          </p>
          <p className="text-lg text-gray-700 mt-4 max-w-3xl mx-auto">
            <strong>Session Description:</strong> Provide the background and importance of the session's topic. 
            Explain what the session will cover and why it is a valuable addition to the conference.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Submission Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">Submit Your Proposal</CardTitle>
                <CardDescription>
                  Complete the form below to submit your pre-conference meeting proposal. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Session Information</h3>
                
                <div>
                  <Label htmlFor="sessionTitle">Session Title *</Label>
                  <Input
                    id="sessionTitle"
                    name="sessionTitle"
                    value={formData.sessionTitle}
                    onChange={handleInputChange}
                    placeholder="Enter the title of your session"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sessionDescription">Session Description *</Label>
                  <Textarea
                    id="sessionDescription"
                    name="sessionDescription"
                    value={formData.sessionDescription}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of your session (200-500 words)"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="meetingType">Meeting Type *</Label>
                    <Select onValueChange={(value) => handleSelectChange('meetingType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meeting type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="symposium">Symposium (100+ attendees)</SelectItem>
                        <SelectItem value="workshop">Workshop (50-100 attendees)</SelectItem>
                        <SelectItem value="meeting">Meeting (up to 50 attendees)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expectedAttendees">Expected Attendees (Max 200) *</Label>
                    <Input
                      id="expectedAttendees"
                      name="expectedAttendees"
                      type="number"
                      value={formData.expectedAttendees}
                      onChange={handleInputChange}
                      placeholder="Number of expected attendees (maximum 200)"
                      min="1"
                      max="200"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum of 200 attendees per session.
                    </p>
                  </div>
                </div>
              </div>

              {/* Organizer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Organizer Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organizerName">Primary Organizer Name *</Label>
                    <Input
                      id="organizerName"
                      name="organizerName"
                      value={formData.organizerName}
                      onChange={handleInputChange}
                      placeholder="Full name of primary organizer"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="organizerEmail">Email Address *</Label>
                    <Input
                      id="organizerEmail"
                      name="organizerEmail"
                      type="email"
                      value={formData.organizerEmail}
                      onChange={handleInputChange}
                      placeholder="organizer@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organizerPhone">Phone Number *</Label>
                    <Input
                      id="organizerPhone"
                      name="organizerPhone"
                      value={formData.organizerPhone}
                      onChange={handleInputChange}
                      placeholder="0800-100-066"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="organization">Organization *</Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="Your organization name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="coOrganizers">Co-Organizers (Optional)</Label>
                  <Textarea
                    id="coOrganizers"
                    name="coOrganizers"
                    value={formData.coOrganizers}
                    onChange={handleInputChange}
                    placeholder="List any co-organizers with their names and organizations"
                    rows={3}
                  />
                </div>
              </div>

              {/* Meeting Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Schedule & Logistics</h3>
                
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="meetingDate">Preferred Date *</Label>
                    <Select onValueChange={(value) => handleSelectChange('meetingDate', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="november_3">November 3, 2025</SelectItem>
                        <SelectItem value="november_4">November 4, 2025</SelectItem>
                        <SelectItem value="both_days">Both Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="meetingTimeStart">Start Time *</Label>
                    <Input
                      id="meetingTimeStart"
                      name="meetingTimeStart"
                      type="time"
                      value={formData.meetingTimeStart}
                      onChange={handleInputChange}
                      min="09:00"
                      max="16:00"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">9am - 4pm EAT</p>
                  </div>

                  <div>
                    <Label htmlFor="meetingTimeEnd">End Time *</Label>
                    <Input
                      id="meetingTimeEnd"
                      name="meetingTimeEnd"
                      type="time"
                      value={formData.meetingTimeEnd}
                      onChange={handleInputChange}
                      min="09:00"
                      max="16:00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sessionDuration">Duration (Hours) *</Label>
                    <Select 
                      value={formData.sessionDuration}
                      onValueChange={(value) => handleSelectChange('sessionDuration', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 hours (minimum)</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="5">5 hours</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="7">7 hours (full day)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">USD $2000/hour</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roomSize">Room Size Preference *</Label>
                    <Select onValueChange={(value) => handleSelectChange('roomSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (up to 30 people)</SelectItem>
                        <SelectItem value="medium">Medium (30-80 people)</SelectItem>
                        <SelectItem value="large">Large (80+ people)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="locationPreference">Location Preference *</Label>
                    <Select onValueChange={(value) => handleSelectChange('locationPreference', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical">In-Person Only</SelectItem>
                        <SelectItem value="virtual">Virtual Only</SelectItem>
                        <SelectItem value="hybrid">Hybrid (In-Person + Virtual)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Abstract and Keywords */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Abstract & Keywords</h3>
                
                {/* Abstract File Upload - Enhanced */}
                <div className="my-6">
                  <Label htmlFor="abstractFile" className="block text-lg font-bold text-primary-700 mb-2">
                    Upload Abstract <span className="text-red-600">*</span>
                  </Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary-400 rounded-xl p-8 bg-primary-50 shadow-sm">
                    <input
                      id="abstractFile"
                      name="abstractFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      ref={fileInputRef}
                      onChange={handleInputChange}
                      required
                      className="block w-full text-lg text-primary-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-lg file:font-semibold file:bg-primary-200 file:text-primary-900 hover:file:bg-primary-300 focus:outline-none"
                    />
                    <p className="text-base text-primary-700 mt-3 font-medium">
                      Please upload your abstract as a PDF or Word document. This is required for submission.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="keywords">Keywords (3-5 keywords) *</Label>
                  <Input
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    placeholder="Enter 3-5 keywords separated by commas"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Please provide 3-5 keywords that describe your session topic.
                  </p>
                </div>

                <div>
                  <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
                  <Textarea
                    id="specialRequirements"
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    placeholder="Any special equipment, setup, or accessibility requirements"
                    rows={3}
                  />
                </div>
              </div>

              {/* Payment Information Link Only */}
              <div className="text-center py-4">
                <a
                  href="/payment-instructions"
                  className="text-primary-600 hover:text-primary-800 underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Pre-Conference Payment & Submission Guidelines →
                </a>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the terms and conditions, including the cancellation policy 
                    ($100 US cancellation fee per meeting for cancellations made by October 29, 
                    no refunds after October 29) and understand that my session requires approval 
                    from the organizing committee. I acknowledge that payment of USD $2000 per hour 
                    must be received within five business days to secure my session slot.
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 space-y-4">
                <div className="text-center">
                  <a
                    href="/payment-instructions"
                    className="text-primary-600 hover:text-primary-800 underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Payment Information & Account Numbers →
                  </a>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
          </div>

          {/* Right Column - Guidelines and Payment Information */}
          <div className="space-y-6">
            {/* Submission Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700">Submission Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Submission Requirements</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Submissions should be in the form of a <strong>250-word abstract</strong></li>
                    <li>• Include a title, the names and affiliations of all authors</li>
                    <li>• Include 3-5 keywords</li>
                    <li>• Maximum of 200 attendees per session</li>
                    <li>• Sessions available 9am to 4pm EAT</li>
                    <li>• <strong>2-3 hour minimum</strong> required to book meeting space</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Important Dates</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Submission Deadline:</strong> 30th September 2025</li>
                    <li>• <strong>Available Dates:</strong> November 3rd - 4th, 2025</li>
                    <li>• <strong>Location:</strong> Munyonyo Speke Resort / Virtual</li>
                  </ul>
                  
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-orange-800 text-sm font-medium">
                      {daysUntilDeadline > 0 ? (
                        <>⚠️ <strong>Deadline Approaching:</strong> Only {daysUntilDeadline} days remaining until the submission deadline (September 30th, 2025)</>
                      ) : (
                        <>🚫 <strong>Deadline Passed:</strong> The submission deadline (September 30th, 2025) has passed</>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">Payment & Booking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Pricing:</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• <strong>Cost:</strong> USD $2000 per hour</li>
                    <li>• Payment must be received within five business days of receipt of request</li>
                    <li>• Rooms will not be assigned until payment is received</li>
                    <li>• Bookings are based on number of attendees (Max of 200)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold text-yellow-800 mb-2">Cancellation Policy:</h4>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• $100 US cancellation fee per meeting applies to all cancellations made by October 29</li>
                    <li>• No fees will be refunded for cancellations received after October 29</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-2">How to Submit:</h4>
                  <p className="text-green-700">
                    Please email your abstract to <strong>moh.conference@health.go.ug</strong> with the subject line 
                    "Submission for [Session Title]" or use the online form below.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
