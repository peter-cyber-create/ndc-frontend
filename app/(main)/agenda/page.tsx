'use client'

import React from 'react'
import { Calendar, Clock, MapPin, Users, Award, Coffee, Utensils, Mic, BarChart3, Wrench, Heart } from 'lucide-react'

const agenda = [
  {
    day: 1,
    date: 'November 3rd',
    events: [
      {
        time: '8:00 - 9:00',
        title: 'Registration & Check-in',
        location: 'Main Lobby',
        description: 'Welcome participants and networking breakfast',
        icon: Users,
        color: 'blue'
      },
      {
        time: '9:00 - 9:30',
        title: 'Opening Ceremony',
        location: 'Main Auditorium',
        description: 'Opening remarks on integrated health systems and technology in combating diseases',
        speaker: 'DR JANE RUTH ACENG, Minister for Health',
        icon: Mic,
        color: 'purple'
      },
      {
        time: '15:30 - 17:00',
        title: 'Innovation Showcase',
        location: 'Innovation Hub',
        description: 'Live demonstrations of advanced medical technologies',
        icon: BarChart3,
        color: 'green'
      },
      {
        time: '18:00 - 20:00',
        title: 'Gala Dinner',
        location: 'Grand Ballroom',
        description: 'Awards ceremony and gala dinner',
        icon: Utensils,
        color: 'orange'
      }
    ]
  },
  {
    day: 2,
    date: 'November 4th',
    events: [
      {
        time: '9:00 - 9:30',
        title: 'Morning Networking',
        location: 'Main Lobby',
        description: 'Day 2 networking and coffee',
        icon: Coffee,
        color: 'blue'
      },
      {
        time: '9:30 - 11:00',
        title: 'Research Presentations',
        location: 'Main Auditorium',
        description: 'Latest research in communicable and non-communicable diseases',
        icon: BarChart3,
        color: 'green'
      },
      {
        time: '11:30 - 12:30',
        title: 'Technology Panel',
        location: 'Conference Hall A',
        description: 'Digital health innovations and implementations',
        icon: Wrench,
        color: 'purple'
      },
      {
        time: '14:00 - 15:30',
        title: 'Workshop Sessions',
        location: 'Various Rooms',
        description: 'Interactive workshops on health system strengthening',
        icon: Users,
        color: 'orange'
      }
    ]
  },
  {
    day: 3,
    date: 'November 5th',
    events: [
      {
        time: '9:00 - 9:30',
        title: 'Morning Session',
        location: 'Main Lobby',
        description: 'Final day coffee and conversations',
        icon: Coffee,
        color: 'blue'
      },
      {
        time: '9:30 - 10:30',
        title: 'Keynote: Health Systems Strengthening',
        location: 'Main Auditorium',
        description: 'Strategies for continental expansion and impact',
        speaker: 'Maria Santos, CEO of PanAfrican Health Network',
        icon: Mic,
        color: 'purple'
      },
      {
        time: '10:30 - 12:00',
        title: 'Partnership & Collaboration Sessions',
        location: 'Multiple Rooms',
        description: 'Structured meetings for potential partnerships',
        icon: Users,
        color: 'green'
      },
      {
        time: '12:00 - 13:00',
        title: 'Working Lunch: Action Planning',
        location: 'Conference Rooms',
        description: 'Planning next steps and commitments',
        icon: Utensils,
        color: 'orange'
      },
      {
        time: '13:00 - 14:30',
        title: 'Conference Outcomes & Next Steps',
        location: 'Main Auditorium',
        description: 'Summary of key insights and action items',
        icon: BarChart3,
        color: 'green'
      },
      {
        time: '14:30 - 15:00',
        title: 'Closing Ceremony',
        location: 'Main Auditorium',
        description: 'Final remarks and conference conclusion',
        icon: Award,
        color: 'purple'
      },
      {
        time: '15:00 - 16:00',
        title: 'Farewell Networking',
        location: 'Main Lobby',
        description: 'Final networking and goodbyes',
        icon: Heart,
        color: 'blue'
      }
    ]
  },
  {
    day: 4,
    date: 'November 6th',
    events: [
      {
        time: '9:00 - 10:00',
        title: 'Final Plenary Session',
        location: 'Main Auditorium',
        description: 'Conference outcomes and action plans',
        icon: BarChart3,
        color: 'green'
      },
      {
        time: '10:00 - 11:00',
        title: 'Conference Wrap-up',
        location: 'Main Auditorium',
        description: 'Summary and next steps',
        icon: Award,
        color: 'purple'
      }
    ]
  },
  {
    day: 5,
    date: 'November 7th',
    events: [
      {
        time: '9:00 - 10:00',
        title: 'Final Keynote',
        location: 'Main Auditorium',
        description: 'Looking forward: Future of health systems in Uganda',
        icon: Mic,
        color: 'purple'
      },
      {
        time: '10:30 - 11:30',
        title: 'Action Planning Session',
        location: 'Conference Hall A',
        description: 'Developing concrete action plans for implementation',
        icon: Wrench,
        color: 'green'
      },
      {
        time: '12:00 - 13:00',
        title: 'Closing Ceremony',
        location: 'Main Auditorium',
        description: 'Official conference closing and next steps',
        icon: Award,
        color: 'orange'
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
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

export default function AgendaPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            NACNDC & JASHConference 2025
          </h1>
        </div>

        {/* Agenda by Day */}
        <div className="space-y-16">
          {agenda.map((day) => (
            <div key={day.day} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
                <h2 className="text-2xl font-bold">Day {day.day} - {day.date}</h2>
              </div>

              {/* Events */}
              <div className="p-6">
                <div className="space-y-6">
                  {day.events.map((event, index) => {
                    const IconComponent = event.icon
                    return (
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        {/* Time */}
                        <div className="flex-shrink-0">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-gray-500" />
                            <span className="font-semibold text-gray-900">{event.time}</span>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${getColorClasses(event.color)}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {event.title}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              <p className="text-gray-700 mb-2">{event.description}</p>
                              {event.speaker && (
                                <p className="text-sm font-medium text-blue-600">
                                  Speaker: {event.speaker}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Don't Miss Out!</h2>
          <p className="text-xl mb-8 opacity-90">
            Secure your spot at The Communicable and Non-Communicable Diseases Conference.
          </p>
          <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Register Now
          </button>
        </div>
      </div>
    </div>
  )
}