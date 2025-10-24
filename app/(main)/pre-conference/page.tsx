'use client'

import { Calendar } from 'lucide-react'

export default function PreConferencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pre Agenda
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Conference agenda and detailed program information will be available soon.
          </p>
          
          {/* Coming Soon Message */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 text-primary-200 mr-4" />
              <h2 className="text-3xl font-bold">Coming Soon</h2>
            </div>
            <p className="text-lg text-primary-100 mb-6">
              We're currently finalizing the conference agenda and program details. 
              Check back soon for the complete schedule, session times, and speaker lineup.
            </p>
            <div className="text-primary-100">
              <p className="font-semibold mb-2">What to expect:</p>
              <ul className="text-left space-y-1 max-w-2xl mx-auto">
                <li>• Complete conference schedule</li>
                <li>• Session descriptions and speakers</li>
                <li>• Breakout session details</li>
                <li>• Networking opportunities</li>
                <li>• Special events and activities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}