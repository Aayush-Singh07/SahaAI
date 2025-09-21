// AI Knowledge Base for Police Assistant
// Updated with comprehensive case data and multilingual support

export type Language = 'english' | 'hindi' | 'marathi';

export interface KnowledgeBaseEntry {
  id: string;
  incident: string;
  aliases: string[];
  keywords: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  pre_procedure: string[];
  documents_checklist: string[];
  procedure_steps: string[];
  bns_explanation: {
    short: string;
    detailed?: string;
  };
  civil_judgment?: string[];
  human_prompts: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  faq_examples: Array<{
    q: {
      en: string;
      hi: string;
      mr: string;
    };
    a: {
      en: string;
      hi: string;
      mr: string;
    };
  }>;
  example_sms: {
    template_en: string;
    template_hi: string;
    template_mr: string;
  };
}

// Comprehensive knowledge base with all 15 case types
export const aiKnowledgeBase: KnowledgeBaseEntry[] = [
  {
    "id": "1",
    "incident": "Mobile phone loss/theft",
    "aliases": ["mobile lost", "lost phone", "phone stolen", "stolen mobile", "cellphone missing", "smartphone gone", "phone snatched"],
    "keywords": {
      "en": ["lost my phone","my phone is lost","phone stolen","stolen smartphone","help my phone is gone","i lost my cellphone","track my phone","imei","imei number","find my device","blocked imei","register fir for phone","file report phone lost","please help my phone","urgent phone missing"],
      "hi": ["मेरा फोन खो गया","फोन चोरी हो गया","मोबाइल गुम","स्मार्टफोन चोरी","कृपया मेरा फोन ढूंढें","IMEI नंबर","IMEI कैसे देखें","FIR दर्ज करें फोन के लिए","मदद करें मेरा फ़ोन गया","आपातकाल फोन खो गया"],
      "mr": ["माझा फोन हरवला","फोन चोरी झाला","मोबाईल हरवला","स्मार्टफोन गायब","कृपया मदत करा फोन हरवला","IMEI नंबर कसा शोधायचा","FIR नोंदवा फोनसाठी"]
    },
    "pre_procedure": [
      "Ask complainant full name",
      "Ask complainant phone number (SMS will be sent here)",
      "Ask complainant address"
    ],
    "documents_checklist": ["IMEI/serial number","purchase invoice/receipt","SIM details","tracking screenshots (Find My Device)","CCTV footage if any"],
    "procedure_steps": [
      "Confirm complainant identity and contact (name, phone, address)",
      "Collect IMEI (ask: dial *#06# or check box/receipt)",
      "Collect phone make, model, color and last seen location/time",
      "Ask for purchase invoice / proof of ownership (Yes/No voice) and note response",
      "Ask for SIM details (Yes/No) and record number/operator",
      "Record if any tracking attempts/screenshots available (Yes/No)",
      "Register FIR / Zero FIR under BNS §303 (theft) if theft suspected; if only lost, diary entry or GD may be used depending on local procedure",
      "Forward IMEI details to CEIR/IMEI tracking cell through police channels",
      "Provide complainant with token number (format YEAR/TOKEN) and send SMS to provided phone"
    ],
    "bns_explanation": {
      "short": "BNS §303 deals with theft. BNSS §173 codifies Zero FIR and mandates registration of FIR for cognizable offences.",
      "detailed": "If the facts disclose a cognizable offence (theft/snatching), FIR must be registered per BNSS §173. Attach IMEI and digital evidence; preserve digital logs per BNSS §193."
    },
    "civil_judgment": ["Lalita Kumari v. State of UP — FIR must be registered for cognizable offences."],
    "human_prompts": {
      "en": ["I understand. I will help you register this. Could you please tell me your full name?", "May I have the phone number to send the report token to?", "Please tell me your address for the report."],
      "hi": ["मैं आपकी मदद करूंगा। क्या आप अपना पूरा नाम बता सकते हैं?", "कृपया वह फ़ोन नंबर दीजिये जिस पर रिपोर्ट टोकन भेजना है।", "कृपया अपना पता बताएं।"],
      "mr": ["मी तुमची मदत करीन. कृपया तुमचे पूर्ण नाव सांगा.", "कृपया रिपोर्ट टोकन पाठवण्याकरिता फोन नंबर द्या.", "कृपया तुमचा पत्ता सांगा."]
    },
    "faq_examples": [
      {
        "q": {"en":"How to track my lost phone using IMEI?","hi":"IMEI से अपने खोए फोन को कैसे ट्रैक करूँ?","mr":"IMEI ने माझा हरवलेला फोन कसा शोधायचा?"},
        "a": {"en":"Provide the IMEI in FIR; police will forward IMEI to CEIR and attempt blocking/tracking. Also inform your operator to block your SIM.","hi":"FIR में IMEI दें; पुलिस CEIR को IMEI भेजकर ब्लॉक/ट्रैक करेगी। अपने ऑपरेटर को भी सिम ब्लॉक करने को कहें।","mr":"FIR मध्ये IMEI द्या; पोलीस CEIR कडे IMEI पाठवून ब्लॉक/ट्रॅक करतील. तुमच्या ऑपरेटरला सिम ब्लॉक करण्यास सांगा."}
      },
      {
        "q": {"en":"I lost my phone but have no invoice, what now?","hi":"मेरे पास कोई खरीद रसीद नहीं है, अब क्या करें?","mr":"माझ्याकडे खरेदी पावती नाही आहे, आता काय करावे?"},
        "a": {"en":"File the FIR with all other details (IMEI, SIM). Mention lack of invoice; police will still register. Try to provide any secondary proof like bank purchase SMS or online order history.","hi":"IMEI, सिम और अन्य विवरण के साथ FIR दर्ज करें। रसीद न होने का उल्लेख करें; पुलिस फिर भी दर्ज करेगी। बैंक SMS या ऑनलाइन ऑर्डर हिस्ट्री दें।","mr":"IMEI, सिम आणि इतर तपशीलांसह FIR नोंदवा. पावती नसल्याचे सांगा; पोलीस नोंद करतील. बँक SMS किंवा ऑनलाइन ऑर्डर इतिहास द्या."}
      }
    ],
    "example_sms": {
      "template_en": "Your report for Mobile Phone Loss/Theft has been filed. Token: {TOKEN}. Use this to check status.",
      "template_hi": "आपकी मोबाइल खोने/चोरी की रिपोर्ट दर्ज कर दी गई है। टोकन: {TOKEN}। स्थिति देखने के लिए इसका उपयोग करें।",
      "template_mr": "आपली मोबाइल हरवण्याची/चोरीची तक्रार नोंदवण्यात आली आहे. टोकन: {TOKEN}. स्थिती पाहण्यासाठी वापरा."
    }
  },
  {
    "id": "2",
    "incident": "Cyber fraud / Online scams",
    "aliases": ["online scam", "upi fraud", "phishing", "otp fraud", "bank fraud", "social media scam"],
    "keywords": {
      "en": ["phishing","vishing","upi fraud","otp scam","online scam","scammed online","fraudulent transaction","fake website","impersonation on social media","account hacked","bank transfer scam","transaction reversal fraud","scammer asked otp","i lost money online","please help online scam"],
      "hi": ["ऑनलाइन ठगी","यूपीआई धोखा","OTP धोखा","फिशिंग","फर्जी वेबसाइट","बैंक फ्रॉड","सोशल मीडिया नकल","मुझे ऑनलाइन ठगा गया","मेरे पैसे निकल गए"],
      "mr": ["ऑनलाइन फसवणूक","UPI फसवणूक","OTP फसवणूक","फिशिंग","खोटी वेबसाइट","बँक फसवणूक","सोशल मीडिया नक्कल","मला ऑनलाइन फसवले गेले"]
    },
    "pre_procedure": ["Ask user's full name","Ask user's phone number (SMS will be sent here)","Ask user's address"],
    "documents_checklist": ["screenshots of conversation/website","bank transaction details / UPI IDs","phone numbers/accounts used by fraudster","email headers if applicable","timestamps and reference numbers"],
    "procedure_steps": [
      "Collect complainant details (name, phone, address)",
      "Ask date/time/platform used (UPI, website, app, social media)",
      "Collect fraudulent account details, recipient UPI ID/account, transaction IDs",
      "Collect screenshots, chat logs, and bank statements (Yes/No voice)",
      "Register FIR under BNS §316/§317 and forward to Cyber Cell",
      "Advise complainant to notify bank immediately to freeze payments/accounts"
    ],
    "bns_explanation": {
      "short":"BNS §316 and §317 deal with cheating and fraudulent acts; BNSS §193 covers preservation of digital evidence.",
      "detailed":"Cyber offences require timely preservation of digital logs and forwarding of evidence to Cyber Cell; the IT Act provisions and BNSS digital evidence protocols apply alongside BNS criminal sections."
    },
    "civil_judgment": ["Shreya Singhal v. Union of India — context on speech vs cyber regulation; not a barrier to cybercrime reporting."],
    "human_prompts": {
      "en":["I understand. Could you tell me when and where the transaction happened?","Please provide screenshots if available — say Yes or No.","I will help register this with Cyber Cell."],
      "hi":["समझ गया। कृपया बताइए लेनदेन कब और किस स्थान पर हुआ?","यदि स्क्रीनशॉट हैं तो हाँ या ना में बताएं।","मैं साइबर सेल में रिपोर्ट दर्ज कराऊंगा।"],
      "mr":["समजले. कृपया सांगा व्यवहार कधी आणि कुठे झाला?","जर स्क्रीनशॉट असतील तर हो/नाही म्हणा.","मी सायबर सेलला तक्रार नोंदवीन."]
    },
    "faq_examples": [
      {
        "q": {"en":"Someone took money from my bank via UPI without permission. What do I do?","hi":"बिना अनुमति के मेरे बैंक से पैसे निकल गए, क्या करूँ?","mr":"माझ्या बँकमधून परवानगी शिवाय पैसे गेले, काय करावे?"},
        "a": {"en":"Immediately call your bank and request a freeze/chargeback. Preserve screenshots and transaction IDs, then file FIR with police and Cyber Cell. Provide all transaction evidence when filing.", "hi":"तुरंत अपने बैंक को कॉल करके फ्रीज़/चार्जबैक का अनुरोध करें। स्क्रीनशॉट्स और ट्रांज़ैक्शन आईडी सुरक्षित रखें, फिर पुलिस और साइबर सेल में FIR दर्ज करें।", "mr":"तुरंत तुमच्या बँकेत संपर्क करा आणि फ्रीझ/चार्जबैक मागा. स्क्रीनशॉट आणि व्यवहार आयडी जतन ठेवा, नंतर पोलीस व सायबर सेलमध्ये FIR नोंदवा."}
      }
    ],
    "example_sms": {
      "template_en":"Your cyber fraud report has been filed. Token: {TOKEN}. We will contact you with updates.",
      "template_hi":"आपकी साइबर ठगी की रिपोर्ट दर्ज हो चुकी है। टोकन: {TOKEN}। हम आपको अपडेट देंगे।",
      "template_mr":"आपली सायबर फसवणुकीची तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. आम्ही तुम्हाला अपडेट देऊ."
    }
  },
  {
    "id": "3",
    "incident": "House break-in / Burglary",
    "aliases": ["home burglary","housebreaking","residential theft","home invasion"],
    "keywords": {
      "en": ["house break-in","burglary","robbery at home","someone entered my house","home was burgled","stolen from house","break-in last night","my home looted","please help burglary","insurance burglary claim"],
      "hi": ["घर में तोड़फोड़","घर चोरी","घर में चोरी हुई","अंदर घुसकर चोरी","रात में घर में तोड़फोड़","कृपया मदद करें घर चोरी"],
      "mr": ["घरात चोरी","घर फोडले गेले","निवासी चोरी","आमच्या घरी चोरी झाली","कृपया मदत करा घरात चोरी"]
    },
    "pre_procedure": ["Ask user's full name","Ask user's phone number (SMS will be sent here)","Ask user's address"],
    "documents_checklist": ["inventory of stolen items","purchase receipts for valuables","CCTV footage (Yes/No)","photos of damage","witness names and contacts"],
    "procedure_steps": [
      "Confirm complainant details (name, phone, address)",
      "Ask when and how entry happened; record point of entry",
      "Record list of stolen/missing items with estimated value",
      "Collect/ask for CCTV footage or nearby camera details (Yes/No)",
      "Scene visit by Investigating Officer (IO) and possible forensic requisition",
      "File FIR under BNS §304/§303 and guide for insurance claim"
    ],
    "bns_explanation": {
      "short":"BNS §304 (house-breaking) and §303 (theft) apply; BNSS §187 allows search & seizure procedures.",
      "detailed":"Police should record scene, take panchnama of found items, and preserve CCTV/digital evidence. Burden of proof considerations from relevant judgments will apply."
    },
    "civil_judgment": ["State of Maharashtra v. Bharat Fakira Dhiwar — burden of proof in theft cases"],
    "human_prompts": {
      "en":["I understand the urgency. Please tell me when and where this happened.","Do you have CCTV footage? Please answer Yes or No.","Please list the valuable items taken, if you can."],
      "hi":["मैं समझता हूँ। कृपया बताइए यह कब और कहाँ हुआ?","क्या आपके पास CCTV फुटेज है? हाँ या ना में बताएं।","कृपया चोरी की गयी कीमती वस्तुएँ बताएं।"],
      "mr":["मला तातडीची गरज समजते. कृपया सांगा हे कधी आणि कुठे झाले?","तुमच्याकडे CCTV फुटेज आहे का? हो/नाही म्हणा.","कृपया चोरी झालेली मौल्यवान वस्तू लिहा."]
    },
    "example_sms": {
      "template_en":"Burglary report filed. Token: {TOKEN}. Police will contact you for investigation steps.",
      "template_hi":"घर में चोरी की रिपोर्ट दर्ज हो चुकी है। टोकन: {TOKEN}। पुलिस आपकी जांच के लिए संपर्क करेगी।",
      "template_mr":"घरफोडीची तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. पोलीस तपासासाठी संपर्क करतील."
    }
  },
  {
    "id": "4",
    "incident": "Pickpocketing / Snatching",
    "aliases": ["pocket theft","snatching","bag snatching","wallet theft"],
    "keywords": {
      "en": ["pickpocketed","snatched","wallet stolen","bag snatched","mobile snatched in crowd","purse stolen","pickpocket in market","lost wallet in crowd","credit cards stolen","cards stolen please help"],
      "hi": ["जेब काटा","स्नैचिंग","पर्स चोरी","बैग छीना गया","भीड़ में चोरी","बिल्ली चोरी","क्रेडिट कार्ड चोरी"],
      "mr": ["पॉकेटमार","झपटमारी","पर्स चोरी","बॅग झपटा","गर्दीत चोरी","क्रेडिट कार्ड हरवले"]
    },
    "pre_procedure": ["Ask user's full name","Ask user's phone number (SMS will be sent here)","Ask user's address"],
    "documents_checklist": ["list of items stolen (wallet/cards)","card numbers last 4 digits","CCTV (Yes/No)","witness details"],
    "procedure_steps": [
      "Collect complainant details",
      "Ask exact location/time and crowd details",
      "Collect suspect description if any",
      "Collect card numbers/last transactions and advise immediate card blocking",
      "Register FIR under BNS §303 and coordinate with patrol units"
    ],
    "bns_explanation": {"short":"FIR mandatory under BNSS §173 for cognizable offences like snatching."},
    "human_prompts": {
      "en":["I am sorry this happened. Where exactly did it happen and when?","Do you have any witness or CCTV? Answer Yes or No.","Please provide last 4 digits of any stolen cards if available."],
      "hi":["मुझे अफसोस है। यह घटना कहाँ और कब हुई?","क्या आपके पास गवाह या CCTV है? हाँ या ना बोलें।","कृपया चोरी हुए कार्ड का आखिरी 4 अंक बताएं अगर हों।"],
      "mr":["मला वाईट वाटते. हे नेमके कुठे आणि केव्हा घडले?","तुमच्याकडे साक्षीदार किंवा CCTV आहे का? हो/नाही सांगा.","चोरी झालेले कार्डचे शेवटचे 4 अंक सांगा जर असतील."]
    },
    "example_sms": {
      "template_en":"Snatching/pickpocketing report filed. Token: {TOKEN}. Block cards immediately if stolen.",
      "template_hi":"स्नैचिंग/जेब कट की रिपोर्ट दर्ज हो चुकी है। टोकन: {TOKEN}। यदि कार्ड चोरी हुए हैं तो तुरंत ब्लॉक करें।",
      "template_mr":"झपटमारी/पॉकेटमार तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. चोरी झाल्यास कार्ड लगेच ब्लॉक करा."
    }
  },
  {
    "id": "5",
    "incident": "Lost & Found items",
    "aliases": ["lost item","found item","lost wallet","found documents"],
    "keywords": {
      "en": ["lost my bag","found a wallet","lost id card","misplaced documents","found phone","lost passport","found keys","documents found","where to report found item","lost property report","found property diary"],
      "hi": ["खोई हुई वस्तु","मिला हुआ पर्स","ID खो गया","दस्तावेज़ गुम","पासपोर्ट खो गया","चाभी मिली"],
      "mr": ["हरवलेली वस्तू","सापडलेला पर्स","ID हरवली","कागदपत्र हरवले","पासपोर्ट हरवला","चावी सापडली"]
    },
    "pre_procedure": ["Ask user's full name","Ask user's phone number (SMS will be sent here)","Ask user's address"],
    "documents_checklist": ["proof of ownership (ID, photos)","description of unique marks","time and place lost/found"],
    "procedure_steps": [
      "Collect complainant details",
      "Ask detailed description of item and where/when lost",
      "Check Found & Lost diary entry (GD) and match if found",
      "If found, perform Panchnama and handover with ID verification",
      "If lost, file report and advise on recovery steps"
    ],
    "bns_explanation": {"short":"Not a penal offence unless theft suspected. Use BNSS §173/§193 for diary and record."},
    "human_prompts": {
      "en":["Please describe the item and when you lost it.","Do you have proof of ownership? Answer Yes or No.","We will log a lost item report and attempt to match with found items."],
      "hi":["कृपया वस्तु का वर्णन बताएं और यह कब गुम हुई","क्या आपके पास स्वामित्व का प्रमाण है? हाँ या ना बताएं","हम खोई हुई वस्तु की रिपोर्ट दर्ज करेंगे और मिलान करेंगे"],
      "mr":["कृपया वस्तूचे तपशील सांगा आणि केव्हा हरवली","तुमच्याकडे मालकीचे पुरावे आहेत का? हो/नाही उत्तर द्या","आम्ही हरवलेली वस्तू नोंदवू आणि सापडण्याची शक्यता तपासू"]
    },
    "example_sms": {
      "template_en":"Your lost/found item report is registered. Token: {TOKEN}. Keep this for claim or follow-up.",
      "template_hi":"आपकी खोई/मिली हुई वस्तु की रिपोर्ट पंजीकृत हो चुकी है। टोकन: {TOKEN}। दावे/फॉलो-अप के लिए यह रखें।",
      "template_mr":"तुमची हरवलेली/सापडलेली वस्तू नोंदवली गेली आहे. टोकन: {TOKEN}. दाव्यासाठी ही ठेवा."
    }
  },
  {
    "id": "6",
    "incident": "Property disputes / Encroachment",
    "aliases": ["land dispute","encroachment","boundary conflict","illegal possession"],
    "keywords": {
      "en": ["land dispute","property dispute","encroachment","boundary issue","illegal possession","neighbor took my land","title dispute","possession rights","who owns land","eviction","title deed","mutation problem","plot boundary fight","attack my land","help with land issue"],
      "hi": ["भूमि विवाद","संपत्ति विवाद","अतिक्रमण","सीमा विवाद","कब्जा","टाइटल विवाद","जमीन विवाद मदद"],
      "mr": ["जमीन वाद","मालमत्ता विवाद","अतिक्रमण","सीमेचा वाद","कबजा","टायटल वाद"]
    },
    "pre_procedure": ["Ask user's full name","Ask user's phone number (SMS will be sent here)","Ask user's address"],
    "documents_checklist": ["title deed/registry","survey map/survey number","mutation records","possession proof (photos, receipts)","neighbors' details"],
    "procedure_steps": [
      "Collect complainant and property details",
      "Ask for title documents and maps (Yes/No)",
      "Record opponent details and nature of trespass",
      "If criminal trespass suspected, register FIR under BNS §§329/331",
      "Otherwise advise civil suit (Specific Relief Act) or refer to SDM/civil court"
    ],
    "bns_explanation": {
      "short":"BNS §329 (criminal trespass) and §331 (mischief) may apply; civil remedies often appropriate.",
      "detailed":"If forceful or criminal possession is present, police will register FIR and maintain peace under BNSS §148–§151; otherwise, civil courts decide rightful possession and injunctions."
    },
    "human_prompts": {
      "en":["Please provide property documents or survey number.","Is someone occupying your land without permission? Yes or No.","Do you have photos showing encroachment? Yes or No."],
      "hi":["कृपया संपत्ति के दस्तावेज़ या सर्वे नंबर दें।","क्या कोई आपके जमीन पर अनाधिकृत रूप से कब्जा कर रहा है? हाँ या ना बताएं।","क्या आपके पास अतिक्रमण की फोटो हैं? हाँ या ना बताएं।"],
      "mr":["कृपया मालमत्तेची कागदपत्रे किंवा सर्वे नंबर द्या.","कोणी तुमच्या जमीनवर अनधिकृत ताबा घेतलाय का? हो/नाही सांगा.","अतिक्रमणाचे फोटो आहेत का? हो/नाही सांगा."]
    },
    "example_sms": {
      "template_en":"Your property dispute report recorded. Token: {TOKEN}. For civil remedy, court proceedings may be required.",
      "template_hi":"आपकी संपत्ति विवाद रिपोर्ट दर्ज की गई है। टोकन: {TOKEN}। नागरिक उपचार के लिए न्यायालयी कार्यवाही की आवश्यकता हो सकती है।",
      "template_mr":"तुमची मालमत्ता तक्रार नोंदी करण्यात आली आहे. टोकन: {TOKEN}. नागरी उपायासाठी न्यायालयीन कारवाई आवश्यक असू शकते."
    }
  },
  {
    "id": "7",
    "incident": "Vehicle theft",
    "aliases": ["car stolen","bike stolen","two-wheeler theft","vehicle missing"],
    "keywords": {
      "en": ["car stolen","bike stolen","vehicle missing","stolen scooter","motorbike stolen","vehicle theft","my bike was taken","stolen vehicle report","rc number","chassis number","engine number","vehicle tracking","insurance claim vehicle"],
      "hi": ["वह वाहन चोरी हो गया","गाड़ी चोरी","बाइक गायब","आरसी नंबर","चेसिस नंबर"],
      "mr": ["वाहन चोरी","कार हरवली","बाईक हरवली","RC नंबर","चेसिस नंबर"]
    },
    "pre_procedure": ["Ask user's full name","Ask user's phone number (SMS will be sent here)","Ask user's address"],
    "documents_checklist": ["RC copy","insurance papers","vehicle photos","chassis/engine numbers","CCTV if available"],
    "procedure_steps": [
      "Collect complainant and vehicle details",
      "Record vehicle registration, make, model, color, chassis & engine numbers",
      "Ask date/time/location of theft and whether keys were stolen",
      "File FIR under BNS §303 and notify RTO to blacklist",
      "Advise insurance claim steps and provide FIR copy for insurer"
    ],
    "bns_explanation": {"short":"Vehicle theft under BNS §303; BNSS §173 requires FIR and §187 allows seizure if recovered."},
    "human_prompts": {
      "en":["Please give vehicle registration and chassis number if available.","Did you have insurance? Yes or No.","Were the vehicle keys stolen? Yes or No."],
      "hi":["कृपया वाहन का पंजीकरण और चेसिस नंबर दें यदि उपलब्ध हो।","क्या आपकी वाहन बीमा है? हाँ या ना बताएं।","कुंजी चोरी हुई थी? हाँ या ना बताएं।"],
      "mr":["कृपया वाहन नोंदणी आणि चेसिस नंबर द्या जर असतील.","तुमच्या वाहनाचा विमा आहे का? हो/नाही सांगा.","की चोरी झाली का? हो/नाही सांगा."]
    },
    "example_sms": {
      "template_en":"Your vehicle theft report has been filed. Token: {TOKEN}. Use this for insurance and follow-up.",
      "template_hi":"आपकी वाहन चोरी की रिपोर्ट दर्ज कर ली गई है। टोकन: {TOKEN}। बीमा और अनुवर्ती के लिए इसका उपयोग करें।",
      "template_mr":"तुमची वाहन चोरी तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. विमा व फॉलो-अपसाठी वापरा."
    }
  },
  {
    "id": "8",
    "incident": "Minor road accidents",
    "aliases": ["road accident","vehicle crash","minor collision","fender bender"],
    "keywords": {
      "en": ["minor accident","road crash","scratch on car","vehicle collision","no major injuries","insurance claim for accident","accident report","hit and run (if)","police accident memo","medical report if injured"],
      "hi": ["छोटी सड़क दुर्घटना","हिट और रन","वाहन के बीच टक्कर","किसी को चोट नहीं आई","बीमा दावा"],
      "mr": ["लहान अपघात","हिट अँड रन","वाहन टक्कर","जखमी नाही","विमा दावा"]
    },
    "pre_procedure": ["Ask user's full name","Ask user's phone number (SMS will be sent here)","Ask user's address"],
    "documents_checklist": ["photos of damage","vehicle RC and insurance","witness details","medical report if injured"],
    "procedure_steps": [
      "Collect basic complainant & vehicle details",
      "Record accident date/time/location and parties involved",
      "Collect photos of damage and witness names",
      "If injury occurred, collect medical report and file FIR if required under BNS §281",
      "Provide accident memo for insurance/documentation"
    ],
    "bns_explanation": {"short":"BNS §281 addresses causing hurt by rash driving; BNSS §173/§193 for FIR and evidence preservation."},
    "human_prompts": {
      "en":["Please describe how the accident happened.","Do you have photos of damage? Yes or No.","Were there injuries? Yes or No."],
      "hi":["कृपया बताएं दुर्घटना कैसे हुई?","क्या आपके पास नुकसान की फोटो हैं? हाँ/ना बताएं।","क्या किसी को चोट आई थी? हाँ/ना बताएं।"],
      "mr":["कृपया सांगा अपघात कसा झाला.","तुमच्याकडे नुकसानाचे फोटो आहेत का? हो/नाही सांगा.","कोणी जखमी झाले का? हो/नाही सांगा."]
    },
    "example_sms": {
      "template_en":"Accident report filed. Token: {TOKEN}. Use for insurance claims and follow-up.",
      "template_hi":"आपकी दुर्घटना रिपोर्ट दर्ज हो चुकी है। टोकन: {TOKEN}। बीमा दावा और अनुवर्ती के लिए इसका उपयोग करें।",
      "template_mr":"अपघाताची तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. विमा व फॉलो-अपसाठी वापरा."
    }
  },
  {
    "id": "9",
    "incident": "Domestic violence / Family disputes",
    "aliases": ["domestic abuse","family assault","wife beaten","husband abuse","marital cruelty"],
    "keywords": {
      "en": ["domestic violence","abuse at home","physically assaulted by husband","wife abused","dowry harassment","marital cruelty","family dispute escalate","need protection order","women's cell help","protection officer"],
      "hi": ["घरेलू हिंसा","पति द्वारा मारपीट","दहेज उत्पीड़न","महिला सेल","सुरक्षा आदेश","रक्षा अधिकारी"],
      "mr": ["घरेगुती हिंसा"," नवरा मारतो","दहेज अत्याचार","महिला सेल मदत","सुरक्षा आदेश"]
    },
    "pre_procedure": ["Ask user's full name","Ask user's phone number (SMS will be sent here)","Ask user's address"],
    "documents_checklist": ["medical report/photos of injuries","call/message evidence","police protection request","previous complaints (if any)"],
    "procedure_steps": [
      "Take complainant details and immediate safety assessment",
      "Collect evidence (medical reports/photos/messages) — Yes/No by voice",
      "File FIR under BNS §85 (Cruelty) / §86 (Dowry) if criminal offence is disclosed",
      "Refer to Protection Officer / Women's Cell and provide information about emergency shelters",
      "Issue steps for protection and legal remedies"
    ],
    "bns_explanation": {"short":"BNS §§85/86 address cruelty and dowry harassment; BNSS ensures FIR & Women's Cell referrals."},
    "human_prompts": {
      "en":["Are you safe right now? Yes or No.","Do you have medical records or photos of injuries? Yes or No.","Would you like a protection order or referral to Women's Cell? Yes or No."],
      "hi":["क्या आप अभी सुरक्षित हैं? हाँ या ना बोलीए।","क्या आपके पास मेडिकल रिकॉर्ड या चोटों की फोटो हैं? हाँ या ना बताएं।","क्या आप महिला सेल से जुड़ना चाहती हैं? हाँ या ना बताएं।"],
      "mr":["तुम सध्या सुरक्षित आहात का? हो/नाही सांगा.","तुमच्याकडे वैद्यकीय अहवाल किंवा जखमांचे फोटो आहेत का? हो/नाही सांगा.","तुम्हाला महिला सेल कडून मदत हवी का? हो/नाही सांगा."]
    },
    "example_sms": {
      "template_en":"Your domestic violence report is lodged. Token: {TOKEN}. We will contact you and provide assistance.",
      "template_hi":"आपकी घरेलू हिंसा की रिपोर्ट दर्ज कर ली गई है। टोकन: {TOKEN}। हम आपसे संपर्क कर सहायता प्रदान करेंगे।",
      "template_mr":"तुमची घरगुती हिंसा तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. आम्ही संपर्क करून मदत करू."
    }
  },
  {
    "id": "10",
    "incident": "Missing persons",
    "aliases": ["missing child","lost person","abduction","runaway person"],
    "keywords": {
      "en": ["missing person","my child missing","lost elderly","abducted","kidnapped","last seen at","missing since last night","track missing person","report missing child","trackchild","police missing report"],
      "hi": ["लापता व्यक्ति","मेरा बच्चा गायब","अपहृत","आखिरी बार देखा गया","खो गया व्यक्ति"],
      "mr": ["हरवलेली व्यक्ती","माझे बाळ हरवले","अपहरण","शेवटचे दिसले"]
    },
    "pre_procedure": ["Ask complainant full name","Ask complainant phone number (SMS will be sent here)","Ask complainant address"],
    "documents_checklist": ["recent photo of missing person","ID proof of missing person","last seen location/time","medical/mental health info if any"],
    "procedure_steps": [
      "Collect full details: name, age, gender, last seen, clothing, distinguishing marks",
      "Upload photo and register FIR under BNS §93/§94 as needed",
      "Alert control room and nearby stations, issue missing person alert",
      "Coordinate with juvenile/elderly welfare agencies if applicable"
    ],
    "bns_explanation": {"short":"BNS §93/§94 pertain to kidnapping/abduction; BNSS §173/§193 govern FIR and evidence preservation."},
    "human_prompts": {
      "en":["Please provide a recent photograph of the missing person.","When and where were they last seen?","Do they have any medical conditions? Yes or No."],
      "hi":["कृपया हाल की फोटो दें।","वे आखिरी बार कब और कहां देखे गए थे?","क्या उनकी कोई चिकित्सकीय समस्या है? हाँ या ना बताएं।"],
      "mr":["कृपया अलीकडील फोटो द्या.","ते शेवटी केव्हा आणि कुठे दिसले?","त्यांना वैद्यकीय समस्या आहे का? हो/नाही सांगा."]
    },
    "example_sms": {
      "template_en":"Missing person report filed. Token: {TOKEN}. Please keep available for updates.",
      "template_hi":"लापता व्यक्ति की रिपोर्ट दर्ज हो चुकी है। टोकन: {TOKEN}। कृपया अपडेट के लिए उपलब्ध रहें।",
      "template_mr":"हरवलेली व्यक्तीची तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. कृपया अपडेटसाठी उपलब्ध रहा."
    }
  },
  {
    "id": "11",
    "incident": "Trespassing / Unlawful entry",
    "aliases": ["unauthorized entry","criminal trespass","illegal occupation"],
    "keywords": {
      "en": ["trespass","unauthorized entry","someone entered property","illegal occupation","staying without permission","land invasion","house trespass","report intruder","file trespass complaint"],
      "hi": ["अवैध प्रवेश","अतिक्रमण","जमीन में घुसपैठ","घर में घुसना","किसी ने कब्जा कर लिया"],
      "mr": ["बेकायदेशीर प्रवेश","अतिक्रमण","माझ्या जागेत घुसले","कब्जा"]
    },
    "pre_procedure": ["Ask complainant full name","Ask complainant phone number (SMS will be sent here)","Ask complainant address"],
    "documents_checklist": ["property documents","photos of entry","witness names","surveyor maps if any"],
    "procedure_steps": [
      "Collect property and complainant details",
      "Establish whether entry is criminal trespass or civil dispute",
      "If criminal trespass, register FIR under BNS §329 and take action to remove trespassers",
      "If civil, advise on civil remedies and injunctions; preserve order and calm under BNSS §148–§151"
    ],
    "bns_explanation": {"short":"BNS §329 covers criminal trespass; BNSS §§148–151 manage maintaining peace and disputes on immovable property."},
    "human_prompts": {
      "en":["Is the intruder still present? Yes or No.","Do you have title documents for this property? Yes or No.","Please describe how the entry occurred."],
      "hi":["आक्रमणकर्ता अभी भी मौजूद है? हाँ या ना बताएं।","क्या आपके पास इस संपत्ति के दस्तावेज़ हैं? हाँ या ना बताएं।","कृपया बताएं यह प्रवेश कैसे हुआ।"],
      "mr":["घुसखोर अजून आहे का? हो/नाही सांगा.","तुमच्याकडे ही मालमत्ता कागदपत्रे आहेत का? हो/नाही सांगा.","कृपया सांगा प्रवेश कसा झाला."]
    },
    "example_sms": {
      "template_en":"Trespass/unlawful entry report filed. Token: {TOKEN}. Police will advise next steps.",
      "template_hi":"आपकी अवैध प्रवेश की रिपोर्ट दर्ज कर ली गई है। टोकन: {TOKEN}। पुलिस अगले कदम बताएगी।",
      "template_mr":"अवैध प्रवेशाची तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. पोलीस पुढील पावले सांगतील."
    }
  },
  {
    "id": "12",
    "incident": "Threats / Intimidation / Blackmail",
    "aliases": ["criminal intimidation","blackmail","online threats","phone threats"],
    "keywords": {
      "en": ["threats","intimidation","blackmail","received threatening call","online threats on social media","extortion","send sms threatening","threatening message","cyber blackmail"],
      "hi": ["धमकी","ब्लैकमेल","धमकी भरे संदेश","ऑनलाइन धमकी","फोन धमकी","बदला की धमकी"],
      "mr": ["धमकी","ब्लॅकमेल","ऑनलाइन धमकी","फोनवर धमकी संदेश"]
    },
    "pre_procedure": ["Ask complainant full name","Ask complainant phone number (SMS will be sent here)","Ask complainant address"],
    "documents_checklist": ["threat messages/screenshots","call logs/recordings if any","witness names","any extortion demands proof"],
    "procedure_steps": [
      "Collect details of threat (content, mode, date/time)",
      "Secure digital evidence (screenshots/call recordings) — Yes/No voice",
      "Register FIR under BNS §351 (criminal intimidation) if credible threat",
      "Advise on protection measures and possible legal reliefs"
    ],
    "bns_explanation": {"short":"BNS §351 addresses criminal intimidation; BNSS §173 ensures FIR for cognizable threats."},
    "human_prompts": {
      "en":["Please describe the threat verbatim.","Do you have screenshots or recordings? Yes or No.","Has the threat been repeated? Yes or No."],
      "hi":["कृपया धमकी शब्दशः बताएं।","क्या आपके पास स्क्रीनशॉट या रिकॉर्डिंग है? हाँ या ना बताएं।","क्या यह धमकी दोहराई गयी? हाँ/ना बताएं।"],
      "mr":["कृपया धमकी अगदी तसंच सांगा.","तुमच्याकडे स्क्रीनशॉट किंवा रेकॉर्डिंग आहे का? हो/नाही सांगा.","ही धमकी पुन्हा केव्हा आली का? हो/नाही सांगा."]
    },
    "example_sms": {
      "template_en":"Threat report filed. Token: {TOKEN}. Police will review evidence and respond.",
      "template_hi":"धमकी की रिपोर्ट दर्ज हो चुकी है। टोकन: {TOKEN}। पुलिस सबूतों की समीक्षा कर जवाब देगी।",
      "template_mr":"धमकीची तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. पोलीस पुरावे तपासतील आणि प्रतिसाद देतील."
    }
  },
  {
    "id": "13",
    "incident": "Forgery / Document tampering",
    "aliases": ["fake documents","forged certificate","document fraud","tampered papers"],
    "keywords": {
      "en": ["forgery","fake certificate","tampered document","paper forged","signature forged","fake title deed","forged ID","document scam","report forged document"],
      "hi": ["जालसाजी","नकली दस्तावेज","हस्ताक्षर फर्जी","दस्तावेज़ में छेड़छाड़"],
      "mr": ["जाळसाजी","खोटे दस्तऐवज","स्वाक्षरी बनावट","दस्तऐवजात फेरफार"]
    },
    "pre_procedure": ["Ask complainant full name","Ask complainant phone number (SMS will be sent here)","Ask complainant address"],
    "documents_checklist": ["original document copy","suspected forged copy","expert opinion if any","transaction history"],
    "procedure_steps": [
      "Collect details of the forged document and how it was used",
      "Ask for original documents and suspected forged copies (Yes/No)",
      "Register FIR under BNS §§336–339 and send documents for forensic examination",
      "Advise civil remedies for cancellation/rectification"
    ],
    "bns_explanation": {"short":"Forgery offences fall under BNS §§336–339; BNSS §193 preserves documentary evidence."},
    "human_prompts": {
      "en":["Which document is forged?","Do you have the original or suspected forged copy? Yes or No.","Was any transaction carried out using the forged document?" ],
      "hi":["कौन सा दस्तावेज़ जालसाजी किया गया है?","क्या आपके पास मूल या संदिग्ध नकली प्रति है? हाँ/ना बताएं।","क्या नकली दस्तावेज़ का उपयोग कर कोई लेनदेन हुआ?"],
      "mr":["कोणते दस्तऐवज जाळसाजी झाले आहे?","तुमच्याकडे मूळ किंवा शंका असलेली प्रत आहे का? हो/नाही सांगा.","जाळसाजीतून कोणते व्यवहार झाले का?"]
    },
    "example_sms": {
      "template_en":"Forgery report filed. Token: {TOKEN}. Documents will be sent for forensic analysis if needed.",
      "template_hi":"जालसाजी की रिपोर्ट दर्ज हो चुकी है। टोकन: {TOKEN}। यदि आवश्यक हुआ तो दस्तावेज़ फोरेंसिक जांच के लिए भेजे जाएंगे।",
      "template_mr":"जाळसाजीची तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. आवश्यक असल्यास दस्तऐवज फॉरेंसिकसाठी पाठवले जातील."
    }
  },
  {
    "id": "14",
    "incident": "Noise complaints / Public nuisance",
    "aliases": ["loud music complaint","public disturbance","neighbour noise","party noise at night"],
    "keywords": {
      "en": ["noise complaint","loud music at night","public nuisance","disturbance","illegal gathering","party noise","factory noise","construction noise","excessive noise complaint"],
      "hi": ["शोर शिकायत","जोर संगीत","सार्वजनिक उत्पीड़न","शोरगुल","रात में पार्टी तेज संगीत"],
      "mr": ["शोर तक्रार","जोरात संगीत","सार्वजनिक त्रास","रात्री पार्टीचा आवाज"]
    },
    "pre_procedure": ["Ask complainant full name","Ask complainant phone number (SMS will be sent here)","Ask complainant address"],
    "documents_checklist": ["audio/video evidence (Yes/No)","time/duration logs","witness names"],
    "procedure_steps": [
      "Collect details on location/time/source of noise",
      "Ask if prior warnings were given and collect evidence (Yes/No)",
      "File complaint and advise municipal/authority steps (local bylaws may apply)",
      "Police may issue warning or challan if persistent public nuisance under BNS §268"
    ],
    "bns_explanation": {"short":"Public nuisance normally under BNS §268; municipal fines and civil remedies may also apply."},
    "human_prompts": {
      "en":["When does the noise usually happen?","Do you have audio/video proof? Yes or No.","Is the noise from a private neighbour or commercial source?"],
      "hi":["आम तौर पर शोर कब होता है?","क्या आपके पास ऑडियो/वीडियो प्रमाण है? हाँ/ना बताएं।","क्या शोर पड़ोसी से है या किसी व्यवसाय से?"],
      "mr":["शोर सहसा केव्हा होतो?","तुमच्याकडे ऑडिओ/व्हिडिओ पुरावा आहे का? हो/नाही सांगा.","हा आवाज शेजारीपासून आहे का किंवा व्यवसायापासून?"]
    },
    "example_sms": {
      "template_en":"Noise complaint registered. Token: {TOKEN}. Authorities will act if disturbance continues.",
      "template_hi":"शोर की शिकायत दर्ज हो चुकी है। टोकन: {TOKEN}। अगर परेशानी जारी रही तो प्रशासन कार्रवाई करेगा।",
      "template_mr":"शोर तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. त्रास चालू राहिला तर प्रशासन कारवाई करेल."
    }
  },
  {
    "id": "15",
    "incident": "Tenant - Landlord disputes",
    "aliases": ["eviction dispute","rent dispute","tenant harassment","landlord harassment"],
    "keywords": {
      "en": ["tenant landlord dispute","eviction without notice","rent not refunded","illegal eviction","tenant harassment","landlord threatening","rent arrears dispute","rent agreement issue","non payment of rent","tenant rights","landlord rights"],
      "hi": ["किरायेदार मालिक विवाद","बिना नोटिस बेदखल करना","किराया विवाद","किरायेदार उत्पीड़न","मकान मालिक धमका रहा है"],
      "mr": ["भाडेकरू मालक वाद","नोटीसशिवाय बेघर","किराया वाद"]
    },
    "pre_procedure": ["Ask complainant full name","Ask complainant phone number (SMS will be sent here)","Ask complainant address"],
    "documents_checklist": ["tenancy agreement","rent receipts","notice letters","photographic evidence of eviction","witness details"],
    "procedure_steps": [
      "Collect tenancy agreement and rental history",
      "Ask nature of dispute and timeline",
      "If criminal acts (assault/illegal eviction), register FIR under BNS §329/§331",
      "Otherwise advise civil remedy like eviction suit under Specific Relief Act or tenancy authority"
    ],
    "bns_explanation": {"short":"Criminal only if trespass or assault; otherwise civil remedies preferred (Specific Relief Act). BNSS §148–§151 balance law & order."},
    "human_prompts": {
      "en":["Please provide tenancy agreement or rent receipts if available.","Has landlord threatened or used force? Yes or No.","Do you have notice or eviction papers? Yes or No."],
      "hi":["यदि उपलब्ध हों तो किरायेदारी समझौता या किराये की रसीद दें।","क्या मकान मालिक ने धमकी दी या बल प्रयोग किया? हाँ/ना बताएं।","क्या आपके पास नोटिस/बेदखली पत्र है? हाँ/ना बताएं।"],
      "mr":["जर असतील तर भाडेकरार किंवा भाड्याची पावती दाखवा.","मालकाने धमकी दिली किंवा बल वापरला का? हो/नाही सांगा.","तुमच्याकडे नोटिस किंवा बेदखली पत्र आहे का? हो/नाही सांगा."]
    },
    "example_sms": {
      "template_en":"Tenant-landlord dispute logged. Token: {TOKEN}. For civil remedy, court action may be required.",
      "template_hi":"किरायेदार-मकान मालिक विवाद दर्ज कर लिया गया है। टोकन: {TOKEN}। नागरिक उपचार के लिए न्यायालयीय कार्यवाही की आवश्यकता हो सकती है।",
      "template_mr":"भाडेकरू-मालक तक्रार नोंदवली गेली आहे. टोकन: {TOKEN}. नागरी उपायासाठी न्यायालयीन कारवाई आवश्यक असू शकते."
    }
  }
];

