import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": { "home": "Home", "find_schemes": "Find Schemes", "my_matches": "My Matches", "login": "Login" },
      "home": {
        "hero_title": "Matching You with the Right Government Schemes",
        "hero_subtitle": "Our advanced NLP engine analyzes your profile to find the most relevant welfare programs.",
        "cta": "Find My Schemes", "how_it_works": "How it Works", "tagline": "AI-Driven Government Assistance"
      },
      "form": {
        "title": "Tell Us About Yourself", "subtitle": "This data helps our AI find the most accurate matches for you.",
        "name": "Full Name", "age": "Age", "state": "State", "income": "Annual Income", "occupation": "Occupation", "category": "Category", "submit": "Check Eligible Schemes"
      },
      "schemes": {
        "pm_kisan": {
          "name": "PM Kisan Samman Nidhi",
          "desc": "Financial benefit of ₹6000 per year in three equal installments to all landholding farmer families.",
          "benefit1": "₹6000 per year", "benefit2": "Direct Benefit Transfer"
        },
        "kaushal_vikas": {
          "name": "Pradhan Mantri Kaushal Vikas Yojana",
          "desc": "Skill certification scheme to enable youth to take up industry-relevant skill training.",
          "benefit1": "Skill Certification", "benefit2": "Placement Assistance"
        }
      }
    }
  },
  hi: {
    translation: {
      "nav": { "home": "होम", "find_schemes": "योजनाएं खोजें", "my_matches": "मेरे मैच", "login": "लॉगिन" },
      "home": {
        "hero_title": "सही सरकारी योजनाओं के साथ आपका मिलान",
        "hero_subtitle": "हमारा उन्नत एनएलपी इंजन सबसे प्रासंगिक कल्याण कार्यक्रमों को खोजने के लिए आपकी प्रोफाइल का विश्लेषण करता है।",
        "cta": "मेरी योजनाएं खोजें", "how_it_works": "यह कैसे काम करता है", "tagline": "AI-संचालित सरकारी सहायता"
      },
      "form": {
        "title": "हमें अपने बारे में बताएं", "subtitle": "यह डेटा हमारे एआई को आपके लिए सबसे सटीक मिलान खोजने में मदद करता है।",
        "name": "पूरा नाम", "age": "आयु", "state": "राज्य", "income": "वार्षिक आय", "occupation": "व्यवसाय", "category": "श्रेणी", "submit": "पात्र योजनाओं की जाँच करें"
      },
      "schemes": {
        "pm_kisan": {
          "name": "पीएम किसान सम्मान निधि",
          "desc": "सभी भूमिधारक किसान परिवारों को तीन समान किश्तों में ₹6000 प्रति वर्ष का वित्तीय लाभ।",
          "benefit1": "₹6000 प्रति वर्ष", "benefit2": "प्रत्यक्ष लाभ हस्तांतरण"
        },
        "kaushal_vikas": {
          "name": "प्रधानमंत्री कौशल विकास योजना",
          "desc": "युवाओं को उद्योग-प्रासंगिक कौशल प्रशिक्षण लेने में सक्षम बनाने के लिए कौशल प्रमाणन योजना।",
          "benefit1": "कौशल प्रमाणन", "benefit2": "नियोजन सहायता"
        }
      }
    }
  },
  kn: {
    translation: {
      "nav": { "home": "ಮನೆ", "find_schemes": "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ", "my_matches": "ನನ್ನ ಹೊಂದಾಣಿಕೆಗಳು", "login": "ಲಾಗಿನ್" },
      "home": {
        "hero_title": "ನಿಮಗಾಗಿ ಸರಿಯಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹೊಂದಿಸಲಾಗುತ್ತಿದೆ",
        "hero_subtitle": "ನಮ್ಮ ಸುಧಾರಿತ NLP ಎಂಜಿನ್ ಹೆಚ್ಚು ಸೂಕ್ತವಾದ ಕಲ್ಯಾಣ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಹುಡುಕಲು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ವಿಲೇಷಿಸುತ್ತದೆ.",
        "cta": "ನನ್ನ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ", "how_it_works": "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ", "tagline": "AI-ಚಾಲಿತ ಸರ್ಕಾರಿ ನೆರವು"
      },
      "form": {
        "title": "ನಿಮ್ಮ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ", "subtitle": "ನಿಮಗಾಗಿ ಹೆಚ್ಚು ನಿಖರವಾದ ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಹುಡುಕಲು ಈ ಡೇಟಾ ನಮ್ಮ AI ಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        "name": "ಪೂರ್ಣ ಹೆಸರು", "age": "ವಯಸ್ಸು", "state": "ರಾಜ್ಯ", "income": "ವಾರ್ಷಿಕ ಆದಾಯ", "occupation": "ಉದ್ಯೋಗ", "category": "ವರ್ಗ", "submit": "ಅರ್ಹ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ"
      },
      "schemes": {
        "pm_kisan": {
          "name": "ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ",
          "desc": "ಎಲ್ಲಾ ಭೂಹಿಡುವಳಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ 6000 ರೂಪಾಯಿಗಳ ಆರ್ಥಿಕ ನೆರವು.",
          "benefit1": "ವರ್ಷಕ್ಕೆ ₹6000", "benefit2": "ನೇರ ಲಾಭ ವರ್ಗಾವಣೆ"
        },
        "kaushal_vikas": {
          "name": "ಪ್ರಧಾನ ಮಂತ್ರಿ ಕೌಶಲ್ಯ ವಿಕಾಸ ಯೋಜನೆ",
          "desc": "ಯುವಕರು ಉದ್ಯಮ-ಸಂಬಂಧಿತ ಕೌಶಲ್ಯ ತರಬೇತಿಯನ್ನು ಪಡೆಯಲು ಅನುವು ಮಾಡಿಕೊಡುವ ಕೌಶಲ್ಯ ಪ್ರಮಾಣೀಕರಣ ಯೋಜನೆ.",
          "benefit1": "ಕೌಶಲ್ಯ ಪ್ರಮಾಣೀಕರಣ", "benefit2": "ಉದ್ಯೋಗ ನೆರವು"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
