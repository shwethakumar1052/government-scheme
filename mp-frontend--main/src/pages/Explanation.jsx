import React from 'react'
import { motion } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, BrainCircuit, ShieldCheck, FileSearch, BadgeCheck, Scale } from 'lucide-react'

const Explanation = () => {
  const location = useLocation()
  const { scheme } = location.state || { 
    scheme: { name: "Sample Scheme", score: 92, category: "General" }
  }

  const criteria = [
    { label: "Demographic Match", status: "success", info: "Age and Gender profile aligns with program targets." },
    { label: "Socio-Economic Filter", status: "success", info: "Income level verified under threshold." },
    { label: "Regional Jurisdictions", status: "success", info: "Authorized for current residential state." },
    { label: "Semantic Probability", status: "success", info: "AI analysis of occupation context shows high relevance." }
  ]

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <Link to="/results" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-10 hover:text-gov-blue transition-colors group">
        <div className="p-1.5 rounded bg-gray-100 group-hover:bg-blue-50"><ArrowLeft className="w-3 h-3" /></div> Back to Recommendations
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Score & Core Reason */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 official-shadow text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gov-blue"></div>
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center mb-6">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <motion.circle 
                  cx="64" cy="64" r="58" fill="none" stroke="#003366" strokeWidth="8" 
                  strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * scheme.score) / 100}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="text-3xl font-black text-gov-deep">{scheme.score}%</div>
            </div>
            <h3 className="text-sm font-bold text-gov-deep uppercase tracking-[0.2em] mb-2">Confidence Score</h3>
            <p className="text-[10px] text-gray-400 font-medium">Verified by Neural Match Engine v4.0</p>
          </div>

          <div className="bg-gov-blue p-8 rounded-3xl text-white space-y-4 shadow-xl shadow-blue-900/10">
            <BadgeCheck className="w-8 h-8 text-india-saffron mb-2" />
            <h4 className="text-lg font-bold">Eligibility Logic</h4>
            <p className="text-xs text-blue-100/60 leading-relaxed font-medium">
              Our NLP engine identified semantic matches between your profile and the latest gazette notification. Multiple regional and economic filters confirm that your attributes align with the program's intended beneficiary group.
            </p>
          </div>
        </div>

        {/* Right Side: Detailed Breakdown */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl p-10 border border-gray-100 official-shadow">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <FileSearch className="w-6 h-6 text-gov-blue" />
                <h2 className="text-xl font-extrabold text-gov-deep tracking-tight">{scheme.name}</h2>
              </div>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-green-100">
                Verification: Successful
              </span>
            </div>

            <div className="space-y-6">
              {criteria.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50/50 border border-gray-100/50"
                >
                  <div className="mt-1 p-1 bg-white rounded-full shadow-sm"><CheckCircle2 className="w-4 h-4 text-india-green" /></div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-800 mb-1">{item.label}</h5>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.info}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-gov-blue" />
                <span className="text-xs font-bold text-gov-deep">Is this match inaccurate? Request Manual Review</span>
              </div>
              <button className="bg-white text-gov-blue border border-blue-200 px-4 py-2 rounded font-bold text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all">
                Submit Feedback
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button className="flex-1 bg-gov-blue text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/10 hover:brightness-110 transition-all">
              Initialize Application
            </button>
            <button className="flex-1 bg-white text-gov-blue border-2 border-gov-blue py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all">
              Download Scheme PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explanation
