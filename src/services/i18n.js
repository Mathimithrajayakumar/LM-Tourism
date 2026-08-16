// src/services/i18n.js
// Scalable Global Multilingual i18n System for LM Tourism.
// Supports 42+ major global and regional languages with native scripts, RTL layout support, and BCP-47 speech codes.

export const LANGUAGES = [
  { code: 'en',    label: 'English',               nativeLabel: 'English',            bcp47: 'en-US' },
  { code: 'ta',    label: 'Tamil',                 nativeLabel: 'தமிழ்',              bcp47: 'ta-IN' },
  { code: 'hi',    label: 'Hindi',                 nativeLabel: 'हिन्दी',             bcp47: 'hi-IN' },
  { code: 'te',    label: 'Telugu',                nativeLabel: 'తెలుగు',             bcp47: 'te-IN' },
  { code: 'ml',    label: 'Malayalam',             nativeLabel: 'മലയാളം',             bcp47: 'ml-IN' },
  { code: 'kn',    label: 'Kannada',               nativeLabel: 'ಕನ್ನಡ',              bcp47: 'kn-IN' },
  { code: 'bn',    label: 'Bengali',               nativeLabel: 'বাংলা',              bcp47: 'bn-IN' },
  { code: 'mr',    label: 'Marathi',               nativeLabel: 'मराठी',              bcp47: 'mr-IN' },
  { code: 'gu',    label: 'Gujarati',              nativeLabel: 'ગુજરાતી',            bcp47: 'gu-IN' },
  { code: 'pa',    label: 'Punjabi',               nativeLabel: 'ਪੰਜਾਬੀ',             bcp47: 'pa-IN' },
  { code: 'ur',    label: 'Urdu',                  nativeLabel: 'اردو',               bcp47: 'ur-PK', rtl: true },
  { code: 'ar',    label: 'Arabic',                nativeLabel: 'العربية',            bcp47: 'ar-SA', rtl: true },
  { code: 'zh',    label: 'Chinese (Simplified)',  nativeLabel: '简体中文',           bcp47: 'zh-CN' },
  { code: 'zh-TW', label: 'Chinese (Traditional)', nativeLabel: '繁體中文',           bcp47: 'zh-TW' },
  { code: 'ja',    label: 'Japanese',              nativeLabel: '日本語',             bcp47: 'ja-JP' },
  { code: 'ko',    label: 'Korean',                nativeLabel: '한국어',             bcp47: 'ko-KR' },
  { code: 'th',    label: 'Thai',                  nativeLabel: 'ภาษาไทย',            bcp47: 'th-TH' },
  { code: 'vi',    label: 'Vietnamese',            nativeLabel: 'Tiếng Việt',         bcp47: 'vi-VN' },
  { code: 'id',    label: 'Indonesian',            nativeLabel: 'Bahasa Indonesia',   bcp47: 'id-ID' },
  { code: 'ms',    label: 'Malay',                 nativeLabel: 'Bahasa Melayu',      bcp47: 'ms-MY' },
  { code: 'fil',   label: 'Filipino',              nativeLabel: 'Tagalog',            bcp47: 'fil-PH' },
  { code: 'fr',    label: 'French',                nativeLabel: 'Français',           bcp47: 'fr-FR' },
  { code: 'de',    label: 'German',                nativeLabel: 'Deutsch',            bcp47: 'de-DE' },
  { code: 'es',    label: 'Spanish',               nativeLabel: 'Español',            bcp47: 'es-ES' },
  { code: 'pt',    label: 'Portuguese',            nativeLabel: 'Português',          bcp47: 'pt-BR' },
  { code: 'it',    label: 'Italian',               nativeLabel: 'Italiano',           bcp47: 'it-IT' },
  { code: 'nl',    label: 'Dutch',                 nativeLabel: 'Nederlands',         bcp47: 'nl-NL' },
  { code: 'ru',    label: 'Russian',               nativeLabel: 'Русский',            bcp47: 'ru-RU' },
  { code: 'uk',    label: 'Ukrainian',             nativeLabel: 'Українська',         bcp47: 'uk-UA' },
  { code: 'tr',    label: 'Turkish',               nativeLabel: 'Türkçe',             bcp47: 'tr-TR' },
  { code: 'el',    label: 'Greek',                 nativeLabel: 'Ελληνικά',           bcp47: 'el-GR' },
  { code: 'he',    label: 'Hebrew',                nativeLabel: 'עברית',              bcp47: 'he-IL', rtl: true },
  { code: 'fa',    label: 'Persian',               nativeLabel: 'فارسی',              bcp47: 'fa-IR', rtl: true },
  { code: 'pl',    label: 'Polish',                nativeLabel: 'Polski',             bcp47: 'pl-PL' },
  { code: 'cs',    label: 'Czech',                 nativeLabel: 'Čeština',            bcp47: 'cs-CZ' },
  { code: 'sv',    label: 'Swedish',               nativeLabel: 'Svenska',            bcp47: 'sv-SE' },
  { code: 'no',    label: 'Norwegian',             nativeLabel: 'Norsk',              bcp47: 'nb-NO' },
  { code: 'da',    label: 'Danish',                nativeLabel: 'Dansk',              bcp47: 'da-DK' },
  { code: 'fi',    label: 'Finnish',               nativeLabel: 'Suomi',              bcp47: 'fi-FI' },
  { code: 'ro',    label: 'Romanian',              nativeLabel: 'Română',             bcp47: 'ro-RO' },
  { code: 'hu',    label: 'Hungarian',             nativeLabel: 'Magyar',             bcp47: 'hu-HU' },
  { code: 'sw',    label: 'Swahili',               nativeLabel: 'Kiswahili',          bcp47: 'sw-TZ' },
];