// Conversation memory for contextual responses
interface ConversationMemory {
  lastQuery: string;
  lastResponse: string;
  lastMatchedEntry: KnowledgeBaseEntry | null;
  context: string[];
}

let conversationMemory: ConversationMemory = {
  lastQuery: '',
  lastResponse: '',
  lastMatchedEntry: null,
  context: []
};

// Helper function to normalize text for matching
const normalizeText = (text: string): string => {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Calculate similarity score between query and keywords
const calculateSimilarity = (query: string, keywords: string[]): number => {
  const normalizedQuery = normalizeText(query);
  const queryWords = normalizedQuery.split(' ');
  
  let maxScore = 0;
  
  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    const keywordWords = normalizedKeyword.split(' ');
    
    // Exact match gets highest score
    if (normalizedQuery.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedQuery)) {
      maxScore = Math.max(maxScore, 1.0);
      continue;
    }
    
    // Word overlap scoring
    let matchingWords = 0;
    for (const queryWord of queryWords) {
      if (keywordWords.some(kw => kw.includes(queryWord) || queryWord.includes(kw))) {
        matchingWords++;
      }
    }
    
    const score = matchingWords / Math.max(queryWords.length, keywordWords.length);
    maxScore = Math.max(maxScore, score);
  }
  
  return maxScore;
};

