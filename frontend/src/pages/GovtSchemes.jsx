import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'

export default function GovtSchemes() {
  const { t } = useTranslation()
  
  const [eligibleSchemes, setEligibleSchemes] = useState([])
  const [allSchemes, setAllSchemes] = useState([])
  const [activeTab, setActiveTab] = useState('eligible')
  const [loading, setLoading] = useState(true)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchSchemes()
  }, [])

  const fetchSchemes = async () => {
    try {
      const [eligibleResponse, allResponse] = await Promise.all([
        api.get('/schemes/eligible/'),
        api.get('/schemes/all/')
      ])
      setEligibleSchemes(eligibleResponse.data)
      setAllSchemes(allResponse.data)
    } catch (error) {
      console.error('Failed to fetch schemes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSchemes = (schemes) => {
    return schemes.filter(scheme =>
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getSchemeColor = (level) => {
    switch (level) {
      case 'central': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'state': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getBenefitColor = (amount) => {
    if (amount.includes('₹') && (amount.includes('Lakh') || amount.includes('100000'))) {
      return 'text-green-600'
    }
    if (amount.includes('₹')) {
      return 'text-blue-600'
    }
    return 'text-gray-600'
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
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-32 w-full"></div>
                  ))}
                </div>
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
          <h1 className="text-3xl font-bold text-gray-900">{t('schemes')}</h1>
          <p className="text-gray-600">Discover government schemes you're eligible for</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search schemes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('eligible')}
                    className={`py-2 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'eligible'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Eligible for You ({eligibleSchemes.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`py-2 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'all'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    All Schemes ({allSchemes.length})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'eligible' && (
                  <div className="space-y-4">
                    {filteredSchemes(eligibleSchemes).length > 0 ? (
                      filteredSchemes(eligibleSchemes).map((scheme, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{scheme.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{scheme.full_name}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSchemeColor(scheme.level)}`}>
                              {scheme.level}
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <p className={`text-lg font-bold ${getBenefitColor(scheme.benefit_amount)}`}>
                              {scheme.benefit_amount}
                            </p>
                            <p className="text-sm text-gray-600">{scheme.benefit_description}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {scheme.applicable_to?.map((item, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {item}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              {scheme.states?.length > 0 && `Available in: ${scheme.states.join(', ')}`}
                            </div>
                            <div className="space-x-2">
                              {scheme.apply_link && (
                                <a
                                  href={scheme.apply_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-light transition-colors"
                                >
                                  {t('apply_now')}
                                </a>
                              )}
                              <button
                                onClick={() => setSelectedScheme(scheme)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <span className="text-4xl mb-4 block">📋</span>
                        <p className="text-gray-600 mb-4">No eligible schemes found</p>
                        <p className="text-sm text-gray-500 mb-4">
                          Complete your profile to get better scheme recommendations
                        </p>
                        <button
                          onClick={() => setActiveTab('all')}
                          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-sm"
                        >
                          Browse All Schemes
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'all' && (
                  <div className="space-y-4">
                    {filteredSchemes(allSchemes).length > 0 ? (
                      filteredSchemes(allSchemes).map((scheme, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{scheme.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{scheme.full_name}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSchemeColor(scheme.level)}`}>
                              {scheme.level}
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <p className={`text-lg font-bold ${getBenefitColor(scheme.benefit_amount)}`}>
                              {scheme.benefit_amount}
                            </p>
                            <p className="text-sm text-gray-600">{scheme.benefit_description}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {scheme.applicable_to?.map((item, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {item}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              {scheme.states?.length > 0 && `Available in: ${scheme.states.join(', ')}`}
                            </div>
                            <div className="space-x-2">
                              {scheme.apply_link && (
                                <a
                                  href={scheme.apply_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-light transition-colors"
                                >
                                  {t('apply_now')}
                                </a>
                              )}
                              <button
                                onClick={() => setSelectedScheme(scheme)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No schemes found matching your search</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scheme Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheme Tips</h2>
              <div className="space-y-3">
                <div className="p-3 bg-primary-bg rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Complete profile:</strong> Fill your profile details for better scheme matching.
                  </p>
                </div>
                <div className="p-3 bg-teal-light rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Documents ready:</strong> Keep Aadhaar, PAN, and income proof ready.
                  </p>
                </div>
                <div className="p-3 bg-amber-light rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Apply early:</strong> Some schemes have limited slots or deadlines.
                  </p>
                </div>
              </div>
            </div>

            {/* Common Documents */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('documents_needed')}</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>Aadhaar Card</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>PAN Card</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>Bank Account Details</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>Income Certificate</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>Residence Proof</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>Passport Size Photos</span>
                </div>
              </div>
            </div>

            {/* Helpline Numbers */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('helpline')}</h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800 mb-1">National Helpline</p>
                  <p className="text-sm text-blue-700">1800-11-6263</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800 mb-1">Women Helpline</p>
                  <p className="text-sm text-green-700">181</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-800 mb-1">Child Development</p>
                  <p className="text-sm text-purple-700">1098</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{selectedScheme.name}</h2>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Full Name</h3>
                  <p className="text-gray-600">{selectedScheme.full_name}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{t('benefits')}</h3>
                  <p className={`text-lg font-bold ${getBenefitColor(selectedScheme.benefit_amount)}`}>
                    {selectedScheme.benefit_amount}
                  </p>
                  <p className="text-gray-600">{selectedScheme.benefit_description}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{t('eligibility')}</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedScheme.eligibility_rules, null, 2)}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Applicable To</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedScheme.applicable_to?.map((item, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Available States</h3>
                  <p className="text-gray-600">
                    {selectedScheme.states?.length > 0 ? selectedScheme.states.join(', ') : 'All India'}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  {selectedScheme.apply_link && (
                    <a
                      href={selectedScheme.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-light text-center"
                    >
                      {t('apply_now')}
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedScheme(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
