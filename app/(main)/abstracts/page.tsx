'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, Upload, User, Mail, Building, Tag, 
  CheckCircle, AlertCircle, Loader2, Calendar
} from 'lucide-react'

export default function AbstractsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    primary_author: '',
    corresponding_email: '',
    organization: '',
    abstract_summary: '',
    keywords: '',
    category: 'research',
    file: null as File | null
  })

  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'error' | null;
    title: string;
    message: string;
  }>({ type: null, title: '', message: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev: any) => ({
      ...prev,
      file: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('primary_author', formData.primary_author)
      formDataToSend.append('corresponding_email', formData.corresponding_email)
      formDataToSend.append('organization', formData.organization)
      formDataToSend.append('abstract_summary', formData.abstract_summary)
      formDataToSend.append('keywords', formData.keywords)
      formDataToSend.append('category', formData.category)
      if (formData.file) {
        formDataToSend.append('file', formData.file)
      }

      const response = await fetch('/api/abstracts', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitResult({
          type: 'success',
          title: 'Abstract Submitted Successfully!',
          message: 'Thank you for submitting your abstract! Your submission has been received and will be reviewed by our committee. You will receive a confirmation email shortly.'
        })
        setFormData({
          title: '',
          primary_author: '',
          corresponding_email: '',
          organization: '',
          abstract_summary: '',
          keywords: '',
          category: 'research',
          file: null
        })
      } else {
        const errorMessage = result.error || result.message || 'Abstract submission failed. Please try again.'
        setSubmitResult({
          type: 'error',
          title: 'Submission Failed',
          message: errorMessage
        })
      }
    } catch (error) {
      console.error('Error submitting abstract:', error)
      setSubmitResult({
        type: 'error',
        title: 'Submission Failed',
        message: 'An error occurred while submitting your abstract. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-950 py-16 px-2 sm:px-0 text-white">
      <div className="flex justify-center mb-10">
        <div className="h-1 w-32 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-700 rounded-full opacity-80" />
      </div>
      
      <div className="max-w-4xl mx-auto rounded-2xl shadow-lg bg-white p-8 sm:p-16 border border-primary-200 transition-all duration-200 hover:scale-[1.01]">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight text-primary-900 drop-shadow-lg text-center">
          Abstract Submission
        </h1>
        <p className="text-center text-primary-700 mb-8">
          Submit your research abstract for the National Digital Health Conference 2025
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Abstract Title */}
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-primary-900 mb-6">Abstract Details</h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="font-semibold text-primary-900">
                Abstract Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="rounded-lg px-4 py-3 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400"
                placeholder="Enter your abstract title"
              />
            </div>
          </div>

          {/* Author Information */}
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-primary-900 mb-6">Author Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="primary_author" className="font-semibold text-primary-900">
                  Primary Author *
                </label>
                <input
                  type="text"
                  id="primary_author"
                  name="primary_author"
                  value={formData.primary_author}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg px-4 py-3 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400"
                  placeholder="Enter primary author name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="corresponding_email" className="font-semibold text-primary-900">
                  Corresponding Email *
                </label>
                <input
                  type="email"
                  id="corresponding_email"
                  name="corresponding_email"
                  value={formData.corresponding_email}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg px-4 py-3 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400"
                  placeholder="Enter corresponding email"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="organization" className="font-semibold text-primary-900">
                Organization *
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                required
                className="w-full mt-2 rounded-lg px-4 py-3 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400"
                placeholder="Enter your organization"
              />
            </div>
          </div>

          {/* Abstract Content */}
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-primary-900 mb-6">Abstract Content</h2>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="abstract_summary" className="font-semibold text-primary-900">
                  Abstract Summary *
                </label>
                <textarea
                  id="abstract_summary"
                  name="abstract_summary"
                  value={formData.abstract_summary}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="rounded-lg px-4 py-3 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400"
                  placeholder="Enter your abstract summary (maximum 500 words)"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="keywords" className="font-semibold text-primary-900">
                  Keywords *
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg px-4 py-3 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400"
                  placeholder="Enter keywords separated by commas"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="font-semibold text-primary-900">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg px-4 py-3 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400"
                >
                  <option value="research">Research</option>
                  <option value="policy">Policy</option>
                  <option value="practice">Practice</option>
                  <option value="innovation">Innovation</option>
                </select>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-primary-900 mb-6">Document Upload</h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="file" className="font-semibold text-primary-900">
                Abstract Document (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload document</span>
                      <input
                        id="file"
                        name="file"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT up to 10MB</p>
                  {formData.file && (
                    <p className="text-sm text-green-600 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {formData.file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:from-primary-600 hover:to-primary-800 transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting Abstract...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Submit Abstract
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success/Error Modal */}
      {submitResult.type && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {submitResult.type === 'success' ? (
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900">{submitResult.title}</h3>
              </div>
              <button
                onClick={() => setSubmitResult({ type: null, title: '', message: '' })}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <AlertCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">{submitResult.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSubmitResult({ type: null, title: '', message: '' })}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  submitResult.type === 'success'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {submitResult.type === 'success' ? 'Great!' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}