// Find best matching entry in knowledge base
export const findBestMatch = (query: string, language: Language): KnowledgeBaseEntry | null => {
  let bestMatch: KnowledgeBaseEntry | null = null;
  let bestScore = 0;
  const threshold = 0.3; // Minimum similarity threshold
  
  for (const entry of aiKnowledgeBase) {
    // Get keywords for the specified language
    const languageKey = language === 'english' ? 'en' : language === 'hindi' ? 'hi' : 'mr';
    const keywords = entry.keywords[languageKey] || entry.keywords.en;
    
    // Also check aliases and incident name
    const allKeywords = [...keywords, ...entry.aliases, entry.incident];
    
    const score = calculateSimilarity(query, allKeywords);
    
    if (score > bestScore && score >= threshold) {
      bestScore = score;
      bestMatch = entry;
    }
  }
  
  return bestMatch;
};

// Generate detailed response with all relevant information
export const generateDetailedResponse = (entry: KnowledgeBaseEntry, language: Language): string => {
  const languageKey = language === 'english' ? 'en' : language === 'hindi' ? 'hi' : 'mr';
  
  // Get polite greeting based on language
  const greetings = {
    english: "I understand you need help with",
    hindi: "मैं समझ गया कि आपको सहायता चाहिए",
    marathi: "मला समजले की तुम्हाला मदत हवी आहे"
  };
  
  const fileReportPrompts = {
    english: "For filing this complaint, please go to the 'File Report' section in our app and enter your details there. This will ensure your complaint is properly registered with a token number.",
    hindi: "इस शिकायत को दर्ज करने के लिए, कृपया हमारे ऐप में 'रिपोर्ट दर्ज करें' सेक्शन में जाएं और वहां अपना विवरण दर्ज करें। इससे आपकी शिकायत टोकन नंबर के साथ सही तरीके से दर्ज हो जाएगी।",
    marathi: "ही तक्रार नोंदवण्यासाठी, कृपया आमच्या अॅपमधील 'रिपोर्ट दाखल करा' विभागात जा आणि तेथे तुमचे तपशील भरा. यामुळे तुमची तक्रार टोकन नंबरसह योग्यरित्या नोंदवली जाईल."
  };
  
  const procedureIntros = {
    english: "Here's what the procedure involves:",
    hindi: "यहाँ बताया गया है कि प्रक्रिया में क्या शामिल है:",
    marathi: "प्रक्रियेत काय समाविष्ट आहे ते येथे आहे:"
  };
  
  const documentsIntros = {
    english: "Required documents:",
    hindi: "आवश्यक दस्तावेज:",
    marathi: "आवश्यक कागदपत्रे:"
  };
  
  const legalIntros = {
    english: "Legal framework:",
    hindi: "कानूनी ढांचा:",
    marathi: "कायदेशीर चौकट:"
  };
  
  // Build comprehensive response
  let response = `${greetings[language]} ${entry.incident}.\n\n`;
  
  // Add file report guidance
  response += `${fileReportPrompts[language]}\n\n`;
  
  // Add procedure information
  response += `${procedureIntros[language]}\n`;
  entry.procedure_steps.forEach((step, index) => {
    response += `${index + 1}. ${step}\n`;
  });
  response += '\n';
  
  // Add required documents
  response += `${documentsIntros[language]}\n`;
  entry.documents_checklist.forEach((doc, index) => {
    response += `• ${doc}\n`;
  });
  response += '\n';
  
  // Add legal framework
  response += `${legalIntros[language]} ${entry.bns_explanation.short}\n\n`;
  
  // Add FAQ if available
  if (entry.faq_examples && entry.faq_examples.length > 0) {
    const faqIntros = {
      english: "Frequently asked questions:",
      hindi: "अक्सर पूछे जाने वाले प्रश्न:",
      marathi: "वारंवार विचारले जाणारे प्रश्न:"
    };
    
    response += `${faqIntros[language]}\n`;
    entry.faq_examples.forEach((faq, index) => {
      response += `Q: ${faq.q[languageKey]}\n`;
      response += `A: ${faq.a[languageKey]}\n\n`;
    });
  }
  
  const helpfulClosings = {
    english: "I hope this information helps you. Please don't hesitate to ask if you need any clarification or have other questions.",
    hindi: "मुझे उम्मीद है कि यह जानकारी आपकी मदद करेगी। यदि आपको कोई स्पष्टीकरण चाहिए या अन्य प्रश्न हैं तो कृपया पूछने में संकोच न करें।",
    marathi: "मला आशा आहे की ही माहिती तुम्हाला मदत करेल. तुम्हाला कोणतेही स्पष्टीकरण हवे असल्यास किंवा इतर प्रश्न असल्यास कृपया विचारण्यास संकोच करू नका."
  };
  
  response += helpfulClosings[language];
  
  return response;
};

