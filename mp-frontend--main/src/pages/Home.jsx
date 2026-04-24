import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Search, ShieldCheck, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-16 pb-20"
    >
      {/* Professional Hero Section */}
      <section className="relative pt-10 pb-16 border-b border-gray-100">
        <div className="absolute top-0 left-0 w-full h-full gov-pattern -z-10 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-gov-blue px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="w-3 h-3" />
            <span>{t('home.tagline')}</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-extrabold text-gov-deep mb-6 leading-[1.15] tracking-tight">
            Matching You with the Right <br className="hidden md:block"/> 
            <span className="text-gov-blue">Government Schemes</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto font-medium">
            {t('home.hero_subtitle')}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/form" className="btn-primary flex items-center gap-2 text-sm shadow-xl shadow-blue-900/10">
              {t('home.cta')} <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="px-6 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 font-bold text-sm hover:border-gov-blue hover:text-gov-blue transition-all">
              {t('home.how_it_works')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Official Service Grid */}
      <section className="max-w-6xl mx-auto w-full px-4">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-xl font-bold text-gov-deep uppercase tracking-widest border-b-2 border-gov-blue inline-block pb-2 mb-4">Core AI Capabilities</h2>
          <p className="text-gray-400 text-sm">Empowering citizens through intelligent automation.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              icon: <Search className="w-6 h-6 text-gov-blue" />, 
              title: "Smart Eligibility Search", 
              desc: "Deep analysis across 500+ center and state welfare programs using semantic NLP." 
            },
            { 
              icon: <Bot className="w-6 h-6 text-gov-blue" />, 
              title: "AI Analysis Engine", 
              desc: "Advanced logic models that understand complex criteria rules for precise matching scores." 
            },
            { 
              icon: <ShieldCheck className="w-6 h-6 text-gov-blue" />, 
              title: "Verified Sources", 
              desc: "Schemes are synchronized directly with official government gazettes and ministry portals." 
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-100 p-8 rounded-xl official-shadow transition-all"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 border border-blue-100">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-3 text-gov-deep">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Portal Notification Bar */}
      <motion.div 
        variants={itemVariants}
        className="max-w-6xl mx-auto w-full px-4"
      >
        <div className="bg-gov-deep p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div>
            <div className="text-xl font-bold mb-1 underline decoration-india-saffron decoration-4 underline-offset-4">New Integration</div>
            <p className="text-blue-200 text-sm opacity-80">We have integrated state-level student scholarships from 15 new states.</p>
          </div>
          <button className="bg-white text-gov-deep px-6 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-india-saffron hover:text-white transition-all">
            Read Gazette
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Home
