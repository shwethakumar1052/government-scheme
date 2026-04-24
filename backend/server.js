const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Translation Cache
const translationCache = new Map();

// ─── Load Enhanced Schemes ───────────────────────────────────────────────────
// ─── START OF NLP ENHANCED DATA LOADING ──────────────────────────────────────
const schemesPath = path.join(__dirname, 'schemes_enhanced.json');
let schemes = [];
try {
  const data = fs.readFileSync(schemesPath, 'utf8');
  schemes = JSON.parse(data);
  console.log(`Loaded ${schemes.length} enhanced schemes.`);
} catch (err) {
  console.error('Error loading schemes_enhanced.json:', err.message);
  try {
    schemes = JSON.parse(fs.readFileSync(path.join(__dirname, 'schemes.json'), 'utf8'));
  } catch (e) { console.error('Total failure to load data'); }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const norm = (s) => (s || '').toString().toLowerCase().trim();

function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(norm);
  return [norm(val)];
}

function truncate(str, maxLen) {
  if (!str) return '';
  const s = str.toString();
  return s.length > maxLen ? s.substring(0, maxLen - 3) + '...' : s;
}

// ─── Occupation Detection (Legacy/Backup) ─────────────────────────────────────
const OCCUPATION_KEYWORD_MAP = {
  'farmer / agriculture':   ['farmer', 'agriculture', 'kisan', 'crop', 'horticulture', 'fisherman', 'fisheries', 'fishing', 'agri', 'cultivat'],
  'student / research':     ['student', 'scholarship', 'education', 'degree', 'college', 'school', 'university', 'research', 'academic', 'coaching', 'pre-matric', 'post-matric'],
  'entrepreneur / startup': ['entrepreneur', 'startup', 'msme', 'enterprise', 'business', 'industry', 'trade', 'manufacturing', 'powerloom', 'textile', 'tourism', 'msme'],
  'daily wage worker':      ['worker', 'labour', 'laborer', 'wage', 'construction', 'shramik', 'mazdoor', 'unorganised', 'migrant', 'bocw', 'building worker', 'sanitation'],
  'other / professional':   ['professional', 'salaried', 'government employee', 'doctor', 'engineer', 'teacher', 'nurse'],
};

function detectOccupationsFromText(schemeText) {
  const detected = new Set();
  for (const [occ, keywords] of Object.entries(OCCUPATION_KEYWORD_MAP)) {
    if (keywords.some((kw) => schemeText.includes(kw))) detected.add(occ);
  }
  return [...detected];
}

// ═════════════════════════════════════════════════════════════════════════════
// API ROUTES (with /api prefix)
// ═════════════════════════════════════════════════════════════════════════════
const router = express.Router();

const recommendHandler = (req, res) => {
  const {
    age        = 0,
    income     = 0,
    gender     = '',
    state      = '',
    occupation = '',
    category   = '',
    query      = '',
  } = req.body;

  const userAge      = parseInt(age, 10)  || 0;
  const userIncome   = parseFloat(income) || 0;
  const userGender   = norm(gender);
  const userState    = norm(state);
  const userOcc      = norm(occupation);
  const userCategory = norm(category);

  const queryWords = query
    ? query.toLowerCase().split(/\W+/).filter((w) => w.length > 2)
    : [];

  const results = [];

  for (const scheme of schemes) {
    // ─── START OF NLP POWERED FILTERING & MATCHING ────────────────────────────
    const nlp = scheme.nlp || {};
    
    const schemeText = [
      scheme.scheme_name || '',
      scheme.details     || '',
      scheme.tags        || '',
      nlp.keywords?.join(' ') || '',
      scheme.schemeCategory || '',
    ].join(' ').toLowerCase();

    // 1. STATE FILTER
    if (!scheme.is_central && userState) {
        const states = nlp.detected_states || [];
        if (states.length > 0 && !states.includes(userState)) {
            const explicit = toArray(scheme.state ?? scheme.states ?? null);
            if (explicit.length > 0 && !explicit.includes(userState)) continue;
        }
    }

    // 2. GENDER FILTER
    const schemeGenders = toArray(scheme.gender ?? scheme.eligibility?.gender ?? null);
    if (schemeGenders.length > 0 && userGender && !schemeGenders.includes(userGender)) continue;

    // 3. INCOME & AGE FILTER (NLP Powered)
    if (nlp.max_income && userIncome > nlp.max_income) continue;
    if (nlp.min_age && userAge < nlp.min_age) continue;
    if (nlp.max_age && userAge > nlp.max_age) continue;

    // 4. OCCUPATION FILTER
    let schemeOccs = toArray(scheme.occupation ?? scheme.eligibility?.occupation ?? null);
    if (schemeOccs.length === 0) schemeOccs = detectOccupationsFromText(schemeText);
    if (schemeOccs.length > 0 && userOcc && !schemeOccs.includes(userOcc)) continue;

    // 5. CATEGORY FILTER
    const schemeCat = norm(scheme.standard_category || '');
    if (userCategory && schemeCat && schemeCat !== 'general') {
        if (!schemeCat.includes(userCategory)) continue;
    }

    // ─── SCORING ──────────────────────────────────────────────────────────────
    let score = 0;
    const reasons = [];

    // Match Query
    if (queryWords.length > 0) {
      const matches = queryWords.filter(w => schemeText.includes(w));
      score += matches.length * 10;
      if (matches.length > 0) reasons.push(`Matches search: ${matches.join(', ')}`);
    }

    // Match State
    if (userState && (nlp.detected_states || []).includes(userState)) {
      score += 20;
      reasons.push(`Specifically for ${userState}`);
    }

    // Match Category
    if (userCategory && schemeCat.includes(userCategory)) {
        score += 15;
        reasons.push(`Matched category ${userCategory}`);
    }

    // NLP Benefit Scoring (keywords)
    if (nlp.keywords) {
        const benefitKeywords = ['assistance', 'relief', 'subsidy', 'grant', 'incentive', 'pension'];
        const matches = nlp.keywords.filter(k => benefitKeywords.includes(k));
        score += matches.length * 5;
    }

    results.push({
      ...scheme,
      matchScore: score,
      reasoning: reasons.join('; ') || 'Matched your profile criteria',
      summary: truncate(scheme.details, 150)
    });
  }

  // Sort by score and take top 12
  const topResults = results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 12);

  res.json(topResults);
};