// Get contextual response based on conversation history
export const getContextualResponse = (query: string, language: Language): string | null => {
  const normalizedQuery = normalizeText(query);
  
  // Check for follow-up questions
  const followUpPatterns = {
    english: ['how', 'what', 'when', 'where', 'why', 'can you', 'tell me', 'explain'],
    hindi: ['कैसे', 'क्या', 'कब', 'कहाँ', 'क्यों', 'बताएं', 'समझाएं'],
    marathi: ['कसे', 'काय', 'केव्हा', 'कुठे', 'का', 'सांगा', 'समजावा']
  };
  
  const languageKey = language === 'english' ? 'english' : language === 'hindi' ? 'hindi' : 'marathi';
  const patterns = followUpPatterns[languageKey];
  
  // If it's a follow-up question and we have context
  if (conversationMemory.lastMatchedEntry && patterns.some(pattern => normalizedQuery.includes(pattern))) {
    // Provide more detailed information about the last matched entry
    return generateDetailedResponse(conversationMemory.lastMatchedEntry, language);
  }
  
  return null;
};

// Update conversation memory
export const updateConversationMemory = (query: string, response: string, matchedEntry: KnowledgeBaseEntry | null) => {
  conversationMemory.lastQuery = query;
  conversationMemory.lastResponse = response;
  conversationMemory.lastMatchedEntry = matchedEntry;
  conversationMemory.context.push(query);
  
  // Keep only last 5 queries for context
  if (conversationMemory.context.length > 5) {
    conversationMemory.context.shift();
  }
};

