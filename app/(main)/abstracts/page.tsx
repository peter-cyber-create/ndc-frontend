'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Calendar, Clock, Users, Award, BookOpen, Presentation, FileImage, Video, Archive } from 'lucide-react'

const documentCategories = [
  {
    id: 'program',
    title: 'Conference Program',
    description: 'Complete schedule and program details',
    icon: Calendar,
    color: 'blue',
    documents: [
      {
        name: 'Full Conference Program',
        type: 'PDF',
        size: '2.4 MB',
        date: '2025-10-15',
        description: 'Complete 5-day conference schedule with all sessions, speakers, and activities'
      },
      {
        name: 'Daily Schedule Overview',
        type: 'PDF',
        size: '1.2 MB',
        date: '2025-10-15',
        description: 'Quick reference guide for each day of the conference'
      },
      {
        name: 'Session Abstracts Book',
        type: 'PDF',
        size: '8.7 MB',
        date: '2025-10-20',
        description: 'Compilation of all accepted abstracts and research presentations'
      }
    ]
  },
  {
    id: 'speakers',
    title: 'Speaker Materials',
    description: 'Speaker profiles, presentations, and resources',
    icon: Users,
    color: 'purple',
    documents: [
      {
        name: 'Speaker Biographies',
        type: 'PDF',
        size: '3.1 MB',
        date: '2025-10-18',
        description: 'Detailed profiles of all conference speakers and panelists'
      },
      {
        name: 'Keynote Presentations',
        type: 'PDF',
        size: '15.2 MB',
        date: '2025-10-22',
        description: 'Slides and materials from keynote presentations'
      },
      {
        name: 'Panel Discussion Notes',
        type: 'PDF',
        size: '2.8 MB',
        date: '2025-10-25',
        description: 'Summary notes from panel discussions and Q&A sessions'
      }
    ]
  },
  {
    id: 'research',
    title: 'Research & Abstracts',
    description: 'Accepted abstracts and research papers',
    icon: BookOpen,
    color: 'green',
    documents: [
      {
        name: 'Accepted Abstracts Collection',
        type: 'PDF',
        size: '12.3 MB',
        date: '2025-10-20',
        description: 'Complete collection of all accepted research abstracts'
      },
      {
        name: 'Poster Presentations',
        type: 'PDF',
        size: '6.8 MB',
        date: '2025-10-21',
        description: 'Digital copies of all poster presentations'
      },
      {
        name: 'Research Paper Proceedings',
        type: 'PDF',
        size: '25.4 MB',
        date: '2025-10-30',
        description: 'Full proceedings of research papers and findings'
      }
    ]
  },
  {
    id: 'multimedia',
    title: 'Multimedia Resources',
    description: 'Videos, photos, and digital content',
    icon: Video,
    color: 'orange',
    documents: [
      {
        name: 'Conference Highlights Video',
        type: 'MP4',
        size: '245 MB',
        date: '2025-11-10',
        description: 'Compilation video of key moments and highlights'
      },
      {
        name: 'Speaker Presentation Videos',
        type: 'ZIP',
        size: '1.2 GB',
        date: '2025-11-12',
        description: 'Recorded presentations from all speakers'
      },
      {
        name: 'Conference Photo Gallery',
        type: 'ZIP',
        size: '890 MB',
        date: '2025-11-08',
        description: 'Professional photos from all conference sessions'
      }
    ]
  },
  {
    id: 'resources',
    title: 'Conference Resources',
    description: 'Additional materials and resources',
    icon: Archive,
    color: 'indigo',
    documents: [
      {
        name: 'Conference Handbook',
        type: 'PDF',
        size: '4.2 MB',
        date: '2025-10-12',
        description: 'Complete conference handbook with guidelines and information'
      },
      {
        name: 'Venue Information',
        type: 'PDF',
        size: '1.8 MB',
        date: '2025-10-10',
        description: 'Detailed information about Speke Resort Munyonyo venue'
      },
      {
        name: 'Networking Guide',
        type: 'PDF',
        size: '2.1 MB',
        date: '2025-10-14',
        description: 'Guide to networking opportunities and participant directory'
      },
      {
        name: 'Conference App Guide',
        type: 'PDF',
        size: '1.5 MB',
        date: '2025-10-16',
        description: 'Instructions for using the conference mobile application'
      }
    ]
  }
]

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-100 text-blue-600 border-blue-200'
    case 'purple':
      return 'bg-purple-100 text-purple-600 border-purple-200'
    case 'green':
      return 'bg-green-100 text-green-600 border-green-200'
    case 'orange':
      return 'bg-orange-100 text-orange-600 border-orange-200'
    case 'indigo':
      return 'bg-indigo-100 text-indigo-600 border-indigo-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'PDF':
      return FileText
    case 'MP4':
    case 'ZIP':
      return Video
    default:
      return FileText
  }
}

export default function E_DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredCategories = selectedCategory === 'all' 
    ? documentCategories 
    : documentCategories.filter(cat => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Conference E-Documents
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access all conference materials, presentations, research papers, and multimedia resources from the NACNDC & JASH Conference 2025.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="mb-2"
            >
              All Documents
            </Button>
            {documentCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="mb-2"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {category.title}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="space-y-8">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${getColorClasses(category.color).split(' ')[0]} text-white`}>
                  <CardTitle className="flex items-center gap-3">
                    <IconComponent className="h-6 w-6" />
                    <div>
                      <div>{category.title}</div>
                      <div className="text-sm font-normal opacity-90">{category.description}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {category.documents.map((doc, index) => {
                      const FileIcon = getFileIcon(doc.type)
                      return (
                        <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className={`p-3 rounded-lg ${getColorClasses(category.color)} flex-shrink-0`}>
                                <FileIcon className="h-6 w-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.name}</h3>
                                <p className="text-gray-600 mb-3">{doc.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <FileText className="h-4 w-4 mr-1" />
                                    {doc.type}
                                  </span>
                                  <span>{doc.size}</span>
                                  <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(doc.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                              <Button className="btn-primary">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Coming Soon Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-4">More Documents Coming Soon</h2>
            <p className="text-lg mb-6 opacity-90">
              Additional conference materials, recordings, and resources will be added after the conference concludes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Get Notified
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}