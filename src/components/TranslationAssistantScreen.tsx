import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Volume2, Languages, AlertCircle } from 'lucide-react';
import type { Language } from '../App';

interface TranslationAssistantScreenProps {
  language: Language;
  onBack: () => void;
}

interface ConversationEntry {
  id: string;
  speaker: 'officer' | 'visitor';
  originalText: string;
  translatedText: string;
  originalLanguage: Language;
  targetLanguage: Language;
  timestamp: Date;
}

const TranslationAssistantScreen: React.FC<TranslationAssistantScreenProps> = ({ onBack }) => {
  const [officerLanguage, setOfficerLanguage] = useState<Language>('english');
  const [visitorLanguage, setVisitorLanguage] = useState<Language>('hindi');
  const [isRecording, setIsRecording] = useState<{ officer: boolean; visitor: boolean }>({
    officer: false,
    visitor: false
  });
  const [officerConversation, setOfficerConversation] = useState<ConversationEntry[]>([]);
  const [visitorConversation, setVisitorConversation] = useState<ConversationEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // API Keys from environment
  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const googleCloudApiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;

  const getText = (key: string, lang: Language) => {
    const translations = {
      translationAssistant: {
        english: 'Translation Assistant',
        hindi: 'अनुवाद सहायक',
        marathi: 'भाषांतर सहाय्यक'
      },
      officer: {
        english: 'Police Officer',
        hindi: 'पुलिस अधिकारी',
        marathi: 'पोलीस अधिकारी'
      },
      visitor: {
        english: 'Visitor',
        hindi: 'आगंतुक',
        marathi: 'अभ्यागत'
      },
      selectLanguage: {
        english: 'Select Language',
        hindi: 'भाषा चुनें',
        marathi: 'भाषा निवडा'
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
      originalText: {
        english: 'Original',
        hindi: 'मूल',
        marathi: 'मूळ'
      },
      translatedText: {
        english: 'Translation',
        hindi: 'अनुवाद',
        marathi: 'भाषांतर'
      },
      noConversation: {
        english: 'No conversation yet. Start by speaking.',
        hindi: 'अभी तक कोई बातचीत नहीं। बोलना शुरू करें।',
        marathi: 'अजून कोणतेही संभाषण नाही. बोलणे सुरू करा.'
      },
      apiKeyMissing: {
        english: 'API keys not configured. Please check your environment variables.',
        hindi: 'API कुंजी कॉन्फ़िगर नहीं की गई। कृपया अपने environment variables जांचें।',
        marathi: 'API की कॉन्फिगर केली नाही. कृपया तुमचे environment variables तपासा.'
      }
    };
    
    return translations[key as keyof typeof translations]?.[lang] || '';
  };

  const languages = [
    { code: 'english' as Language, name: 'English', nativeName: 'English' },
    { code: 'hindi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'marathi' as Language, name: 'Marathi', nativeName: 'मराठी' }
  ];

  // Helper functions for API language codes
  const getWhisperLanguageCode = (lang: Language): string => {
    switch (lang) {
      case 'hindi':
        return 'hi';
      case 'marathi':
        return 'mr';
      default:
        return 'en';
    }
  };

  const getTranslationLanguageCode = (lang: Language): string => {
    switch (lang) {
      case 'hindi':
        return 'hi';
      case 'marathi':
        return 'mr';
      default:
        return 'en';
    }
  };

  const getTTSVoiceConfig = (lang: Language) => {
    switch (lang) {
      case 'hindi':
        return { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-D' };
      case 'marathi':
        return { languageCode: 'mr-IN', name: 'mr-IN-Wavenet-A' };
      default:
        return { languageCode: 'en-US', name: 'en-US-Wavenet-D' };
    }
  };

  // Speech-to-Text using OpenAI Whisper
  const speechToTextWithWhisper = async (audioBlob: Blob, languageCode: string): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', new File([audioBlob], 'audio.wav', { type: 'audio/wav' }));
      formData.append('model', 'whisper-1');
      formData.append('language', languageCode);

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Whisper STT error:', error);
      throw new Error('Speech recognition failed');
    }
  };

  // Translation using Google Cloud Translation API
  const translateTextWithGoogle = async (
    text: string, 
    sourceLang: Language, 
    targetLang: Language
  ): Promise<string> => {
    try {
      const sourceCode = getTranslationLanguageCode(sourceLang);
      const targetCode = getTranslationLanguageCode(targetLang);

      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${googleCloudApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceCode,
          target: targetCode,
          format: 'text'
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Translation failed');
    }
  };

  // Text-to-Speech using Google Cloud TTS
  const textToSpeechWithGoogle = async (text: string, targetLang: Language): Promise<string> => {
    try {
      const voiceConfig = getTTSVoiceConfig(targetLang);

      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleCloudApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text: text },
          voice: voiceConfig,
          audioConfig: { audioEncoding: 'MP3' }
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const data = await response.json();
      return data.audioContent || '';
    } catch (error) {
      console.error('TTS error:', error);
      throw new Error('Text-to-speech failed');
    }
  };

  const startRecording = async (speaker: 'officer' | 'visitor') => {
    // Check if API keys are configured
    if (!openaiApiKey || !googleCloudApiKey) {
      alert(getText('apiKeyMissing', 'english'));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processAudio(audioBlob, speaker);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(prev => ({ ...prev, [speaker]: true }));
      
      // Auto-stop recording after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording({ officer: false, visitor: false });
  };

  const processAudio = async (audioBlob: Blob, speaker: 'officer' | 'visitor') => {
    setIsProcessing(true);
    
    try {
      const sourceLanguage = speaker === 'officer' ? officerLanguage : visitorLanguage;
      const targetLanguage = speaker === 'officer' ? visitorLanguage : officerLanguage;
      
      // Step 1: Speech-to-Text with Whisper
      const whisperLanguageCode = getWhisperLanguageCode(sourceLanguage);
      const originalText = await speechToTextWithWhisper(audioBlob, whisperLanguageCode);
      
      if (!originalText.trim()) {
        alert('No speech detected. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Step 2: Translation with Google Cloud
      const translatedText = await translateTextWithGoogle(originalText, sourceLanguage, targetLanguage);

      // Step 3: Text-to-Speech with Google Cloud
      const audioContent = await textToSpeechWithGoogle(translatedText, targetLanguage);

      // Step 4: Create conversation entry
      const newEntry: ConversationEntry = {
        id: Date.now().toString(),
        speaker,
        originalText,
        translatedText,
        originalLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        timestamp: new Date()
      };

      // Step 5: Update conversation state
      if (speaker === 'officer') {
        setOfficerConversation(prev => [...prev, newEntry]);
      } else {
        setVisitorConversation(prev => [...prev, newEntry]);
      }

      // Step 6: Play translated audio
      if (audioContent) {
        playTranslatedAudio(audioContent);
      }

    } catch (error) {
      console.error('Error processing audio:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Processing failed'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const playTranslatedAudio = (base64AudioContent: string) => {
    try {
      setIsSpeaking(true);
      const audio = new Audio(`data:audio/mp3;base64,${base64AudioContent}`);
      
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        setIsSpeaking(false);
        console.error('Error playing audio');
      };
      
      audio.play();
    } catch (error) {
      console.error('Error playing translated audio:', error);
      setIsSpeaking(false);
    }
  };

  const clearConversations = () => {
    setOfficerConversation([]);
    setVisitorConversation([]);
  };

  // Check if API keys are configured
  const apiKeysConfigured = openaiApiKey && googleCloudApiKey;

  return (
    <div className="min-h-full bg-gray-50">
      {/* Clear Conversations Button */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-end">
            <button 
              onClick={clearConversations}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* API Keys Warning */}
      {!apiKeysConfigured && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-yellow-800 font-medium">API Keys Required</p>
              <p className="text-yellow-700 text-sm">
                Please configure VITE_OPENAI_API_KEY and VITE_GOOGLE_CLOUD_API_KEY in your .env file to use the translation assistant.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800"></div>
              <span>{getText('processing', 'english')}</span>
            </div>
          </div>
        )}

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Playing Translation...</span>
            </div>
          </div>
        )}

        {/* Two-sided interface */}
        <div className="grid grid-cols-2 gap-3 lg:gap-6">
          {/* Officer Side */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👮</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{getText('officer', officerLanguage)}</h2>
                  <p className="text-gray-500 text-sm">{getText('selectLanguage', officerLanguage)}</p>
                </div>
              </div>
            </div>

            {/* Language Selection */}
            <div className="mb-6">
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Officer Language:</label>
              <select
                value={officerLanguage}
                onChange={(e) => setOfficerLanguage(e.target.value as Language)}
                className="w-full p-2 lg:p-3 text-xs lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Microphone Button */}
            <div className="text-center mb-6">
              <button
                onClick={() => isRecording.officer ? stopRecording() : startRecording('officer')}
                disabled={isRecording.visitor || isProcessing || !apiKeysConfigured}
                className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                  isRecording.officer
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRecording.officer ? (
                  <MicOff className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                ) : (
                  <Mic className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                )}
              </button>
              <p className="text-gray-600 text-xs lg:text-sm mt-2">
                {isRecording.officer ? getText('listening', officerLanguage) : getText('tapToSpeak', officerLanguage)}
              </p>
            </div>

            {/* Officer Conversation */}
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <h3 className="text-sm lg:text-lg font-semibold text-gray-800 mb-4">Officer Conversation</h3>
              
              {officerConversation.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Languages className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs lg:text-sm">{getText('noConversation', officerLanguage)}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {officerConversation.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs lg:text-xs text-gray-500 mb-1">
                            {getText('originalText', 'english')} ({entry.originalLanguage})
                          </p>
                          <p className="text-xs lg:text-sm text-gray-800 font-medium">{entry.originalText}</p>
                        </div>
                        <div>
                          <p className="text-xs lg:text-xs text-gray-500 mb-1">
                            {getText('translatedText', 'english')} ({entry.targetLanguage})
                          </p>
                          <p className="text-xs lg:text-sm text-blue-600 font-medium">{entry.translatedText}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Visitor Side */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🙋</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{getText('visitor', visitorLanguage)}</h2>
                  <p className="text-gray-500 text-sm">{getText('selectLanguage', visitorLanguage)}</p>
                </div>
              </div>
            </div>

            {/* Language Selection */}
            <div className="mb-6">
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Visitor Language:</label>
              <select
                value={visitorLanguage}
                onChange={(e) => setVisitorLanguage(e.target.value as Language)}
                className="w-full p-2 lg:p-3 text-xs lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Microphone Button */}
            <div className="text-center mb-6">
              <button
                onClick={() => isRecording.visitor ? stopRecording() : startRecording('visitor')}
                disabled={isRecording.officer || isProcessing || !apiKeysConfigured}
                className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                  isRecording.visitor
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-green-500 hover:bg-green-600 hover:scale-105'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRecording.visitor ? (
                  <MicOff className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                ) : (
                  <Mic className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                )}
              </button>
              <p className="text-gray-600 text-xs lg:text-sm mt-2">
                {isRecording.visitor ? getText('listening', visitorLanguage) : getText('tapToSpeak', visitorLanguage)}
              </p>
            </div>

            {/* Visitor Conversation */}
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <h3 className="text-sm lg:text-lg font-semibold text-gray-800 mb-4">Visitor Conversation</h3>
              
              {visitorConversation.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Languages className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs lg:text-sm">{getText('noConversation', visitorLanguage)}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visitorConversation.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs lg:text-xs text-gray-500 mb-1">
                            {getText('originalText', 'english')} ({entry.originalLanguage})
                          </p>
                          <p className="text-xs lg:text-sm text-gray-800 font-medium">{entry.originalText}</p>
                        </div>
                        <div>
                          <p className="text-xs lg:text-xs text-gray-500 mb-1">
                            {getText('translatedText', 'english')} ({entry.targetLanguage})
                          </p>
                          <p className="text-xs lg:text-sm text-green-600 font-medium">{entry.translatedText}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationAssistantScreen;