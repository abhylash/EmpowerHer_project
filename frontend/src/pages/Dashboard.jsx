import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/useAuthStore'
import api from '../api/axios'
import { Heart, Calendar, Brain, Baby, Utensils, Shield, FileText, MessageCircle, TrendingUp, Activity } from 'lucide-react'

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/auth/dashboard/')
      setDashboardData(response.data)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('good_morning')
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getMoodEmoji = (score) => {
    if (score >= 8) return '😊'
    if (score >= 6) return '🙂'
    if (score >= 4) return '😐'
    if (score >= 2) return '😔'
    return '😢'
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-rose-50 via-white to-purple-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-rose-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {getGreeting()}, {user?.first_name || user?.username}</h1>
              <p className="text-gray-600 text-lg">
                {new Date().toLocaleDateString(i18n.language, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white rounded-lg shadow-md px-4 py-2 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <span className="text-sm font-medium text-gray-700">Health Score: 85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Next Period Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-rose-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{t('next_period')}</h3>
              <Calendar className="w-6 h-6 text-rose-500" />
            </div>
            <p className="text-3xl font-bold text-rose-600">
              {dashboardData?.latest_cycle ? 'In 12 days' : 'No data'}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {dashboardData?.latest_cycle?.start_date || 'Start logging your periods'}
            </p>
          </div>

          {/* Mood Today Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{t('how_feeling')}</h3>
              <Brain className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {dashboardData?.today_mood ? `${dashboardData.today_mood.score}/10` : 'Not logged'}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {dashboardData?.today_mood?.notes || 'How are you feeling today?'}
            </p>
          </div>

          {/* Calories Today Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{t('todays_calories')}</h3>
              <Utensils className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {Math.round(dashboardData?.today_calories || 0)} kcal
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Goal: 2000 kcal
            </p>
          </div>

          {/* Schemes Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{t('eligible_schemes')}</h3>
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData?.schemes_count || 0}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Available schemes
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-rose-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/cycles"
              className="flex flex-col items-center p-6 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors group"
            >
              <Calendar className="w-8 h-8 text-rose-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700">{t('log_period')}</span>
            </Link>

            <Link
              to="/mental"
              className="flex flex-col items-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
            >
              <Brain className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700">Log Mood</span>
            </Link>

            <Link
              to="/fitness"
              className="flex flex-col items-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <Utensils className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700">Log Meal</span>
            </Link>

            <Link
              to="/ai-chat"
              className="flex flex-col items-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <MessageCircle className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700">{t('ai_chat')}</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity & Schemes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Cycle History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-rose-500" />
              Recent Cycle History
            </h2>
            {dashboardData?.latest_cycle ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-rose-50 rounded-lg border border-rose-200">
                  <div>
                    <p className="font-medium text-gray-900">Last Period</p>
                    <p className="text-sm text-gray-600">
                      {new Date(dashboardData.latest_cycle.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {dashboardData.latest_cycle.flow_level}
                    </p>
                    <p className="text-xs text-gray-600">
                      Flow: {dashboardData.latest_cycle.cramp_score}/10
                    </p>
                  </div>
                </div>
                <Link
                  to="/cycles"
                  className="text-rose-600 text-sm font-medium hover:text-rose-700 flex items-center"
                >
                  View full history →
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mb-4 mx-auto" />
                <p className="text-gray-600 mb-4">No cycle data yet</p>
                <Link
                  to="/cycles"
                  className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors font-medium"
                >
                  Start Tracking
                </Link>
              </div>
            )}
          </div>

          {/* Profile Completion */}
          {!profile || !profile.age || !profile.state ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-rose-500" />
                Complete Your Profile
              </h2>
              <p className="text-gray-600 mb-6">
                Complete your profile to get personalized health insights and government scheme recommendations.
              </p>
              <Link
                to="/onboarding"
                className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors font-medium"
              >
                Complete Profile
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-rose-500" />
                Your Profile
              </h2>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="font-medium mr-2">Age:</span> {profile.age}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="font-medium mr-2">State:</span> {profile.state}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="font-medium mr-2">Language:</span> {profile.language}
                </p>
              </div>
              <Link
                to="/onboarding"
                className="text-rose-600 text-sm font-medium hover:text-rose-700 mt-6 inline-block flex items-center"
              >
                Edit Profile →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