// Clear conversation memory
export const clearConversationMemory = () => {
  conversationMemory = {
    lastQuery: '',
    lastResponse: '',
    lastMatchedEntry: null,
    context: []
  };
};

// Get conversation memory
export const getConversationMemory = () => conversationMemory;

// Additional helper functions for officer contacts and station information
export const getOfficerContacts = (language: Language): string => {
  const contacts = {
    english: `Police Station Contacts:
• Superintendent of Police: Rahul Gupta, IPS - rahul.gupta@gov.goa.in, +91 98765 43210
• Station House Officer: Anil Naik - anil.naik@goapolice.gov.in, +91 91234 56789
• 24/7 Helpline: +91 832 1000 999
• Emergency: 100`,
    hindi: `पुलिस स्टेशन संपर्क:
• पुलिस अधीक्षक: राहुल गुप्ता, IPS - rahul.gupta@gov.goa.in, +91 98765 43210
• थाना प्रभारी: अनिल नाइक - anil.naik@goapolice.gov.in, +91 91234 56789
• 24/7 हेल्पलाइन: +91 832 1000 999
• आपातकाल: 100`,
    marathi: `पोलीस स्टेशन संपर्क:
• पोलीस अधीक्षक: राहुल गुप्ता, IPS - rahul.gupta@gov.goa.in, +91 98765 43210
• स्टेशन हाऊस ऑफिसर: अनिल नाईक - anil.naik@goapolice.gov.in, +91 91234 56789
• 24/7 हेल्पलाइन: +91 832 1000 999
• आपत्कालीन: 100`
  };
  
  return contacts[language];
};

