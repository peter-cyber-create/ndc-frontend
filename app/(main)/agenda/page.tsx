'use client'

import React, { useState, useMemo } from 'react'
import { Calendar, Clock, MapPin, Users, Award, Coffee, Utensils, Mic, BarChart3, Wrench, Heart, Filter, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const agenda = [
  {
    id: 1,
    day: 1,
    date: 'November 3rd, 2025',
    track: 'Opening & Keynotes',
    events: [
      {
        time: '8:00 - 9:00',
        title: 'Registration & Check-in',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Welcome participants and networking breakfast',
        speaker: 'Conference Organizers',
        icon: Users,
        color: 'blue',
        type: 'Registration'
      },
      {
        time: '9:00 - 9:30',
        title: 'Opening Ceremony',
        location: 'Main Auditorium',
        room: 'Auditorium A',
        description: 'Opening remarks on integrated health systems and technology in combating diseases',
        speaker: 'Dr. Jane Ruth Aceng Ocero, Minister of Health',
        icon: Mic,
        color: 'purple',
        type: 'Keynote'
      },
      {
        time: '9:30 - 10:30',
        title: 'Keynote Address - Opening Ceremony',
        location: 'Main Auditorium',
        room: 'Auditorium A',
        description: 'Keynote presentation for the opening ceremony',
        speaker: 'Dr. Queen Dube, Keynote Speaker',
        icon: Mic,
        color: 'purple',
        type: 'Keynote'
      },
      {
        time: '10:30 - 11:00',
        title: 'Coffee Break',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Networking and refreshments',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '11:00 - 12:30',
        title: 'Side Event: Unifying Health',
        location: 'Conference Hall A',
        room: 'Hall A',
        description: 'Building an Integrated, Equitable, and Sustainable Health System for Uganda',
        speaker: 'Dr. Alex Riolexus Ario, Associate Professor',
        icon: Heart,
        color: 'green',
        type: 'Presentation'
      },
      {
        time: '14:00 - 15:30',
        title: 'Track: Health Policy, Financing and Partnerships',
        location: 'Conference Hall B',
        room: 'Hall B',
        description: 'Session on health policy, financing mechanisms, and partnership strategies',
        speaker: 'Henry Magala, Session Chair',
        icon: BarChart3,
        color: 'orange',
        type: 'Panel'
      },
      {
        time: '15:30 - 16:00',
        title: 'Coffee Break',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Afternoon networking and refreshments',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '16:00 - 17:30',
        title: 'Track: Digital Health & Data Use',
        location: 'Conference Hall C',
        room: 'Hall C',
        description: 'Digital health innovations and data utilization strategies',
        speaker: 'Dr. Alex Riolexus Ario, Director',
        icon: Wrench,
        color: 'purple',
        type: 'Presentation'
      },
      {
        time: '18:00 - 20:00',
        title: 'Welcome Reception',
        location: 'Grand Ballroom',
        room: 'Ballroom',
        description: 'Welcome reception and networking dinner',
        speaker: 'Conference Organizers',
        icon: Utensils,
        color: 'orange',
        type: 'Social'
      }
    ]
  },
  {
    id: 2,
    day: 2,
    date: 'November 4th, 2025',
    track: 'Research & Technology',
    events: [
      {
        time: '8:00 - 9:00',
        title: 'Morning Networking',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Day 2 networking and breakfast',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '9:00 - 10:30',
        title: 'Track: Diagnostics, AMR & Epidemic Readiness',
        location: 'Main Auditorium',
        room: 'Auditorium A',
        description: 'Latest research in diagnostics, antimicrobial resistance, and epidemic preparedness',
        speaker: 'Dr. Alex Riolexus Ario, Director',
        icon: BarChart3,
        color: 'green',
        type: 'Presentation'
      },
      {
        time: '10:30 - 11:00',
        title: 'Coffee Break',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Morning refreshments and networking',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '11:00 - 12:30',
        title: 'Track: Health Systems & Policy',
        location: 'Conference Hall A',
        room: 'Hall A',
        description: 'Health systems strengthening and policy development',
        speaker: 'Dr. Diana Atwine, Permanent Secretary',
        icon: Users,
        color: 'purple',
        type: 'Panel'
      },
      {
        time: '12:30 - 14:00',
        title: 'Lunch Break',
        location: 'Dining Hall',
        room: 'Dining Hall',
        description: 'Lunch and networking',
        speaker: 'All Participants',
        icon: Utensils,
        color: 'orange',
        type: 'Social'
      },
      {
        time: '14:00 - 15:30',
        title: 'Track: Environmental Health & Climate Change',
        location: 'Conference Hall B',
        room: 'Hall B',
        description: 'Environmental health challenges and climate change impacts',
        speaker: 'Dr. Charles Olaro, Director General',
        icon: Heart,
        color: 'green',
        type: 'Presentation'
      },
      {
        time: '15:30 - 16:00',
        title: 'Coffee Break',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Afternoon refreshments',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '16:00 - 17:30',
        title: 'Track: Health Innovations',
        location: 'Conference Hall C',
        room: 'Hall C',
        description: 'Innovative health technologies and solutions',
        speaker: 'Dr. Kazoora Wilson, Clinical Mentor',
        icon: Wrench,
        color: 'purple',
        type: 'Workshop'
      }
    ]
  },
  {
    id: 3,
    day: 3,
    date: 'November 5th, 2025',
    track: 'Partnerships & Action',
    events: [
      {
        time: '8:00 - 9:00',
        title: 'Morning Networking',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Day 3 networking and breakfast',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '9:00 - 10:30',
        title: 'Track: Health Policy, Financing and Partnerships',
        location: 'Main Auditorium',
        room: 'Auditorium A',
        description: 'Advanced strategies in health policy and financing',
        speaker: 'Henry Magala, Session Chair',
        icon: BarChart3,
        color: 'orange',
        type: 'Panel'
      },
      {
        time: '10:30 - 11:00',
        title: 'Coffee Break',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Morning refreshments',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '11:00 - 12:30',
        title: 'Track: Digital Health & Data Use',
        location: 'Conference Hall A',
        room: 'Hall A',
        description: 'Digital transformation in healthcare delivery',
        speaker: 'Dr. Alex Riolexus Ario, Director',
        icon: Wrench,
        color: 'purple',
        type: 'Presentation'
      },
      {
        time: '12:30 - 14:00',
        title: 'Lunch Break',
        location: 'Dining Hall',
        room: 'Dining Hall',
        description: 'Lunch and networking',
        speaker: 'All Participants',
        icon: Utensils,
        color: 'orange',
        type: 'Social'
      },
      {
        time: '14:00 - 15:30',
        title: 'Track: Health Systems & Policy',
        location: 'Conference Hall B',
        room: 'Hall B',
        description: 'Health system strengthening and policy implementation',
        speaker: 'Dr. Diana Atwine, Permanent Secretary',
        icon: Users,
        color: 'purple',
        type: 'Workshop'
      },
      {
        time: '15:30 - 16:00',
        title: 'Coffee Break',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Afternoon refreshments',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '16:00 - 17:30',
        title: 'Track: Health Innovations',
        location: 'Conference Hall C',
        room: 'Hall C',
        description: 'Innovative approaches to health challenges',
        speaker: 'Dr. Kazoora Wilson, Clinical Mentor',
        icon: Wrench,
        color: 'purple',
        type: 'Workshop'
      }
    ]
  },
  {
    id: 4,
    day: 4,
    date: 'November 6th, 2025',
    track: 'Research & Innovation',
    events: [
      {
        time: '8:00 - 9:00',
        title: 'Morning Networking',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Day 4 networking and breakfast',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '9:00 - 10:30',
        title: 'Track: Diagnostics, AMR & Epidemic Readiness',
        location: 'Main Auditorium',
        room: 'Auditorium A',
        description: 'Advanced diagnostics and epidemic preparedness strategies',
        speaker: 'Dr. Alex Riolexus Ario, Director',
        icon: BarChart3,
        color: 'green',
        type: 'Presentation'
      },
      {
        time: '10:30 - 11:00',
        title: 'Coffee Break',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Morning refreshments',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '11:00 - 12:30',
        title: 'Track: Environmental Health & Climate Change',
        location: 'Conference Hall A',
        room: 'Hall A',
        description: 'Climate change impacts on health systems',
        speaker: 'Dr. Charles Olaro, Director General',
        icon: Heart,
        color: 'green',
        type: 'Presentation'
      },
      {
        time: '12:30 - 14:00',
        title: 'Lunch Break',
        location: 'Dining Hall',
        room: 'Dining Hall',
        description: 'Lunch and networking',
        speaker: 'All Participants',
        icon: Utensils,
        color: 'orange',
        type: 'Social'
      },
      {
        time: '14:00 - 15:30',
        title: 'Track: Health Innovations',
        location: 'Conference Hall B',
        room: 'Hall B',
        description: 'Cutting-edge health technologies and innovations',
        speaker: 'Dr. Kazoora Wilson, Clinical Mentor',
        icon: Wrench,
        color: 'purple',
        type: 'Workshop'
      },
      {
        time: '15:30 - 16:00',
        title: 'Coffee Break',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Afternoon refreshments',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '16:00 - 17:30',
        title: 'Track: Health Policy, Financing and Partnerships',
        location: 'Conference Hall C',
        room: 'Hall C',
        description: 'Partnership strategies and financing mechanisms',
        speaker: 'Henry Magala, Session Chair',
        icon: BarChart3,
        color: 'orange',
        type: 'Panel'
      }
    ]
  },
  {
    id: 5,
    day: 5,
    date: 'November 7th, 2025',
    track: 'Closing & Future Directions',
    events: [
      {
        time: '8:00 - 9:00',
        title: 'Morning Networking',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Final day networking and breakfast',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '9:00 - 10:30',
        title: 'Guest Speaker Presentation',
        location: 'Main Auditorium',
        room: 'Auditorium A',
        description: 'Special guest speaker presentation',
        speaker: 'Prof. Francis Omaswa, Guest Speaker',
        icon: Mic,
        color: 'purple',
        type: 'Keynote'
      },
      {
        time: '10:30 - 11:00',
        title: 'Coffee Break',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Morning refreshments',
        speaker: 'All Participants',
        icon: Coffee,
        color: 'blue',
        type: 'Networking'
      },
      {
        time: '11:00 - 12:30',
        title: 'Conference Outcomes & Next Steps',
        location: 'Main Auditorium',
        room: 'Auditorium A',
        description: 'Summary of key insights and action items',
        speaker: 'Dr. Jane Ruth Aceng Ocero, Minister of Health',
        icon: BarChart3,
        color: 'green',
        type: 'Presentation'
      },
      {
        time: '12:30 - 14:00',
        title: 'Working Lunch: Action Planning',
        location: 'Dining Hall',
        room: 'Dining Hall',
        description: 'Planning next steps and commitments',
        speaker: 'All Participants',
        icon: Utensils,
        color: 'orange',
        type: 'Workshop'
      },
      {
        time: '14:00 - 15:00',
        title: 'Closing Ceremony',
        location: 'Main Auditorium',
        room: 'Auditorium A',
        description: 'Final remarks and conference conclusion',
        speaker: 'Dr. Diana Atwine, Permanent Secretary',
        icon: Award,
        color: 'purple',
        type: 'Closing'
      },
      {
        time: '15:00 - 16:00',
        title: 'Farewell Networking',
        location: 'Main Lobby',
        room: 'Lobby',
        description: 'Final networking and goodbyes',
        speaker: 'All Participants',
        icon: Heart,
        color: 'blue',
        type: 'Networking'
      }
    ]
  }
]

const tracks = ['All', 'Opening & Keynotes', 'Research & Technology', 'Partnerships & Action', 'Research & Innovation', 'Closing & Future Directions']
const types = ['All', 'Keynote', 'Presentation', 'Panel', 'Workshop', 'Networking', 'Exhibition', 'Social', 'Registration', 'Closing']
const rooms = ['All', 'Auditorium A', 'Hall A', 'Hall B', 'Hall C', 'Lobby', 'Ballroom', 'Dining Hall', 'Multiple']

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
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

export default function AgendaPage() {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all')
  const [selectedTrack, setSelectedTrack] = useState<string>('All')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedRoom, setSelectedRoom] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAgenda = useMemo(() => {
    return agenda.filter(day => {
      if (selectedDay !== 'all' && day.day !== selectedDay) return false
      if (selectedTrack !== 'All' && day.track !== selectedTrack) return false
      
      const filteredEvents = day.events.filter(event => {
        if (selectedType !== 'All' && event.type !== selectedType) return false
        if (selectedRoom !== 'All' && event.room !== selectedRoom) return false
        if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !event.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !event.speaker.toLowerCase().includes(searchTerm.toLowerCase())) return false
        return true
      })
      
      return filteredEvents.length > 0
    })
  }, [selectedDay, selectedTrack, selectedType, selectedRoom, searchTerm])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Conference Agenda
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the comprehensive schedule of events, sessions, and activities at the NACNDC & JASH Conference 2025.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Agenda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Day Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Days</option>
                  {agenda.map(day => (
                    <option key={day.day} value={day.day}>Day {day.day} - {day.date}</option>
                  ))}
                </select>
              </div>

              {/* Track Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Track</label>
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {tracks.map(track => (
                    <option key={track} value={track}>{track}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Room Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {rooms.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDay('all')
                  setSelectedTrack('All')
                  setSelectedType('All')
                  setSelectedRoom('All')
                  setSearchTerm('')
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile-Responsive Agenda */}
        <div className="space-y-8">
          {filteredAgenda.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more events.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAgenda.map((day) => (
              <Card key={day.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="flex items-center justify-between">
                    <span>Day {day.day} - {day.date}</span>
                    <span className="text-sm font-normal opacity-90">{day.track}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speaker</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {day.events.map((event, index) => {
                          const IconComponent = event.icon
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm font-medium text-gray-900">{event.time}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className={`p-2 rounded-lg ${getColorClasses(event.color)} mr-3`}>
                                    <IconComponent className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                    <div className="text-sm text-gray-500">{event.description}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-900">
                                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                  {event.location}
                                </div>
                                <div className="text-sm text-gray-500">{event.room}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {event.speaker}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getColorClasses(event.color)}`}>
                                  {event.type}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden">
                    {day.events.map((event, index) => {
                      const IconComponent = event.icon
                      return (
                        <div key={index} className="border-b border-gray-200 last:border-b-0 p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${getColorClasses(event.color)} flex-shrink-0`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-semibold text-gray-900">{event.title}</h3>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getColorClasses(event.color)}`}>
                                  {event.type}
                                </span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500 mb-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {event.time}
                              </div>
                              <div className="flex items-center text-xs text-gray-500 mb-2">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.location} • {event.room}
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                              <p className="text-xs font-medium text-blue-600">{event.speaker}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Don't Miss Out!</h2>
              <p className="text-xl mb-8 opacity-90">
                Secure your spot at the NACNDC & JASH Conference 2025.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  Register Now
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Download Agenda
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}