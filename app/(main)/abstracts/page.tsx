'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, Upload, Calendar, AlertCircle, CheckCircle, 
  Loader2, Clock, Users, Award, Target, Shield, Globe, Building2, Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/useToast'

interface FormData {
  title: string
  presentation_type: string
  conference_track: string
  subcategory: string
  firstName: string
  lastName: string
  email: string
  phone: string
  institution: string
  position: string
  district: string
  co_authors: string
  keywords: string
  background: string
  methods: string
  findings: string
  conclusion: string
  policy_implications: string
  abstract_file: File | null
  conflict_of_interest: boolean
  ethical_approval: boolean
  consent_to_publish: boolean
}

const conferenceTracks = [
  {
    value: 'integrated-diagnostics',
    label: 'Integrated Diagnostics, AMR, and Epidemic Readiness',
    description: 'Strengthening diagnostic systems to support integrated care, AMR, and outbreak preparedness and response.',
    subcategories: [
      'Diagnostic Technologies',
      'Antimicrobial Resistance',
      'Epidemic Preparedness',
      'Laboratory Systems',
      'Point-of-Care Testing'
    ]
  },
  {
    value: 'digital-health',
    label: 'Health Data and Innovation',
    description: 'Harnessing digital tools, AI, and data systems to transform public health delivery and surveillance.',
    subcategories: [
      'Health Information Systems',
      'Artificial Intelligence in Health',
      'Telemedicine',
      'Health Data Analytics',
      'Mobile Health Applications'
    ]
  },
  {
    value: 'community-engagement',
    label: 'Community Engagement for Disease Prevention and Elimination',
    description: 'Driving public health gains through localized leadership, equity, and participation.',
    subcategories: [
      'Community Health Workers',
      'Health Education',
      'Behavioral Change',
      'Community-Based Interventions',
      'Health Promotion'
    ]
  },
  {
    value: 'health-system-resilience',
    label: 'Health System Resilience and Emergency Preparedness and Response',
    description: 'Building flexible, shock-ready systems capable of sustaining essential care during Public Health crises.',
    subcategories: [
      'Emergency Response Systems',
      'Health System Strengthening',
      'Disaster Preparedness',
      'Supply Chain Management',
      'Workforce Development'
    ]
  },
  {
    value: 'policy-financing',
    label: 'Policy, Financing and Cross-Sector Integration',
    description: 'Mobilizing sustainable financing and multi-sectoral collaboration to achieve UHC.',
    subcategories: [
      'Health Financing',
      'Policy Development',
      'Universal Health Coverage',
      'Cross-Sectoral Collaboration',
      'Health Economics'
    ]
  },
  {
    value: 'one-health',
    label: 'One Health',
    description: 'Integrated responses to interconnected agriculture, environmental, human, and animal health risks.',
    subcategories: [
      'Zoonotic Diseases',
      'Environmental Health',
      'Food Safety',
      'Vector-Borne Diseases',
      'Ecosystem Health'
    ]
  },
  {
    value: 'care-treatment',
    label: 'Care, Treatment & Rehabilitation',
    description: 'Building people-centered models of care that blend biomedical and culturally rooted practices.',
    subcategories: [
      'Clinical Care Models',
      'Rehabilitation Services',
      'Palliative Care',
      'Mental Health Services',
      'Traditional Medicine Integration'
    ]
  }
]

