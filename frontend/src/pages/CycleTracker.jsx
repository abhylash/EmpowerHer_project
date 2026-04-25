import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../api/axios'

export default function CycleTracker() {
  const { t } = useTranslation()
  
  const [cycles, setCycles] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [showLogForm, setShowLogForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    start_date: '',
    flow_level: 'medium',
    cramp_score: 5,
    mood: '',
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [cyclesResponse, predictionResponse] = await Promise.all([
        api.get('/cycles/'),
        api.get('/cycles/prediction/')
      ])
      setCycles(cyclesResponse.data)
      setPrediction(predictionResponse.data)
    } catch (error) {
      console.error('Failed to fetch cycle data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/cycles/', formData)
      setShowLogForm(false)
      setFormData({
        start_date: '',
        flow_level: 'medium',
        cramp_score: 5,
        mood: '',
        notes: ''
      })
      fetchData()
    } catch (error) {
      console.error('Failed to log cycle:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'menstrual': return 'bg-red-100 text-red-800 border-red-200'
      case 'follicular': return 'bg-green-100 text-green-800 border-green-200'
      case 'ovulatory': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'luteal': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getFlowColor = (flow) => {
    switch (flow) {
      case 'light': return 'bg-pink-100 text-pink-800'
      case 'medium': return 'bg-red-100 text-red-800'
      case 'heavy': return 'bg-red-200 text-red-900'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-rose-50 via-white to-purple-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-rose-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('cycle_tracker')}</h1>
          <p className="text-gray-600 text-lg">Track your menstrual cycle and get predictions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prediction Card */}
            {prediction && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-rose-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  📊 Cycle Prediction
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
                    <p className="text-sm text-gray-600 mb-2">{t('next_period')}</p>
                    <p className="text-xl font-bold text-rose-600">
                      {prediction.next_period_date ? 
                        new Date(prediction.next_period_date).toLocaleDateString() : 
                        'No prediction'
                      }
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-gray-600 mb-2">{t('ovulation')}</p>
                    <p className="text-xl font-bold text-purple-600">
                      {prediction.ovulation_start ? 
                        `${new Date(prediction.ovulation_start).toLocaleDateString()} - ${new Date(prediction.ovulation_end).toLocaleDateString()}` : 
                        'No prediction'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-lg p-4 border border-rose-200">
                  <p className="text-sm text-gray-600 mb-2">{t('current_phase')}</p>
                  <p className="text-lg font-medium text-gray-900 capitalize">{prediction.current_phase}</p>
                </div>
                {prediction.ovulation_start && prediction.ovulation_end && (
                  <div className="bg-teal-light rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">{t('ovulation')} Window</p>
                    <p className="font-medium">
                      {new Date(prediction.ovulation_start).toLocaleDateString()} - {new Date(prediction.ovulation_end).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cycle Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cycle History</h2>
              
              {cycles.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cycles.map(cycle => ({
                    name: new Date(cycle.start_date).toLocaleDateString(),
                    length: cycle.cycle_length || 28,
                    cramps: cycle.cramp_score
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="length" 
                      stroke="#993556" 
                      strokeWidth={2}
                      name="Cycle Length (days)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cramps" 
                      stroke="#0F6E56" 
                      strokeWidth={2}
                      name="Cramp Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📅</span>
                  <p className="text-gray-600 mb-4">No cycle data yet</p>
                  <button
                    onClick={() => setShowLogForm(true)}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-sm"
                  >
                    Log Your First Period
                  </button>
                </div>
              )}
            </div>

            {/* Recent Cycles */}
            {cycles.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Cycles</h2>
                <div className="space-y-3">
                  {cycles.slice(0, 5).map(cycle => (
                    <div key={cycle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(cycle.start_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {cycle.cycle_length ? `${cycle.cycle_length} days` : 'In progress'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFlowColor(cycle.flow_level)}`}>
                          {cycle.flow_level}
                        </span>
                        <span className="text-sm text-gray-600">
                          Cramps: {cycle.cramp_score}/10
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Log Period Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('log_period')}</h2>
              
              {!showLogForm ? (
                <button
                  onClick={() => setShowLogForm(true)}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-light transition-colors"
                >
                  Log New Period
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('start_date')}
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('flow_level')}
                    </label>
                    <select
                      name="flow_level"
                      value={formData.flow_level}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="light">Light</option>
                      <option value="medium">Medium</option>
                      <option value="heavy">Heavy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cramp Score (1-10)
                    </label>
                    <input
                      type="range"
                      name="cramp_score"
                      min="1"
                      max="10"
                      value={formData.cramp_score}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600">{formData.cramp_score}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('mood')}
                    </label>
                    <input
                      type="text"
                      name="mood"
                      value={formData.mood}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="How are you feeling?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('notes')}
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Any additional notes..."
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-light transition-colors"
                    >
                      {t('save')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLogForm(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Cycle Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cycle Tips</h2>
              <div className="space-y-3">
                <div className="p-3 bg-primary-bg rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Track regularly:</strong> Log your period start and end dates for accurate predictions.
                  </p>
                </div>
                <div className="p-3 bg-teal-light rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Note symptoms:</strong> Track cramps, mood, and flow patterns to understand your body better.
                  </p>
                </div>
                <div className="p-3 bg-amber-light rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Stay prepared:</strong> Use predictions to plan ahead for supplies and activities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
