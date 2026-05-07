import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function FoodLogger() {
  
  const [activeTab, setActiveTab] = useState('search')
  const [meals, setMeals] = useState([])
  const [nutritionSummary, setNutritionSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [mealForm, setMealForm] = useState({
    meal_type: 'breakfast',
    food_items: [],
    total_calories: 0
  })

  const foodDatabase = [
    { name: 'Rice', calories: 130, protein: 2.7, carb: 28, fat: 0.3 },
    { name: 'Roti', calories: 104, protein: 3.1, carb: 21, fat: 0.4 },
    { name: 'Dal', calories: 116, protein: 8, carb: 20, fat: 0.4 },
    { name: 'Vegetable Curry', calories: 85, protein: 2.5, carb: 12, fat: 3.2 },
    { name: 'Sambar', calories: 95, protein: 3.5, carb: 15, fat: 2.8 },
    { name: 'Curd', calories: 61, protein: 3.5, carb: 4.7, fat: 3.3 },
    { name: 'Salad', calories: 25, protein: 1.3, carb: 5, fat: 0.2 },
    { name: 'Buttermilk', calories: 40, protein: 1.5, carb: 5, fat: 1.5 },
    { name: 'Banana', calories: 89, protein: 1.1, carb: 23, fat: 0.3 },
    { name: 'Apple', calories: 52, protein: 0.3, carb: 14, fat: 0.2 }
  ]

  useEffect(() => {
    fetchTodayData()
  }, [])

  const fetchTodayData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const [mealsResponse, summaryResponse] = await Promise.all([
        api.get(`/fitness/meals/?date=${today}`),
        api.get('/fitness/summary/')
      ])
      setMeals(mealsResponse.data)
      setNutritionSummary(summaryResponse.data)
    } catch (error) {
      console.error('Failed to fetch today\'s data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return
    
    setAnalyzing(true)
    try {
      const response = await api.post('/fitness/meals/analyse-photo/', {
        image: selectedImage
      })
      setAnalysisResult(response.data.analysis)
    } catch (error) {
      console.error('Failed to analyze image:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const addToMealLog = (foodItem) => {
    setMealForm(prev => ({
      ...prev,
      food_items: [...prev.food_items, foodItem],
      total_calories: prev.total_calories + foodItem.calories
    }))
  }

  const removeFromMealLog = (index) => {
    setMealForm(prev => {
      const newItems = prev.food_items.filter((_, i) => i !== index)
      const removedItem = prev.food_items[index]
      return {
        ...prev,
        food_items: newItems,
        total_calories: prev.total_calories - removedItem.calories
      }
    })
  }

  const submitMeal = async () => {
    try {
      await api.post('/fitness/meals/', {
        ...mealForm,
        date: new Date().toISOString().split('T')[0]
      })
      setMealForm({
        meal_type: 'breakfast',
        food_items: [],
        total_calories: 0
      })
      fetchTodayData()
    } catch (error) {
      console.error('Failed to log meal:', error)
    }
  }

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
    <div className="bg-gradient-to-br from-rose-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fitness & Nutrition</h1>
          <p className="text-gray-600 text-lg">Track your nutrition and maintain a healthy diet</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg border border-rose-100">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('search')}
                    className={`py-3 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'search'
                        ? 'border-rose-500 text-rose-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    🍽️ Search Food
                  </button>
                  <button
                    onClick={() => setActiveTab('photo')}
                    className={`py-3 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'photo'
                        ? 'border-rose-500 text-rose-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Photo Detection
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'search' && (
                  <div className="space-y-6">
                    {/* Search */}
                    <div>
                      <input
                        type="text"
                        placeholder="Search for food items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    {/* Food Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredFoods.map((food, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900">{food.name}</h3>
                            <span className="text-sm text-gray-600">{food.calories} kcal</span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>Protein: {food.protein}g | Carbs: {food.carb}g | Fat: {food.fat}g</p>
                          </div>
                          <button
                            onClick={() => addToMealLog(food)}
                            className="mt-3 w-full bg-primary text-white py-1 px-3 rounded text-sm hover:bg-primary-light transition-colors"
                          >
                            Add to Log
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'photo' && (
                  <div className="space-y-6">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Food Photo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {selectedImage ? (
                          <div className="space-y-4">
                            <img 
                              src={selectedImage} 
                              alt="Food" 
                              className="max-h-48 mx-auto rounded-lg"
                            />
                            <div className="space-x-3">
                              <button
                                onClick={analyzeImage}
                                disabled={analyzing}
                                className="bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {analyzing ? 'Analyzing...' : 'Analyze Food'}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedImage(null)
                                  setAnalysisResult(null)
                                }}
                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="file-upload"
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Choose Image
                            </label>
                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Analysis Results */}
                    {analysisResult && (
                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">Analysis Results</h3>
                        {analysisResult.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{item.dish}</h4>
                              <span className="text-sm text-gray-600">{item.calories_kcal} kcal</span>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>Protein: {item.protein_g}g | Carbs: {item.carb_g}g | Fat: {item.fat_g}g</p>
                            </div>
                            <button
                              onClick={() => addToMealLog({
                                name: item.dish,
                                calories: item.calories_kcal,
                                protein: item.protein_g,
                                carb: item.carb_g,
                                fat: item.fat_g
                              })}
                              className="mt-3 w-full bg-rose-500 text-white py-1 px-3 rounded text-sm hover:bg-rose-600 transition-colors"
                            >
                              Add to Log
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Current Meal Log */}
            {mealForm.food_items.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Meal Log</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meal Type
                  </label>
                  <select
                    value={mealForm.meal_type}
                    onChange={(e) => setMealForm(prev => ({ ...prev, meal_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div className="space-y-2 mb-4">
                  {mealForm.food_items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.calories} kcal</p>
                      </div>
                      <button
                        onClick={() => removeFromMealLog(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total Calories:</span>
                    <span className="text-xl font-bold text-rose-500">{mealForm.total_calories} kcal</span>
                  </div>
                  <button
                    onClick={submitMeal}
                    className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 transition-colors"
                  >
                    Log Meal
                  </button>
                </div>
              </div>
            )}

            {/* Today's Meals */}
            {meals.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Meals</h2>
                <div className="space-y-3">
                  {meals.map((meal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{meal.meal_type}</p>
                        <p className="text-sm text-gray-600">
                          {meal.food_items?.length || 0} items • {meal.total_calories} kcal
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 capitalize">{meal.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutrition Summary */}
            {nutritionSummary && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Summary</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Calories</span>
                      <span>{Math.round(nutritionSummary.calories)}/2000 kcal</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-rose-500 h-2 rounded-full"
                        style={{ width: `${Math.min((nutritionSummary.calories / 2000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Protein</span>
                      <span>{Math.round(nutritionSummary.protein)}/50g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-500 h-2 rounded-full"
                        style={{ width: `${Math.min((nutritionSummary.protein / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Carbs</span>
                      <span>{Math.round(nutritionSummary.carbs)}/250g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${Math.min((nutritionSummary.carbs / 250) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fat</span>
                      <span>{Math.round(nutritionSummary.fat)}/65g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${Math.min((nutritionSummary.fat / 65) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nutrition Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Tips</h2>
              <div className="space-y-3">
                <div className="p-3 bg-rose-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Balanced diet:</strong> Include all food groups for complete nutrition.
                  </p>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Hydration:</strong> Drink at least 8 glasses of water daily.
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Portion control:</strong> Use smaller plates and eat slowly.
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
