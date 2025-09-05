'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, Upload, User, Mail, Building, Phone, MapPin, 
  CheckCircle, AlertCircle, Loader2, Calendar, Users, Tag
} from 'lucide-react'

export default function AbstractsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    presentationType: 'oral',
    conferenceTrack: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    institution: '',
    position: '',
    district: '',
    coAuthors: '',
    abstractSummary: '',
    keywords: '',
    background: '',
    methods: '',
    findings: '',
    conclusion: '',
    policyImplications: '',
    file: null as File | null,
    conflictOfInterest: false,
    ethicalApproval: false,
    consentToPublish: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      file: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      
      // Basic Information
      formDataToSend.append('title', formData.title)
      formDataToSend.append('presentationType', formData.presentationType)
      formDataToSend.append('conferenceTrack', formData.conferenceTrack)
      
      // Author Information
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('institution', formData.institution)
      formDataToSend.append('position', formData.position)
      formDataToSend.append('district', formData.district)
      formDataToSend.append('coAuthors', formData.coAuthors)
      
      // Abstract Content
      formDataToSend.append('abstractSummary', formData.abstractSummary)
      formDataToSend.append('keywords', formData.keywords)
      formDataToSend.append('background', formData.background)
      formDataToSend.append('methods', formData.methods)
      formDataToSend.append('findings', formData.findings)
      formDataToSend.append('conclusion', formData.conclusion)
      formDataToSend.append('policyImplications', formData.policyImplications)
      
      // Declarations
      formDataToSend.append('conflictOfInterest', formData.conflictOfInterest.toString())
      formDataToSend.append('ethicalApproval', formData.ethicalApproval.toString())
      formDataToSend.append('consentToPublish', formData.consentToPublish.toString())
      
      if (formData.file) {
        formDataToSend.append('file', formData.file)
      }

      const response = await fetch('/api/abstracts', {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()

      if (response.ok) {
        alert('Abstract submitted successfully!')
        router.push('/')
      } else {
        alert(`Abstract submission failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Abstract submission error:', error)
      alert('Abstract submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Abstract Submission</h1>
          <p className="text-xl text-gray-600">Submit your research abstract for NACNDC & JASH Conference 2025</p>
        </div>

        {/* Submission Guidelines */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Submission Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Dates</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Abstract Submission Deadline: <strong>September 15, 2025</strong></li>
                <li>Notification of Acceptance: <strong>September 25, 2025</strong></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Maximum 300 words (excluding references)</li>
                <li>Maximum file size: 2MB</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Abstract Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Abstract Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide a clear, descriptive title for your research"
              />
            </div>

            {/* Presentation Type and Conference Track */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Presentation Type *
                </label>
                <select
                  name="presentationType"
                  value={formData.presentationType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="oral">Oral Presentation</option>
                  <option value="poster">Poster Presentation</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Conference Track *
                </label>
                <select
                  name="conferenceTrack"
                  value={formData.conferenceTrack}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose the most relevant category</option>
                  <option value="integrated-diagnostics">Integrated Diagnostics, AMR, and Epidemic Readiness</option>
                  <option value="digital-health">Digital Health, Data, and Innovation</option>
                  <option value="community-engagement">Community Engagement for Disease Prevention and Elimination</option>
                  <option value="health-system-resilience">Health System Resilience and Emergency Preparedness and Response</option>
                  <option value="policy-financing">Policy, Financing and Cross-Sector Integration</option>
                  <option value="one-health">One Health</option>
                  <option value="care-treatment">Care, Treatment & Rehabilitation</option>
                  <option value="cross-cutting">Cross-Cutting Themes (Applicable to All Tracks)</option>
                </select>
              </div>
            </div>

            {/* Author Information */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Author Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Official correspondence will be sent to this email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Include country code (e.g., +256)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Institution/Organization *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full name of your institution"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Position/Title *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    District/Region *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="District where you are based in Uganda"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Co-Authors (Optional)
                  </label>
                  <textarea
                    name="coAuthors"
                    value={formData.coAuthors}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List all co-authors with their institutions (one per line)"
                  />
                </div>
              </div>
            </div>

            {/* Abstract Content */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Abstract Content</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Abstract Summary *
                  </label>
                  <textarea
                    name="abstractSummary"
                    value={formData.abstractSummary}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Provide a concise summary of your research (100-150 words)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Keywords *
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3-6 keywords separated by commas"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Background *
                  </label>
                  <textarea
                    name="background"
                    value={formData.background}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief background and context for your research"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Methods *
                  </label>
                  <textarea
                    name="methods"
                    value={formData.methods}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of methods used"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Findings *
                  </label>
                  <textarea
                    name="findings"
                    value={formData.findings}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Key findings of your research"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Conclusion *
                  </label>
                  <textarea
                    name="conclusion"
                    value={formData.conclusion}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Conclusions drawn from your research"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Policy/Practice Implications (Optional)
                  </label>
                  <textarea
                    name="policyImplications"
                    value={formData.policyImplications}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="How your research can inform policy or practice"
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Document Upload</h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Upload Abstract Document
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">
                      {formData.file ? formData.file.name : 'Choose File'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, DOC, or DOCX files only. Maximum size: 2MB
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Declarations */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Declarations</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="conflictOfInterest"
                    checked={formData.conflictOfInterest}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                  />
                  <label className="text-sm text-gray-700">
                    Conflict of Interest: I declare that there are no conflicts of interest related to this research.
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="ethicalApproval"
                    checked={formData.ethicalApproval}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                  />
                  <label className="text-sm text-gray-700">
                    Ethical Approval: This research has obtained necessary ethical approvals (where applicable).
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="consentToPublish"
                    checked={formData.consentToPublish}
                    onChange={handleInputChange}
                    required
                    className="mt-1 mr-3"
                  />
                  <label className="text-sm text-gray-700">
                    Consent to Publish: I consent to the publication of this abstract in conference proceedings and related materials. *
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-8">
              <button
                type="submit"
                disabled={isSubmitting || !formData.consentToPublish}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting Abstract...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Submit Abstract
                  </div>
                )}
              </button>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                By submitting this form, you agree to the conference terms and conditions.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
