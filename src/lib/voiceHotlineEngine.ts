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
  const q = query.toLowerCase();

  // 1. Rust / Blight / Fungal symptoms
  if (q.includes('rust') || q.includes('peela') || q.includes('haldi') || q.includes('kungi') || q.includes('blight') || q.includes('rog') || q.includes('jhulsa') || q.includes('fungus')) {
    switch (language) {
      case 'hi':
        return 'पीला रतुआ या झुलसा रोग के लिए, तुरंत प्रोपिकोनाज़ोल 25 प्रतिशत ईसी (टिल्ट) 1 मिली प्रति लीटर पानी में मिलाकर 200 लीटर पानी प्रति एकड़ छिड़काव करें। पत्तियां सूखने के बाद ही स्प्रे करें।';
      case 'pa':
        return 'ਪੀਲੀ ਕੁੰਗੀ ਜਾਂ ਝੁਲਸਾ ਰੋਗ ਲਈ, ਤੁਰੰਤ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ 25 ਈ.ਸੀ. (ਟਿਲਟ) 200 ਮਿਲੀ ਪ੍ਰਤੀ ਏਕੜ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।';
      case 'te':
        return 'తుప్పు తెగులు లేదా ఆకుమచ్చ తెగులు కోసం, ప్రొపికోనజోల్ 25% EC 1 మిల్లీ లీటరు నీటికి కలిపి ఎకరాకు 200 లీటర్ల నీటితో పిచికారీ చేయండి.';
      case 'ta':
        return 'துரு நோய் அல்லது இலைக்கருகல் நோய்க்கு, புரோபிகோனசோல் 25% EC 1 மி.லி தண்ணீரில் கலந்து ஏக்கருக்கு 200 லிட்டர் தெளிக்கவும்.';
      case 'mr':
        return 'तांबेਰਾ किंवा करपा रोगासाठी, प्रोपिकोनाझोल 25% EC 1 मिली प्रति लिटर पाण्यात मिसळून 200 लिटर पाण्यात फवारणी करा.';
      default:
        return 'For Yellow Rust or Blight fungal infection, immediately apply Propiconazole 25% EC (Tilt) at 1 ml per liter in 200 liters of water per acre. Spray when canopy foliage is dry.';
    }
  }

  // 2. Fertilizer / Urea / DAP
  if (q.includes('urea') || q.includes('khad') || q.includes('fertilizer') || q.includes('dap') || q.includes('npk') || q.includes('nitrogen') || q.includes('khat')) {
    switch (language) {
      case 'hi':
        return 'गेहूं में सीआरआई अवस्था यानी 21 दिन पर पहली सिंचाई के तुरंत बाद यूरिया की पहली टॉप-ड्रेसिंग 45 किलो प्रति एकड़ करें। नैनो यूरिया 4 मिली प्रति लीटर का पर्णीय छिड़काव भी बहुत प्रभावी है।';
      case 'pa':
        return 'ਕਣਕ ਦੇ ਪਹਿਲੇ ਪਾਣੀ (21ਵੇਂ ਦਿਨ) ਤੋਂ ਬਾਅਦ ਪ੍ਰਤੀ ਏਕੜ ਇੱਕ ਬੋਰੀ ਯੂਰੀਆ ਪਾਓ। ਨੈਨੋ ਯੂਰੀਆ ਦਾ ਸਪਰੇਅ ਵੀ ਫਸਲ ਨੂੰ ਹਰਾ-ਭਰਾ ਰੱਖਦਾ ਹੈ।';
      case 'te':
        return 'వరి లేదా గోధుమలకు మొదటి నీటి పారుదల తర్వాత ఎకరాకు 45 కిలోల యూరియాను అందించండి. నానో యూరియా స్ప్రే కూడా చాలా ఉపయోగపడుతుంది.';
      case 'ta':
        return 'பயிரின் முதல் பாசனத்திற்குப் பிறகு ஏக்கருக்கு 45 கிலோ யூரியா இடவும். நானோ யூரியா தெளிப்பது சிறந்த வளர்ச்சி தரும்.';
      case 'mr':
        return 'पहिल्या पाण्याच्या पाळीनंतर एकरी 45 किलो युरिया द्या. नॅनो युरियाची 4 मिली प्रति लिटर फवारणी उत्पादनात वाढ करते.';
      default:
        return 'At the Crown Root Initiation stage (21 days), apply first top-dressing of Urea at 45 kg per acre. Nano Urea foliar spray at 4 ml per liter delivers high nitrogen use efficiency.';
    }
  }

  // 3. Mandi / Rate / Price
  if (q.includes('mandi') || q.includes('rate') || q.includes('bhav') || q.includes('price') || q.includes('bechna') || q.includes('vikri') || q.includes('dhara')) {
    switch (language) {
      case 'hi':
        return 'आज खन्ना और इंदौर मंडी में शरबती गेहूं 2,840 रुपये प्रति क्विंटल और हाइब्रिड टमाटर 38 रुपये किलो चल रहा है। आगामी हफ्तों में गेहूं के दामों में 5 प्रतिशत की बढ़त की संभावना है।';
      case 'pa':
        return 'ਅੱਜ ਮੰਡੀ ਵਿੱਚ ਕਣਕ 2,475 ਰੁਪਏ ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਅਤੇ ਬਾਸਮਤੀ 3,920 ਰੁਪਏ ਚੱਲ ਰਹੀ ਹੈ। ਕੀਮਤਾਂ ਮਜ਼ਬੂਤ ਰਹਿਣ ਦੀ ਉਮੀਦ ਹੈ।';
      case 'te':
        return 'ఈరోజు మార్కెట్లో నాణ్యమైన గోధుమలు క్వింటాలుకు ₹2,840 మరియు టమోటా కిలో ₹38 పలుకుతోంది. కొద్ది రోజులు నిల్వ ఉంచడం లాభదాయకం.';
      case 'ta':
        return 'இன்றைய சந்தையில் உயர் ரக கோதுமை குவிண்டாலுக்கு ₹2,840 மற்றும் தக்காளி கிலோ ₹38-க்கு விற்பனையாகிறது.';
      case 'mr':
        return 'आज बाजारात गहू ₹2,840 प्रति क्विंटल आणि कांदा-टोमॅटोचे दर समाधानकारक आहेत. प्रतवारी करून माल विका.';
      default:
        return 'Today Sharbati Wheat is trading at ₹2,840 per quintal in central yards and Basmati Paddy at ₹3,920 per quintal. We recommend holding high-quality wheat for 3 more weeks.';
    }
  }

  // 4. Weather / Rain / Spray suitability
  if (q.includes('weather') || q.includes('barish') || q.includes('meen') || q.includes('rain') || q.includes('mausam') || q.includes('spray')) {
    switch (language) {
      case 'hi':
        return 'आज दोपहर 11 बजे से शाम 4 बजे तक मौसम साफ रहेगा, हवा की गति 7 किमी प्रति घंटा है। यह खेत में स्प्रे करने के लिए सबसे अनुकूल समय है।';
      case 'pa':
        return 'ਅੱਜ ਮੌਸਮ ਸਾਫ ਹੈ, ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਬਿਲਕੁਲ ਘੱਟ ਹੈ। ਦੁਪਹਿਰ 11 ਵਜੇ ਤੋਂ ਬਾਅਦ ਸਪਰੇਅ ਕਰਨ ਦਾ ਵਧੀਆ ਸਮਾਂ ਹੈ।';
      case 'te':
        return 'నేడు వర్ష సూచన లేదు. గాలి వేగం సాధారణంగా ఉంది. ఉదయం 11 నుండి సాయంత్రం 4 గంటల వరకు పిచికారీ చేయడానికి అనుకూల సమయం.';
      case 'ta':
        return 'இன்று மழை வாய்ப்பு குறைவு. இலைகளில் பனி காய்ந்த பிறகு காலை 11 மணி முதல் மாலை 4 மணி வரை மருந்து தெளிக்கலாம்.';
      case 'mr':
        return 'आज हवामान कोरडे असून वाऱ्याचा वेग 8 किमी आहे. फवारणीसाठी आजचा दिवस अत्यंत अनुकूल आहे.';
      default:
        return 'Current telemetry indicates favorable conditions with wind under 8 km/h and rain probability under 5%. The optimal foliar spray window is between 11:00 AM and 4:00 PM.';
    }
  }

  // Default friendly agricultural greeting
  switch (language) {
    case 'hi':
      return 'जी किसान भाई, मैंने आपकी बात सुनी। फसल में किसी भी रोग, खाद की मात्रा, या मंडी भाव के बारे में विस्तार से पूछें, मैं आपकी सेवा में हाज़िर हूँ।';
    case 'pa':
      return 'ਹਾਂਜੀ ਕਿਸਾਨ ਵੀਰੋ, ਫਸਲ ਵਿੱਚ ਕੀੜੇ-ਮਕੌੜੇ, ਖਾਦਾਂ, ਜਾਂ ਮੰਡੀ ਰੇਟ ਬਾਰੇ ਬੇਝਿਜਕ ਪੁੱਛੋ।';
    case 'te':
      return 'రైతు సోదరా, మీ పంట సంరక్షణ మరియు సరైన ఎరువుల కోసం నన్ను ఏ ప్రశ్నైనా అడగవచ్చు.';
    case 'ta':
      return 'விவசாய நண்பரே, உங்கள் பயிர் பாதுகாப்பு மற்றும் சந்தை விலை பற்றிய விவரங்களை தாராளமாகக் கேட்கலாம்.';
    case 'mr':
      return 'शेतकरी मित्रा, पिकाचे संरक्षण, खतांचे नियोजन आणि बाजारभावाची संपूर्ण माहिती मी देतो.';
    default:
      return 'I am listening! You can ask me about plant disease treatments, fertilizer dosage, optimal spray windows, or APMC mandi rates.';
  }
}