const TRANSLATIONS = {
  // ── Navigation ──
  nav_home: {
    en: 'Home', ta: 'முகப்பு', hi: 'होम', te: 'హోమ్', ml: 'ഹോം', kn: 'ಮನೆ', bn: 'হোম', mr: 'होम', gu: 'હોમ', pa: 'ਹੋਮ', ur: 'ہوم', ar: 'الرئيسية', zh: '首页', 'zh-TW': '首頁', ja: 'ホーム', ko: '홈', th: 'หน้าแรก', vi: 'Trang chủ', id: 'Beranda', ms: 'Utama', fil: 'Bahay', fr: 'Accueil', de: 'Startseite', es: 'Inicio', pt: 'Início', it: 'Home', nl: 'Home', ru: 'Главная', uk: 'Головна', tr: 'Ana Sayfa', el: 'Αρχική', he: 'בית', fa: 'خانه', pl: 'Strona główna', cs: 'Domů', sv: 'Hem', no: 'Hjem', da: 'Hjem', fi: 'Koti', ro: 'Acasă', hu: 'Főoldal', sw: 'Nyumbani'
  },
  nav_explore: {
    en: 'Explore', ta: 'ஆராயுங்கள்', hi: 'एक्सप्लोर', te: 'అన్వేషించు', ml: 'അന്വേഷിക്കൂ', kn: 'ಅನ್ವೇಷಿಸಿ', bn: 'অন্বেষণ', mr: 'शोध', gu: 'શોધો', pa: 'ਖੋਜੋ', ur: 'تلاش کریں', ar: 'استكشف', zh: '探索', 'zh-TW': '探索', ja: '探索', ko: '탐색', th: 'สำรวจ', vi: 'Khám phá', id: 'Jelajahi', ms: 'Terokai', fil: 'Galugarin', fr: 'Explorer', de: 'Erkunden', es: 'Explorar', pt: 'Explorar', it: 'Esplora', nl: 'Ontdekken', ru: 'Обзор', uk: 'Огляд', tr: 'Keşfet', el: 'Εξερευνήστε', he: 'חקור', fa: 'کاوش', pl: 'Odkrywaj', cs: 'Prozkoumat', sv: 'Utforska', no: 'Utforsk', da: 'Udforsk', fi: 'Tutki', ro: 'Explorează', hu: 'Felfedezés', sw: 'Gundua'
  },
  nav_favourites: {
    en: 'Saved', ta: 'சேமிக்கப்பட்டது', hi: 'सहेजे गए', te: 'సేవ్ చేయబడింది', ml: 'സേവ് ചെയ്തത്', kn: 'ಉಳಿಸಿದ', bn: 'সংরক্ষিত', mr: 'जतन केलेले', gu: 'સાચવેલ', pa: 'ਸੰਭਾਲੇ ਗਏ', ur: 'محفوظ شدہ', ar: 'المحفوظات', zh: '收藏', 'zh-TW': '收藏', ja: '保存済み', ko: '저장됨', th: 'บันทึกแล้ว', vi: 'Đã lưu', id: 'Tersimpan', ms: 'Disimpan', fil: 'Naka-save', fr: 'Sauvegardés', de: 'Gespeichert', es: 'Guardados', pt: 'Guardados', it: 'Salvati', nl: 'Opgeslagen', ru: 'Сохраненные', uk: 'Збережені', tr: 'Kaydedilenler', el: 'Αποθηκευμένα', he: 'שמורים', fa: 'ذخیره شده', pl: 'Zapisane', cs: 'Uložené', sv: 'Sparade', no: 'Lagret', da: 'Gemt', fi: 'Tallennettu', ro: 'Salvate', hu: 'Mentett', sw: 'Iliyohifadhiwa'
  },
  nav_profile: {
    en: 'Profile', ta: 'சுயவிவரம்', hi: 'प्रोफ़ाइल', te: 'ప్రొఫైల్', ml: 'പ്രൊഫൈൽ', kn: 'ಪ್ರೊಫೈಲ್', bn: 'प्रोफाइल', mr: 'प्रोफाइल', gu: 'પ્રોફાઇલ', pa: 'ਪ੍ਰੋਫਾਈਲ', ur: 'پروفائل', ar: 'الملف الشخصي', zh: '个人', 'zh-TW': '個人', ja: 'プロフィール', ko: '프로필', th: 'โปรไฟล์', vi: 'Hồ sơ', id: 'Profil', ms: 'Profil', fil: 'Profile', fr: 'Profil', de: 'Profil', es: 'Perfil', pt: 'Perfil', it: 'Profilo', nl: 'Profiel', ru: 'Профиль', uk: 'Профіль', tr: 'Profil', el: 'Προφίλ', he: 'פרופיל', fa: 'پروفایل', pl: 'Profil', cs: 'Profil', sv: 'Profil', no: 'Profil', da: 'Profil', fi: 'Profiili', ro: 'Profil', hu: 'Profil', sw: 'Profili'
  },

  // ── Hero Banner & Search ──
  hero_title: {
    en: "Explore World Architectural Wonders",
    ta: 'உலகக் கட்டிடக்கலை அதிசயங்களை ஆராயுங்கள்',
    hi: 'दुनिया के वास्तुशिल्प चमत्कारों की खोज करें',
    te: 'ప్రపంచ వాస్తుశిల్పం అద్భుతాలను అన్వేషించండి',
    ml: 'ലോകത്തിലെ വാസ്തുശില്പ അദ്ഭുതങ്ങൾ കണ്ടെത്തൂ',
    kn: 'ವಿಶ್ವದ ವಾಸ್ತುಶಿಲ್ಪ ಅದ್ಭುತಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    bn: 'বিশ্ব স্থাপত্য বিস্ময় আবিষ্কার করুন',
    mr: 'जगातील वास्तू आश्चर्यांचा शोध घ्या',
    gu: 'વિશ્વ સ્થાપત્ય અજાયબીઓની શોધ કરો',
    pa: 'ਵਿਸ਼ਵ ਵਾਸਤੂਕਲਾ ਦੇ ਅਜੂਬਿਆਂ ਦੀ ਖੋਜ ਕਰੋ',
    ur: 'دنیا کے عجیبات کا احاطہ کریں',
    ar: 'استكشف العجائب المعمارية العالمية',
    zh: '探索世界建筑奇迹',
    'zh-TW': '探索世界建築奇蹟',
    ja: '世界の建築の驚異を探索する',
    ko: '세계 건축의 경이로움을 탐험하세요',
    th: 'สำรวจสิ่งมหัศจรรย์ทางสถาปัตยกรรมของโลก',
    vi: 'Khám phá các kỳ quan kiến trúc thế giới',
    id: 'Jelajahi Keajaiban Arsitektur Dunia',
    ms: 'Terokai Keajaiban Seni Bina Dunia',
    fil: 'Galugarin ang mga kababalaghan ng arkitektura sa mundo',
    fr: "Explorez les merveilles architecturales du monde",
    de: 'Entdecken Sie Indiens & weltweite architektonische Wunder',
    es: 'Explora las maravillas arquitectónicas del mundo',
    pt: 'Explore as Maravilhas Arquitetônicas do Mundo',
    it: 'Esplora le meraviglie architettoniche del mondo',
    nl: 'Ontdek wereldwijde architectonische wonderen',
    ru: 'Исследуйте архитектурные чудеса мира',
    uk: 'Досліджуйте архітектурні чудеса світу',
    tr: 'Dünyanın Mimari Harikalarını Keşfedin',
    el: 'Εξερευνήστε τα αρχιτεκτονικά θαύματα του κόσμου',
    he: 'חקור את פלאי האדריכלות של העולם',
    fa: 'عجایب معماری جهان را کاوش کنید',
    pl: 'Odkrywaj cuda architektury świata',
    cs: 'Prozkoumejte architektonické divy světa',
    sv: 'Utforska världens arkitektoniska underverk',
    no: 'Utforsk verdens arkitektoniske underverker',
    da: 'Udforsk verdens arkitektoniske vidundere',
    fi: 'Tutki maailman arkkitehtuurin ihmeitä',
    ro: 'Explorează minunile arhitecturale ale lumii',
    hu: 'Fedezze fel a világ építészeti csodáit',
    sw: 'Gundua Maajabu ya Usanifu wa Majengo Duniani'
  },
  hero_subtitle: {
    en: 'Interactive 3D AR tours, historical narratives, and generative AI guides at your fingertips.',
    ta: 'ஊடாடும் 3D AR சுற்றுப்பயணங்கள், வரலாற்று கதைகள் மற்றும் AI வழிகாட்டிகள்.',
    hi: 'इंटरएक्टिव 3D AR टूर, ऐतिहासिक कथाएं, और AI गाइड आपकी उंगलियों पर।',
    te: 'ఇంటరాక్టివ్ 3D AR పర్యటనలు, చారిత్రక కథనాలు మరియు AI గైడ్‌లు.',
    ml: 'ഇൻ്ററാക്ടീവ് 3D AR ടൂറുകൾ, ചരിത്ര വിവരണങ്ങൾ, AI ഗൈഡുകൾ.',
    kn: 'ಸಂವಾದಾತ್ಮಕ 3D AR ಪ್ರವಾಸಗಳು, ಐತಿಹಾಸಿಕ ನಿರೂಪಣೆಗಳು ಮತ್ತು AI ಮಾರ್ಗದರ್ಶಿಗಳು.',
    bn: 'ইন্টারেক্টিভ 3D AR সফর, ঐতিহাসিক বিবরণ এবং AI গাইড।',
    mr: 'इंटरएक्टिव्ह 3D AR टूर, ऐतिहासिक कथा आणि AI मार्गदर्शक.',
    gu: 'ઇન્ટરેક્ટિવ 3D AR ટૂર્સ, ઐતિહાસિક વાર્તાઓ અને AI માર્ગદર્શક.',
    pa: 'ਇੰਟਰਐਕਟਿਵ 3D AR ਟੂਰ, ਇਤਿਹਾਸਕ ਕਹਾਣੀਆਂ ਅਤੇ AI ਗਾਈਡ।',
    ur: 'انٹرایکٹو 3D AR ٹور، تاریخی کہانیاں اور AI گائیڈز۔',
    ar: 'جولات AR ثلاثية الأبعاد تفاعلية وسرد تاريخي ومرشد AI ذكي.',
    zh: '交互式 3D AR 导览、历史叙事和生成式 AI 导游。',
    'zh-TW': '互動式 3D AR 導覽、歷史敘事和生成式 AI 導遊。',
    ja: 'インタラクティブな3D ARツアー、歴史的ナラティブ、AIガイド。',
    ko: '대화형 3D AR 투어, 역사적 이야기 및 생성형 AI 가이드.',
    th: 'ทัวร์ 3D AR เชิงโต้ตอบ ประวัติศาสตร์ และไกด์ AI',
    vi: 'Chuyến tham quan 3D AR tương tác, câu chuyện lịch sử và hướng dẫn viên AI.',
    id: 'Tur 3D AR interaktif, narasi sejarah, dan pemandu AI generatif.',
    ms: 'Lawatan 3D AR interaktif, narasi sejarah, dan panduan AI.',
    fil: 'Interactive 3D AR tours, kasaysayan, at AI guides.',
    fr: 'Visites 3D AR interactives, récits historiques et guides IA génératifs.',
    de: 'Interaktive 3D AR-Touren, historische Erzählungen und KI-Guides.',
    es: 'Tours 3D AR interactivos, narrativas históricas y guías de IA generativa.',
    pt: 'Tours 3D AR interativos, narrativas históricas e guias de IA.',
    it: 'Tour 3D AR interattivi, racconti storici e guide IA.',
    nl: 'Interactieve 3D AR-tours, historische verhalen en AI-gidsen.',
    ru: 'Интерактивные 3D AR туры, исторические хроники и ИИ-гид.',
    uk: 'Інтерактивні 3D AR тури, історичні хроніки та ШІ-гід.',
    tr: 'Etkileşimli 3D AR turları, tarihi anlatılar ve yapay zeka rehberleri.',
    el: 'Διαδραστικές 3D AR περιηγήσεις, ιστορικές αφηγήσεις και οδηγοί AI.',
    he: 'סיורי AR תלת-ממדיים אינטראקטיביים ומדריכי AI.',
    fa: 'تورهای 3D AR تعاملی و راهنماهای هوش مصنوعی.',
    pl: 'Interaktywne wycieczki 3D AR, narracje historyczne i przewodnik AI.',
    cs: 'Interaktivní 3D AR prohlídky, historické příběhy a AI průvodce.',
    sv: 'Interaktiva 3D AR-turer, historiska berättelser och AI-guider.',
    no: 'Interaktive 3D AR-turer, historiske fortellinger og AI-guider.',
    da: 'Interaktive 3D AR-ture, historiske fortællinger og AI-guider.',
    fi: 'Interaktiiviset 3D AR -kierrokset, historialliset tarinat ja AI-oppaat.',
    ro: 'Tururi 3D AR interactive, narațiuni istorice și ghiduri AI.',
    hu: 'Interaktív 3D AR túrák, történelmi történetek és AI útmutatók.',
    sw: 'Ziara za 3D AR, simulizi za kihistoria na miongozo ya AI.'
  },
  search_placeholder: {
    en: 'Search Taj Mahal, Eiffel Tower, Colosseum...',
    ta: 'தாஜ் மஹால், ஈபிள் கோபுரம் தேடுங்கள்...',
    hi: 'ताज महल, एफिल टॉवर, कोलोसियम खोजें...',
    te: 'తాజ్ మహల్, ఈఫిల్ టవర్ వెతకండి...',
    ml: 'താജ് മഹൽ, ഈഫൽ ഗോപുരം തിരയൂ...',
    kn: 'ತಾಜ್ ಮಹಲ್, ಈಫಿಲ್ ಟವರ್ ಹುಡುಕಿ...',
    bn: 'তাজমহল, আইফেল টাওয়ার খুঁজুন...',
    mr: 'ताजमहाल, आयफेल टॉवर शोधा...',
    gu: 'તાજમહાલ, એફિલ ટાવર શોધો...',
    pa: 'ਤਾਜ ਮਹਿਲ, ਐਫਿਲ ਟਾਵਰ ਖੋਜੋ...',
    ur: 'تاج محل، ایفل ٹاور تلاش کریں...',
    ar: 'ابحث عن تاج محل، برج إيفل، الكولوسيوم...',
    zh: '搜索 泰姬陵、埃菲尔铁塔、罗马斗兽场...',
    'zh-TW': '搜尋 泰姬瑪哈陵、艾菲爾鐵塔...',
    ja: 'タージ・マハル、エッフェル塔を検索...',
    ko: '타지마할, 에펠탑, 콜로세움 검색...',
    th: 'ค้นหา ทาชมาฮาล, หอไอเฟล...',
    vi: 'Tìm kiếm Đền Taj Mahal, Tháp Eiffel...',
    id: 'Cari Taj Mahal, Menara Eiffel...',
    ms: 'Cari Taj Mahal, Menara Eiffel...',
    fil: 'Maghanap ng Taj Mahal, Eiffel Tower...',
    fr: 'Rechercher Taj Mahal, Tour Eiffel...',
    de: 'Taj Mahal, Eiffelturm, Kolosseum suchen...',
    es: 'Buscar Taj Mahal, Torre Eiffel, Coliseo...',
    pt: 'Buscar Taj Mahal, Torre Eiffel, Coliseu...',
    it: 'Cerca Taj Mahal, Torre Eiffel...',
    nl: 'Zoek Taj Mahal, Eiffeltoren...',
    ru: 'Поиск: Тадж-Махал, Эйфелева башня...',
    uk: 'Пошук: Тадж-Махал, Ейфелева вежа...',
    tr: 'Tac Mahal, Eyfel Kulesi ara...',
    el: 'Αναζήτηση Ταζ Μαχάλ, Пύργος του Άιφελ...',
    he: 'חפש את טאג׳ מהאל, מגדל אייפל...',
    fa: 'جستجوی تاج محل، برج ایفل...',
    pl: 'Szukaj Tadź Mahal, Wieża Eiffla...',
    cs: 'Hledat Tádž Mahal, Eiffelova věž...',
    sv: 'Sök Taj Mahal, Eiffeltornet...',
    no: 'Søk Taj Mahal, Eiffeltårnet...',
    da: 'Søg Taj Mahal, Eiffeltårnet...',
    fi: 'Etsi Taj Mahal, Eiffel-torni...',
    ro: 'Caută Taj Mahal, Turnul Eiffel...',
    hu: 'Keresés: Tádzs Mahal, Eiffel-torony...',
    sw: 'Tafuta Taj Mahal, Jumba la Eiffel...'
  },
  search_btn: {
    en: 'Search', ta: 'தேடு', hi: 'खोजें', te: 'వెతకండి', ml: 'തിരയൂ', kn: 'ಹುಡುಕಿ', bn: 'খুঁজুন', mr: 'शोधा', gu: 'શોધો', pa: 'ਖੋਜੋ', ur: 'تلاش', ar: 'بحث', zh: '搜索', 'zh-TW': '搜尋', ja: '検索', ko: '검색', th: 'ค้นหา', vi: 'Tìm', id: 'Cari', ms: 'Cari', fil: 'Maghanap', fr: 'Chercher', de: 'Suchen', es: 'Buscar', pt: 'Buscar', it: 'Cerca', nl: 'Zoeken', ru: 'Поиск', uk: 'Пошук', tr: 'Ara', el: 'Αναζήτηση', he: 'חפש', fa: 'جستجو', pl: 'Szukaj', cs: 'Hledat', sv: 'Sök', no: 'Søk', da: 'Søg', fi: 'Etsi', ro: 'Caută', hu: 'Keresés', sw: 'Tafuta'
  },
  quick_actions: {
    en: 'Quick Actions', ta: 'விரைவு செயல்கள்', hi: 'त्वरित क्रियाएं', te: 'త్వరిత చర్యలు', ml: 'ദ്രുത പ്രവർത്തനങ്ങൾ', kn: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು', bn: 'দ্রুত কাজ', mr: 'जलद कृती', gu: 'ઝડપી ક્રિયાઓ', pa: 'ਤੇਜ਼ ਕਾਰਵਾਈਆਂ', ur: 'فوری اقدامات', ar: 'إجراءات سريعة', zh: '快捷操作', 'zh-TW': '快捷操作', ja: 'クイック操作', ko: '빠른 작업', th: 'การดำเนินการด่วน', vi: 'Thao tác nhanh', id: 'Tindakan Cepat', ms: 'Tindakan Pantas', fil: 'Mabilis na Aksyon', fr: 'Actions rapides', de: 'Schnellaktionen', es: 'Acciones rápidas', pt: 'Ações Rápidas', it: 'Azioni rapide', nl: 'Snelle acties', ru: 'Быстрые действия', uk: 'Швидкі дії', tr: 'Hızlı Eylemler', el: 'Γρήγορες Ενέργειες', he: 'פעולות מהירות', fa: 'اقدامات سریع', pl: 'Szybkie akcje', cs: 'Rychlé akce', sv: 'Snabbval', no: 'Hurtigvalg', da: 'Hurtige handlinger', fi: 'Pikatoiminnot', ro: 'Acțiuni rapide', hu: 'Gyors műveletek', sw: 'Hatua za Haraka'
  },
  featured: {
    en: 'Featured Monuments', ta: 'சிறப்பு நினைவுச்சின்னங்கள்', hi: 'विशेष स्मारक', te: 'ఫీచర్డ్ స్మారక చిహ్నాలు', ml: 'ഫീച്ചർ ചെയ്ത സ്മാരകങ്ങൾ', kn: 'ವೈಶಿಷ್ಟ್ಯ ಸ್ಮಾರಕಗಳು', bn: 'বিশেষ স্থাপত্য', mr: 'विशेष स्मारके', gu: 'મુખ્ય સ્મારકો', pa: 'ਖਾਸ ਸਮਾਰਕ', ur: 'نمایاں عمارتیں', ar: 'معالم بارزة', zh: '精选古迹', 'zh-TW': '精選古蹟', ja: '注目の記念碑', ko: '주요 유적지', th: 'โบราณสถานแนะนำ', vi: 'Di tích nổi bật', id: 'Monumen Unggulan', ms: 'Monumen Pilihan', fil: 'Mga Tampok na Monumento', fr: 'Monuments en vedette', de: 'Ausgewählte Denkmäler', es: 'Monumentos destacados', pt: 'Monumentos em Destaque', it: 'Monumenti in evidenza', nl: 'Uitgelichte monumenten', ru: 'Популярные памятники', uk: 'Популярні пам\'ятки', tr: 'Öne Çıkan Anıtlar', el: 'Προβεβλημένα Μνημεία', he: 'אנדרטאות נבחרות', fa: 'بناهای برجسته', pl: 'Wyróżnione zabytki', cs: 'Doporučené památky', sv: 'Utvalda monument', no: 'Utvalgte monumenter', da: 'Udvalgte monumenter', fi: 'Suositellut muistomerkit', ro: 'Monumente reprezentative', hu: 'Kiemelt műemlékek', sw: 'Kumbukumbu Maarufu'
  },
  see_all: {
    en: 'See All', ta: 'அனைத்தும்', hi: 'सब देखें', te: 'అన్నీ చూడండి', ml: 'എല്ലാം കാണൂ', kn: 'ಎಲ್ಲ ನೋಡಿ', bn: 'সব দেখুন', mr: 'सर्व पहा', gu: 'બધા જુઓ', pa: 'ਸਭ ਦੇਖੋ', ur: 'سب دیکھیں', ar: 'عرض الكل', zh: '查看全部', 'zh-TW': '查看全部', ja: 'すべて見る', ko: '모두 보기', th: 'ดูทั้งหมด', vi: 'Xem tất cả', id: 'Lihat Semua', ms: 'Lihat Semua', fil: 'Tingnan Lahat', fr: 'Voir tout', de: 'Alle anzeigen', es: 'Ver todo', pt: 'Ver Todos', it: 'Vedi tutti', nl: 'Alles bekijken', ru: 'Смотреть все', uk: 'Дивитися все', tr: 'Tümünü Gör', el: 'Δείτε όλα', he: 'הצג הכל', fa: 'مشاهده همه', pl: 'Zobacz wszystkie', cs: 'Zobrazit vše', sv: 'Visa alla', no: 'Se alle', da: 'Se alle', fi: 'Näytä kaikki', ro: 'Vezi tot', hu: 'Összes megtekintése', sw: 'Ona Zote'
  },
  popular: {
    en: 'Popular Destinations', ta: 'பிரபலமான இடங்கள்', hi: 'लोकप्रिय गंतव्य', te: 'ప్రసిద్ధ గమ్యస్థానాలు', ml: 'ജനപ്രിയ സ്ഥലങ്ങൾ', kn: 'ಜನಪ್ರಿಯ ತಾಣಗಳು', bn: 'জনপ্রিয় গন্তব্য', mr: 'लोकप्रिय ठिकाणे', gu: 'લોકપ્રિય સ્થળો', pa: 'ਮਕਬੂਲ ਸਥਾਨ', ur: 'مقبول مقامات', ar: 'وجهات شهيرة', zh: '热门景点', 'zh-TW': '熱門景點', ja: '人気の目的地', ko: '인기 여행지', th: 'จุดหมายยอดนิยม', vi: 'Điểm đến phổ biến', id: 'Destinasi Populer', ms: 'Destinasi Popular', fil: 'Popular na Destinasyon', fr: 'Destinations populaires', de: 'Beliebte Reiseziele', es: 'Destinos populares', pt: 'Destinos Populares', it: 'Destinazioni popolari', nl: 'Populaire bestemmingen', ru: 'Популярные направления', uk: 'Популярні напрямки', tr: 'Popüler Rotalar', el: 'Δημοφιλείς Προορισμοί', he: 'יעדים פופולריים', fa: 'مقاصد محبوب', pl: 'Popularne miejsca', cs: 'Oblíbené destinace', sv: 'Populära resmål', no: 'Populære reisemål', da: 'Populære destinationer', fi: 'Suosittuja kohteita', ro: 'Destinații populare', hu: 'Népszerű úti célok', sw: 'Maeneo Maarufu'
  },
  recent_searches: {
    en: 'Recent Searches', ta: 'சமீபத்திய தேடல்கள்', hi: 'हाल की खोजें', te: 'ఇటీవల శోధనలు', ml: 'സമീപകാല തിരയലുകൾ', kn: 'ಇತ್ತೀಚಿನ ಹುಡುಕಾಟಗಳು', bn: 'সাম্প্রতিক অনুসন্ধান', mr: 'नुकतेच शोधलेले', gu: 'તાજેતરની શોધો', pa: 'ਹਾਲੀਆ ਖੋਜਾਂ', ur: 'حالیہ تلاشیں', ar: 'عمليات البحث الأخيرة', zh: '最近搜索', 'zh-TW': '最近搜尋', ja: '最近の検索', ko: '최근 검색', th: 'การค้นหาล่าสุด', vi: 'Tìm kiếm gần đây', id: 'Pencarian Terakhir', ms: 'Carian Terkini', fil: 'Kamakailang Paghahanap', fr: 'Recherches récentes', de: 'Letzte Suchanfragen', es: 'Búsquedas recientes', pt: 'Pesquisas Recentes', it: 'Ricerche recenti', nl: 'Recente zoekopdrachten', ru: 'Недавние поиски', uk: 'Нещодавні пошуки', tr: 'Son Aramalar', el: 'Πρόσφατες Αναζητήσεις', he: 'חיפושים אחרונים', fa: 'جستجوهای اخیر', pl: 'Ostatnie wyszukiwania', cs: 'Nedávná hledání', sv: 'Senaste sökningar', no: 'Nylige søk', da: 'Seneste søgninger', fi: 'Viimeisimmät haut', ro: 'Căutări recente', hu: 'Legutóbbi keresések', sw: 'Utafutaji wa Hivi Karibuni'
  },

  // ── Explore View ──
  explore_title: {
    en: 'Explore Monuments', ta: 'நினைவுச்சின்னங்களை ஆராயுங்கள்', hi: 'स्मारक खोजें', te: 'స్మారక చిహ్నాలు', ml: 'സ്മാരകങ്ങൾ അന്വേഷിക്കൂ', kn: 'ಸ್ಮಾರಕಗಳನ್ನು ಅನ್ವೇಷಿಸಿ', bn: 'স্মারক খুঁজুন', mr: 'स्मारके शोधा', gu: 'સ્મારકો શોધો', pa: 'ਸਮਾਰਕਾਂ ਦੀ ਖੋਜ', ur: 'عمارتیں تلاش کریں', ar: 'استكشف المعالم', zh: '探索古迹', 'zh-TW': '探索古蹟', ja: '記念碑を探索', ko: '유적지 탐색', th: 'สำรวจโบราณสถาน', vi: 'Khám phá di tích', id: 'Jelajahi Monumen', ms: 'Terokai Monumen', fil: 'Galugarin ang Monumento', fr: 'Explorer les monuments', de: 'Denkmäler erkunden', es: 'Explorar monumentos', pt: 'Explorar Monumentos', it: 'Esplora monumenti', nl: 'Monumenten ontdekken', ru: 'Каталог памятников', uk: 'Каталог пам\'яток', tr: 'Anıtları Keşfet', el: 'Εξερευνήστε Μνημεία', he: 'חקור אנדרטאות', fa: 'کاوش بناها', pl: 'Przeglądaj zabytki', cs: 'Prozkoumat památky', sv: 'Utforska monument', no: 'Utforsk monumenter', da: 'Udforsk monumenter', fi: 'Tutki muistomerkkejä', ro: 'Explorează monumentele', hu: 'Műemlékek felfedezése', sw: 'Gundua Kumbukumbu'
  },
  search_by: {
    en: 'Search by name, city, or state...', ta: 'பெயர், நகர் அல்லது மாநிலத்தால் தேடுங்கள்...', hi: 'नाम, शहर या राज्य से खोजें...', te: 'పేరు, నగరం లేదా రాష్ట్రం ద్వారా వెతకండి...', ml: 'പേര്, നഗരം അല്ലെങ്കിൽ സംസ്ഥാനം തിരയൂ...', kn: 'ಹೆಸರು, ನಗರ ಅಥವಾ ರಾಜ್ಯದ ಮೂಲಕ ಹುಡುಕಿ...', bn: 'নাম, শহর বা রাজ্য দিয়ে খুঁজুন...', mr: 'नाव, शहर किंवा राज्यानुसार शोधा...', gu: 'નામ, શહેર અથવા રાજ્ય દ્વારા શોધો...', pa: 'ਨਾਮ, ਸ਼ਹਿਰ ਜਾਂ ਰਾਜ ਨਾਲ ਖੋਜੋ...', ur: 'نام، شہر یا ریاست سے تلاش کریں...', ar: 'ابحث بالاسم أو المدينة أو الولاية...', zh: '按名称、城市或省份搜索...', 'zh-TW': '按名稱、城市或省份搜尋...', ja: '名前、都市、州で検索...', ko: '이름, 도시, 국가로 검색...', th: 'ค้นหาด้วยชื่อ เมือง...', vi: 'Tìm theo tên, thành phố...', id: 'Cari berdasarkan nama, kota...', ms: 'Cari mengikut nama, bandar...', fil: 'Maghanap sa pangalan, lungsod...', fr: 'Rechercher par nom, ville...', de: 'Nach Name, Stadt oder Staat suchen...', es: 'Buscar por nombre, ciudad o estado...', pt: 'Buscar por nome, cidade...', it: 'Cerca per nome, città...', nl: 'Zoek op naam, stad...', ru: 'Поиск по названию или городу...', uk: 'Пошук за назвою або містом...', tr: 'İsim, şehir veya bölgeye göre ara...', el: 'Αναζήτηση με όνομα, πόλη...', he: 'חפש לפי שם, עיר...', fa: 'جستجو بر اساس نام، شهر...', pl: 'Szukaj wg nazwy, miasta...', cs: 'Hledat podle jména, města...', sv: 'Sök på namn, stad...', no: 'Søk etter navn, stad...', da: 'Søg efter navn, by...', fi: 'Hae nimellä, kaupungilla...', ro: 'Caută după nume, oraș...', hu: 'Keresés név, város alapján...', sw: 'Tafuta kwa jina, mji...'
  },
  showing: {
    en: 'Showing', ta: 'காண்பிக்கிறது', hi: 'दिखा रहे हैं', te: 'చూపిస్తోంది', ml: 'കാണിക്കുന്നു', kn: 'ತೋರಿಸುತ್ತಿದೆ', bn: 'দেখাচ্ছে', mr: 'दाखवत आहे', gu: 'દર્શાવે છે', pa: 'ਦਿਖਾ ਰਹੇ ਹਾਂ', ur: 'دکھا رہا ہے', ar: 'عرض', zh: '显示', 'zh-TW': '顯示', ja: '表示中', ko: '표시 중', th: 'กำลังแสดง', vi: 'Hiển thị', id: 'Menampilkan', ms: 'Menunjukkan', fil: 'Ipinapakita', fr: 'Affichage de', de: 'Anzeigen von', es: 'Mostrando', pt: 'Exibindo', it: 'Visualizzazione di', nl: 'Weergave van', ru: 'Показано', uk: 'Показано', tr: 'Gösterilen', el: 'Εμφάνιση', he: 'מציג', fa: 'نمایش', pl: 'Wyświetlanie', cs: 'Zobrazeno', sv: 'Visar', no: 'Viser', da: 'Viser', fi: 'Näytetään', ro: 'Se afișează', hu: 'Megjelenítve', sw: 'Inaonyesha'
  },
  monument: {
    en: 'monument', ta: 'நினைவுச்சின்னம்', hi: 'स्मारक', te: 'స్మారకం', ml: 'സ്മാരകം', kn: 'ಸಾಮ್ರಾಜ್ಯ', bn: 'স্মৃতিস্তম্ভ', mr: 'स्मारक', gu: 'સ્મારક', pa: 'ਸਮਾਰਕ', ur: 'عمارت', ar: 'معلم', zh: '个古迹', 'zh-TW': '個古蹟', ja: '件の記念碑', ko: '개 유적지', th: 'โบราณสถาน', vi: 'di tích', id: 'monumen', ms: 'monumen', fil: 'monumento', fr: 'monument', de: 'Denkmal', es: 'monumento', pt: 'monumento', it: 'monumento', nl: 'monument', ru: 'памятник', uk: 'пам\'ятка', tr: 'anıt', el: 'μνημείο', he: 'אנדרטה', fa: 'بنا', pl: 'zabytek', cs: 'památka', sv: 'monument', no: 'monument', da: 'monument', fi: 'muistomerkki', ro: 'monument', hu: 'műemlék', sw: 'kumbukumbu'
  },
  monuments: {
    en: 'monuments', ta: 'நினைவுச்சின்னங்கள்', hi: 'स्मारक', te: 'స్మారకాలు', ml: 'സ്മാരകങ്ങൾ', kn: 'ಸ್ಮಾರಕಗಳು', bn: 'স্মৃতিস্তম্ভসমূহ', mr: 'स्मारके', gu: 'સ્મારકો', pa: 'ਸਮਾਰਕ', ur: 'عمارتیں', ar: 'معالم', zh: '个古迹', 'zh-TW': '個古蹟', ja: '件の記念碑', ko: '개 유적지', th: 'โบราณสถาน', vi: 'di tích', id: 'monumen', ms: 'monumen', fil: 'mga monumento', fr: 'monuments', de: 'Denkmäler', es: 'monumentos', pt: 'monumentos', it: 'monumenti', nl: 'monumenten', ru: 'памятников', uk: 'пам\'яток', tr: 'anıt', el: 'μνημεία', he: 'אנדרטאות', fa: 'بناها', pl: 'zabytków', cs: 'památek', sv: 'monument', no: 'monumenter', da: 'monumenter', fi: 'muistomerkkiä', ro: 'monumente', hu: 'műemlék', sw: 'kumbukumbu'
  },
  no_monuments: {
    en: 'No monuments found', ta: 'நினைவுச்சின்னங்கள் கிடைக்கவில்லை', hi: 'कोई स्मारक नहीं मिला', te: 'స్మారక చిహ్నాలు కనుగొనబడలేదు', ml: 'ഒരു സ്മാരകവും കണ്ടെത്തിയില്ല', kn: 'ಯಾವ ಸ್ಮಾರಕಗಳೂ ಕಂಡುಬಂದಿಲ್ಲ', bn: 'কোনো স্মৃতিস্তম্ভ পাওয়া যায়নি', mr: 'कोणतेही स्मारक आढळले नाही', gu: 'કોઈ સ્મારક મળ્યા નથી', pa: 'ਕੋਈ ਸਮਾਰਕ ਨਹੀਂ ਮਿਲਿਆ', ur: 'کوئی عمارت نہیں ملی', ar: 'لم يتم العثور على معالم', zh: '未找到相关古迹', 'zh-TW': '未找到相關古蹟', ja: '記念碑が見つかりません', ko: '유적지를 찾을 수 없습니다', th: 'ไม่พบโบราณสถาน', vi: 'Không tìm thấy di tích nào', id: 'Tidak ada monumen ditemukan', ms: 'Tiada monumen ditemui', fil: 'Walang nakitang monumento', fr: 'Aucun monument trouvé', de: 'Keine Denkmäler gefunden', es: 'No se encontraron monumentos', pt: 'Nenhum monumento encontrado', it: 'Nessun monumento trovato', nl: 'Geen monumenten gevonden', ru: 'Памятники не найдены', uk: 'Пам\'ятки не знайдені', tr: 'Anıt bulunamadı', el: 'Δεν βρέθηκαν μνημεία', he: 'לא נמצאו אנדרטאות', fa: 'بنایی یافت نشد', pl: 'Nie znaleziono zabytków', cs: 'Nenalezeny žádné památky', sv: 'Inga monument hittades', no: 'Ingen monumenter funnet', da: 'Ingen monumenter fundet', fi: 'Muistomerkkejä ei löytynyt', ro: 'Nu s-au găsit monumente', hu: 'Nem található műemlék', sw: 'Hakuna kumbukumbu iliyopatikana'
  },

  // ── Favourites ──
  my_favourites: {
    en: 'My Favourites', ta: 'என் பிடித்தவைகள்', hi: 'मेरे पसंदीदा', te: 'నా ఇష్టమైనవి', ml: 'എന്റെ പ്രിയപ്പെട്ടവ', kn: 'ನನ್ನ ನೆಚ್ಚಿನ', bn: 'আমার প্রিয়', mr: 'माझे आवडते', gu: 'મારા મનપસંદ', pa: 'ਮੇਰੇ ਪਸੰਦੀਦਾ', ur: 'میری پسندیدہ', ar: 'المفضلة لدي', zh: '我的收藏', 'zh-TW': '我的收藏', ja: 'お気に入り', ko: '내 즐겨찾기', th: 'รายการโปรดของฉัน', vi: 'Mục yêu thích của tôi', id: 'Favorit Saya', ms: 'Kegemaran Saya', fil: 'Aking Mga Paborito', fr: 'Mes favoris', de: 'Meine Favoriten', es: 'Mis favoritos', pt: 'Meus Favoritos', it: 'I miei preferiti', nl: 'Mijn favorieten', ru: 'Мои избранные', uk: 'Мої улюблені', tr: 'Favorilerim', el: 'Τα Αγαπημένα μου', he: 'המועדפים שלי', fa: 'علاقه‌مندی‌های من', pl: 'Moje ulubione', cs: 'Moje oblíbené', sv: 'Mina favoriter', no: 'Mine favoritter', da: 'Mine favoritter', fi: 'Omat suosikit', ro: 'Favoritele mele', hu: 'Kedvenceim', sw: 'Vipendwa Vyangu'
  },
  no_favourites: {
    en: 'No Favourites Saved Yet', ta: 'இன்னும் பிடித்தவை சேமிக்கப்படவில்லை', hi: 'अभी कोई पसंदीदा नहीं', te: 'ఇంకా ఇష్టమైనవి సేవ్ చేయబడలేదు', ml: 'ഇതുവരെ ഒന്നും സേവ് ചെയ്തിട്ടില്ല', kn: 'ಯಾವ ಇಷ್ಟವಾದವೂ ಉಳಿಸಿಲ್ಲ', bn: 'এখনো কোনো প্রিয় সংরক্ষণ করা হয়নি', mr: 'अद्याप कोणतेही आवडते जतन केलेले नाही', gu: 'હજુ સુધી કોઈ મનપસંદ સાચવ્યા નથી', pa: 'ਅਜੇ ਕੋਈ ਪਸੰਦੀਦਾ ਸੰਭਾਲਿਆ ਨਹੀਂ ਗਿਆ', ur: 'ابھی تک کوئی پسندیدہ محفوظ نہیں کیا گیا', ar: 'لم يتم حفظ مفضلات بعد', zh: '暂无收藏的古迹', 'zh-TW': '暫無收藏的古蹟', ja: 'まだお気に入りがありません', ko: '저장된 즐겨찾기가 없습니다', th: 'ยังไม่มีรายการโปรดที่บันทึกไว้', vi: 'Chưa có yêu thích nào được lưu', id: 'Belum Ada Favorit Tersimpan', ms: 'Belum Ada Kegemaran Disimpan', fil: 'Wala Pang Naka-save na Paborito', fr: 'Aucun favori enregistré', de: 'Noch keine Favoriten gespeichert', es: 'Aún no hay favoritos guardados', pt: 'Nenhum favorito salvo ainda', it: 'Nessun preferito salvato', nl: 'Nog geen favorieten opgeslagen', ru: 'Избранных пока нет', uk: 'Улюблених поки немає', tr: 'Henüz Kaydedilen Favori Yok', el: 'Δεν υπάρχουν ακόμη αποθηκευμένα αγαπημένα', he: 'טרם נשמרו מועדפים', fa: 'هنوز علاقه‌مندی ذخیره نشده است', pl: 'Brak zapisanych ulubionych', cs: 'Zatím žádné uložené oblíbené', sv: 'Inga favoriter sparade ännu', no: 'Ingen favoritter lagret ennå', da: 'Ingen favoritter gemt endnu', fi: 'Ei vielä tallennettuja suosikkeja', ro: 'Nu există favorite salvate încă', hu: 'Még nincsenek mentett kedvencek', sw: 'Hakuna Vipendwa Vilivyohifadhiwa Bado'
  },
  explore_monuments: {
    en: 'Explore Monuments', ta: 'நினைவுச்சின்னங்களை ஆராயுங்கள்', hi: 'स्मारक एक्सप्लोर करें', te: 'స్మారకాలను అన్వేషించండి', ml: 'സ്മാരകങ്ങൾ അന്വേഷിക്കൂ', kn: 'ಸ್ಮಾರಕಗಳನ್ನು ಅನ್ವೇಷಿಸಿ', bn: 'স্মৃতিস্তম্ভসমূহ অন্বেষণ করুন', mr: 'स्मारके शोधा', gu: 'સ્મારકો શોધો', pa: 'ਸਮਾਰਕਾਂ ਦੀ ਖੋਜ ਕਰੋ', ur: 'عمارتیں تلاش کریں', ar: 'استكشف المعالم', zh: '去探索古迹', 'zh-TW': '去探索古蹟', ja: '記念碑を探索', ko: '유적지 탐색', th: 'สำรวจโบราณสถาน', vi: 'Khám phá di tích', id: 'Jelajahi Monumen', ms: 'Terokai Monumen', fil: 'Galugarin ang Monumento', fr: 'Explorer les monuments', de: 'Denkmäler erkunden', es: 'Explorar monumentos', pt: 'Explorar Monumentos', it: 'Esplora monumenti', nl: 'Monumenten ontdekken', ru: 'Перейти к обзору', uk: 'Перейти до огляду', tr: 'Anıtları Keşfet', el: 'Εξερευνήστε Μνημεία', he: 'חקור אנדרטאות', fa: 'کاوش بناها', pl: 'Przeglądaj zabytki', cs: 'Prozkoumat památky', sv: 'Utforska monument', no: 'Utforsk monumenter', da: 'Udforsk monumenter', fi: 'Tutki muistomerkkejä', ro: 'Explorează monumentele', hu: 'Műemlékek felfedezése', sw: 'Gundua Kumbukumbu'
  },
  saved_sites: {
    en: 'saved heritage site', ta: 'சேமிக்கப்பட்ட தலம்', hi: 'सहेजी गई विरासत', te: 'సేవ్ చేసిన స్థలం', ml: 'സേവ് ചെയ്ത സ്ഥലം', kn: 'ಉಳಿಸಿದ ತಾಣ', bn: 'সংরক্ষিত স্থান', mr: 'जतन केलेले ठिकाण', gu: 'સાચવેલ સ્થળ', pa: 'ਸੰਭਾਲਿਆ ਸਥਾਨ', ur: 'محفوظ شدہ مقام', ar: 'موقع محفوظ', zh: '已收藏的地方', 'zh-TW': '已收藏的地方', ja: '保存された場所', ko: '저장된 유적지', th: 'สถานที่ที่บันทึกไว้', vi: 'địa điểm đã lưu', id: 'situs tersimpan', ms: 'tapak disimpan', fil: 'naka-save na site', fr: 'site du patrimoine enregistré', de: 'gespeicherter Ort', es: 'sitio guardado', pt: 'local salvo', it: 'sito salvato', nl: 'opgeslagen plek', ru: 'сохраненное место', uk: 'збережене місце', tr: 'kaydedilen alan', el: 'αποθηκευμένη τοποθεσία', he: 'אתר שמור', fa: 'مکان ذخیره شده', pl: 'zapisany zabytek', cs: 'uložené místo', sv: 'sparad plats', no: 'lagret sted', da: 'gemt sted', fi: 'tallennettu kohde', ro: 'locatție salvată', hu: 'mentett helyszín', sw: 'eneeo lililohifadhiwa'
  },

  // ── Detail Modal ──
  listen_guide: {
    en: 'Listen Guide', ta: 'கேளுங்கள்', hi: 'गाइड सुनें', te: 'గైడ్ వినండి', ml: 'ഗൈഡ് കേൾക്കൂ', kn: 'ಮಾರ್ಗದರ್ಶಿ ಕೇಳಿ', bn: 'গাইড শুনুন', mr: 'मार्गदर्शक ऐका', gu: 'ગાઇડ સાંભળો', pa: 'ਗਾਈਡ ਸੁਣੋ', ur: 'گائیڈ سنیں', ar: 'استمع للمرشد', zh: '语音导览', 'zh-TW': '語音導覽', ja: '音声ガイド', ko: '음성 가이드', th: 'ฟังไกด์', vi: 'Nghe hướng dẫn', id: 'Dengar Panduan', ms: 'Dengar Panduan', fil: 'Makinig sa Guide', fr: 'Écouter le guide', de: 'Guide anhören', es: 'Escuchar guía', pt: 'Ouvir Guia', it: 'Ascolta guida', nl: 'Gids beluisteren', ru: 'Аудиогид', uk: 'Аудіогід', tr: 'Rehberi Dinle', el: 'Ακούστε τον Οδηγό', he: 'הקשב למדריך', fa: 'شنیدن راهنما', pl: 'Słuchaj przewodnika', cs: 'Poslechnout průvodce', sv: 'Lyssna på guide', no: 'Lytt til guide', da: 'Lyt til guide', fi: 'Kuuntele opasta', ro: 'Ascultă ghidul', hu: 'Útmutató hallgatása', sw: 'Sikiliza Mwongozo'
  },
  pause_audio: {
    en: 'Pause', ta: 'இடைநிறுத்து', hi: 'रोकें', te: 'పాజ్', ml: 'താൽക്കാലികമായി നിർത്തൂ', kn: 'ವಿರಾಮ', bn: 'বিরতি', mr: 'थंबवा', gu: 'અટકાવો', pa: 'ਰੋਕੋ', ur: 'وقفہ', ar: 'إيقاف مؤقت', zh: '暂停', 'zh-TW': '暫停', ja: '一時停止', ko: '일시정지', th: 'หยุดชั่วคราว', vi: 'Tạm dừng', id: 'Jeda', ms: 'Jeda', fil: 'I-pause', fr: 'Pause', de: 'Pause', es: 'Pausa', pt: 'Pausar', it: 'Pausa', nl: 'Pauze', ru: 'Пауза', uk: 'Пауза', tr: 'Duraklat', el: 'Παύση', he: 'השהה', fa: 'مکث', pl: 'Pauza', cs: 'Pauza', sv: 'Pausa', no: 'Pause', da: 'Pause', fi: 'Tauko', ro: 'Pauză', hu: 'Szünet', sw: 'Sitisha'
  },
  stop_audio: {
    en: 'Stop', ta: 'நிறுத்து', hi: 'बंद करें', te: 'ఆపు', ml: 'നിർത്തൂ', kn: 'ನಿಲ್ಲಿಸಿ', bn: 'থামান', mr: 'बंद करा', gu: 'બંધ કરો', pa: 'ਬੰਦ ਕਰੋ', ur: 'روکیں', ar: 'إيقاف', zh: '停止', 'zh-TW': '停止', ja: '停止', ko: '정지', th: 'หยุด', vi: 'Dừng', id: 'Berhenti', ms: 'Berhenti', fil: 'Itigil', fr: 'Arrêter', de: 'Stopp', es: 'Detener', pt: 'Parar', it: 'Interrompi', nl: 'Stoppen', ru: 'Стоп', uk: 'Стоп', tr: 'Durdur', el: 'Διακοπή', he: 'עצור', fa: 'توقف', pl: 'Zatrzymaj', cs: 'Zastavit', sv: 'Stoppa', no: 'Stopp', da: 'Stop', fi: 'Pysäytä', ro: 'Oprește', hu: 'Leállítás', sw: 'Acha'
  },
  ask_ai: {
    en: 'Ask AI Guide', ta: 'AI வழிகாட்டியிடம் கேளுங்கள்', hi: 'AI गाइड से पूछें', te: 'AI గైడ్‌ను అడగండి', ml: 'AI ഗൈഡിനോട് ചോദിക്കൂ', kn: 'AI ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಕೇಳಿ', bn: 'AI গাইডকে জিজ্ঞাসা করুন', mr: 'AI मार्गदर्शकाला विचारा', gu: 'AI માર્ગદર્શકને પૂછો', pa: 'AI ਗਾਈਡ ਨੂੰ ਪੁੱਛੋ', ur: 'AI گائیڈ سے پوچھیں', ar: 'اسأل مرشد الذكاء الاصطناعي', zh: '咨询 AI 导游', 'zh-TW': '諮詢 AI 導遊', ja: 'AIガイドに質問', ko: 'AI 가이드에게 질문', th: 'ถามไกด์ AI', vi: 'Hỏi hướng dẫn viên AI', id: 'Tanya Pemandu AI', ms: 'Tanya Panduan AI', fil: 'Magtanong sa AI Guide', fr: 'Demander au guide IA', de: 'KI-Guide fragen', es: 'Preguntar al guía de IA', pt: 'Perguntar ao Guia IA', it: 'Chiedi alla Guida IA', nl: 'Vraag AI-gids', ru: 'Спросить ИИ-гида', uk: 'Запитати ШІ-гіда', tr: 'Yapay Zeka Rehberine Sor', el: 'Ρωτήστε τον Οδηγό AI', he: 'שאל את מדריך ה-AI', fa: 'پرسش از راهنمای هوش مصنوعی', pl: 'Zapytaj przewodnika AI', cs: 'Zeptat se AI průvodce', sv: 'Fråga AI-guiden', no: 'Spør AI-guiden', da: 'Spørg AI-guiden', fi: 'Kysy AI-oppaalta', ro: 'Întreabă ghidul AI', hu: 'Kérdezze az AI útmutatót', sw: 'Uliza Mwongozo wa AI'
  },
  ar_view: {
    en: '3D AR View', ta: '3D AR பார்வை', hi: '3D AR दृश्य', te: '3D AR వీక్షణ', ml: '3D AR കാഴ്ച', kn: '3D AR ನೋಟ', bn: '3D AR ভিউ', mr: '3D AR दृश्य', gu: '3D AR દ્રશ્ય', pa: '3D AR ਦ੍ਰਿਸ਼', ur: '3D AR ویو', ar: 'عرض AR ثلاثي الأبعاد', zh: '3D AR 视角', 'zh-TW': '3D AR 視角', ja: '3D ARビュー', ko: '3D AR 뷰', th: 'มุมมอง 3D AR', vi: 'Chế độ 3D AR', id: 'Tampilan 3D AR', ms: 'Paparan 3D AR', fil: '3D AR View', fr: 'Vue 3D AR', de: '3D AR Ansicht', es: 'Vista 3D AR', pt: 'Visualização 3D AR', it: 'Vista 3D AR', nl: '3D AR-weergave', ru: '3D AR Вид', uk: '3D AR Вигляд', tr: '3D AR Görünümü', el: 'Προβολή 3D AR', he: 'תצוגת AR תלת ממדית', fa: 'نمای 3D AR', pl: 'Widok 3D AR', cs: '3D AR pohled', sv: '3D AR-vy', no: '3D AR-visning', da: '3D AR-visning', fi: '3D AR -näkymä', ro: 'Vizualizare 3D AR', hu: '3D AR nézet', sw: 'Muonekano wa 3D AR'
  },
  tab_overview: {
    en: 'Overview', ta: 'கண்ணோட்டம்', hi: 'अवलोकन', te: 'అవలోకనం', ml: 'അവലോകനം', kn: 'ಅವಲೋಕನ', bn: 'সংক্ষিপ্ত বিবরণ', mr: 'आढावा', gu: 'અવલોકન', pa: 'ਸੰਖੇਪ', ur: 'خلاصہ', ar: 'نظرة عامة', zh: '概览', 'zh-TW': '概覽', ja: '概要', ko: '개요', th: 'ภาพรวม', vi: 'Tổng quan', id: 'Ikhtisar', ms: 'Gambaran Keseluruhan', fil: 'Pangkalahatang-ideya', fr: 'Aperçu', de: 'Überblick', es: 'Resumen', pt: 'Visão Geral', it: 'Panoramica', nl: 'Overzicht', ru: 'Обзор', uk: 'Огляд', tr: 'Genel Bakış', el: 'Επισκόπηση', he: 'סקירה כללית', fa: 'بررسی کلی', pl: 'Przegląd', cs: 'Přehled', sv: 'Översikt', no: 'Oversikt', da: 'Oversigt', fi: 'Yleiskatsaus', ro: 'Prezentare generală', hu: 'Áttekintés', sw: 'Muhtasari'
  },
  tab_history: {
    en: 'History', ta: 'வரலாறு', hi: 'इतिहास', te: 'చరిత్ర', ml: 'ചരിത്രം', kn: 'ಇತಿಹಾಸ', bn: 'ইতিহাস', mr: 'इतिहास', gu: 'ઇતિહાસ', pa: 'ਇਤਿਹਾਸ', ur: 'تاریخ', ar: 'التاريخ', zh: '历史', 'zh-TW': '歷史', ja: '歴史', ko: '역사', th: 'ประวัติศาสตร์', vi: 'Lịch sử', id: 'Sejarah', ms: 'Sejarah', fil: 'Kasaysayan', fr: 'Histoire', de: 'Geschichte', es: 'Historia', pt: 'História', it: 'Storia', nl: 'Geschiedenis', ru: 'История', uk: 'Історія', tr: 'Tarih', el: 'Ιστορία', he: 'היסטוריה', fa: 'تاریخچه', pl: 'Historia', cs: 'Historie', sv: 'Historia', no: 'Historie', da: 'Historie', fi: 'Historia', ro: 'Istorie', hu: 'Történelem', sw: 'Historia'
  },
  tab_architecture: {
    en: 'Architecture', ta: 'கட்டிடக்கலை', hi: 'वास्तुकला', te: 'వాస్తుశిల్పం', ml: 'വാസ്തുശില്പം', kn: 'ವಾಸ್ತುಶಿಲ್ಪ', bn: 'স্থাপত্য', mr: 'वास्तुकला', gu: 'સ્થાપત્ય', pa: 'ਵਾਸਤੂਕਲਾ', ur: 'فنِ تعمیر', ar: 'العمارة', zh: '建筑风格', 'zh-TW': '建築風格', ja: '建築', ko: '건축', th: 'สถาปัตยกรรม', vi: 'Kiến trúc', id: 'Arsitektur', ms: 'Seni Bina', fil: 'Arkitektura', fr: 'Architecture', de: 'Architektur', es: 'Arquitectura', pt: 'Arquitetura', it: 'Architettura', nl: 'Architectuur', ru: 'Архитектура', uk: 'Архітектура', tr: 'Mimari', el: 'Αρχιτεκτονική', he: 'ארכיטקטורה', fa: 'معماری', pl: 'Architektura', cs: 'Architektura', sv: 'Arkitektur', no: 'Arkitektur', da: 'Arkitektur', fi: 'Arkkitehtuuri', ro: 'Arhitectură', hu: 'Építészet', sw: 'Usanifu'
  },
  tab_ai: {
    en: '🤖 AI Assistant', ta: '🤖 AI உதவியாளர்', hi: '🤖 AI सहायक', te: '🤖 AI సహాయకుడు', ml: '🤖 AI സഹായി', kn: '🤖 AI ಸಹಾಯಕ', bn: '🤖 AI সহকারী', mr: '🤖 AI सहाय्यक', gu: '🤖 AI મદદનીશ', pa: '🤖 AI ਸਹਾਇਕ', ur: '🤖 AI معاون', ar: '🤖 مساعد الذكاء الاصطناعي', zh: '🤖 AI 助手', 'zh-TW': '🤖 AI 助手', ja: '🤖 AIアシスタント', ko: '🤖 AI 어시스턴트', th: '🤖 ผู้ช่วย AI', vi: '🤖 Trợ lý AI', id: '🤖 Asisten AI', ms: '🤖 Pembantu AI', fil: '🤖 AI Assistant', fr: '🤖 Assistant IA', de: '🤖 KI-Assistent', es: '🤖 Asistente IA', pt: '🤖 Assistente IA', it: '🤖 Assistente IA', nl: '🤖 AI-assistent', ru: '🤖 ИИ-ассистент', uk: '🤖 ШІ-асистент', tr: '🤖 Yapay Zeka Asistanı', el: '🤖 Βοηθός AI', he: '🤖 עוזר AI', fa: '🤖 دستیار هوش مصنوعی', pl: '🤖 Asystent AI', cs: '🤖 AI Asistent', sv: '🤖 AI-assistent', no: '🤖 AI-assistent', da: '🤖 AI-assistent', fi: '🤖 AI-avustaja', ro: '🤖 Asistent AI', hu: '🤖 AI asszisztens', sw: '🤖 Msaidizi wa AI'
  },

  // ── Profile & Settings ──
  app_preferences: {
    en: 'App Preferences', ta: 'செயலி விருப்பங்கள்', hi: 'ऐप प्राथमिकताएं', te: 'యాప్ ప్రాధాన్యతలు', ml: 'ആപ്പ് മുൻഗണനകൾ', kn: 'ಅಪ್ಲಿಕೇಶನ್ ಆದ್ಯತೆಗಳು', bn: 'অ্যাপের পছন্দসমূহ', mr: 'ॲप प्राधान्ये', gu: 'એપ પસંદગીઓ', pa: 'ਐਪ ਤਰਜੀਹਾਂ', ur: 'ایپ کی ترجیحات', ar: 'تفضيلات التطبيق', zh: '应用偏好', 'zh-TW': '應用偏好', ja: 'アプリ設定', ko: '앱 환경설정', th: 'การตั้งค่าแอป', vi: 'Tùy chỉnh ứng dụng', id: 'Preferensi Aplikasi', ms: 'Keutamaan Aplikasi', fil: 'Mga Kagustuhan sa App', fr: "Préférences de l'application", de: 'App-Einstellungen', es: 'Preferencias de la app', pt: 'Preferências do Aplicativo', it: 'Preferenze app', nl: 'App-voorkeuren', ru: 'Настройки приложения', uk: 'Налаштування програми', tr: 'Uygulama Tercihleri', el: 'Προτιμήσεις Εφαρμογής', he: 'העדפות אפליקציה', fa: 'تنظیمات برنامه', pl: 'Preferencje aplikacji', cs: 'Nastavení aplikace', sv: 'Appinställningar', no: 'Appinnstillinger', da: 'App-indstillinger', fi: 'Sovelluksen asetukset', ro: 'Preferințe aplicație', hu: 'Alkalmazás beállításai', sw: 'Mapendeleo ya Programu'
  },
  dark_theme: {
    en: 'Dark Theme', ta: 'இருண்ட தீம்', hi: 'डार्क थीम', te: 'డార్క్ థీమ్', ml: 'ഡാർക്ക് തീം', kn: 'ಡಾರ್ಕ್ ಥೀಮ್', bn: 'ডার্ক থিম', mr: 'डार्क थीम', gu: 'ડાર્ક થીમ', pa: 'ਡਾਰਕ ਥੀਮ', ur: 'ڈارک تھیم', ar: 'المظهر الداكن', zh: '深色主题', 'zh-TW': '深色主題', ja: 'ダークテーマ', ko: '다크 테마', th: 'ธีมมืด', vi: 'Giao diện tối', id: 'Tema Gelap', ms: 'Tema Gelap', fil: 'Dark Theme', fr: 'Thème sombre', de: 'Dunkles Theme', es: 'Tema oscuro', pt: 'Tema Escuro', it: 'Tema scuro', nl: 'Donker thema', ru: 'Темная тема', uk: 'Темна тема', tr: 'Karanlık Tema', el: 'Σκούρο Θέμα', he: 'ערכת נושא כהה', fa: 'تم تاریک', pl: 'Ciemny motyw', cs: 'Tmavé téma', sv: 'Mörkt tema', no: 'Mørkt tema', da: 'Mørkt tema', fi: 'Tumma teema', ro: 'Temă întunecată', hu: 'Sötét téma', sw: 'Mandhari meusi'
  },
  dark_theme_desc: {
    en: 'Adjust visual theme to dark palette', ta: 'காட்சி தீம்மை இருண்ட நிறத்திற்கு மாற்றவும்', hi: 'विजुअल थीम को डार्क में बदलें', te: 'విజువల్ థీమ్‌ని డార్క్ పాలెట్‌కు మార్చండి', ml: 'വിഷ്വൽ തീം ഇരുണ്ട പാലറ്റിലേക്ക് മാറ്റൂ', kn: 'ದೃಶ್ಯ ಥೀಮ್ ಅನ್ನು ಡಾರ್ಕ್‌ಗೆ ಬದಲಿಸಿ', bn: 'আভা ডার্ক মোডে পরিবর্তন করুন', mr: 'विझ्युअल थीम डार्कवर बदला', gu: 'વિઝ્યુઅલ થીમ ડાર્ક મોડમાં બદલો', pa: 'ਵਿਜ਼ੂਅਲ ਥੀਮ ਨੂੰ ਡਾਰਕ ਕਰੋ', ur: 'ڈارک تھیم میں تبدیل کریں', ar: 'تغيير المظهر إلى اللون الداكن', zh: '切换到深色外观', 'zh-TW': '切換到深色外觀', ja: 'ダークパレットに変更', ko: '어두운 테마로 전환', th: 'สลับเป็นธีมสีเข้ม', vi: 'Chuyển sang giao diện tối', id: 'Ubah ke tema gelap', ms: 'Tukar ke tema gelap', fil: 'Palitan sa dark mode', fr: 'Passer au thème sombre', de: 'Zum dunklen Farbschema wechseln', es: 'Cambiar al tema oscuro', pt: 'Mudar para o tema escuro', it: 'Passa al tema scuro', nl: 'Schakel over naar donker thema', ru: 'Переключить на темный режим', uk: 'Переключити на темний режим', tr: 'Karanlık moda geç', el: 'Αλλαγή σε σκούρα εμφάνιση', he: 'עבור למצב כהה', fa: 'تغییر به تم تاریک', pl: 'Przełącz na ciemny motyw', cs: 'Přepnout na tmavé téma', sv: 'Växla till mörkt tema', no: 'Bytt til mørkt tema', da: 'Skift til mørkt tema', fi: 'Vaihda tummaan teemaan', ro: 'Comută la tema întunecată', hu: 'Váltás sötét témára', sw: 'Badilisha kuwa muonekano mweusi'
  },
  language: {
    en: 'Language', ta: 'மொழி', hi: 'भाषा', te: 'భాష', ml: 'ഭാഷ', kn: 'ಭಾಷೆ', bn: 'ভাষা', mr: 'भाषा', gu: 'ભાષા', pa: 'ਭਾਸ਼ਾ', ur: 'زبان', ar: 'اللغة', zh: '语言', 'zh-TW': '語言', ja: '言語', ko: '언어', th: 'ภาษา', vi: 'Ngôn ngữ', id: 'Bahasa', ms: 'Bahasa', fil: 'Wika', fr: 'Langue', de: 'Sprache', es: 'Idioma', pt: 'Idioma', it: 'Lingua', nl: 'Taal', ru: 'Язык', uk: 'Мова', tr: 'Dil', el: 'Γλώσσα', he: 'שפה', fa: 'زبان', pl: 'Język', cs: 'Jazyk', sv: 'Språk', no: 'Språk', da: 'Sprog', fi: 'Kieli', ro: 'Limbă', hu: 'Nyelv', sw: 'Lugha'
  },
  notifications: {
    en: 'Push Notifications', ta: 'புஷ் அறிவிப்புகள்', hi: 'पुश नोटिफिकेशन', te: 'పుష్ నోటిఫికేషన్‌లు', ml: 'പുഷ് നോടിഫിക്കേഷനുകൾ', kn: 'ಪುಶ್ ಅಧಿಸೂಚನೆಗಳು', bn: 'পুশ নোটিফিকেশন', mr: 'पुश सूचना', gu: 'પુશ સૂચનાઓ', pa: 'ਪੁਸ਼ ਨੋਟੀਫਿਕੇਸ਼ਨ', ur: 'پش اطلاعات', ar: 'الإشعارات المباشرة', zh: '推送通知', 'zh-TW': '推送通知', ja: 'プッシュ通知', ko: '푸시 알림', th: 'การแจ้งเตือน', vi: 'Thông báo đẩy', id: 'Notifikasi Push', ms: 'Pemberitahuan', fil: 'Mga Notipikasyon', fr: 'Notifications push', de: 'Push-Benachrichtigungen', es: 'Notificaciones push', pt: 'Notificações Push', it: 'Notifiche push', nl: 'Pushmeldingen', ru: 'Пуш-уведомления', uk: 'Сповіщення', tr: 'Anlık Bildirimler', el: 'Ειδοποιήσεις Push', he: 'התראות פוש', fa: 'اعلان‌ها', pl: 'Powiadomienia push', cs: 'Upozornění', sv: 'Push-meddelanden', no: 'Push-varsler', da: 'Push-meddelelser', fi: 'Push-ilmoitukset', ro: 'Notificări push', hu: 'Értesítések', sw: 'Arifa'
  },
  logout: {
    en: 'Logout', ta: 'வெளியேறு', hi: 'लॉगआउट', te: 'లాగ్‌అవుట్', ml: 'ലോഗ്ഔട്ട്', kn: 'ಲಾಗ್ ಔಟ್', bn: 'লগআউট', mr: 'लॉगआउट', gu: 'લૉગ આઉટ', pa: 'ਲੌਗ ਆਉਟ', ur: 'لاگ آؤٹ', ar: 'تسجيل الخروج', zh: '退出登录', 'zh-TW': '登出', ja: 'ログアウト', ko: '로그아웃', th: 'ออกจากระบบ', vi: 'Đăng xuất', id: 'Keluar', ms: 'Log Keluar', fil: 'Mag-log out', fr: 'Déconnexion', de: 'Abmelden', es: 'Cerrar sesión', pt: 'Sair', it: 'Disconnetti', nl: 'Uitloggen', ru: 'Выйти', uk: 'Вийти', tr: 'Çıkış Yap', el: 'Αποσύνδεση', he: 'התנתק', fa: 'خروج', pl: 'Wyloguj', cs: 'Odhlásit se', sv: 'Logga ut', no: 'Logg ut', da: 'Log ud', fi: 'Kirjaudu ulos', ro: 'Deconectare', hu: 'Kijelentkezés', sw: 'Ondoka'
  },
  select_language: {
    en: 'Select Language', ta: 'மொழியைத் தேர்ந்தெடுக்கவும்', hi: 'भाषा चुनें', te: 'భాషను ఎంచుకోండి', ml: 'ഭാഷ തിരഞ്ഞെടുക്കൂ', kn: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', bn: 'ভাষা নির্বাচন করুন', mr: 'भाषा निवडा', gu: 'ભાષા પસંદ કરો', pa: 'ਭਾਸ਼ਾ ਚੁਣੋ', ur: 'زبان منتخب کریں', ar: 'اختر اللغة', zh: '选择语言', 'zh-TW': '選擇語言', ja: '言語を選択', ko: '언어 선택', th: 'เลือกภาษา', vi: 'Chọn ngôn ngữ', id: 'Pilih Bahasa', ms: 'Pilih Bahasa', fil: 'Pumili ng Wika', fr: 'Choisir la langue', de: 'Sprache wählen', es: 'Seleccionar idioma', pt: 'Selecionar Idioma', it: 'Seleziona lingua', nl: 'Selecteer taal', ru: 'Выберите язык', uk: 'Оберіть мову', tr: 'Dil Seçin', el: 'Επιλέξτε Γλώσσα', he: 'בחר שפה', fa: 'انتخاب زبان', pl: 'Wybierz język', cs: 'Vybrat jazyk', sv: 'Välj språk', no: 'Velg språk', da: 'Vælg sprog', fi: 'Valitse kieli', ro: 'Selectează limba', hu: 'Válasszon nyelvet', sw: 'Chagua Lugha'
  },
  search_lang: {
    en: 'Search language by name or script...',
    ta: 'பெயர் அல்லது எழுத்தால் தேடுங்கள்...',
    hi: 'नाम या लिपि से भाषा खोजें...',
    te: 'పేరు లేదా లిపి ద్వారా వెతకండి...',
    ml: 'പേര് അല്ലെങ്കിൽ ലിപി വഴി തിരയൂ...',
    ar: 'ابحث عن اللغة بالاسم أو الخط...',
    zh: '按名称或文字搜索语言...',
    ja: '言語名やスクリプトで検索...',
    es: 'Buscar idioma por nombre o escritura...'
  }
};

let _currentLang = 'en';

export function setLanguage(code) {
  const langObj = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  _currentLang = langObj.code;
  
  // Set HTML lang attribute
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = _currentLang;
    document.documentElement.dir  = langObj.rtl ? 'rtl' : 'ltr';
  }
}

export function getLanguage() {
  return _currentLang;
}

export function getLanguageObj(code = _currentLang) {
  return LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
}

export function getVoiceLangCode(code = _currentLang) {
  const obj = getLanguageObj(code);
  return obj.bcp47 || 'en-US';
}

/**
 * Returns translated string for key, falling back gracefully to English.
 */
export function t(key) {
  const entry = TRANSLATIONS[key];
  if (!entry) {
    return key;
  }
  return entry[_currentLang] || entry['en'] || key;
}

/**
 * Renders the Searchable Language Modal Dialog.
 */
export function renderLanguageModal(searchQuery = '') {
  const currentObj = getLanguageObj();
  const q = searchQuery.toLowerCase().trim();

  const filteredLangs = LANGUAGES.filter(l => 
    !q || 
    l.label.toLowerCase().includes(q) || 
    l.nativeLabel.toLowerCase().includes(q) || 
    l.code.toLowerCase().includes(q)
  );

  return `
    <div class="modal-backdrop" onclick="if(event.target === this) window.closeModal();" style="z-index: 12000;">
      <div class="modal-container" style="max-width: 580px; padding: 24px; max-height: 85vh; display: flex; flex-direction: column;">
        
        <button class="modal-close-btn" onclick="window.closeModal()">
          <span class="material-symbols-rounded">close</span>
        </button>

        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
          <span class="material-symbols-rounded" style="color: var(--color-primary); font-size: 32px;">language</span>
          <div>
            <h2 style="font-size: 1.25rem; margin: 0; color: var(--text-primary);">${t('select_language')}</h2>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              Current: <strong>${currentObj.nativeLabel} (${currentObj.label})</strong>
            </div>
          </div>
        </div>

        <!-- Search Bar -->
        <div style="position: relative; margin-bottom: 16px;">
          <span class="material-symbols-rounded" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 20px;">search</span>
          <input 
            type="text" 
            id="lang-modal-search"
            placeholder="${t('search_lang') || 'Search language by name or script...'}"
            value="${searchQuery.replace(/"/g, '&quot;')}"
            oninput="window.filterLanguageModal(this.value)"
            style="width: 100%; padding: 10px 14px 10px 42px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-size: 0.9rem;"
          />
        </div>

        <!-- Scrollable Language List Grid -->
        <div style="flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; padding-right: 4px;">
          ${filteredLangs.map(l => `
            <button 
              type="button"
              onclick="window.changeLanguage('${l.code}')"
              style="display: flex; flex-direction: column; align-items: flex-start; padding: 10px 14px; border-radius: var(--radius-md); border: 2px solid ${l.code === _currentLang ? 'var(--color-primary)' : 'var(--border-subtle)'}; background: ${l.code === _currentLang ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-secondary)'}; cursor: pointer; text-align: left; transition: all 0.15s ease;"
            >
              <div style="font-weight: 800; font-size: 1rem; color: ${l.code === _currentLang ? 'var(--color-primary)' : 'var(--text-primary)'};">${l.nativeLabel}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${l.label}</div>
            </button>
          `).join('')}
        </div>

        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border-subtle); text-align: right;">
          <button class="chip active" onclick="window.closeModal()" style="padding: 8px 20px; font-weight: 700;">
            Done
          </button>
        </div>

      </div>
    </div>
  `;
}