router.post('/recommend', recommendHandler);
router.post('/match-schemes', recommendHandler);

// CATEGORIZED SEARCH ENDPOINT (Karnataka vs Central)
router.get('/search-categorized', (req, res) => {
  const { type = 'karnataka', query = '' } = req.query;
  const searchTerm = query.toLowerCase();

  let filtered = schemes;

  if (type === 'karnataka') {
    // Filter for Karnataka only (Central is excluded here as per user request)
    filtered = schemes.filter(s => 
      !s.is_central && 
      (s.nlp?.detected_states?.includes('karnataka') || s.state?.toLowerCase() === 'karnataka')
    );
  } else if (type === 'central') {
    // Filter for Central only
    filtered = schemes.filter(s => s.is_central);
  } else if (type === 'women') {
    // Filter for Women Empowerment
    filtered = schemes.filter(s => 
        norm(s.gender).includes('female') || 
        norm(s.gender).includes('women') ||
        norm(s.schemeCategory).includes('women') ||
        [s.scheme_name, s.details, s.tags].join(' ').toLowerCase().includes('women empowerment')
    );
  }

  if (searchTerm) {
    filtered = filtered.filter(s => {
      const text = [s.scheme_name, s.details, s.tags].join(' ').toLowerCase();
      return text.includes(searchTerm);
    });
  }

  // Take top 20 for search results
  res.json(filtered.slice(0, 20).map(s => ({
    ...s,
    summary: truncate(s.details, 150)
  })));
});

// ─── Placeholder for Live API Integration ─────────────────────────────────────
// Note: To use Data.gov.in, an API key is required. 
// This function shows how we would fetch live updates.
async function fetchLiveUpdates(resourceId, apiKey) {
  try {
    // const response = await fetch(`https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json`);
    // const data = await response.json();
    // return data.records;
    return []; // Placeholder
  } catch (err) {
    console.error('Live API Error:', err);
    return [];
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// TRANSLATION ENDPOINT
// ═════════════════════════════════════════════════════════════════════════════
router.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang) return res.status(400).json({ error: 'Missing text or targetLang' });
  if (targetLang === 'en') return res.json({ translatedText: text });

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return res.json({ translatedText: translationCache.get(cacheKey) });
  }

  try {
    const result = await translate(text, { to: targetLang });
    translationCache.set(cacheKey, result.text);
    res.json({ translatedText: result.text });
  } catch (err) {
    console.error('Translation Error:', err);
    res.json({ translatedText: text, error: 'Translation failed' });
  }
});

router.get('/explain/:id/:userId', (req, res) => {
    res.json({ explanation: "This scheme matches your profile because it is targeted at your specific demographic and region." });
});

app.use('/api', router);

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Force event loop to stay active
setInterval(() => {
  // Keep alive
}, 60000);
