// Kisan Voice Hotline ("Call Doctor") Engine

export interface VoiceDoctorProfile {
  id: string;
  name: string;
  specialty: string;
  phoneExtension: string;
  avatar: string;
  greetingText: Record<string, string>;
}

export const DOCTOR_PROFILES: VoiceDoctorProfile[] = [
  {
    id: 'doc-pathology',
    name: 'Dr. M. S. Swaminathan (AI)',
    specialty: 'Chief Plant Pathologist & Fungal Diagnostics',
    phoneExtension: '1800-SKY-CROP-1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    greetingText: {
      en: 'Namaste Kisan! I am your AI Agronomist on call. Which crop disease or pest symptom are you seeing in your field?',
      hi: 'नमस्ते किसान भाई! मैं आपका फसल डॉक्टर हूँ। आपके खेत में कौन सी बीमारी या कीड़ा लगा है?',
      pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤੁਹਾਡਾ ਫਸਲ ਮਾਹਿਰ ਹਾਂ। ਤੁਹਾਡੇ ਖੇਤ ਵਿੱਚ ਕਿਹੜੀ ਬਿਮਾਰੀ ਜਾਂ ਕੀੜਾ ਨਜ਼ਰ ਆ ਰਿਹਾ ਹੈ?',
      te: 'నమస్కారం రైతు సోదరా! నేను మీ AI పంట వైద్యుడిని. మీ పొలంలో ఏ తెగులు లేదా పురుగు కనిపిస్తోంది?',
      ta: 'வணக்கம் விவசாய நண்பரே! நான் உங்கள் AI பயிர் மருத்துவர். உங்கள் பயிரில் என்ன நோய் அல்லது பூச்சி தாக்குதல் உள்ளது?',
      mr: 'नमस्कार शेतकरी बंधूंनो! मी आपला पीक सल्लागार डॉक्टर आहे. आपल्या शेतात कोणत्या रोगाची लक्षणे दिसत आहेत?'
    }
  },
  {
    id: 'doc-fertilizer',
    name: 'Dr. Ramesh Sharma',
    specialty: 'Soil Nutrient & NPK Fertigation Specialist',
    phoneExtension: '1800-SKY-CROP-2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    greetingText: {
      en: 'Hello! I am Dr. Sharma from Soil Science. Tell me your crop stage and fertilizer requirement.',
      hi: 'राम राम! मैं डॉक्टर शर्मा, मृदा विशेषज्ञ। अपनी फसल की अवस्था और खाद की ज़रूरत बताएं।',
      pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਡਾ. ਸ਼ਰਮਾ, ਖਾਦ ਅਤੇ ਮਿੱਟੀ ਮਾਹਿਰ। ਆਪਣੀ ਫਸਲ ਦੀ ਸਟੇਜ ਦੱਸੋ।',
      te: 'హలో! నేను డాక్టర్ శర్మ. మీ పంట దశ మరియు ఎరువుల మోతాదు గురించి అడగండి.',
      ta: 'வணக்கம்! நான் டாக்டர் சர்மா. உங்கள் உர அளவு மற்றும் மண் வளம் பற்றி கேளுங்கள்.',
      mr: 'राम राम! मी डॉ. शर्मा, खत व जमीन तज्ज्ञ. आपल्या पिकाची खत मात्रा विचारा.'
    }
  },
  {
    id: 'doc-market',
    name: 'Shri Vikram Patel',
    specialty: 'APMC Mandi Intelligence & MSP Pricing Desk',
    phoneExtension: '1800-SKY-CROP-3',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    greetingText: {
      en: 'Kisan Mandi Desk online! Ask for today\'s wheat, paddy, tomato, or cotton rates across yards.',
      hi: 'किसान मंडी डेस्क में स्वागत है! गेहूं, धान, टमाटर या कपास के आज के ताज़ा भाव पूछें।',
      pa: 'ਕਿਸਾਨ ਮੰਡੀ ਡੈਸਕ ਹਾਜ਼ਰ ਹੈ! ਕਣਕ, ਝੋਨਾ, ਜਾਂ ਆਲੂ ਦੇ ਅੱਜ ਦੇ ਮੰਡੀ ਰੇਟ ਪੁੱਛੋ।',
      te: 'కిసాన్ మార్కెట్ డెస్క్! గోధుమలు, వరి, టమోటా తాజా మార్కెట్ ధరలు అడగండి.',
      ta: 'விவசாய சந்தை மையம்! இன்றைய நெல், தக்காளி சந்தை விலைகளை அறியலாம்.',
      mr: 'किसान मंडी डेस्क! गहू, कापूस किंवा टोमॅटोचे आजचे बाजारभाव विचारा.'
    }
  }
];

export interface HotlineMessage {
  id: string;
  sender: 'doctor' | 'farmer';
  text: string;
  timestamp: string;
}

