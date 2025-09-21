import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, MessageCircle, Bot, User } from 'lucide-react';
import { 
  aiKnowledgeBase, 
  findBestMatch, 
  getContextualResponse, 
  updateConversationMemory,
  clearConversationMemory,
  getConversationMemory,
  generateDetailedResponse,
  type Language, 
  type KnowledgeBaseEntry 
} from '../data/aiKnowledgeBase';

interface AIVoiceAssistantScreenProps {
  language: Language;
  onBack: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  language: Language;
  timestamp: Date;
}

const AIVoiceAssistantScreen: React.FC<AIVoiceAssistantScreenProps> = ({ language: initialLanguage, onBack }) => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(initialLanguage);
  const [isInitialized, setIsInitialized] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const getText = (key: string, lang: Language) => {
    const translations = {
      greeting: {
        english: 'Hello! I am your AI Police Assistant. I can help you with police procedures, legal information, BNS/BNSS sections, officer contacts, and filing complaints. Please press the microphone button and speak your query in English, Hindi, or Marathi.',
        hindi: 'नमस्ते! मैं आपका एआई पुलिस सहायक हूं। मैं पुलिस प्रक्रियाओं, कानूनी जानकारी, BNS/BNSS धाराओं, अधिकारी संपर्क और शिकायत दर्ज करने में आपकी सहायता कर सकता हूं। कृपया माइक्रोफोन बटन दबाएं और अंग्रेजी, हिंदी या मराठी में अपना प्रश्न बोलें।',
        marathi: 'नमस्कार! मी तुमचा एआय पोलीस सहाय्यक आहे. मी पोलीस प्रक्रिया, कायदेशीर माहिती, BNS/BNSS कलम, अधिकारी संपर्क आणि तक्रार दाखल करण्यात तुमची मदत करू शकतो. कृपया मायक्रोफोन बटन दाबा आणि इंग्रजी, हिंदी किंवा मराठीत तुमचा प्रश्न बोला.'
      },
      tapToSpeak: {
        english: 'Tap to speak',
        hindi: 'बोलने के लिए टैप करें',
        marathi: 'बोलण्यासाठी टॅप करा'
      },
      listening: {
        english: 'Listening...',
        hindi: 'सुन रहा है...',
        marathi: 'ऐकत आहे...'
      },
      processing: {
        english: 'Processing...',
        hindi: 'प्रसंस्करण...',
        marathi: 'प्रक्रिया करत आहे...'
      },
      speaking: {
        english: 'Speaking...',
        hindi: 'बोल रहा है...',
        marathi: 'बोलत आहे...'
      },
      noMatch: {
        english: 'I apologize, but I could not find information about your query in my knowledge base. Please try asking about: mobile theft, cyber fraud, house burglary, pickpocketing, missing persons, domestic violence, property disputes, vehicle theft, road accidents, lost items, BNS/BNSS sections, officer contacts, or police station information. You can also ask for legal procedures or required documents.',
        hindi: 'मुझे खेद है, लेकिन मैं अपने ज्ञान आधार में आपके प्रश्न के बारे में जानकारी नहीं खोज सका। कृपया इन विषयों के बारे में पूछने का प्रयास करें: मोबाइल चोरी, साइबर धोखाधड़ी, घर की चोरी, जेब काटना, लापता व्यक्ति, घरेलू हिंसा, संपत्ति विवाद, वाहन चोरी, सड़क दुर्घटना, खोई वस्तुएं, BNS/BNSS धाराएं, अधिकारी संपर्क, या पुलिस स्टेशन जानकारी। आप कानूनी प्रक्रियाओं या आवश्यक दस्तावेजों के बारे में भी पूछ सकते हैं।',
        marathi: 'मला माफ करा, परंतु मी माझ्या ज्ञान आधारात तुमच्या प्रश्नाबद्दल माहिती शोधू शकलो नाही. कृपया या विषयांबद्दल विचारण्याचा प्रयत्न करा: मोबाइल चोरी, सायबर फसवणूक, घरफोडी, खिशाकापू, हरवलेली व्यक्ती, घरगुती हिंसा, मालमत्ता वाद, वाहन चोरी, रस्ता अपघात, हरवलेल्या वस्तू, BNS/BNSS कलम, अधिकारी संपर्क, किंवा पोलीस स्टेशन माहिती. तुम्ही कायदेशीर प्रक्रिया किंवा आवश्यक कागदपत्रांबद्दल देखील विचारू शकता.'
      },
      errorRecording: {
        english: 'Error accessing microphone. Please check permissions and try again.',
        hindi: 'माइक्रोफोन एक्सेस करने में त्रुटि। कृपया अनुमतियां जांचें और पुनः प्रयास करें।',
        marathi: 'मायक्रोफोन अॅक्सेस करताना त्रुटी. कृपया परवानग्या तपासा आणि पुन्हा प्रयत्न करा.'
      },
      replayAudio: {
        english: 'Replay audio',
        hindi: 'ऑडियो रिप्ले करें',
        marathi: 'ऑडिओ रिप्ले करा'
      }
    };
    
    return translations[key as keyof typeof translations]?.[lang] || '';
  };

  const getLanguageCode = (lang: Language): string => {
    switch (lang) {
      case 'hindi':
        return 'hi-IN';
      case 'marathi':
        return 'mr-IN';
      default:
        return 'en-US';
    }
  };

  const speakText = (text: string, lang: Language) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(lang);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const addMessage = (sender: 'user' | 'ai', text: string, lang: Language) => {
    const message: Message = {
      id: Date.now().toString(),
      sender,
      text,
      language: lang,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, message]);
    return message;
  };

  const processUserQuery = async (query: string) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // First check for contextual responses based on conversation memory
    const contextualResponse = getContextualResponse(query, currentLanguage);
    
    if (contextualResponse) {
      const aiMessage = addMessage('ai', contextualResponse, currentLanguage);
      updateConversationMemory(query, contextualResponse, getConversationMemory().lastMatchedEntry);
      speakText(contextualResponse, currentLanguage);
      setIsProcessing(false);
      return;
    }
    
    // Find best match in knowledge base
    const bestMatch = findBestMatch(query, currentLanguage);
    
    if (bestMatch) {
      // Generate detailed response with full information
      const response = generateDetailedResponse(bestMatch, currentLanguage);
      const aiMessage = addMessage('ai', response, currentLanguage);
      updateConversationMemory(query, response, bestMatch);
      speakText(response, currentLanguage);
    } else {
      const noMatchResponse = getText('noMatch', currentLanguage);
      const aiMessage = addMessage('ai', noMatchResponse, currentLanguage);
      updateConversationMemory(query, noMatchResponse, null);
      speakText(noMatchResponse, currentLanguage);
    }
    
    setIsProcessing(false);
  };

  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(getText('errorRecording', currentLanguage));
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = getLanguageCode(currentLanguage);

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessage('user', transcript, currentLanguage);
        processUserQuery(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        let errorMessage = getText('errorRecording', currentLanguage);
        switch (event.error) {
          case 'no-speech':
            errorMessage = currentLanguage === 'hindi' ? 'कोई आवाज़ नहीं सुनाई दी। कृपया पुनः प्रयास करें।' :
                          currentLanguage === 'marathi' ? 'कोणताही आवाज ऐकू आला नाही. कृपया पुन्हा प्रयत्न करा.' :
                          'No speech was detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = currentLanguage === 'hindi' ? 'माइक्रोफोन नहीं मिला। कृपया माइक्रोफोन जांचें।' :
                          currentLanguage === 'marathi' ? 'मायक्रोफोन सापडला नाही. कृपया मायक्रोफोन तपासा.' :
                          'No microphone found. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = currentLanguage === 'hindi' ? 'माइक्रोफोन की अनुमति नहीं दी गई। कृपया माइक्रोफोन एक्सेस की अनुमति दें।' :
                          currentLanguage === 'marathi' ? 'मायक्रोफोनची परवानगी नाकारली. कृपया मायक्रोफोन अॅक्सेसची परवानगी द्या.' :
                          'Microphone permission denied. Please allow microphone access.';
            break;
        }
        
        alert(errorMessage);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      alert(getText('errorRecording', currentLanguage));
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleLanguageChange = (newLang: Language) => {
    setCurrentLanguage(newLang);
    setConversation([]);
    clearConversationMemory();
    setIsInitialized(false);
    
    // Add greeting in new language
    setTimeout(() => {
      const greeting = getText('greeting', newLang);
      addMessage('ai', greeting, newLang);
      speakText(greeting, newLang);
      setIsInitialized(true);
    }, 100);
  };

  // Initial greeting
  useEffect(() => {
    if (!isInitialized) {
      const greeting = getText('greeting', currentLanguage);
      addMessage('ai', greeting, currentLanguage);
      speakText(greeting, currentLanguage);
      setIsInitialized(true);
    }
  }, [currentLanguage, isInitialized]);

  // Auto-scroll to bottom
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const languages = [
    { code: 'english' as Language, name: 'English', nativeName: 'English' },
    { code: 'hindi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'marathi' as Language, name: 'Marathi', nativeName: 'मराठी' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Back Arrow Header */}
      <div className="bg-navy-blue text-white p-4 flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-navy-blue/80 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold">AI Voice Assistant</h1>
          <p className="text-blue-200 text-sm">Police Station AI Assistant</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col pt-4 pb-4">
        {/* Language Selection */}
        <div className="bg-white border-b p-4">
          <div className="flex justify-center space-x-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  currentLanguage === lang.code
                    ? 'bg-bright-yellow text-navy-blue'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex items-start space-x-3 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-navy-blue' 
                    : 'bg-bright-yellow'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-navy-blue" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`rounded-lg px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-navy-blue text-white'
                    : 'bg-white text-navy-blue shadow-md border'
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.sender === 'ai' && (
                      <button
                        onClick={() => speakText(message.text, message.language)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                        title={getText('replayAudio', currentLanguage)}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3 h-3 text-red-500" />
                        ) : (
                          <Volume2 className="w-3 h-3 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md xl:max-w-lg flex items-start space-x-3">
                <div className="w-8 h-8 bg-bright-yellow rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-navy-blue" />
                </div>
                <div className="bg-white text-navy-blue shadow-md border rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bright-yellow"></div>
                    <span className="text-sm">{getText('processing', currentLanguage)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={conversationEndRef} />
        </div>

        {/* Status Bar */}
        {(isRecording || isSpeaking) && (
          <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2">
            <div className="flex items-center justify-center space-x-2">
              {isRecording && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-navy-blue font-bold">{getText('listening', currentLanguage)}</span>
                </>
              )}
              {isSpeaking && (
                <>
                  <Volume2 className="w-4 h-4 text-bright-yellow animate-pulse" />
                  <span className="text-sm text-navy-blue font-bold">{getText('speaking', currentLanguage)}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Microphone Button */}
        <div className="bg-white border-t p-4">
          <div className="flex justify-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing || isSpeaking}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-bright-yellow hover:bg-yellow-500 hover:scale-105'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-navy-blue" />
              )}
            </button>
          </div>
          <p className="text-center text-navy-blue text-sm mt-2 font-bold">
            {isRecording ? getText('listening', currentLanguage) : getText('tapToSpeak', currentLanguage)}
          </p>
          <p className="text-center text-gray-500 text-xs mt-1">
            Ask about police procedures, BNS/BNSS sections, officer contacts, or legal information
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIVoiceAssistantScreen;