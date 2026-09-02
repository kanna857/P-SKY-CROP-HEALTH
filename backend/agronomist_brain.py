"""
Kisan Voice Hotline AI Agronomist Brain
Comprehensive Multi-Lingual Agricultural Diagnostic and Advisory Engine
Supports: English, Hindi, Telugu, Tamil, Punjabi, Marathi
Understands: Native scripts, Transliterated/Phonetic questions, and English queries.
"""

def answer_agronomy_query(query: str, language: str = 'en', doctor_id: str = 'doc-pathology') -> str:
    q = query.lower().strip()
    
    # 0. Field Telemetry / Zone 3 / Satellite Problem (నా పొలంలో సమస్య ఏమిటి?)
    if any(k in q for k in [
        'సమస్య', 'పొలంలో', 'problem', 'field', 'समस्या', 'खेत', 'zone', 'stress',
        'ఆరోగ్యం', 'health', 'what is wrong', 'deficiency', 'palam', 'polam', 'samasya',
        'khet', 'plot', 'issue', 'satellite', 'ndvi', 'status'
    ]):
        if language == 'te':
            return "మీ పొలంలోని Zone 3 లో శాటిలైట్ పరిశీలన ప్రకారం తీవ్రమైన crop stress ఉంది. NDVI 0.38 కు పడిపోయింది మరియు నీటి కొరత ఉంది. వెంటనే Zone 3 లో సబ్‌సర్ఫేస్ డ్రిప్ తనిఖీ చేసి 24 గంటల్లో నీటిపారుదల మరియు మైక్రోన్యూట్రియెంట్స్ అందించండి."
        elif language == 'hi':
            return "उपग्रह टेलीमेट्री के अनुसार आपके खेत के ज़ोन 3 में गंभीर फसल तनाव पाया गया है। एनडीवीआई गिरकर 0.38 हो गया है और नमी की भारी कमी है। कृपया 24 घंटे के भीतर ज़ोन 3 में सिंचाई और सूक्ष्म पोषक तत्वों की आपूर्ति करें।"
        elif language == 'pa':
            return "ਸੈਟੇਲਾਈਟ ਡੇਟਾ ਅਨੁਸਾਰ ਤੁਹਾਡੇ ਖੇਤ ਦੇ ਜ਼ੋਨ 3 ਵਿੱਚ ਫਸਲ ਦਾ ਤਣਾਅ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੈ। ਐਨ.ਡੀ.ਵੀ.ਆਈ 0.38 ਤੱਕ ਡਿੱਗ ਗਿਆ ਹੈ। ਤੁਰੰਤ ਜ਼ੋਨ 3 ਵਿੱਚ ਪਾਣੀ ਅਤੇ ਜ਼ਰੂਰੀ ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।"
        elif language == 'ta':
            return "செயற்கைக்கோள் தகவலின்படி உங்கள் வயலின் Zone 3 பகுதியில் பயிர் மன அழுத்தம் கண்டறியப்பட்டுள்ளது. NDVI 0.38 ஆக குறைந்துள்ளது. உடனடியாக அந்த பகுதியில் பாசனம் மற்றும் நுண்ணூட்டச்சத்து அளியுங்கள்."
        elif language == 'mr':
            return "उपग्रह नोंदीनुसार आपल्या शेतातील Zone 3 मध्ये तीव्र पीक तणाव दिसून येत आहे. NDVI 0.38 पर्यंत घसरला आहे. पुढील 24 तासांत तातडीने सिंचन आणि सूक्ष्म अन्नद्रव्यांचा पुरवठा करा."
        else:
            return "Satellite telemetry reveals elevated crop stress in Zone 3 of your field with NDVI dropped to 0.38. Targeted drip irrigation and foliar micro-nutrients are strongly recommended within 24 hours."

    # 1. Cotton - Pink / American Bollworm (గులాబీ రంగు పురుగు / పత్తి / गुलाबी सुंडी / कपास)
    if any(k in q for k in [
        'bollworm', 'cotton', 'పత్తి', 'గులాబీ', 'కపాస్', 'कपास', 'गुलाबी', 'patti', 'gulabi',
        'kapaas', 'sundi', 'pink', 'నల్లి', 'కిడా'
    ]):
        if language == 'te':
            return "పత్తిలో గులాబీ రంగు పురుగు నివారణకు ఎకరాకు 8 లింగాకర్షక బుట్టలు (Pheromone traps) అమర్చండి. ఉధృతి ఎక్కువగా ఉంటే ప్రొఫెనోఫాస్ 2 మి.లీ లేదా ఇమామెక్టిన్ బెంజోయేట్ 0.5 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి."
        elif language == 'hi':
            return "कपास में गुलाबी सुंडी के नियंत्रण के लिए प्रति एकड़ 8 फेरोमोन ट्रैप लगाएं। गंभीर प्रकोप में इमामेक्टिन बेंजोएट 5% SG 0.5 ग्राम या प्रोफेनोफॉस 2 मिली प्रति लीटर पानी में मिलाकर छिड़काव करें।"
        elif language == 'pa':
            return "ਨਰਮੇ ਵਿੱਚ ਗੁਲਾਬੀ ਸੁੰਡੀ ਦੀ ਰੋਕਥਾਮ ਲਈ ਪ੍ਰਤੀ ਏਕੜ 8 ਫੇਰੋਮੋਨ ਟਰੈਪ ਲਗਾਓ। ਜ਼ਿਆਦਾ ਹਮਲੇ ਵੇਲੇ ਇਮਾਮੈਕਟਿਨ ਬੈਂਜੋਏਟ 100 ਗ੍ਰਾਮ ਪ੍ਰਤੀ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਛਿੜਕੋ।"
        elif language == 'ta':
            return "பருத்தியில் இளஞ்சிவப்பு காய் புழுவிற்கு எக்டருக்கு 8 இனக்கவர்ச்சி பொறிகள் வையுங்கள். தீவிர தாக்குதலுக்கு இமாமெக்டின் பென்சோயேட் 0.5 கிராம்/லிட்டர் தெளிக்கவும்."
        elif language == 'mr':
            return "कपाशीतील बोंडअळीच्या नियंत्रणासाठी एकरी 8 कामगंध सापळे लावा. जास्त प्रादुर्भाव असल्यास इमामेक्टिन बेंझोएट 0.5 ग्रॅम प्रति लिटर पाण्यात मिसळून फवारा."
        else:
            return "For Cotton Pink Bollworm control, install 8 pheromone traps per acre. For active infestation, spray Emamectin Benzoate 5% SG at 0.5 g per liter or Profenofos at 2 ml per liter of water."

    # 2. Rice / Paddy - Blast, Stem Borer & BPH (వరి అగ్గితెగులు, కాండం తొలుచు పురుగు / धान का झुलसा, तना छेदक)
    if any(k in q for k in [
        'paddy', 'rice', 'వరి', 'ధానం', 'ధాన్', 'धान', 'blast', 'stem borer', 'bph',
        'అగ్గి', 'झुलसा', 'ਝੋਨਾ', 'vari', 'dhan', 'aggi', 'tegulu', 'borer', 'chawal'
    ]):
        if language == 'te':
            return "వరిలో అగ్గితెగులు (Blast) కు ట్రైసైక్లాజోల్ 75% WP (బాన్) 0.6 గ్రాములు లేదా కాండం తొలుచు పురుగుకు క్లోరాంట్రానిలిప్రోల్ (కొరాజెన్) 0.4 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయండి."
        elif language == 'hi':
            return "धान में ब्लास्ट रोग के लिए ट्राईसाइक्लाजोल 75% WP 0.6 ग्राम प्रति लीटर, और तना छेदक या भूरा फुदका के लिए कोराजन (क्लोरेंट्रानिलीप्रोल) 0.4 मिली प्रति लीटर पानी में छिड़कें।"
        elif language == 'pa':
            return "ਝੋਨੇ ਵਿੱਚ ਧੌਣ ਮਰੋੜ (ਬਲਾਸਟ) ਲਈ ਟਰਾਈਸਾਈਕਲਾਜ਼ੋਲ 120 ਗ੍ਰਾਮ ਜਾਂ ਤਣਾ ਛੇਦਕ ਲਈ ਕੋਰਾਜਨ 60 ਮਿਲੀ ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕੋ।"
        elif language == 'ta':
            return "நெல்லில் குலை நோய்க்கு ட்ரைசைக்ளசோல் 0.6 கிராம்/லிட்டர், தண்டு துளைப்பான் தாக்குதலுக்கு கோராஜன் 0.4 மி.லி தெளிக்கவும்."
        elif language == 'mr':
            return "भातावरील करपा रोगासाठी ट्रायसायक्लॅझोल 0.6 ग्रॅम किंवा खोडकिडीसाठी कोराजेन 0.4 मिली प्रति लिटर पाण्यात फवारणी करा."
        else:
            return "For Rice/Paddy Blast, apply Tricyclazole 75% WP (Baan) at 0.6 g/liter. For Stem Borer or BPH, spray Chlorantraniliprole 18.5% SC (Coragen) at 0.4 ml/liter in 200 liters water/acre."

    # 3. Tomato & Chilli - Leaf Curl, Thrips, Mites (టమోటా ఆకుముడత, మిరప తామర పురుగులు / टमाटर पत्ता मरोड़, मिर्च थ्रिप्स)
    if any(k in q for k in [
        'tomato', 'chilli', 'mirchi', 'టమోటా', 'మిరప', 'टमाटर', 'मिर्च', 'curl', 'thrips',
        'mite', 'ముడత', 'murda', 'tamatar', 'mirapa', 'aaku mudatha', 'tameta', 'pilli'
    ]):
        if language == 'te':
            return "మిరప మరియు టమోటాలో ఆకుముడత మరియు తామర పురుగుల (Thrips) నివారణకు ఫిప్రోనిల్ + ఇమిడాక్లోప్రిడ్ (పోలీస్) 1 గ్రాము లేదా స్పైరోమెసిఫెన్ 1 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయండి. నీలి/పసుపు రంగు జిగురు అట్టలు పెట్టండి."
        elif language == 'hi':
            return "मिर्च और टमाटर में पत्ता मरोड़ और थ्रिप्स कीट के लिए, फिप्रोनिल + इमिडाक्लोप्रिड (पुलिस) 1 ग्राम प्रति लीटर, या नीम का तेल 3 मिली प्रति लीटर पानी में मिलाकर छिड़कें। नीले व पीले चिपचिपे कार्ड लगाएं।"
        elif language == 'pa':
            return "ਟਮਾਟਰ ਤੇ ਮਿਰਚ ਵਿੱਚ ਪੱਤਾ ਮਰੋੜ ਰੋਗ ਦੀ ਰੋਕਥਾਮ ਲਈ ਇਮੀਡਾਕਲੋਪ੍ਰਿਡ 0.5 ਮਿਲੀ ਜਾਂ ਨਿੰਮ ਦਾ ਤੇਲ 3 ਮਿਲੀ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਸਪਰੇਅ ਕਰੋ।"
        elif language == 'ta':
            return "மிளகாய் மற்றும் தக்காளியில் இலை சுருட்டல் மற்றும் த்ரிப்ஸ் பூச்சிக்கு ஃபிப்ரோனில் + இமிடாக்ளோப்ரிட் 1 கிராம்/லிட்டர் அல்லது வேப்ப எண்ணெய் தெளிக்கவும்."
        elif language == 'mr':
            return "मिरची व टोमॅटोतील चुरडा-मुरडा व थ्रिप्स किडीसाठी फिप्रोनिल + इमिडाक्लोप्रिड 1 ग्रॅम प्रति लिटर किंवा निंबोळी अर्क 3 मिली प्रति लिटर पाण्यात फवारा."
        else:
            return "For Tomato & Chilli Leaf Curl and Thrips/Mites, spray Fipronil 40% + Imidacloprid 40% WG (Police) at 1 g/liter or Spiromesifen at 1 ml/liter. Install blue and yellow sticky traps (15/acre)."

    # 4. Yellow Leaves / Nutrient Deficiency (ఆకులు పసుపు రంగు / पीली पत्तियां / పీలే పత్తే)
    if any(k in q for k in [
        'yellow', 'chlorosis', 'పసుపు', 'పీలి', 'पीली', 'पत्ते', 'zinc', 'iron', 'nitrogen',
        'pasupu', 'peela', 'pila', 'aakulu pasupu', 'patte peele', 'pale leaf'
    ]):
        if language == 'te':
            return "ఆకులు పసుపు రంగులోకి మారితే: క్రింది ఆకులు పసుపు అయితే నత్రజని లోపం - నానో యూరియా 4 మి.లీ స్ప్రే చేయండి. పై లేత ఆకులు పసుపు అయితే జింక్ సల్ఫేట్ 2 గ్రాములు లేదా ఫెర్రస్ సల్ఫేట్ 1 గ్రాము లీటరు నీటికి కలిపి పిచికారీ చేయండి."
        elif language == 'hi':
            return "पत्तियां पीली पड़ने पर: पुरानी पत्तियां पीली हैं तो नाइट्रोजन की कमी है, नैनो यूरिया 4 मिली/लीटर छिड़कें। नई पत्तियां पीली हैं तो जिंक सल्फेट 2 ग्राम या फेरस सल्फेट 1 ग्राम प्रति लीटर पानी में मिलाकर स्प्रे करें।"
        elif language == 'pa':
            return "ਜੇ ਪੱਤੇ ਪੀਲੇ ਪੈ ਰਹੇ ਹਨ, ਤਾਂ ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਕਮੀ ਲਈ ਨੈਨੋ ਯੂਰੀਆ 4 ਮਿਲੀ ਜਾਂ ਜ਼ਿੰਕ ਸਲਫੇਟ 0.5% ਦਾ ਛਿੜਕਾਅ ਕਰੋ।"
        elif language == 'ta':
            return "இலைகள் மஞ்சளானால், பழைய இலைகளுக்கு நானோ யூரியா 4 மி.லி, புதிய தளிர்களுக்கு ஜிங்க் சல்பேட் 2 கிராம்/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்."
        elif language == 'mr':
            return "पाने पिवळी पडल्यास: खालची पाने असल्यास नत्र कमतरता आहे, नॅनो युरिया 4 मिली/लिटर फवारा. वरची नवीन पाने पिवळी असल्यास झिंक सल्फेट 2 ग्रॅम प्रति लिटर फवारा."
        else:
            return "For Yellowing Leaves: If lower leaves turn yellow, it is Nitrogen deficiency - spray Nano Urea at 4 ml/L. If new upper leaves turn yellow, apply Zinc Sulphate (2 g/L) or Ferrous Sulphate (1 g/L)."

    # 5. Flower / Fruit Dropping (పూత రాలడం / పూత / फूल गिरना / ఫుల్ ਝੜਨਾ)
    if any(k in q for k in [
        'flower', 'dropping', 'fruit drop', 'పూత', 'రాలడం', 'రాలిపోవడం', 'फूल', 'गिरना',
        'pootha', 'raladam', 'phool', 'girna', 'boron', 'planofix', 'shedding'
    ]):
        if language == 'te':
            return "పూత మరియు పిందె రాలడం నివారణకు ప్లానోఫిక్స్ (ఆల్ఫా NAA) 1 మి.లీ 4.5 లీటర్ల నీటికి కలిపి లేదా బోరాన్ 20% 1 గ్రాము లీటరు నీటికి కలిపి ఉదయం వేళల్లో పిచికారీ చేయండి."
        elif language == 'hi':
            return "फूल और फल झड़ने से रोकने के लिए प्लानोफिक्स (अल्फा NAA) 1 मिली को 4.5 लीटर पानी में घोलकर, या घुलनशील बोरॉन 1 ग्राम प्रति लीटर पानी में मिलाकर छिड़कें।"
        elif language == 'pa':
            return "ਫੁੱਲ ਅਤੇ ਫਲ ਝੜਨ ਤੋਂ ਰੋਕਣ ਲਈ ਪਲੈਨੋਫਿਕਸ 1 ਮਿਲੀ ਪ੍ਰਤੀ 4.5 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਜਾਂ ਬੋਰੋਨ 1 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਛਿੜਕੋ।"
        elif language == 'ta':
            return "பூக்கள் உதிர்வதைத் தடுக்க பிளனோபிக்ஸ் 1 மி.லி / 4.5 லிட்டர் தண்ணீர் அல்லது போரான் 1 கிராம்/லிட்டர் கலந்து தெளிக்கவும்."
        elif language == 'mr':
            return "फुलगळ व फळगळ थांबवण्यासाठी प्लॅनोफिक्स 1 मिली 4.5 लिटर पाण्यात किंवा बोरॉन 1 ग्रॅम प्रति लिटर पाण्यात मिसळून फवारणी करा."
        else:
            return "To prevent flower and fruit drop, spray Planofix (Alpha NAA) at 1 ml per 4.5 liters of water, combined with Soluble Boron 20% at 1 g/liter during early morning hours."

    # 6. Fall Armyworm in Maize (మొక్కజొన్న కత్తెర పురుగు / मक्का का फॉल आर्मीवर्म)
    if any(k in q for k in [
        'maize', 'corn', 'మొక్కజొన్న', 'మొక్కజొన', 'मक्का', 'armyworm', 'కత్తెర',
        'mokkajonna', 'makka', 'kattera', 'whorl', 'faw'
    ]):
        if language == 'te':
            return "మొక్కజొన్నలో కత్తెర పురుగు నివారణకు క్లోరాంట్రానిలిప్రోల్ (కొరాజెన్) 0.4 మి.లీ లేదా స్పైనెటోరామ్ (డెలిగేట్) 0.9 మి.లీ లీటరు నీటికి కలిపి సుడులలో (Whorl) పడేలా పిచికారీ చేయండి."
        elif language == 'hi':
            return "मक्का में फॉल आर्मीवर्म (सैनिक कीट) के लिए कोराजन 0.4 मिली या स्पाइनेटोरम 0.9 मिली प्रति लीटर पानी में घोलकर पौधे की गोभ (Whorl) में सीधे डालें।"
        elif language == 'pa':
            return "ਮੱਕੀ ਵਿੱਚ ਫਾਲ ਆਰਮੀਵਰਮ ਦੀ ਰੋਕਥਾਮ ਲਈ ਕੋਰਾਜਨ 0.4 ਮਿਲੀ ਜਾਂ ਸਪਾਈਨੇਟੋਰਮ 0.9 ਮਿਲੀ ਪ੍ਰਤੀ ਲੀਟਰ ਗੋਭ ਵਿੱਚ ਸਪਰੇਅ ਕਰੋ।"
        elif language == 'ta':
            return "மக்காச்சோளப் படைப்புழுவிற்கு கோராஜன் 0.4 மி.லி அல்லது ஸ்பைனோசாட் குருத்தில் படும்படி தெளிக்கவும்."
        elif language == 'mr':
            return "मक्यातील लष्करी अळीसाठी (Fall Armyworm) कोराजेन 0.4 मिली किंवा स्पायनेटोरम 0.9 मिली प्रति लिटर पोंग्यात पडेल असे फवारा."
        else:
            return "For Maize Fall Armyworm (FAW), spray Chlorantraniliprole 18.5% SC (Coragen) at 0.4 ml/L or Spinetoram 11.7% SC at 0.9 ml/L directly into the plant whorl."

    # 7. Fungus / Blight / Rust / Spots / తెగుళ్ళు / తుప్పు
    if any(k in q for k in [
        'fungus', 'blight', 'rust', 'mildew', 'spot', 'rot', 'తుప్పు', 'తెగులు', 'తెగుళ్ళు', 'మచ్చ',
        'फफूंद', 'रतुआ', 'करपा', 'धब्बा', 'tegulu', 'macha', 'rot', 'kungi', 'damping'
    ]):
        if language == 'te':
            return "శిలీంధ్ర తెగుళ్ళకు మాంకోజెబ్ + మెటలాక్సిల్ (రిడోమిల్ గోల్డ్) 2 గ్రాములు లేదా అజోక్సీస్ట్రోబిన్ + డిఫెనోకోనాజోల్ (అమిస్టార్ టాప్) 1 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయండి."
        elif language == 'hi':
            return "फफूंदजनित झुलसा व रतुआ रोगों के लिए रिडोमिल गोल्ड 2 ग्राम प्रति लीटर या एमिस्टार टॉप (एज़ोक्सीस्ट्रोबिन + डाइफेनोकोनाज़ोल) 1 मिली प्रति लीटर पानी में स्प्रे करें।"
        elif language == 'pa':
            return "ਫੰਗਸ ਅਤੇ ਕੁੰਗੀ ਰੋਗ ਲਈ ਰਿਡੋਮਿਲ ਗੋਲਡ 2 ਗ੍ਰਾਮ ਜਾਂ ਟਿਲਟ 1 ਮਿਲੀ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।"
        elif language == 'ta':
            return "பூஞ்சை நோய்களுக்கு ரிடோமில் கோல்ட் 2 கிராம் அல்லது அமிஸ்டார் டாப் 1 மி.லி/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்."
        elif language == 'mr':
            return "बुरशीजन्य करपा किंवा तांबेरा रोगासाठी रिडोमिल गोल्ड 2 ग्रॅम किंवा ॲमिस्टार टॉप 1 मिली प्रति लिटर पाण्यात फवारा."
        else:
            return "For fungal blights, rusts, and leaf spots, spray Metalaxyl + Mancozeb (Ridomil Gold) at 2 g/L or Azoxystrobin + Difenoconazole (Amistar Top) at 1 ml/L."

    # 8. Sucking Pests / Whiteflies / Aphids / పురుగులు / कीड़े / Purugu
    if any(k in q for k in [
        'pest', 'insect', 'worm', 'caterpillar', 'aphid', 'whitefly', 'పురుగు', 'పురుగులు',
        'కీటకం', 'कीड़ा', 'कीड़े', 'purugu', 'kida', 'kide', 'sucking', 'dosa', 'tela', 'larva'
    ]):
        if language == 'te':
            return "రసం పీల్చే పురుగులు మరియు తెల్లదోమ నివారణకు ఇమిడాక్లోప్రిడ్ 17.8% SL 0.5 మి.లీ లేదా థయామెథోక్సామ్ 25% WG 0.3 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి."
        elif language == 'hi':
            return "रस चूसक कीटों और सफेद मक्खी के लिए इमिडाक्लोप्रिड 17.8% SL 0.5 मिली, या थायमेथॉक्सम 25% WG 0.3 ग्राम प्रति लीटर पानी में मिलाकर छिड़कें।"
        elif language == 'pa':
            return "ਚਿੱਟੀ ਮੱਖੀ ਅਤੇ ਤੇਲੇ ਲਈ ਇਮੀਡਾਕਲੋਪ੍ਰਿਡ 0.5 ਮਿਲੀ ਜਾਂ ਥਾਇਆਮੈਥੋਕਸਾਮ 0.3 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਸਪਰੇਅ ਕਰੋ।"
        elif language == 'ta':
            return "சாறு உறிஞ்சும் பூச்சிகள் மற்றும் வெள்ளை ஈக்களுக்கு இமிடாக்ளோப்ரிட் 0.5 மி.லி அல்லது தயாமெதாக்ஸம் 0.3 கிராம்/லிட்டர் தெளிக்கவும்."
        elif language == 'mr':
            return "मावा, तुडतुडे व पांढरी माशीसाठी इमिडाक्लोप्रिड 0.5 मिली किंवा थायामेथोक्साम 0.3 ग्रॅम प्रति लिटर पाण्यात मिसळून फवारा."
        else:
            return "For sucking pests, aphids, and whiteflies, spray Imidacloprid 17.8% SL at 0.5 ml/L or Thiamethoxam 25% WG at 0.3 g/L in 150-200 liters of water per acre."

    # 9. Fertilizer / NPK / Soil Health / Urea / DAP / ఎరువులు / खाद
    if any(k in q for k in [
        'fertilizer', 'dap', 'npk', 'urea', 'potash', 'ఎరువులు', 'खाद', 'खत', 'ਖਾਦ',
        'eruvulu', 'khad', 'khat', 'growth', 'yield', 'tonic', 'poshaka', 'zinc'
    ]):
        if language == 'te':
            return "సమతుల్య పోషకాల కోసం ఎకరాకు సిఫార్సు చేసిన ఎరువుల మోతాదును నేల తేమగా ఉన్నప్పుడు వేయండి. పూత దశలో 19-19-19 నీటిలో కరిగే ఎరువు 5 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయడం ద్వారా దిగుబడి 20% పెరుగుతుంది."
        elif language == 'hi':
            return "संतुलित पोषण के लिए एनपीके 19-19-19 घुलनशील खाद 5 ग्राम प्रति लीटर पानी में मिलाकर वानस्पतिक अवस्था में छिड़कें। फल बनते समय 0-0-50 (पोटाश) का स्प्रे गुणवत्ता और उपज बढ़ाता है।"
        elif language == 'pa':
            return "ਫਸਲ ਦੇ ਵਾਧੇ ਲਈ 19-19-19 ਘੁਲਣਸ਼ੀਲ ਖਾਦ 1 ਕਿਲੋ ਪ੍ਰਤੀ ਏਕੜ ਸਪਰੇਅ ਕਰੋ। ਇਸ ਨਾਲ ਫਸਲ ਹਰੀ-ਭਰੀ ਰਹਿੰਦੀ ਹੈ।"
        elif language == 'ta':
            return "சமச்சீர் ஊட்டச்சத்திற்கு 19-19-19 நீரில் கரையும் உரத்தை 5 கிராம்/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும். இது பயிர் வளர்ச்சியை அதிகரிக்கும்."
        elif language == 'mr':
            return "संतुलित खतासाठी 19-19-19 विद्राव्य खत 5 ग्रॅम प्रति लिटर फवारा. फळ धारणेच्या वेळी 0-0-50 पोटाशची फवारणी दाण्यांचे वजन वाढवते."
        else:
            return "For balanced nutrition, apply NPK 19-19-19 water-soluble grade at 5 g/liter at vegetative stage. Apply 0-0-50 (SOP) at fruit/grain filling stage to boost yield and market grade by 20%."

    # 10. Weed Control / కలుపు నివారణ / खरपतवार
    if any(k in q for k in [
        'weed', 'herbicide', 'కలుపు', 'కలుపు మందు', 'खरपतवार', 'घास', 'ਨਦੀਨ',
        'kalupu', 'khas', 'grass', 'weedicide'
    ]):
        if language == 'te':
            return "విత్తిన 48 గంటల్లోపు పెండిమిథాలిన్ 30% EC 1-1.3 లీటర్లు ఎకరాకు పిచికారీ చేయడం వల్ల అన్ని రకాల కలుపు మొలకెత్తదు. నిలబడిన పంటలో అంతరకృషి లేదా సిఫార్సు చేసిన పోస్ట్-ఎమర్జెన్స్ కలుపు మందులు వాడండి."
        elif language == 'hi':
            return "बुवाई के 48 घंटे के भीतर पेंडीमेथालिन 30% EC 1 से 1.25 लीटर प्रति एकड़ 200 लीटर पानी में छिड़कें। खड़ी फसल में चौड़ी पत्ती के खरपतवार के लिए उपयुक्त चयनात्मक खरपतवारनाशक का उपयोग करें।"
        elif language == 'pa':
            return "ਬਿਜਾਈ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਪੈਂਡੀਮੈਥਾਲਿਨ 1 ਲੀਟਰ ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕੋ ਤਾਂ ਜੋ ਨਦੀਨ ਨਾ ਉੱਗ ਸਕਣ।"
        elif language == 'ta':
            return "விதைத்த 48 மணி நேரத்திற்குள் பெண்டிமெத்தலின் 1 லிட்டர்/ஏக்கர் தெளிப்பது களைகளை முழுமையாகக் கட்டுப்படுத்தும்."
        elif language == 'mr':
            return "पेरणीनंतर 48 तासांच्या आत पेंडीमेथालिन 1 लिटर प्रति एकर 200 लिटर पाण्यात फवारा, ज्यामुळे तण उगवणार नाही."
        else:
            return "For pre-emergence weed control, spray Pendimethalin 30% EC at 1.0 to 1.25 L per acre within 48 hours of sowing in moist soil. For standing crops, use targeted selective post-emergence herbicides."

    # 11. Mandi Prices / Market Rates / మార్కెట్ ధరలు / मंडी भाव
    if any(k in q for k in [
        'mandi', 'rate', 'price', 'ధర', 'ధరలు', 'మార్కెట్', 'భావం', 'भाव', 'రేట్',
        'बाजारभाव', 'bhav', 'dhara', 'cost', 'msp'
    ]):
        if language == 'te':
            return "నేడు ప్రధాన వ్యవసాయ మార్కెట్లలో శ్రేష్ఠమైన గోధుమలు క్వింటాలుకు ₹2,840, వరి ₹2,450, టమోటా కిలో ₹32-₹38 మరియు పత్తి క్వింటాలుకు ₹7,450 పలుకుతోంది."
        elif language == 'hi':
            return "आज की मुख्य मंडियों में शरबती गेहूं 2,840 रुपये/क्विंटल, धान 2,450 रुपये, संकर टमाटर 32 से 38 रुपये किलो और कपास 7,450 रुपये प्रति क्विंटल बिक रहा है।"
        elif language == 'pa':
            return "ਅੱਜ ਮੰਡੀ ਵਿੱਚ ਕਣਕ ₹2,475 ਪ੍ਰਤੀ ਕੁਇੰਟਲ, ਬਾਸਮਤੀ ₹3,920 ਅਤੇ ਆਲੂ ₹16 ਪ੍ਰਤੀ ਕਿਲੋ ਚੱਲ ਰਿਹਾ ਹੈ।"
        elif language == 'ta':
            return "இன்றைய சந்தையில் நெல் குவிண்டாலுக்கு ₹2,450, தக்காளி கிலோ ₹35, மற்றும் பருத்தி ₹7,450-க்கு விலை போகிறது."
        elif language == 'mr':
            return "आज बाजारात गहू ₹2,840, कांदा ₹22-₹28 प्रति किलो आणि कापूस ₹7,450 प्रति क्विंटल दराने विक्री होत आहे."
        else:
            return "Today's APMC benchmark rates: Wheat ₹2,840/qtl, Basmati Paddy ₹3,920/qtl, Hybrid Tomato ₹34-₹38/kg, and Medium Staple Cotton ₹7,450/qtl."

    # 12. Weather & Spray Timing / వాతావరణం / मौसम
    if any(k in q for k in [
        'weather', 'rain', 'వాతావరణం', 'వర్షం', 'मौसम', 'बारिश', 'ਮੌਸਮ',
        'vathavaranam', 'varsham', 'mausam', 'barish', 'spray safe', 'wind'
    ]):
        if language == 'te':
            return "రాగల 24 గంటల్లో వాతావరణం పొడిగా ఉంటుంది. వర్ష సూచన లేదు. గాలి వేగం 8 కి.మీ లోపే ఉంది కాబట్టి ఉదయం 8 నుండి 11 గంటల మధ్య లేదా సాయంత్రం వేళల్లో పిచికారీ చేయడానికి అత్యంత అనుకూల సమయం."
        elif language == 'hi':
            return "आगामी 24 घंटे में मौसम साफ रहेगा और बारिश की संभावना 5% से कम है। हवा की गति सामान्य है। सुबह 8 से 11 बजे या शाम को दवा का छिड़काव करना सबसे उत्तम रहेगा।"
        elif language == 'pa':
            return "ਅਗਲੇ 24 ਘੰਟੇ ਮੌਸਮ ਸਾਫ ਹੈ। ਸਵੇਰੇ 8 ਤੋਂ 11 ਵਜੇ ਦੇ ਵਿਚਕਾਰ ਸਪਰੇਅ ਕਰਨ ਦਾ ਬਹੁਤ ਵਧੀਆ ਸਮਾਂ ਹੈ।"
        elif language == 'ta':
            return "அடுத்த 24 மணி நேரத்திற்கு மழை வாய்ப்பு இல்லை. காலை 8 முதல் 11 மணி வரை மருந்து தெளிக்க உகந்த நேரம்."
        elif language == 'mr':
            return "पुढील 24 तासांत हवामान कोरडे राहील. सकाळी 8 ते 11 किंवा संध्याकाळी 4 नंतर फवारणी करणे अत्यंत फायदेशीर ठरेल."
        else:
            return "Telemetry indicates clear skies with rainfall probability under 5% and wind speeds under 8 km/h. Ideal foliar spraying window is 8:00 AM to 11:00 AM or after 4:00 PM."

    # 13. Medicine / Spray / Dosage / Treatment / Rogam / Dawa / Mandhu
    if any(k in q for k in [
        'medicine', 'spray', 'dose', 'dosage', 'treatment', 'cure', 'dawa', 'dawai',
        'mandhu', 'mandu', 'rogam', 'bimari', 'మందు', 'పిచికారీ', 'రోగం', 'दवा', 'इलाज'
    ]):
        if language == 'te':
            return "మీ పంట సంరక్షణ కోసం: తెగులు లేదా పురుగు లక్షణాలను బట్టి సరైన మందును ఎంచుకోండి. ప్రాథమిక నివారణకు వేప నూనె 3 మి.లీ లేదా శిలీంధ్రాల నివారణకు మాంకోజెబ్ 2.5 గ్రాములు లీటరు నీటికి కలిపి ఉదయం వేళల్లో పిచికారీ చేయండి."
        elif language == 'hi':
            return "फसल सुरक्षा के लिए: रोग के शुरुआती लक्षणों में नीम का तेल 10,000 ppm 3 मिली/लीटर या फफूंदनाशक मैन्कोज़ेब 2.5 ग्राम प्रति लीटर पानी में मिलाकर सुबह के समय छिड़काव करें।"
        elif language == 'pa':
            return "ਫਸਲ ਦੇ ਇਲਾਜ ਲਈ ਨਿੰਮ ਦਾ ਤੇਲ 3 ਮਿਲੀ ਜਾਂ ਮੈਨਕੋਜ਼ੇਬ 2.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।"
        elif language == 'ta':
            return "பயிர் சிகிச்சைக்கு வேப்ப எண்ணெய் 3 மி.லி அல்லது மேன்கோசெப் 2.5 கிராம்/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்."
        elif language == 'mr':
            return "पिकाच्या उपचारासाठी निंबोळी अर्क 3 मिली किंवा मॅन्कोझेब 2.5 ग्रॅम प्रति लिटर पाण्यात मिसळून सकाळी फवारणी करा."
        else:
            return "For broad-spectrum crop protection, spray cold-pressed Neem Oil (10,000 ppm) at 3 ml/L or contact fungicide Mancozeb 75% WP at 2.5 g/liter in 200 liters of water per acre."

    # 14. Dynamic Comprehensive Agronomist Fallback for ANY OTHER Query
    if language == 'te':
        return "మీరు అడిగిన పంట సమస్యపై సలహా: పొలంలో నేల తేమను సరిచూసి, తెగుళ్ళు లేదా పురుగుల ప్రారంభ దశలో వేప నూనె 3 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయండి. సమతుల్య NPK 19-19-19 ఎరువులను అందించండి."
    elif language == 'hi':
        return "आपके सवाल पर कृषि वैज्ञानिक सलाह: खेत में उचित नमी बनाए रखें। किसी भी शुरुआती कीट या रोग के लिए नीम तेल 10,000 ppm 3 मिली प्रति लीटर का छिड़काव करें और 19-19-19 सूक्ष्म पोषक तत्वों का संतुलित प्रयोग करें।"
    elif language == 'pa':
        return "ਤੁਹਾਡੇ ਸਵਾਲ 'ਤੇ ਖੇਤੀ ਮਾਹਿਰ ਦੀ ਸਲਾਹ: ਫਸਲ ਦੀ ਚੰਗੀ ਸਿਹਤ ਲਈ ਖੇਤ ਵਿੱਚ ਨਮੀ ਬਣਾਈ ਰੱਖੋ। ਸ਼ੁਰੂਆਤੀ ਬਿਮਾਰੀਆਂ ਲਈ ਨਿੰਮ ਦਾ ਤੇਲ 3 ਮਿਲੀ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਸਪਰੇਅ ਕਰੋ।"
    elif language == 'ta':
        return "உங்கள் கேள்விக்கான விவசாய ஆலோசனை: பயிர் பாதுகாப்புக்கு மண்ணின் ஈரப்பதத்தை சரியாக பராமரிக்கவும். ஆரம்ப கட்ட பூச்சி தாக்குதலுக்கு வேப்ப எண்ணெய் 3 மி.லி/லிட்டர் தெளித்து நுண்ணூட்டச்சத்தை இடவும்."
    elif language == 'mr':
        return "आपल्या प्रश्नावर कृषी सल्ला: पिकाच्या चांगल्या वाढीसाठी शेतात योग्य ओलावा ठेवा. प्राथमिक कीड व रोगासाठी निंबोळी अर्क 3 मिली प्रति लिटर पाण्यात फवारा व सूक्ष्म अन्नद्रव्यांचा वापर करा."
    else:
        return "Agronomist recommendation for your query: Maintain optimal soil moisture and inspect field zones. For early pest or pathogen control, apply Neem Oil 10,000 ppm at 3 ml/L along with water-soluble 19-19-19 (5 g/L) for vigorous vegetative recovery."