// Generate spoken agronomist answer based on speech query and language
export function generateDoctorSpeechResponse(
  query: string,
  language: 'en' | 'hi' | 'pa' | 'te' | 'ta' | 'mr'
): string {
  const q = query.toLowerCase().trim();

  // 0. Field Telemetry / Zone Diagnostics (Image 4: నా పొలంలో సమస్య ఏమిటి?)
  if (
    q.includes('సమస్య') || q.includes('పొలంలో') || q.includes('problem') || q.includes('field') ||
    q.includes('समस्या') || q.includes('खेत') || q.includes('zone') || q.includes('stress') ||
    q.includes('ఆరోగ్యం') || q.includes('health') || q.includes('what is wrong') || q.includes('palam') ||
    q.includes('polam') || q.includes('samasya') || q.includes('khet') || q.includes('plot')
  ) {
    switch (language) {
      case 'te':
        return 'మీ పొలంలోని Zone 3 లో శాటిలైట్ పరిశీలన ప్రకారం తీవ్రమైన crop stress ఉంది. NDVI 0.38 కు పడిపోయింది మరియు నీటి కొరత ఉంది. వెంటనే Zone 3 లో సబ్‌సర్ఫేస్ డ్రిప్ తనిఖీ చేసి 24 గంటల్లో నీటిపారుదల మరియు మైక్రోన్యూట్రియెంట్స్ అందించండి.';
      case 'hi':
        return 'उपग्रह टेलीमेट्री के अनुसार आपके खेत के ज़ोन 3 में गंभीर फसल तनाव पाया गया है। एनडीवीआई गिरकर 0.38 हो गया है और नमी की भारी कमी है। कृपया 24 घंटे के भीतर ज़ोन 3 में सिंचाई और सूक्ष्म पोषक तत्वों की आपूर्ति करें।';
      case 'pa':
        return 'ਸੈਟੇਲਾਈਟ ਡੇਟਾ ਅਨੁਸਾਰ ਤੁਹਾਡੇ ਖੇਤ ਦੇ ਜ਼ੋਨ 3 ਵਿੱਚ ਫਸਲ ਦਾ ਤਣਾਅ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੈ। ਐਨ.ਡੀ.ਵੀ.ਆਈ 0.38 ਤੱਕ ਡਿੱਗ ਗਿਆ ਹੈ। ਤੁਰੰਤ ਜ਼ੋਨ 3 ਵਿੱਚ ਪਾਣੀ ਅਤੇ ਜ਼ਰੂਰੀ ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।';
      case 'ta':
        return 'செயற்கைக்கோள் தகவலின்படி உங்கள் வயலின் Zone 3 பகுதியில் பயிர் மன அழுத்தம் கண்டறியப்பட்டுள்ளது. NDVI 0.38 ஆக குறைந்துள்ளது. உடனடியாக அந்த பகுதியில் பாசனம் மற்றும் நுண்ணூட்டச்சத்து அளியுங்கள்.';
      case 'mr':
        return 'उपग्रह नोंदीनुसार आपल्या शेतातील Zone 3 मध्ये तीव्र पीक तणाव दिसून येत आहे. NDVI 0.38 पर्यंत घसरला आहे. पुढील 24 तासांत तातडीने सिंचन आणि सूक्ष्म अन्नद्रव्यांचा पुरवठा करा.';
      default:
        return 'Satellite telemetry reveals elevated crop stress in Zone 3 of your field with NDVI dropped to 0.38. Targeted drip irrigation and foliar micro-nutrients are strongly recommended within 24 hours.';
    }
  }

  // 1. Cotton - Pink / American Bollworm (గులాబీ రంగు పురుగు / పత్తి / गुलाबी सुंडी / कपास)
  if (
    q.includes('bollworm') || q.includes('cotton') || q.includes('పత్తి') || q.includes('గులాబీ') ||
    q.includes('कपास') || q.includes('गुलाबी') || q.includes('patti') || q.includes('gulabi') ||
    q.includes('kapaas') || q.includes('sundi') || q.includes('pink')
  ) {
    switch (language) {
      case 'te':
        return 'పత్తిలో గులాబీ రంగు పురుగు నివారణకు ఎకరాకు 8 లింగాకర్షక బుట్టలు (Pheromone traps) అమర్చండి. ఉధృతి ఎక్కువగా ఉంటే ప్రొఫెనోఫాస్ 2 మి.లీ లేదా ఇమామెక్టిన్ బెంజోయేట్ 0.5 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి.';
      case 'hi':
        return 'कपास में गुलाबी सुंडी के नियंत्रण के लिए प्रति एकड़ 8 फेरोमोन ट्रैप लगाएं। गंभीर प्रकोप में इमामेक्टिन बेंजोएट 5% SG 0.5 ग्राम या प्रोफेनोफॉस 2 मिली प्रति लीटर पानी में मिलाकर छिड़काव करें।';
      case 'pa':
        return 'ਨਰਮੇ ਵਿੱਚ ਗੁਲਾਬੀ ਸੁੰਡੀ ਦੀ ਰੋਕਥਾਮ ਲਈ ਪ੍ਰਤੀ ਏਕੜ 8 ਫੇਰੋਮੋਨ ਟਰੈਪ ਲਗਾਓ। ਜ਼ਿਆਦਾ ਹਮਲੇ ਵੇਲੇ ਇਮਾਮੈਕਟਿਨ ਬੈਂਜੋਏਟ 100 ਗ੍ਰਾਮ ਪ੍ਰਤੀ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਛਿੜਕੋ।';
      case 'ta':
        return 'பருத்தியில் இளஞ்சிவப்பு காய் புழுவிற்கு எக்டருக்கு 8 இனக்கவர்ச்சி பொறிகள் வையுங்கள். தீவிர தாக்குதலுக்கு இமாமெக்டின் பென்சோயேட் 0.5 கிராம்/லிட்டர் தெளிக்கவும்.';
      case 'mr':
        return 'कपाशीतील बोंडअळीच्या नियंत्रणासाठी एकरी 8 कामगंध सापळे लावा. जास्त प्रादुर्भाव असल्यास इमामेक्टिन बेंझोएट 0.5 ग्रॅम प्रति लिटर पाण्यात मिसळून फवारा.';
      default:
        return 'For Cotton Pink Bollworm control, install 8 pheromone traps per acre. For active infestation, spray Emamectin Benzoate 5% SG at 0.5 g per liter or Profenofos at 2 ml per liter of water.';
    }
  }

  // 2. Rice / Paddy - Blast, Stem Borer & BPH (వరి అగ్గితెగులు, కాండం తొలుచు పురుగు / धान का झुलसा, तना छेदक)
  if (
    q.includes('paddy') || q.includes('rice') || q.includes('వరి') || q.includes('ధాన్') ||
    q.includes('धान') || q.includes('blast') || q.includes('stem borer') || q.includes('bph') ||
    q.includes('అగ్గి') || q.includes('झुलसा') || q.includes('vari') || q.includes('dhan') ||
    q.includes('aggi') || q.includes('borer') || q.includes('chawal')
  ) {
    switch (language) {
      case 'te':
        return 'వరిలో అగ్గితెగులు (Blast) కు ట్రైసైక్లాజోల్ 75% WP (బాన్) 0.6 గ్రాములు లేదా కాండం తొలుచు పురుగుకు క్లోరాంట్రానిలిప్రోల్ (కొరాజెన్) 0.4 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయండి.';
      case 'hi':
        return 'धान में ब्लास्ट रोग के लिए ट्राईसाइक्लाजोल 75% WP 0.6 ग्राम प्रति लीटर, और तना छेदक या भूरा फुदका के लिए कोराजन (क्लोरेंट्रानिलीप्रोल) 0.4 मिली प्रति लीटर पानी में छिड़कें।';
      case 'pa':
        return 'ਝੋਨੇ ਵਿੱਚ ਧੌਣ ਮਰੋੜ (ਬਲਾਸਟ) ਲਈ ਟਰਾਈਸਾਈਕਲਾਜ਼ੋਲ 120 ਗ੍ਰਾਮ ਜਾਂ ਤਣਾ ਛੇਦਕ ਲਈ ਕੋਰਾਜਨ 60 ਮਿਲੀ ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕੋ।';
      case 'ta':
        return 'நெல்லில் குலை நோய்க்கு ட்ரைசைக்ளசோல் 0.6 கிராம்/லிட்டர், தண்டு துளைப்பான் தாக்குதலுக்கு கோராஜன் 0.4 மி.லி தெளிக்கவும்.';
      case 'mr':
        return 'भातावरील करपा रोगासाठी ट्रायसायक्लॅझोल 0.6 ग्रॅम किंवा खोडकिडीसाठी कोराजेन 0.4 मिली प्रति लिटर पाण्यात फवारणी करा.';
      default:
        return 'For Rice/Paddy Blast, apply Tricyclazole 75% WP (Baan) at 0.6 g/liter. For Stem Borer or BPH, spray Chlorantraniliprole 18.5% SC (Coragen) at 0.4 ml/liter in 200 liters water/acre.';
    }
  }

  // 3. Tomato & Chilli - Leaf Curl, Thrips, Mites (టమోటా ఆకుముడత, మిరప తామర పురుగులు / टमाटर पत्ता मरोड़, मिर्च थ्रिप्स)
  if (
    q.includes('tomato') || q.includes('chilli') || q.includes('mirchi') || q.includes('టమోటా') ||
    q.includes('మిరప') || q.includes('टमाटर') || q.includes('मिर्च') || q.includes('curl') ||
    q.includes('thrips') || q.includes('mite') || q.includes('ముడత') || q.includes('murda') ||
    q.includes('tamatar') || q.includes('mirapa') || q.includes('mudatha')
  ) {
    switch (language) {
      case 'te':
        return 'మిరప మరియు టమోటాలో ఆకుముడత మరియు తామర పురుగుల (Thrips) నివారణకు ఫిప్రోనిల్ + ఇమిడాక్లోప్రిడ్ (పోలీస్) 1 గ్రాము లేదా స్పైరోమెసిఫెన్ 1 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయండి. నీలి/పసుపు రంగు జిగురు అట్టలు పెట్టండి.';
      case 'hi':
        return 'मिर्च और टमाटर में पत्ता मरोड़ और थ्रिप्स कीट के लिए, फिप्रोनिल + इमिडाक्लोप्रिड (पुलिस) 1 ग्राम प्रति लीटर, या नीम का तेल 3 मिली प्रति लीटर पानी में मिलाकर छिड़कें। नीले व पीले चिपचिपे कार्ड लगाएं।';
      case 'pa':
        return 'ਟਮਾਟਰ ਤੇ ਮਿਰਚ ਵਿੱਚ ਪੱਤਾ ਮਰੋੜ ਰੋਗ ਦੀ ਰੋਕਥਾਮ ਲਈ ਇਮੀਡਾਕਲੋਪ੍ਰਿਡ 0.5 ਮਿਲੀ ਜਾਂ ਨਿੰਮ ਦਾ ਤੇਲ 3 ਮਿਲੀ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਸਪਰੇਅ ਕਰੋ।';
      case 'ta':
        return 'மிளகாய் மற்றும் தக்காளியில் இலை சுருட்டல் மற்றும் த்ரிப்ஸ் பூச்சிக்கு ஃபிப்ரோனில் + இமிடாக்ளோப்ரிட் 1 கிராம்/லிட்டர் அல்லது வேப்ப எண்ணெய் தெளிக்கவும்.';
      case 'mr':
        return 'मिरची व टोमॅटोतील चुरडा-मुरडा व थ्रिप्स किडीसाठी फिप्रोनिल + इमिडाक्लोप्रिड 1 ग्रॅम प्रति लिटर किंवा निंबोळी अर्क 3 मिली प्रति लिटर पाण्यात फवारा.';
      default:
        return 'For Tomato & Chilli Leaf Curl and Thrips/Mites, spray Fipronil 40% + Imidacloprid 40% WG (Police) at 1 g/liter or Spiromesifen at 1 ml/liter. Install blue and yellow sticky traps (15/acre).';
    }
  }

  // 4. Yellow Leaves / Nutrient Deficiencies (ఆకులు పసుపు రంగు / पीली पत्तियां / పీలే పత్తే)
  if (
    q.includes('yellow') || q.includes('chlorosis') || q.includes('పసుపు') || q.includes('पीली') ||
    q.includes('पत्ते') || q.includes('zinc') || q.includes('iron') || q.includes('nutrient') ||
    q.includes('pasupu') || q.includes('peela') || q.includes('pila') || q.includes('aakulu')
  ) {
    switch (language) {
      case 'te':
        return 'ఆకులు పసుపు రంగులోకి మారితే: క్రింది ఆకులు పసుపు అయితే నత్రజని లోపం - నానో యూరియా 4 మి.లీ స్ప్రే చేయండి. పై లేత ఆకులు పసుపు అయితే జింక్ సల్ఫేట్ 2 గ్రాములు లేదా ఫెర్రస్ సల్ఫేట్ 1 గ్రాము లీటరు నీటికి కలిపి పిచికారీ చేయండి.';
      case 'hi':
        return 'पत्तियां पीली पड़ने पर: पुरानी पत्तियां पीली हैं तो नाइट्रोजन की कमी है, नैनो यूरिया 4 मिली/लीटर छिड़कें। नई पत्तियां पीली हैं तो जिंक सल्फेट 2 ग्राम या फेरस सल्फेट 1 ग्राम प्रति लीटर पानी में मिलाकर स्प्रे करें।';
      case 'pa':
        return 'ਜੇ ਪੱਤੇ ਪੀਲੇ ਪੈ ਰਹੇ ਹਨ, ਤਾਂ ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਕਮੀ ਲਈ ਨੈਨੋ ਯੂਰੀਆ 4 ਮਿਲੀ ਜਾਂ ਜ਼ਿੰਕ ਸਲਫੇਟ 0.5% ਦਾ ਛਿੜਕਾਅ ਕਰੋ।';
      case 'ta':
        return 'இலைகள் மஞ்சளானால், பழைய இலைகளுக்கு நானோ யூரியா 4 மி.லி, புதிய தளிர்களுக்கு ஜிங்க் சல்பேட் 2 கிராம்/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.';
      case 'mr':
        return 'पाने पिवळी पडल्यास: खालची पाने असल्यास नत्र कमतरता आहे, नॅनो युरिया 4 मिली/लिटर फवारा. वरची नवीन पाने पिवळी असल्यास झिंक सल्फेट 2 ग्रॅम प्रति लिटर फवारा.';
      default:
        return 'For Yellowing Leaves: If lower leaves turn yellow, it is Nitrogen deficiency - spray Nano Urea at 4 ml/L. If new upper leaves turn yellow, apply Zinc Sulphate (2 g/L) or Ferrous Sulphate (1 g/L).';
    }
  }

  // 5. Flower / Fruit Dropping (పూత రాలడం / फूल गिरना / ఫుల్ ਝੜਨਾ)
  if (
    q.includes('flower') || q.includes('drop') || q.includes('dropping') || q.includes('పూత') ||
    q.includes('రాలడం') || q.includes('రాలిపోవడం') || q.includes('फूल') || q.includes('गिरना') ||
    q.includes('pootha') || q.includes('raladam') || q.includes('phool') || q.includes('girna') ||
    q.includes('boron') || q.includes('planofix')
  ) {
    switch (language) {
      case 'te':
        return 'పూత మరియు పిందె రాలడం నివారణకు ప్లానోఫిక్స్ (ఆల్ఫా NAA) 1 మి.లీ 4.5 లీటర్ల నీటికి కలిపి లేదా బోరాన్ 20% 1 గ్రాము లీటరు నీటికి కలిపి ఉదయం వేళల్లో పిచికారీ చేయండి.';
      case 'hi':
        return 'फूल और फल झड़ने से रोकने के लिए प्लानोफिक्स (अल्फा NAA) 1 मिली को 4.5 लीटर पानी में घोलकर, या घुलनशील बोरॉन 1 ग्राम प्रति लीटर पानी में मिलाकर छिड़कें।';
      case 'pa':
        return 'ਫੁੱਲ ਅਤੇ ਫਲ ਝੜਨ ਤੋਂ ਰੋਕਣ ਲਈ ਪਲੈਨੋਫਿਕਸ 1 ਮਿਲੀ ਪ੍ਰਤੀ 4.5 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਜਾਂ ਬੋਰੋਨ 1 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਛਿੜਕੋ।';
      case 'ta':
        return 'பூக்கள் உதிர்வதைத் தடுக்க பிளனோபிக்ஸ் 1 மி.லி / 4.5 லிட்டர் தண்ணீர் அல்லது போரான் 1 கிராம்/லிட்டர் கலந்து தெளிக்கவும்.';
      case 'mr':
        return 'फुलगळ व फळगळ थांबवण्यासाठी प्लॅनोफिक्स 1 मिली 4.5 लिटर पाण्यात किंवा बोरॉन 1 ग्रॅम प्रति लिटर पाण्यात मिसळून फवारणी करा.';
      default:
        return 'To prevent flower and fruit drop, spray Planofix (Alpha NAA) at 1 ml per 4.5 liters of water, combined with Soluble Boron 20% at 1 g/liter during early morning hours.';
    }
  }

  // 6. Maize / Corn - Fall Armyworm (మొక్కజొన్న కత్తెర పురుగు / मक्का)
  if (
    q.includes('maize') || q.includes('corn') || q.includes('మొక్కజొన్న') || q.includes('मक्का') ||
    q.includes('armyworm') || q.includes('కత్తెర') || q.includes('mokkajonna') || q.includes('makka') ||
    q.includes('kattera')
  ) {
    switch (language) {
      case 'te':
        return 'మొక్కజొన్నలో కత్తెర పురుగు నివారణకు క్లోరాంట్రానిలిప్రోల్ (కొరాజెన్) 0.4 మి.లీ లేదా స్పైనెటోరామ్ (డెలిగేట్) 0.9 మి.లీ లీటరు నీటికి కలిపి సుడులలో (Whorl) పడేలా పిచికారీ చేయండి.';
      case 'hi':
        return 'मक्का में फॉल आर्मीवर्म (सैनिक कीट) के लिए कोराजन 0.4 मिली या स्पाइनेटोरम 0.9 मिली प्रति लीटर पानी में घोलकर पौधे की गोभ (Whorl) में सीधे डालें।';
      case 'pa':
        return 'ਮੱਕੀ ਵਿੱਚ ਫਾਲ ਆਰਮੀਵਰਮ ਦੀ ਰੋਕਥਾਮ ਲਈ ਕੋਰਾਜਨ 0.4 ਮਿਲੀ ਜਾਂ ਸਪਾਈਨੇਟੋਰਮ 0.9 ਮਿਲੀ ਪ੍ਰਤੀ ਲੀਟਰ ਗੋਭ ਵਿੱਚ ਸਪਰੇਅ ਕਰੋ।';
      case 'ta':
        return 'மக்காச்சோளப் படைப்புழுவிற்கு கோராஜன் 0.4 மி.லி அல்லது ஸ்பைனோசாட் குருத்தில் படும்படி தெளிக்கவும்.';
      case 'mr':
        return 'मक्यातील लष्करी अळीसाठी (Fall Armyworm) कोराजेन 0.4 मिली किंवा स्पायनेटोरम 0.9 मिली प्रति लिटर पोंग्यात पडेल असे फवारा.';
      default:
        return 'For Maize Fall Armyworm (FAW), spray Chlorantraniliprole 18.5% SC (Coragen) at 0.4 ml/L or Spinetoram 11.7% SC at 0.9 ml/L directly into the plant whorl.';
    }
  }

  // 7. Rust / Blight / Fungal symptoms / Spots / తెగుళ్ళు
  if (
    q.includes('rust') || q.includes('blight') || q.includes('fungus') || q.includes('mildew') ||
    q.includes('spot') || q.includes('rot') || q.includes('తుప్పు') || q.includes('తెగులు') ||
    q.includes('తెగుళ్ళు') || q.includes('మచ్చ') || q.includes('फफूंद') || q.includes('रतुआ') ||
    q.includes('करपा') || q.includes('धब्बा') || q.includes('tegulu') || q.includes('macha')
  ) {
    switch (language) {
      case 'te':
        return 'శిలీంధ్ర తెగుళ్ళకు మాంకోజెబ్ + మెటలాక్సిల్ (రిడోమిల్ గోల్డ్) 2 గ్రాములు లేదా అజోక్సీస్ట్రోబిన్ + డిఫెనోకోనాజోల్ (అమిస్టార్ టాప్) 1 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయండి.';
      case 'hi':
        return 'पीला रतुआ या झुलसा रोग के लिए रिडोमिल गोल्ड 2 ग्राम प्रति लीटर या एमिस्टार टॉप (एज़ोक्सीस्ट्रोबिन + डाइफेनोकोनाज़ोल) 1 मिली प्रति लीटर पानी में मिलाकर स्प्रे करें।';
      case 'pa':
        return 'ਪੀਲੀ ਕੁੰਗੀ ਜਾਂ ਝੁਲਸਾ ਰੋਗ ਲਈ ਤੁਰੰਤ ਰਿਡੋਮਿਲ ਗੋਲਡ 2 ਗ੍ਰਾਮ ਜਾਂ ਟਿਲਟ 1 ਮਿਲੀ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।';
      case 'ta':
        return 'துரு நோய் அல்லது இலைக்கருகல் நோய்க்கு ரிடோமில் கோல்ட் 2 கிராம் அல்லது அமிஸ்டார் டாப் 1 மி.லி தண்ணீரில் கலந்து தெளிக்கவும்.';
      case 'mr':
        return 'तांबेरा किंवा करपा रोगासाठी रिडोमिल गोल्ड 2 ग्रॅम किंवा ॲमिस्टार टॉप 1 मिली प्रति लिटर पाण्यात फवारणी करा.';
      default:
        return 'For Yellow Rust, Blight, or Leaf Spot fungal infection, apply Metalaxyl + Mancozeb (Ridomil Gold) at 2 g/L or Azoxystrobin + Difenoconazole (Amistar Top) at 1 ml/L.';
    }
  }

  // 8. Sucking Pests / Whiteflies / Aphids / పురుగులు / Purugu
  if (
    q.includes('aphid') || q.includes('whitefly') || q.includes('pest') || q.includes('insect') ||
    q.includes('worm') || q.includes('caterpillar') || q.includes('పురుగు') || q.includes('పురుగులు') ||
    q.includes('కీటకం') || q.includes('कीड़ा') || q.includes('कीड़े') || q.includes('purugu') ||
    q.includes('kida') || q.includes('sucking')
  ) {
    switch (language) {
      case 'te':
        return 'రసం పీల్చే పురుగులు మరియు తెల్లదోమ నివారణకు ఇమిడాక్లోప్రిడ్ 17.8% SL 0.5 మి.లీ లేదా థయామెథోక్సామ్ 25% WG 0.3 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి.';
      case 'hi':
        return 'रस चूसक कीटों और सफेद मक्खी के लिए इमिडाक्लोप्रिड 17.8% SL 0.5 मिली, या थायमेथॉक्सम 25% WG 0.3 ग्राम प्रति लीटर पानी में मिलाकर छिड़कें।';
      case 'pa':
        return 'ਚਿੱਟੀ ਮੱਖੀ ਅਤੇ ਤੇਲੇ ਲਈ ਇਮੀਡਾਕਲੋਪ੍ਰਿਡ 0.5 ਮਿਲੀ ਜਾਂ ਥਾਇਆਮੈਥੋਕਸਾਮ 0.3 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਸਪਰੇਅ ਕਰੋ।';
      case 'ta':
        return 'சாறு உறிஞ்சும் பூச்சிகள் மற்றும் வெள்ளை ஈக்களுக்கு இமிடாக்ளோப்ரிட் 0.5 மி.லி அல்லது தயாமெதாக்ஸம் 0.3 கிராம்/லிட்டர் தெளிக்கவும்.';
      case 'mr':
        return 'मावा, तुडतुडे व पांढरी माशीसाठी इमिडाक्लोप्रिड 0.5 मिली किंवा थायामेथोक्साम 0.3 ग्रॅम प्रति लिटर पाण्यात मिसळून फवारा.';
      default:
        return 'For sucking pests, aphids, and whiteflies, spray Imidacloprid 17.8% SL at 0.5 ml/L or Thiamethoxam 25% WG at 0.3 g/L in 150-200 liters of water per acre.';
    }
  }

  // 9. Fertilizer / Urea / DAP / NPK / ఎరువులు / Eruvulu
  if (
    q.includes('urea') || q.includes('khad') || q.includes('fertilizer') || q.includes('dap') ||
    q.includes('npk') || q.includes('potash') || q.includes('ఎరువులు') || q.includes('खाद') ||
    q.includes('खत') || q.includes('eruvulu') || q.includes('growth') || q.includes('yield') ||
    q.includes('tonic')
  ) {
    switch (language) {
      case 'te':
        return 'మొదటి నీటి పారుదల తర్వాత ఎకరాకు 45 కిలోల యూరియాను అందించండి. పూత మరియు కాయల దశలో 19-19-19 నీటిలో కరిగే ఎరువు 5 గ్రాములు లీటరు నీటికి కలిపి స్ప్రే చేయడం వల్ల నాణ్యత మరియు దిగుబడి 20% పెరుగుతుంది.';
      case 'hi':
        return 'पहली सिंचाई के बाद प्रति एकड़ एक बोरी यूरिया डालें। फसल की बढ़वार के लिए एनपीके 19-19-19 घुलनशील खाद 5 ग्राम प्रति लीटर पानी में मिलाकर छिड़कें। फल बनते समय 0-0-50 पोटाश का स्प्रे करें।';
      case 'pa':
        return 'ਕਣਕ ਜਾਂ ਝੋਨੇ ਦੇ ਪਹਿਲੇ ਪਾਣੀ ਤੋਂ ਬਾਅਦ ਪ੍ਰਤੀ ਏਕੜ ਇੱਕ ਬੋਰੀ ਯੂਰੀਆ ਪਾਓ। ਨੈਨੋ ਯੂਰੀਆ ਦਾ ਸਪਰੇਅ ਵੀ ਫਸਲ ਨੂੰ ਹਰਾ-ਭਰਾ ਰੱਖਦਾ ਹੈ।';
      case 'ta':
        return 'பயிரின் முதல் பாசனத்திற்குப் பிறகு ஏக்கருக்கு 45 கிலோ யூரியா இடவும். 19-19-19 நீரில் கரையும் உரத்தை 5 கிராம்/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.';
      case 'mr':
        return 'पहिल्या पाण्याच्या पाळीनंतर एकरी 45 किलो युरिया द्या. 19-19-19 विद्राव्य खत 5 ग्रॅम प्रति लिटर फवारल्यास पिकाची जोमदार वाढ होते.';
      default:
        return 'Apply top-dressing of Urea at 45 kg per acre after first irrigation. Spray water-soluble NPK 19-19-19 at 5 g/L during vegetative growth and 0-0-50 (SOP) during fruit development.';
    }
  }

  // 10. Weed Control / కలుపు నివారణ / Kalupu
  if (
    q.includes('weed') || q.includes('herbicide') || q.includes('కలుపు') || q.includes('खरपतवार') ||
    q.includes('घास') || q.includes('kalupu') || q.includes('grass')
  ) {
    switch (language) {
      case 'te':
        return 'విత్తిన 48 గంటల్లోపు పెండిమిథాలిన్ 30% EC 1-1.3 లీటర్లు ఎకరాకు పిచికారీ చేయడం వల్ల అన్ని రకాల కలుపు మొలకెత్తదు. నిలబడిన పంటలో అంతరకృషి లేదా సిఫార్సు చేసిన పోస్ట్-ఎమర్జెన్స్ కలుపు మందులు వాడండి.';
      case 'hi':
        return 'बुवाई के 48 घंटे के भीतर पेंडीमेथालिन 30% EC 1 से 1.25 लीटर प्रति एकड़ 200 लीटर पानी में छिड़कें। खड़ी फसल में चौड़ी पत्ती के खरपतवार के लिए उपयुक्त चयनात्मक खरपतवारनाशक का उपयोग करें।';
      case 'pa':
        return 'ਬਿਜਾਈ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਪੈਂਡੀਮੈਥਾਲਿਨ 1 ਲੀਟਰ ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕੋ ਤਾਂ ਜੋ ਨਦੀਨ ਨਾ ਉੱਗ ਸਕਣ।';
      case 'ta':
        return 'விதைத்த 48 மணி நேரத்திற்குள் பெண்டிமெத்தலின் 1 லிட்டர்/ஏக்கர் தெளிப்பது களைகளை முழுமையாகக் கட்டுப்படுத்தும்.';
      case 'mr':
        return 'पेरणीनंतर 48 तासांच्या आत पेंडीमेथालिन 1 लिटर प्रति एकर 200 लिटर पाण्यात फवारा, ज्यामुळे तण उगवणार नाही.';
      default:
        return 'For pre-emergence weed control, spray Pendimethalin 30% EC at 1.0 to 1.25 L per acre within 48 hours of sowing in moist soil. For standing crops, use targeted selective post-emergence herbicides.';
    }
  }

  // 11. Mandi / Rate / Price / ధరలు / Bhav
  if (
    q.includes('mandi') || q.includes('rate') || q.includes('price') || q.includes('ధర') ||
    q.includes('ధరలు') || q.includes('మార్కెట్') || q.includes('भाव') || q.includes('రేట్') ||
    q.includes('bhav') || q.includes('dhara')
  ) {
    switch (language) {
      case 'te':
        return 'ఈరోజు మార్కెట్లో నాణ్యమైన గోధుమలు క్వింటాలుకు ₹2,840, వరి ₹2,450, టమోటా కిలో ₹34-₹38 మరియు పత్తి క్వింటాలుకు ₹7,450 పలుకుతోంది.';
      case 'hi':
        return 'आज की मुख्य मंडियों में शरबती गेहूं 2,840 रुपये/क्विंटल, धान 2,450 रुपये, संकर टमाटर 32 से 38 रुपये किलो और कपास 7,450 रुपये प्रति क्विंटल चल रहा है।';
      case 'pa':
        return 'ਅੱਜ ਮੰਡੀ ਵਿੱਚ ਕਣਕ ₹2,475 ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਅਤੇ ਬਾਸਮਤੀ ₹3,920 ਚੱਲ ਰਹੀ ਹੈ। ਕੀਮਤਾਂ ਮਜ਼ਬੂਤ ਰਹਿਣ ਦੀ ਉਮੀਦ ਹੈ।';
      case 'ta':
        return 'இன்றைய சந்தையில் நெல் குவிண்டாலுக்கு ₹2,450 மற்றும் தக்காளி கிலோ ₹35-க்கு விற்பனையாகிறது.';
      case 'mr':
        return 'आज बाजारात गहू ₹2,840 प्रति क्विंटल, कांदा ₹25 प्रति किलो आणि कापूस ₹7,450 प्रति क्विंटल दराने विक्री होत आहे.';
      default:
        return 'Today Sharbati Wheat is trading at ₹2,840/quintal, Basmati Paddy at ₹3,920/quintal, Hybrid Tomato at ₹34-₹38/kg, and Cotton at ₹7,450/quintal.';
    }
  }

  // 12. Weather / Rain / Spray Timing / వాతావరణం
  if (
    q.includes('weather') || q.includes('rain') || q.includes('వాతావరణం') || q.includes('వర్షం') ||
    q.includes('मौसम') || q.includes('बारिश') || q.includes('vathavaranam') || q.includes('spray')
  ) {
    switch (language) {
      case 'te':
        return 'రాగల 24 గంటల్లో వాతావరణం అనుకూలంగా ఉంటుంది. వర్ష సూచన లేదు. గాలి వేగం సాధారణంగా ఉంది కాబట్టి ఉదయం 8 నుండి 11 గంటల మధ్య లేదా సాయంత్రం వేళల్లో పిచికారీ చేయడానికి అత్యంత అనుకూల సమయం.';
      case 'hi':
        return 'आज मौसम साफ रहेगा, हवा की गति 7 किमी प्रति घंटा है और बारिश की संभावना नगण्य है। सुबह 8 से 11 बजे या दोपहर 4 बजे के बाद खेत में स्प्रे करने का सबसे अच्छा समय है।';
      case 'pa':
        return 'ਅੱਜ ਮੌਸਮ ਸਾਫ ਹੈ, ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਬਿਲਕੁਲ ਘੱਟ ਹੈ। ਦੁਪਹਿਰ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂ ਸ਼ਾਮ ਨੂੰ ਸਪਰੇਅ ਕਰਨ ਦਾ ਵਧੀਆ ਸਮਾਂ ਹੈ।';
      case 'ta':
        return 'இன்று மழை வாய்ப்பு குறைவு. காற்று வேகம் சீராக உள்ளதால் காலை 8 முதல் 11 மணி வரை மருந்து தெளிக்க உகந்தது.';
      case 'mr':
        return 'आज हवामान कोरडे असून वाऱ्याचा वेग सामान्य आहे. सकाळी 8 ते 11 किंवा संध्याकाळी 4 नंतर फवारणी करणे अत्यंत अनुकूल आहे.';
      default:
        return 'Current telemetry indicates favorable conditions with wind under 8 km/h and rain probability under 5%. The optimal foliar spray window is between 8:00 AM and 11:00 AM or after 4:00 PM.';
    }
  }

  // 13. Medicine / Spray / Dosage / Treatment / Mandhu / Dawa
  if (
    q.includes('medicine') || q.includes('spray') || q.includes('treatment') || q.includes('mandhu') ||
    q.includes('mandu') || q.includes('dawa') || q.includes('dawai') || q.includes('మందు') ||
    q.includes('పిచికారీ') || q.includes('దవా') || q.includes('రోగం')
  ) {
    switch (language) {
      case 'te':
        return 'మీ పంట సంరక్షణ కోసం: తెగులు లేదా పురుగు లక్షణాలను బట్టి సరైన మందును ఎంచుకోండి. ప్రాథమిక నివారణకు వేప నూనె 3 మి.లీ లేదా శిలీంధ్రాల నివారణకు మాంకోజెబ్ 2.5 గ్రాములు లీటరు నీటికి కలిపి ఉదయం వేళల్లో పిచికారీ చేయండి.';
      case 'hi':
        return 'फसल सुरक्षा के लिए रोग के शुरुआती लक्षणों में नीम का तेल 10,000 ppm 3 मिली/लीटर या फफूंदनाशक मैन्कोज़ेब 2.5 ग्राम प्रति लीटर पानी में मिलाकर सुबह के समय छिड़काव करें।';
      case 'pa':
        return 'ਫਸਲ ਦੇ ਇਲਾਜ ਲਈ ਨਿੰਮ ਦਾ ਤੇਲ 3 ਮਿਲੀ ਜਾਂ ਮੈਨਕੋਜ਼ੇਬ 2.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।';
      case 'ta':
        return 'பயிர் சிகிச்சைக்கு வேப்ப எண்ணெய் 3 மி.லி அல்லது மேன்கோசெப் 2.5 கிராம்/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.';
      case 'mr':
        return 'पिकाच्या उपचारासाठी निंबोळी अर्क 3 मिली किंवा मॅन्कोझेब 2.5 ग्रॅम प्रति लिटर पाण्यात मिसळून सकाळी फवारणी करा.';
      default:
        return 'For broad-spectrum crop protection, spray cold-pressed Neem Oil (10,000 ppm) at 3 ml/L or contact fungicide Mancozeb 75% WP at 2.5 g/liter in 200 liters of water per acre.';
    }
  }

  // 14. Dynamic Comprehensive Default for ANY Other Query
  switch (language) {
    case 'te':
      return 'మీరు అడిగిన పంట సమస్యపై సలహా: పొలంలో నేల తేమను సరిచూసి, తెగుళ్ళు లేదా పురుగుల ప్రారంభ దశలో వేప నూనె 3 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయండి. సమతుల్య NPK 19-19-19 ఎరువులను అందించండి.';
    case 'hi':
      return 'आपके सवाल पर कृषि वैज्ञानिक सलाह: खेत में उचित नमी बनाए रखें। किसी भी शुरुआती कीट या रोग के लिए नीम तेल 10,000 ppm 3 मिली प्रति लीटर का छिड़काव करें और 19-19-19 सूक्ष्म पोषक तत्वों का संतुलित प्रयोग करें।';
    case 'pa':
      return "ਤੁਹਾਡੇ ਸਵਾਲ 'ਤੇ ਖੇਤੀ ਮਾਹਿਰ ਦੀ ਸਲਾਹ: ਫਸਲ ਦੀ ਚੰਗੀ ਸਿਹਤ ਲਈ ਖੇਤ ਵਿੱਚ ਨਮੀ ਬਣਾਈ ਰੱਖੋ। ਸ਼ੁਰੂਆਤੀ ਬਿਮਾਰੀਆਂ ਲਈ ਨਿੰਮ ਦਾ ਤੇਲ 3 ਮਿਲੀ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਸਪਰੇਅ ਕਰੋ।";
    case 'ta':
      return 'உங்கள் கேள்விக்கான விவசாய ஆலோசனை: பயிர் பாதுகாப்புக்கு மண்ணின் ஈரப்பதத்தை சரியாக பராமரிக்கவும். ஆரம்ப கட்ட பூச்சி தாக்குதலுக்கு வேப்ப எண்ணெய் 3 மி.லி/லிட்டர் தெளித்து நுண்ணூட்டச்சத்தை இடவும்.';
    case 'mr':
      return 'आपल्या प्रश्नावर कृषी सल्ला: पिकाच्या चांगल्या वाढीसाठी शेतात योग्य ओलावा ठेवा. प्राथमिक कीड व रोगासाठी निंबोळी अर्क 3 मिली प्रति लिटर पाण्यात फवारा व सूक्ष्म अन्नद्रव्यांचा वापर करा.';
    default:
      return 'Agronomist recommendation for your query: Maintain optimal soil moisture and inspect field zones. For early pest or pathogen control, apply Neem Oil 10,000 ppm at 3 ml/L along with water-soluble 19-19-19 (5 g/L) for vigorous vegetative recovery.';
  }
}
