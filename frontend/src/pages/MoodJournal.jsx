import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../api/axios'

export default function MoodJournal() {
  
  const [moods, setMoods] = useState([])
  const [patterns, setPatterns] = useState(null)
  const [loading, setLoading] = useState(true)
  const [patternsLoading, setPatternsLoading] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchMoods()
  }, [])

  const fetchMoods = async () => {
    try {
      const response = await api.get('/mental/mood/')
      setMoods(response.data)
    } catch (error) {
      console.error('Failed to fetch moods:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatterns = async () => {
    setPatternsLoading(true)
    try {
      const response = await api.get('/mental/patterns/')
      setPatterns(response.data.insight)
    } catch (error) {
      console.error('Failed to fetch patterns:', error)
    } finally {
      setPatternsLoading(false)
    }
  }

  const getMoodEmoji = (score) => {
    switch (score) {
      case 10: return '😊'
      case 8: return '🙂'
      case 5: return '😐'
      case 3: return '😔'
      case 1: return '😢'
      default: return '😐'
    }
  }

  const getMoodColor = (score) => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 6) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (score >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (score >= 2) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const submitMood = async () => {
    if (!selectedMood) return
    
    try {
      await api.post('/mental/mood/', {
        score: selectedMood,
        notes: notes,
        date: new Date().toISOString().split('T')[0]
      })
      
      setSelectedMood(null)
      setNotes('')
      fetchMoods()
    } catch (error) {
      console.error('Failed to log mood:', error)
    }
  }

  const chartData = moods.slice(-14).map(mood => ({
    date: new Date(mood.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: mood.score
  })).reverse()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="skeleton h-6 w-1/3 mb-4"></div>
                <div className="skeleton h-64 w-full"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="skeleton h-6 w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mental Wellness</h1>
          <p className="text-gray-600">Track your mood and understand your emotional patterns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Logger */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling?</h2>
              
              <div className="space-y-6">
                {/* Mood Selection */}
                <div>
                  <p className="text-sm text-gray-600 mb-3">How are you feeling today?</p>
                  <div className="flex justify-between">
                    {[10, 8, 5, 3, 1].map(score => (
                      <button
                        key={score}
                        onClick={() => setSelectedMood(score)}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                          selectedMood === score
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-3xl mb-1">{getMoodEmoji(score)}</span>
                        <span className="text-xs text-gray-600">{score}/10</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="What's on your mind? Any specific feelings or events?"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={submitMood}
                  disabled={!selectedMood}
                  className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Log Mood
                </button>
              </div>
            </div>

            {/* Mood Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mood Trend (Last 14 Days)</h2>
              
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#993556" 
                      fill="#FBEAF0"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">🧠</span>
                  <p className="text-gray-600 mb-4">No mood data yet</p>
                  <p className="text-sm text-gray-500">Start tracking your mood to see patterns</p>
                </div>
              )}
            </div>

            {/* Recent Moods */}
            {moods.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Mood Entries</h2>
                <div className="space-y-3">
                  {moods.slice(0, 10).map(mood => (
                    <div key={mood.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getMoodEmoji(mood.score)}</span>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(mood.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Score: {mood.score}/10
                            {mood.cycle_day && ` • Cycle Day ${mood.cycle_day}`}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(mood.score)}`}>
                        {mood.score >= 8 ? 'Great' : mood.score >= 6 ? 'Good' : mood.score >= 4 ? 'Okay' : mood.score >= 2 ? 'Low' : 'Very Low'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Patterns */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
                <button
                  onClick={fetchPatterns}
                  disabled={patternsLoading}
                  className="text-sm text-rose-500 hover:text-rose-600 disabled:opacity-50"
                >
                  {patternsLoading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
              
              {patterns ? (
                <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded">
                  <p className="text-sm text-gray-700">{patterns}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-3xl mb-2 block">🤔</span>
                  <p className="text-sm text-gray-600">
                    Click "Analyze" to get AI-powered mood insights
                  </p>
                </div>
              )}
            </div>

            {/* Mood Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mood Tips</h2>
              <div className="space-y-3">
                <div className="p-3 bg-rose-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Daily tracking:</strong> Consistency helps identify patterns and triggers.
                  </p>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Note context:</strong> Record events that might affect your mood.
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Self-care:</strong> Low mood days are normal - be kind to yourself.
                  </p>
                </div>
              </div>
            </div>

            {/* Mood Statistics */}
            {moods.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Mood</span>
                    <span className="font-medium">
                      {(moods.reduce((sum, mood) => sum + mood.score, 0) / moods.length).toFixed(1)}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Entries Logged</span>
                    <span className="font-medium">{moods.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Best Day</span>
                    <span className="font-medium">
                      {Math.max(...moods.map(m => m.score))}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trend</span>
                    <span className="font-medium text-green-600">Improving ↗️</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
