import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/useAuthStore'
import api from '../api/axios'

export default function Onboarding() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const profile = useAuthStore((state) => state.profile)
  const setProfile = useAuthStore((state) => state.setProfile)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    age: profile?.age || '',
    state: profile?.state || '',
    language: profile?.language || 'en',
    health_conditions: profile?.health_conditions || [],
    is_pregnant: profile?.is_pregnant || false,
    income_category: profile?.income_category || '',
    occupation: profile?.occupation || '',
    phone: profile?.phone || ''
  })

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Lakshadweep',
    'Puducherry'
  ]

  const healthConditions = ['PCOD', 'Irregular Periods', 'Thyroid', 'Diabetes', 'Hypertension', 'Anemia']

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleHealthConditionToggle = (condition) => {
    setFormData(prev => ({
      ...prev,
      health_conditions: prev.health_conditions.includes(condition)
        ? prev.health_conditions.filter(c => c !== condition)
        : [...prev.health_conditions, condition]
    }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.patch('/auth/profile/update/', formData)
      const profileResponse = await api.get('/auth/profile/')
      setProfile(profileResponse.data)
      navigate('/')
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('age')}
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your age"
                    min="15"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('state')}
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select your state</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('language')}
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="kn">ಕನ್ನಡ</option>
                    <option value="ta">தமிழ்</option>
                    <option value="te">తెలుగు</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Health Conditions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select any health conditions you have (optional)
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {healthConditions.map(condition => (
                  <label
                    key={condition}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.health_conditions.includes(condition)}
                      onChange={() => handleHealthConditionToggle(condition)}
                      className="mr-3 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{condition}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_pregnant"
                    checked={formData.is_pregnant}
                    onChange={handleInputChange}
                    className="mr-3 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Currently Pregnant</span>
                </label>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Income & Occupation</h3>
              <p className="text-sm text-gray-600 mb-4">
                This helps us find relevant government schemes for you
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('income_category')}
                  </label>
                  <select
                    name="income_category"
                    value={formData.income_category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select income category</option>
                    <option value="bpl">BPL (Below Poverty Line)</option>
                    <option value="low">Low Income</option>
                    <option value="mid">Middle Income</option>
                    <option value="high">High Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('occupation')}
                  </label>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select occupation</option>
                    <option value="labour">Daily Wage Labour</option>
                    <option value="farmer">Farmer</option>
                    <option value="private">Private Sector</option>
                    <option value="govt">Government Employee</option>
                    <option value="self">Self Employed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('phone')} (optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Information</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Age:</span>
                  <span className="text-sm">{formData.age || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">State:</span>
                  <span className="text-sm">{formData.state || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Language:</span>
                  <span className="text-sm">{formData.language || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Health Conditions:</span>
                  <span className="text-sm">
                    {formData.health_conditions.length > 0 
                      ? formData.health_conditions.join(', ')
                      : 'None'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Pregnant:</span>
                  <span className="text-sm">{formData.is_pregnant ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Income Category:</span>
                  <span className="text-sm">{formData.income_category || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Occupation:</span>
                  <span className="text-sm">{formData.occupation || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Phone:</span>
                  <span className="text-sm">{formData.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="bg-primary-bg border-l-4 border-primary p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Great!</strong> Your profile will help us provide personalized health insights and find relevant government schemes for you.
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-gradient-to-br from-rose-50 via-white to-purple-50 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
              <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="px-6 py-8">
            {renderStep()}
          </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('previous')}
              </button>

              {currentStep === 4 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('loading')}...
                    </span>
                  ) : (
                    t('finish')
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
                >
                  {t('next')}
                </button>
              )}
            </div>
        </div>
      </div>
  )
}