export const getStationInfo = (language: Language): string => {
  const info = {
    english: `Panjim Police Station Information:
• Address: Altinho, Panaji, Goa, 403001
• Station Code: PGS-011
• Jurisdiction: Panaji City limits including Altinho, Patto, Ribandar, Miramar
• Services: FIR registration, Police Clearance Certificate, Verification services
• Facilities: Women's Help Desk, Traffic Unit, Cyber Cell coordination`,
    hindi: `पंजिम पुलिस स्टेशन जानकारी:
• पता: अल्टिन्हो, पणजी, गोवा, 403001
• स्टेशन कोड: PGS-011
• क्षेत्राधिकार: पणजी शहर की सीमा में अल्टिन्हो, पट्टो, रिबंदर, मिरामार शामिल
• सेवाएं: FIR पंजीकरण, पुलिस क्लीयरेंस सर्टिफिकेट, सत्यापन सेवाएं
• सुविधाएं: महिला सहायता डेस्क, ट्रैफिक यूनिट, साइबर सेल समन्वय`,
    marathi: `पंजिम पोलीस स्टेशन माहिती:
• पत्ता: अल्टिन्हो, पणजी, गोवा, 403001
• स्टेशन कोड: PGS-011
• अधिकारक्षेत्र: पणजी शहराच्या हद्दीत अल्टिन्हो, पट्टो, रिबंदर, मिरामार समाविष्ट
• सेवा: FIR नोंदणी, पोलीस क्लिअरन्स सर्टिफिकेट, पडताळणी सेवा
• सुविधा: महिला मदत डेस्क, ट्रॅफिक युनिट, सायबर सेल समन्वय`
  };
  
  return info[language];
};