export default function AbstractsPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    presentation_type: '',
    conference_track: '',
    subcategory: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    institution: '',
    position: '',
    district: '',
    co_authors: '',
    keywords: '',
    background: '',
    methods: '',
    findings: '',
    conclusion: '',
    policy_implications: '',
    abstract_file: null,
    conflict_of_interest: false,
    ethical_approval: false,
    consent_to_publish: false
  })

  // Calculate days until deadlines
  useEffect(() => {
    const calculateDaysUntil = (targetDate: string) => {
      const target = new Date(targetDate + 'T23:59:59')
      const now = new Date()
      const timeDiff = target.getTime() - now.getTime()
      return Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)))
    }

    setDaysUntilDeadline(calculateDaysUntil('2025-09-30'))
  }, [])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev: any) => ({
      ...prev,
      abstract_file: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Check if deadline has passed
    if (daysUntilDeadline <= 0) {
      showError('Submission Failed: The abstract submission deadline has passed.')
      setIsSubmitting(false)
      return
    }

    // Validate required fields
    if (!formData.title || !formData.presentation_type || !formData.conference_track || 
        !formData.subcategory || !formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.institution || !formData.position || 
        !formData.district || !formData.keywords ||
        !formData.background || !formData.methods || !formData.findings || 
        !formData.conclusion || !formData.consent_to_publish || !formData.abstract_file) {
      showError('Submission Failed: Please fill in all required fields marked with * and upload your abstract file.')
      setIsSubmitting(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('presentation_type', formData.presentation_type)
      formDataToSend.append('conference_track', formData.conference_track)
      formDataToSend.append('subcategory', formData.subcategory)
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('institution', formData.institution)
      formDataToSend.append('position', formData.position)
      formDataToSend.append('district', formData.district)
      formDataToSend.append('co_authors', formData.co_authors)
      formDataToSend.append('keywords', formData.keywords)
      formDataToSend.append('background', formData.background)
      formDataToSend.append('methods', formData.methods)
      formDataToSend.append('findings', formData.findings)
      formDataToSend.append('conclusion', formData.conclusion)
      formDataToSend.append('policy_implications', formData.policy_implications)
      formDataToSend.append('conflict_of_interest', formData.conflict_of_interest.toString())
      formDataToSend.append('ethical_approval', formData.ethical_approval.toString())
      formDataToSend.append('consent_to_publish', formData.consent_to_publish.toString())
      
      if (formData.abstract_file) {
        formDataToSend.append('abstract_file', formData.abstract_file)
      }

      const response = await fetch('/api/abstracts', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (response.ok) {
        success('Submission Successful! Abstract submitted successfully. We will review it and get back to you by September 25, 2025.')
        setFormData({
          title: '',
          presentation_type: '',
          conference_track: '',
          subcategory: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          institution: '',
          position: '',
          district: '',
          co_authors: '',
          keywords: '',
          background: '',
          methods: '',
          findings: '',
          conclusion: '',
          policy_implications: '',
          abstract_file: null,
          conflict_of_interest: false,
          ethical_approval: false,
          consent_to_publish: false
        })
      } else {
        const errorMessage = result.error || result.message || 'Please check your information and try again.'
        showError('Submission Failed: ' + errorMessage)
      }
    } catch (error) {
      showError('Submission Failed: Could not connect to the server. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Abstract Submission Form</h1>
          <p className="text-lg text-gray-600">National Conference 2025</p>
        </div>

        {/* Important Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-3" />
                Important Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Submission Deadline</span>
                    <span className={`font-bold ${daysUntilDeadline > 0 ? 'text-yellow-300' : 'text-red-400'}`}>
                      {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Deadline passed'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-600 to-green-700 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <CheckCircle className="h-5 w-5 mr-3" />
                Payment Information
              </CardTitle>
              <CardDescription className="text-green-100">
                Complete your payment to secure your spot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Total Fee Information */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Total Fee: $6000 USD</h4>
                      <p className="text-green-100 text-sm">
                        Based on USD $2000 per hour (3-hour minimum session). Payment must be received within five business days.
                      </p>
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mt-3">
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-1 flex-shrink-0" />
                          <p className="text-yellow-800 font-semibold text-xs">
                            Rooms will not be assigned until payment is received.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Details */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-start">
                    <Upload className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">Bank Transfer Details</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {/* UGX Account */}
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm">UGX Account</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account Title:</span>
                              <span className="font-mono text-gray-900">MU SPH Research Account</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account Number:</span>
                              <span className="font-mono text-gray-900">9030005611449</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bank:</span>
                              <span className="font-mono text-gray-900">Stanbic Bank Uganda Limited</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Swift Code:</span>
                              <span className="font-mono text-gray-900">SBICUGKX</span>
                            </div>
                          </div>
                        </div>

                        {/* USD Account */}
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm">USD Account</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Intermediary Bank:</span>
                              <span className="font-mono text-gray-900">Citibank New York</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">USD Account:</span>
                              <span className="font-mono text-gray-900">36110279</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">SWIFT:</span>
                              <span className="font-mono text-gray-900">CITIUS33</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">ABA Number:</span>
                              <span className="font-mono text-gray-900">021000089</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Payment Instructions */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">Important Instructions</h4>
                      <ul className="text-green-100 space-y-1 text-sm">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Use your full name as payment reference</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Upload payment proof immediately after transfer</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Payment must be made within 24 hours</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Contact us if you need assistance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Award className="h-5 w-5 mr-3" />
                Review Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-white text-primary-600 rounded-full flex items-center justify-center mr-3 text-xs font-bold">1</div>
                  <span className="text-sm">Submit Abstract</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-white text-primary-600 rounded-full flex items-center justify-center mr-3 text-xs font-bold">2</div>
                  <span className="text-sm">Expert Review</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Single Column Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Form */}
          <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <FileText className="h-6 w-6 mr-3" />
                  Abstract Submission Form
            </CardTitle>
            <CardDescription className="text-primary-100">
              Complete all required fields below. All submissions are subject to review by the Scientific Committee.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Abstract Details Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary-600" />
                  Abstract Details
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">Abstract Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                      placeholder="Enter a clear, descriptive title for your research"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="presentation_type" className="text-sm font-medium text-gray-700">Presentation Type *</Label>
                      <Select value={formData.presentation_type} onValueChange={(value) => handleSelectChange('presentation_type', value)}>
                        <SelectTrigger className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400">
                          <SelectValue placeholder="Select presentation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oral">Oral Presentation</SelectItem>
                          <SelectItem value="poster">Poster Presentation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conference_track" className="text-sm font-medium text-gray-700">Conference Track *</Label>
                      <Select value={formData.conference_track} onValueChange={(value) => {
                        handleSelectChange('conference_track', value)
                        setFormData(prev => ({ ...prev, subcategory: '' })) // Reset subcategory when track changes
                      }}>
                        <SelectTrigger className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400">
                          <SelectValue placeholder="Choose the most relevant category" />
                        </SelectTrigger>
                        <SelectContent>
                          {conferenceTracks.map((track) => (
                            <SelectItem key={track.value} value={track.value}>
                              <span className="font-medium">{track.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.conference_track && (
                    <div className="space-y-2">
                      <Label htmlFor="subcategory" className="text-sm font-medium text-gray-700">Subcategory *</Label>
                      <Select value={formData.subcategory} onValueChange={(value) => handleSelectChange('subcategory', value)}>
                        <SelectTrigger className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400">
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {conferenceTracks.find(track => track.value === formData.conference_track)?.subcategories.map((subcategory) => (
                            <SelectItem key={subcategory} value={subcategory}>
                              {subcategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Author Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary-600" />
                  Author Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                      placeholder="Official correspondence will be sent to this email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                      placeholder="Include country code (e.g., +256)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution" className="text-sm font-medium text-gray-700">Institution/Organization *</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      required
                      className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                      placeholder="Full name of your institution"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium text-gray-700">Position/Title *</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                      placeholder="Enter your position or title"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="text-sm font-medium text-gray-700">District/Region *</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                    placeholder="District where you are based in Uganda"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="co_authors" className="text-sm font-medium text-gray-700">Co-Authors (Optional)</Label>
                  <Textarea
                    id="co_authors"
                    name="co_authors"
                    value={formData.co_authors}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="List all co-authors with their institutions (one per line)"
                  />
                </div>
              </div>

              {/* Abstract Content Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-primary-600" />
                  Abstract Content
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">Keywords *</Label>
                    <Input
                      id="keywords"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleInputChange}
                      required
                      className="h-12 text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                      placeholder="3-6 keywords separated by commas"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="background" className="text-sm font-medium text-gray-700">Background *</Label>
                      <Textarea
                        id="background"
                        name="background"
                        value={formData.background}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                        placeholder="Brief background and context for your research"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="methods" className="text-sm font-medium text-gray-700">Methods *</Label>
                      <Textarea
                        id="methods"
                        name="methods"
                        value={formData.methods}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                        placeholder="Brief description of methods used"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="findings" className="text-sm font-medium text-gray-700">Findings *</Label>
                      <Textarea
                        id="findings"
                        name="findings"
                        value={formData.findings}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                        placeholder="Key findings of your research"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conclusion" className="text-sm font-medium text-gray-700">Conclusion *</Label>
                      <Textarea
                        id="conclusion"
                        name="conclusion"
                        value={formData.conclusion}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                        placeholder="Conclusions drawn from your research"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policy_implications" className="text-sm font-medium text-gray-700">Policy/Practice Implications (Optional)</Label>
                    <Textarea
                      id="policy_implications"
                      name="policy_implications"
                      value={formData.policy_implications}
                      onChange={handleInputChange}
                      rows={3}
                      className="text-base border-2 border-gray-300 focus:border-primary-600 rounded-lg transition-all duration-200 hover:border-primary-400"
                      placeholder="How your research can inform policy or practice"
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-primary-600" />
                  Document Upload
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">Required Documents</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Abstract document (PDF, DOC, or DOCX)</li>
                          <li>• Maximum file size: 2MB</li>
                          <li>• File must be clearly named and readable</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="abstract_file" className="text-sm font-medium text-gray-700">Upload Abstract Document *</Label>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-all duration-200 bg-gray-50 hover:bg-primary-50 cursor-pointer"
                      onClick={() => document.getElementById('abstract_file')?.click()}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2 font-medium">
                        Click to upload or drag and drop your file here
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        PDF, DOC, or DOCX files only • Maximum size: 2MB
                      </p>
                      <input
                        type="file"
                        id="abstract_file"
                        name="abstract_file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <Label
                        htmlFor="abstract_file"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Label>
                      {formData.abstract_file && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-green-800">
                                File selected: {formData.abstract_file.name}
                              </p>
                              <p className="text-xs text-green-600">
                                Size: {(formData.abstract_file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Tips */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-yellow-800 mb-2">Upload Tips</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Ensure your document is properly formatted and proofread</li>
                          <li>• Use a clear, descriptive filename</li>
                          <li>• Check that all images and tables are visible</li>
                          <li>• Remove any personal information if not required</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Declarations Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary-600" />
                  Official Declarations
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Checkbox
                      id="conflict_of_interest"
                      checked={formData.conflict_of_interest}
                      onCheckedChange={(checked) => handleCheckboxChange('conflict_of_interest', checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="conflict_of_interest" className="text-sm text-gray-700 leading-relaxed">
                      <strong>Conflict of Interest Declaration:</strong> I declare that there are no conflicts of interest related to this research that could influence the outcome or interpretation of the findings.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Checkbox
                      id="ethical_approval"
                      checked={formData.ethical_approval}
                      onCheckedChange={(checked) => handleCheckboxChange('ethical_approval', checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="ethical_approval" className="text-sm text-gray-700 leading-relaxed">
                      <strong>Ethical Approval:</strong> This research has obtained necessary ethical approvals from the relevant institutional review board (where applicable) and complies with all applicable ethical guidelines.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <Checkbox
                      id="consent_to_publish"
                      checked={formData.consent_to_publish}
                      onCheckedChange={(checked) => handleCheckboxChange('consent_to_publish', checked as boolean)}
                      className="mt-1"
                      required
                    />
                    <Label htmlFor="consent_to_publish" className="text-sm text-gray-700 leading-relaxed">
                      <strong>Consent to Publish:</strong> I consent to the publication of this abstract in conference proceedings, related materials, and any subsequent publications by the Ministry of Health, Republic of Uganda. *
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-80 h-14 text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2 border-primary-600 hover:border-primary-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                      Processing Submission...
                    </>
                  ) : (
                    <>
                      <Shield className="h-6 w-6 mr-3" />
                      Submit Abstract
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-center text-gray-600 mt-4 text-sm">
                By submitting this form, you agree to the conference terms and conditions.
              </p>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}