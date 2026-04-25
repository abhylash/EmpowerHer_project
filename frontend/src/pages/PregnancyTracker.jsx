import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'

export default function PregnancyTracker() {
  const { t } = useTranslation()
  
  const [pregnancyProfile, setPregnancyProfile] = useState(null)
  const [weeklyData, setWeeklyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    lmp_date: ''
  })
  const [symptoms, setSymptoms] = useState([])
  const [symptomAnalysis, setSymptomAnalysis] = useState(null)

  useEffect(() => {
    fetchPregnancyData()
  }, [])

  const fetchPregnancyData = async () => {
    try {
      const profileResponse = await api.get('/pregnancy/')
      setPregnancyProfile(profileResponse.data)
      
      if (profileResponse.data) {
        const weeklyResponse = await api.get('/pregnancy/weekly/')
        setWeeklyData(weeklyResponse.data)
      }
    } catch (error) {
      // Profile might not exist yet
    } finally {
      setLoading(false)
    }
  }

  const createPregnancyProfile = async () => {
    try {
      await api.post('/pregnancy/', formData)
      setShowForm(false)
      setFormData({ lmp_date: '' })
      fetchPregnancyData()
    } catch (error) {
      console.error('Failed to create pregnancy profile:', error)
    }
  }

  const getBabySizeEmoji = (size) => {
    const sizeEmojis = {
      'poppy seed': '🌱',
      'sesame seed': '🫘',
      'lentil': '🫘',
      'blueberry': '🫐',
      'grape': '🍇',
      'strawberry': '🍓',
      'fig': '🍈',
      'lime': '🍋',
      'apple': '🍎',
      'avocado': '🥑',
      'turnip': '🥔',
      'bell pepper': '🫑',
      'tomato': '🍅',
      'banana': '🍌',
      'carrot': '🥕',
      'spaghetti squash': '🎃',
      'rutabaga': '🥕',
      'scallion': '🧅',
      'head of cauliflower': '🥦',
      'large eggplant': '🍆',
      'butternut squash': '🎃',
      'cabbage': '🥬',
      'coconut': '🥥',
      'jicama': '🥔',
      'pineapple': '🍍',
      'cantaloupe': '🍈',
      'honeydew melon': '🍈',
      'watermelon': '🍉',
      'winter melon': '🎃',
      'leek': '🧅',
      'pumpkin': '🎃'
    }
    return sizeEmojis[size] || '👶'
  }

  const getWeekColor = (week) => {
    if (week <= 12) return 'bg-pink-100 text-pink-800 border-pink-200'
    if (week <= 28) return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-purple-100 text-purple-800 border-purple-200'
  }

  const handleSymptomToggle = (symptom) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) return
    
    try {
      const response = await api.post('/pregnancy/symptoms/', { symptoms })
      setSymptomAnalysis(response.data)
    } catch (error) {
      console.error('Failed to analyze symptoms:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="skeleton h-6 w-1/3 mb-4"></div>
                <div className="skeleton h-8 w-full mb-4"></div>
                <div className="skeleton h-32 w-full"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">{t('pregnancy')}</h1>
          <p className="text-gray-600">Track your pregnancy journey and get weekly updates</p>
        </div>

        {!pregnancyProfile ? (
          /* Create Pregnancy Profile */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Start Your Pregnancy Journey</h2>
              <p className="text-gray-600 mb-6">
                Enter your Last Menstrual Period (LMP) date to track your pregnancy progress
              </p>
              
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-light transition-colors"
                >
                  Set Up Pregnancy Tracking
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Menstrual Period (LMP)
                    </label>
                    <input
                      type="date"
                      value={formData.lmp_date}
                      onChange={(e) => setFormData({ lmp_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={createPregnancyProfile}
                      disabled={!formData.lmp_date}
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start Tracking
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Week Banner */}
              {weeklyData && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Week {weeklyData.week} of 40
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getWeekColor(weeklyData.week)}`}>
                      {weeklyData.week <= 12 ? 'First Trimester' : weeklyData.week <= 28 ? 'Second Trimester' : 'Third Trimester'}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(weeklyData.week / 40) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {weeklyData.week}/40 weeks completed
                    </p>
                  </div>

                  {/* Baby Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-primary-bg rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-3xl">{getBabySizeEmoji(weeklyData.baby_size)}</span>
                        <div>
                          <p className="font-medium text-gray-900">Baby Size</p>
                          <p className="text-sm text-gray-600">{weeklyData.baby_size}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        About the size of a {weeklyData.baby_comparison}
                      </p>
                    </div>
                    
                    <div className="bg-teal-light rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-3xl">📅</span>
                        <div>
                          <p className="font-medium text-gray-900">Due Date</p>
                          <p className="text-sm text-gray-600">
                            {new Date(pregnancyProfile.edd).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        {Math.round((new Date(pregnancyProfile.edd) - new Date()) / (1000 * 60 * 60 * 24))} days to go
                      </p>
                    </div>
                  </div>

                  {/* Development Info */}
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-medium text-gray-900 mb-1">Baby Development</h3>
                      <p className="text-sm text-gray-700">{weeklyData.development}</p>
                    </div>
                    
                    <div className="border-l-4 border-teal pl-4">
                      <h3 className="font-medium text-gray-900 mb-1">Maternal Tip</h3>
                      <p className="text-sm text-gray-700">{weeklyData.maternal_tip}</p>
                    </div>
                    
                    <div className="border-l-4 border-amber pl-4">
                      <h3 className="font-medium text-gray-900 mb-1">Nutrition Tip</h3>
                      <p className="text-sm text-gray-700">{weeklyData.nutrition_tip}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Symptom Checker */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Symptom Checker</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Select any symptoms you're experiencing to check for warning signs
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    'Morning sickness', 'Fatigue', 'Back pain', 'Headaches',
                    'Swelling', 'Heartburn', 'Frequent urination', 'Food cravings',
                    'Mood swings', 'Bleeding', 'Severe headache', 'Reduced movement',
                    'Blurred vision', 'Fever', 'Dizziness', 'Chest pain'
                  ].map(symptom => (
                    <label
                      key={symptom}
                      className={`flex items-center p-2 border rounded cursor-pointer text-sm ${
                        symptoms.includes(symptom)
                          ? 'border-primary bg-primary-bg'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={symptoms.includes(symptom)}
                        onChange={() => handleSymptomToggle(symptom)}
                        className="mr-2 text-primary focus:ring-primary"
                      />
                      {symptom}
                    </label>
                  ))}
                </div>

                <button
                  onClick={analyzeSymptoms}
                  disabled={symptoms.length === 0}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze Symptoms
                </button>

                {symptomAnalysis && (
                  <div className={`mt-4 p-4 rounded-lg border ${
                    symptomAnalysis.has_danger_signs
                      ? 'bg-red-50 border-red-200'
                      : 'bg-green-50 border-green-200'
                  }`}>
                    {symptomAnalysis.has_danger_signs ? (
                      <div>
                        <p className="font-medium text-red-800 mb-2">⚠️ Danger Signs Detected</p>
                        <p className="text-sm text-red-700 mb-2">
                          The following symptoms require immediate medical attention:
                        </p>
                        <ul className="text-sm text-red-700 list-disc list-inside">
                          {symptomAnalysis.danger_signs.map((sign, index) => (
                            <li key={index}>{sign}</li>
                          ))}
                        </ul>
                        <p className="text-sm text-red-700 font-medium mt-3">
                          Please contact your healthcare provider immediately.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-green-800 mb-2">✅ No Immediate Danger Signs</p>
                        <p className="text-sm text-green-700">
                          Your symptoms appear to be normal pregnancy symptoms. However, always consult your healthcare provider if you're concerned.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pregnancy Tips */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pregnancy Tips</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-primary-bg rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Prenatal care:</strong> Regular check-ups are essential for monitoring your health and baby's development.
                    </p>
                  </div>
                  <div className="p-3 bg-teal-light rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Nutrition:</strong> Eat a balanced diet rich in iron, calcium, and folic acid.
                    </p>
                  </div>
                  <div className="p-3 bg-amber-light rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Exercise:</strong> Gentle exercise like walking and swimming is beneficial.
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="font-medium text-red-800 mb-1">🚨 Emergency</p>
                    <p className="text-sm text-red-700">Call 108 for medical emergencies</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800 mb-1">📞 Doctor</p>
                    <p className="text-sm text-blue-700">Contact your healthcare provider</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800 mb-1">🤱 Support</p>
                    <p className="text-sm text-green-700">Pregnancy helpline: 1800-11-6263</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
