import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

export default function FoodLogger() {
  const [activeTab, setActiveTab] = useState('search')
  const [meals, setMeals] = useState([])
  const [nutritionSummary, setNutritionSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [mealForm, setMealForm] = useState({ meal_type: 'breakfast', food_items: [], total_calories: 0 })

  // Photo Detection
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [detectedFoods, setDetectedFoods] = useState([])
  const [photoError, setPhotoError] = useState('')
  const fileInputRef = useRef(null)

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
    { name: 'Apple', calories: 52, protein: 0.3, carb: 14, fat: 0.2 },
    { name: 'Idli (2 pcs)', calories: 138, protein: 4, carb: 28, fat: 0.4 },
    { name: 'Dosa', calories: 168, protein: 4, carb: 30, fat: 3.7 },
    { name: 'Poha', calories: 180, protein: 3.5, carb: 36, fat: 2.5 },
    { name: 'Upma', calories: 170, protein: 4.5, carb: 30, fat: 4 },
    { name: 'Paneer (100g)', calories: 265, protein: 18, carb: 1.2, fat: 20 },
    { name: 'Egg (boiled)', calories: 78, protein: 6, carb: 0.6, fat: 5 },
    { name: 'Chicken Curry (100g)', calories: 190, protein: 18, carb: 5, fat: 10 },
    { name: 'Fish Curry (100g)', calories: 150, protein: 20, carb: 3, fat: 6 },
    { name: 'Moong Dal', calories: 105, protein: 7, carb: 18, fat: 0.4 },
    { name: 'Rajma', calories: 127, protein: 8.7, carb: 22, fat: 0.5 },
    { name: 'Chana (chickpeas)', calories: 164, protein: 8.9, carb: 27, fat: 2.6 },
    { name: 'Milk (1 glass)', calories: 149, protein: 8, carb: 12, fat: 8 },
    { name: 'Sprouts', calories: 30, protein: 2.5, carb: 5, fat: 0.2 },
    { name: 'Chapati (1 pc)', calories: 104, protein: 3.1, carb: 21, fat: 0.4 },
    { name: 'Puri (1 pc)', calories: 130, protein: 2.5, carb: 18, fat: 5.5 },
    { name: 'Bhindi Masala', calories: 70, protein: 2, carb: 10, fat: 2.8 },
    { name: 'Aloo Sabji', calories: 110, protein: 2.1, carb: 21, fat: 2.5 },
    { name: 'Palak Paneer', calories: 180, protein: 10, carb: 8, fat: 12 },
    { name: 'Biryani (1 cup)', calories: 290, protein: 10, carb: 45, fat: 8 },
    { name: 'Orange', calories: 47, protein: 0.9, carb: 12, fat: 0.1 },
    { name: 'Mango (1 cup)', calories: 107, protein: 0.8, carb: 25, fat: 0.4 },
    { name: 'Watermelon (1 cup)', calories: 46, protein: 0.9, carb: 11, fat: 0.2 },
    { name: 'Groundnuts (30g)', calories: 170, protein: 7.6, carb: 5, fat: 14 },
    { name: 'Ghee (1 tsp)', calories: 45, protein: 0, carb: 0, fat: 5 },
    { name: 'Coconut Chutney', calories: 80, protein: 1.5, carb: 5, fat: 6 },
  ]

  useEffect(() => { fetchTodayData() }, [])

  const fetchTodayData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const [mealsRes, summaryRes] = await Promise.all([
        api.get(`/fitness/meals/?date=${today}`),
        api.get('/fitness/summary/')
      ])
      setMeals(mealsRes.data)
      setNutritionSummary(summaryRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addToMealLog = (food) => {
    setMealForm(prev => ({
      ...prev,
      food_items: [...prev.food_items, food],
      total_calories: prev.total_calories + food.calories
    }))
  }

  const removeFromMealLog = (index) => {
    setMealForm(prev => {
      const removed = prev.food_items[index]
      return {
        ...prev,
        food_items: prev.food_items.filter((_, i) => i !== index),
        total_calories: prev.total_calories - removed.calories
      }
    })
  }

  const submitMeal = async () => {
    try {
      await api.post('/fitness/meals/', { ...mealForm, date: new Date().toISOString().split('T')[0] })
      setMealForm({ meal_type: 'breakfast', food_items: [], total_calories: 0 })
      fetchTodayData()
    } catch (err) {
      console.error(err)
    }
  }

  // ── OPENROUTER PHOTO DETECTION ──
  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setDetectedFoods([])
    setPhotoError('')
    setSelectedImage(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onloadend = () => setImageBase64(reader.result.split(',')[1])
    reader.readAsDataURL(file)
  }

  const analyzeWithOpenRouter = async () => {
    if (!imageBase64) return
    setAnalyzing(true)
    setPhotoError('')
    setDetectedFoods([])
    const prompt = `You are a professional dietitian. Analyze this food image and identify all visible food items.
Return ONLY a valid JSON array — no markdown, no explanation, no code blocks. Format:
[{"name":"Food Name","calories":100,"protein":5,"carb":15,"fat":2}]
Each field: name (string), calories (number kcal), protein (grams), carb (grams), fat (grams). Be accurate for Indian foods.`
    
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3001',
          'X-Title': 'EmpowerHer'
        },
        body: JSON.stringify({
          model: "google/gemma-4-31b-it:free", // Verified free vision model
          models: ["google/gemma-4-31b-it:free", "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", "openrouter/free"], // Reliable free fallbacks
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ]
        })
      })
      
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      
      let text = data.choices?.[0]?.message?.content || ''
      // Extract JSON if it's wrapped in markdown
      text = text.replace(/```json|```/g, '').trim()
      setDetectedFoods(JSON.parse(text))
    } catch (err) {
      setPhotoError('Could not analyze the image. Make sure it shows food clearly and try again.')
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  const photoTotals = detectedFoods.reduce(
    (a, f) => ({ cal: a.cal + (f.calories||0), p: a.p + (f.protein||0), c: a.c + (f.carb||0), fat: a.fat + (f.fat||0) }),
    { cal: 0, p: 0, c: 0, fat: 0 }
  )

  const filteredFoods = foodDatabase.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-rose-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fitness & Nutrition</h1>
          <p className="text-gray-600 text-lg">Track your nutrition and maintain a healthy diet</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Tab Panel */}
            <div className="bg-white rounded-xl shadow-lg border border-rose-100">
              {/* Tab Buttons */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'search' ? 'border-b-2 border-rose-500 text-rose-600 bg-rose-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  🍽️ Search Food
                </button>
                <button
                  onClick={() => setActiveTab('photo')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'photo' ? 'border-b-2 border-rose-500 text-rose-600 bg-rose-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  📸 AI Photo Detection
                </button>
              </div>

              <div className="p-6">
                {/* ── SEARCH TAB ── */}
                {activeTab === 'search' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Search for food items (e.g. Rice, Dal, Paneer...)"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1">
                      {filteredFoods.map((food, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium text-gray-900">{food.name}</h3>
                            <span className="text-sm font-semibold text-rose-600">{food.calories} kcal</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">
                            <span className="text-teal-600 font-medium">P: {food.protein}g</span>
                            {' · '}
                            <span className="text-amber-600 font-medium">C: {food.carb}g</span>
                            {' · '}
                            <span className="text-purple-600 font-medium">F: {food.fat}g</span>
                          </p>
                          <button
                            onClick={() => addToMealLog(food)}
                            className="w-full bg-primary text-white py-1.5 rounded text-sm hover:bg-primary-light transition-colors"
                          >
                            + Add to Log
                          </button>
                        </div>
                      ))}
                      {filteredFoods.length === 0 && (
                        <div className="col-span-2 text-center py-8 text-gray-400">
                          <span className="text-3xl block mb-2">🔍</span>
                          No results for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── PHOTO DETECTION TAB ── */}
                {activeTab === 'photo' && (
                  <div className="space-y-6">
                    <p className="text-sm text-gray-500">Upload a photo of your meal and AI will detect food items and estimate their nutrition.</p>

                    {/* Upload Area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-rose-300 rounded-xl p-6 text-center cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition-all"
                    >
                      {selectedImage ? (
                        <img src={selectedImage} alt="Selected food" className="max-h-56 mx-auto rounded-lg object-contain" />
                      ) : (
                        <div>
                          <span className="text-5xl block mb-3">📷</span>
                          <p className="text-gray-600 font-medium">Click to upload food photo</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                    </div>

                    {/* Action Buttons */}
                    {selectedImage && (
                      <div className="flex gap-3">
                        <button
                          onClick={analyzeWithOpenRouter}
                          disabled={analyzing}
                          className="flex-1 bg-rose-500 text-white py-2.5 rounded-lg font-medium hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          {analyzing ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                              </svg>
                              Analyzing with AI...
                            </span>
                          ) : '🔍 Detect Food & Get Nutrition'}
                        </button>
                        <button
                          onClick={() => { setSelectedImage(null); setImageBase64(null); setDetectedFoods([]); setPhotoError('') }}
                          className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    )}

                    {/* Error */}
                    {photoError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        ⚠️ {photoError}
                      </div>
                    )}

                    {/* Results */}
                    {detectedFoods.length > 0 && (
                      <div className="space-y-4">
                        {/* Nutrition Summary Banner */}
                        <div className="bg-gradient-to-r from-rose-500 to-purple-600 rounded-xl p-5 text-white">
                          <h3 className="font-semibold text-lg mb-3">📊 Total Nutrition Summary</h3>
                          <div className="grid grid-cols-4 gap-3 text-center">
                            <div className="bg-white/20 rounded-lg p-3">
                              <p className="text-2xl font-bold">{Math.round(photoTotals.cal)}</p>
                              <p className="text-xs opacity-80">Calories (kcal)</p>
                            </div>
                            <div className="bg-white/20 rounded-lg p-3">
                              <p className="text-2xl font-bold">{photoTotals.p.toFixed(1)}g</p>
                              <p className="text-xs opacity-80">Protein</p>
                            </div>
                            <div className="bg-white/20 rounded-lg p-3">
                              <p className="text-2xl font-bold">{photoTotals.c.toFixed(1)}g</p>
                              <p className="text-xs opacity-80">Carbs</p>
                            </div>
                            <div className="bg-white/20 rounded-lg p-3">
                              <p className="text-2xl font-bold">{photoTotals.fat.toFixed(1)}g</p>
                              <p className="text-xs opacity-80">Fat</p>
                            </div>
                          </div>
                        </div>

                        {/* Individual Detected Items */}
                        <h4 className="font-semibold text-gray-800">Detected Food Items ({detectedFoods.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {detectedFoods.map((item, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-1">
                                <h5 className="font-medium text-gray-900">{item.name}</h5>
                                <span className="text-sm font-bold text-rose-600">{item.calories} kcal</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-3">
                                <span className="text-teal-600 font-medium">P: {item.protein}g</span>
                                {' · '}
                                <span className="text-amber-600 font-medium">C: {item.carb}g</span>
                                {' · '}
                                <span className="text-purple-600 font-medium">F: {item.fat}g</span>
                              </p>
                              <button
                                onClick={() => addToMealLog(item)}
                                className="w-full bg-rose-500 text-white py-1.5 rounded text-sm hover:bg-rose-600 transition-colors"
                              >
                                + Add to Log
                              </button>
                            </div>
                          ))}
                        </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                  <select
                    value={mealForm.meal_type}
                    onChange={e => setMealForm(prev => ({ ...prev, meal_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div className="space-y-2 mb-4">
                  {mealForm.food_items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.calories} kcal · P:{item.protein}g · C:{item.carb}g · F:{item.fat}g
                        </p>
                      </div>
                      <button onClick={() => removeFromMealLog(i)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total Calories:</span>
                    <span className="text-xl font-bold text-rose-500">{mealForm.total_calories} kcal</span>
                  </div>
                  <button onClick={submitMeal} className="w-full bg-rose-500 text-white py-2 rounded-md hover:bg-rose-600 transition-colors">
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
                  {meals.map((meal, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{meal.meal_type}</p>
                        <p className="text-sm text-gray-600">{meal.food_items?.length || 0} items • {meal.total_calories} kcal</p>
                      </div>
                      <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded">{meal.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {nutritionSummary && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Summary</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Calories', value: nutritionSummary.calories, max: 2000, unit: 'kcal', color: 'bg-rose-500' },
                    { label: 'Protein', value: nutritionSummary.protein, max: 50, unit: 'g', color: 'bg-teal-500' },
                    { label: 'Carbs', value: nutritionSummary.carbs, max: 250, unit: 'g', color: 'bg-amber-500' },
                    { label: 'Fat', value: nutritionSummary.fat, max: 65, unit: 'g', color: 'bg-purple-500' },
                  ].map(({ label, value, max, unit, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{label}</span>
                        <span>{Math.round(value)}/{max} {unit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Tips</h2>
              <div className="space-y-3">
                <div className="p-3 bg-rose-50 rounded-lg"><p className="text-sm text-gray-700"><strong>Balanced diet:</strong> Include all food groups for complete nutrition.</p></div>
                <div className="p-3 bg-teal-50 rounded-lg"><p className="text-sm text-gray-700"><strong>Hydration:</strong> Drink at least 8 glasses of water daily.</p></div>
                <div className="p-3 bg-amber-50 rounded-lg"><p className="text-sm text-gray-700"><strong>Portion control:</strong> Use smaller plates and eat slowly.</p></div>
                <div className="p-3 bg-purple-50 rounded-lg"><p className="text-sm text-gray-700"><strong>Iron-rich foods:</strong> Include spinach, dal, and rajma to prevent anemia.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
