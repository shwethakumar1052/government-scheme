import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Landmark, ArrowRight, ExternalLink, Languages, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SchemeSearch = () => {
    const { i18n } = useTranslation();
    const [type, setType] = useState('karnataka');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [translating, setTranslating] = useState(false);

    // Dynamic colors based on type
    const getThemeColor = () => {
        if (type === 'karnataka') return 'blue';
        if (type === 'central') return 'orange';
        return 'purple'; // For Women
    };

    const themeColor = getThemeColor();

    const translateResults = async (data, lang) => {
        if (lang === 'en' || !Array.isArray(data)) return data || [];
        setTranslating(true);
        try {
            const translated = await Promise.all(data.map(async (s) => {
                const titleRes = await axios.post('http://localhost:5001/api/translate', { text: s.scheme_name, targetLang: lang });
                const descRes = await axios.post('http://localhost:5001/api/translate', { text: s.summary, targetLang: lang });
                return {
                    ...s,
                    scheme_name: titleRes.data.translatedText,
                    summary: descRes.data.translatedText
                };
            }));
            return translated;
        } catch (err) {
            console.error('Translation failed:', err);
            return data;
        } finally {
            setTranslating(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5001/api/search-categorized?type=${type}&query=${query}`);
            const translatedData = await translateResults(response.data, i18n.language);
            setResults(translatedData);
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [type, i18n.language]);

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-4xl font-bold text-slate-900 mb-4`}
                    >
                        Explore Government Schemes
                    </motion.h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Search and discover schemes specifically tailored for Karnataka, Central Government, or Women Empowerment.
                    </p>
                </div>

                {/* Search & Toggle Section */}
                <div className={`bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 mb-12 border-t-4 ${
                    themeColor === 'blue' ? 'border-blue-500' : 
                    themeColor === 'orange' ? 'border-orange-500' : 'border-purple-500'
                }`}>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Type Toggle */}
                        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                            <button
                                onClick={() => setType('karnataka')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    type === 'karnataka' 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    Karnataka
                                </div>
                            </button>
                            <button
                                onClick={() => setType('central')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    type === 'central' 
                                    ? 'bg-white text-orange-600 shadow-sm' 
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Landmark size={16} />
                                    Central
                                </div>
                            </button>
                            <button
                                onClick={() => setType('women')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    type === 'women' 
                                    ? 'bg-white text-purple-600 shadow-sm' 
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Heart size={16} />
                                    Women
                                </div>
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder={`Search for ${type} schemes...`}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 transition-all`}
                            />
                        </div>
                        
                        <button
                            onClick={handleSearch}
                            className={`bg-${themeColor}-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-${themeColor}-700 transition-all shadow-lg shadow-${themeColor}-200`}
                        >
                            Search
                        </button>
                    </div>
                    {translating && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className={`mt-4 flex items-center gap-2 text-${themeColor}-600 text-sm font-medium`}
                        >
                            <Languages size={16} className="animate-bounce" />
                            Translating results into {i18n.language === 'kn' ? 'Kannada' : 'Hindi'}...
                        </motion.div>
                    )}
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [1,2,3].map(i => (
                            <div key={i} className="bg-white p-6 rounded-2xl h-64 animate-pulse border border-slate-100" />
                        ))
                    ) : (
                        <AnimatePresence>
                            {results.map((scheme, idx) => (
                                <motion.div
                                    key={scheme.id || idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`bg-white p-6 rounded-2xl border border-slate-100 transition-all group ${
                                        themeColor === 'blue' ? 'hover:border-blue-200' :
                                        themeColor === 'orange' ? 'hover:border-orange-200' : 'hover:border-purple-200'
                                    } hover:shadow-xl`}
                                >
                                    <div className="mb-4">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${
                                            scheme.is_central ? 'bg-orange-50 text-orange-600' : 
                                            scheme.schemeCategory === 'Women Empowerment' ? 'bg-purple-50 text-purple-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                            {scheme.is_central ? 'Central Govt' : 'State Scheme'}
                                        </span>
                                    </div>
                                    <h3 className={`text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-${themeColor}-600 transition-colors`}>
                                        {scheme.scheme_name}
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                                        {scheme.summary}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <button className={`text-${themeColor}-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all`}>
                                            Details <ArrowRight size={16} />
                                        </button>
                                        {scheme.url && (
                                            <a href={scheme.url} target="_blank" rel="noreferrer" className={`text-slate-400 hover:text-${themeColor}-600`}>
                                                <ExternalLink size={18} />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {!loading && results.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">No schemes found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchemeSearch;
