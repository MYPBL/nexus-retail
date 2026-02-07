import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const priceData = [
  { day: 'Day 1', myPrice: 45, competitorPrice: 50 },
  { day: 'Day 2', myPrice: 46, competitorPrice: 49 },
  { day: 'Day 3', myPrice: 47, competitorPrice: 48 },
  { day: 'Day 4', myPrice: 48, competitorPrice: 47 },
  { day: 'Day 5', myPrice: 49, competitorPrice: 46 },
  { day: 'Day 6', myPrice: 50, competitorPrice: 45 },
  { day: 'Day 7', myPrice: 51, competitorPrice: 44 },
]

function Dashboard() {
  const [strategy, setStrategy] = useState('')
  const [loading, setLoading] = useState(false)

  const getAIStrategy = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          competitor_price: 44,
          my_price: 51,
          market_trend: 'increasing demand, competitor lowering prices'
        })
      })
      const data = await response.json()
      setStrategy(data.advice)
    } catch (error) {
      setStrategy('Error: Could not fetch strategy. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">NexusRetail Dashboard</h1>
        
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">Price Trends (7 Days)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="myPrice" stroke="#3b82f6" strokeWidth={3} name="My Price" />
              <Line type="monotone" dataKey="competitorPrice" stroke="#ef4444" strokeWidth={3} name="Competitor Price" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-xl p-8 border border-blue-100">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            AI Strategic Advice
          </h2>
          <button
            onClick={getAIStrategy}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg mb-6 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? '🔄 Analyzing...' : '✨ Get AI Strategy'}
          </button>
          
          <div className="bg-white rounded-xl shadow-inner p-6 border-2 border-blue-200">
            <textarea
              value={strategy}
              readOnly
              placeholder="💡 Click the button above to receive AI-powered strategic insights tailored to your market position..."
              className="w-full h-48 p-4 bg-transparent resize-none focus:outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
