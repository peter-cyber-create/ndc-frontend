import React from 'react'
import { Clock } from 'lucide-react'

export const metadata = {
  title: 'Conference E-Documents - NACNDC & JASH Conference 2025',
  description: 'Access conference materials, presentations, and resources.',
  keywords: 'conference documents, presentations, research papers, NACNDC, JASH',
}

export default function EDocumentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conference E-Documents
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Access conference materials and resources.
          </p>
          
          {/* Coming Soon Message */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-12 w-12 text-primary-200 mr-4" />
              <h2 className="text-3xl font-bold">Coming Soon</h2>
            </div>
            <p className="text-lg text-primary-100 mb-6">
              Conference materials will be available after the event.
            </p>
            <div className="text-primary-100">
              <p className="font-semibold mb-2">Available after conference:</p>
              <ul className="text-left space-y-1 max-w-2xl mx-auto">
                <li>• Presentation slides</li>
                <li>• Research papers</li>
                <li>• Conference proceedings</li>
                <li>• Multimedia resources</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}