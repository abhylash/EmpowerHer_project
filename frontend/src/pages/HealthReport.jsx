import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function HealthReport() {
  
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGenerateForm, setShowGenerateForm] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports/')
      setReports(response.data)
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    try {
      await api.post('/reports/generate/', {})
      fetchReports()
      fetchReports()
    } catch (error) {
      console.error('Failed to generate report:', error)
    }
  }

  const downloadReport = async (reportId, pdfUrl) => {
    try {
      // Create a temporary link to download the PDF
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `health-report-${reportId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to download report:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready': return '✅'
      case 'processing': return '⚙️'
      case 'pending': return '⏳'
      case 'failed': return '❌'
      default: return '📄'
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
          <h1 className="text-3xl font-bold text-gray-900">Health Reports</h1>
          <p className="text-gray-600">Generate and download your comprehensive medical reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generate Report */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Generate New Report</h2>
                <button
                  onClick={generateReport}
                  className="bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600"
                >
                  Generate Report
                </button>
              </div>
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Health Reports</h2>
              
              {reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">📊</span>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                Comprehensive Medical Report
                              </h3>
                              <p className="text-sm text-gray-600">
                                Generated: {report.generated_at ? 
                                  new Date(report.generated_at).toLocaleDateString() : 
                                  'Not generated yet'
                                }
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                              {getStatusIcon(report.status)} {report.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {report.status === 'ready' && report.pdf_url && (
                            <button
                              onClick={() => downloadReport(report.id, report.pdf_url)}
                              className="inline-flex items-center px-3 py-1 bg-rose-500 text-white text-sm rounded hover:bg-rose-600 transition-colors"
                            >
                              Download
                            </button>
                          )}
                          {report.status === 'processing' && (
                            <span className="text-sm text-blue-600">
                              Processing...
                            </span>
                          )}
                          {report.status === 'failed' && (
                            <span className="text-sm text-red-600">
                              Failed to generate
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📊</span>
                  <p className="text-gray-600 mb-4">No health reports yet</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Generate your first comprehensive medical report to track your overall progress
                  </p>
                  <button
                    onClick={generateReport}
                    className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 text-sm"
                  >
                    Generate Your First Report
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Features</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cycle Analysis</p>
                    <p className="text-xs text-gray-600">Track your menstrual patterns</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mood Trends</p>
                    <p className="text-xs text-gray-600">Understand emotional patterns</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nutrition Summary</p>
                    <p className="text-xs text-gray-600">Calorie and nutrient tracking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">AI Insights</p>
                    <p className="text-xs text-gray-600">Personalized health recommendations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Scheme Suggestions</p>
                    <p className="text-xs text-gray-600">Relevant government schemes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Tips</h2>
              <div className="space-y-3">
                <div className="p-3 bg-rose-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Consistent tracking:</strong> Log your health data regularly for comprehensive reports.
                  </p>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Regular review:</strong> Generate reports regularly to track overall progress.
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Share with doctor:</strong> Use reports for better healthcare consultations.
                  </p>
                </div>
              </div>
            </div>

            {/* Sample Report Preview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sample Report</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <span className="text-4xl mb-2 block">📄</span>
                <p className="text-sm text-gray-600 mb-2">Comprehensive Medical Report</p>
                <p className="text-xs text-gray-500">
                  Includes cycles, mood, nutrition, and AI insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
