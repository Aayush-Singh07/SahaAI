import React from 'react';
import { Mic, FileText, CheckCircle, Languages, MapPin, Bot } from 'lucide-react';
import type { Language, Screen } from '../App';

interface HomeScreenProps {
  language: Language;
  onNavigate: (screen: Screen) => void;
  onLanguageChange: (language: Language) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ language, onNavigate, onLanguageChange }) => {
  const getText = (key: string) => {
    const translations = {
      aiVoiceAssistant: {
        english: 'SahAI',
        hindi: 'सहाय',
        marathi: 'सहाय्य'
      },
      tapToSpeak: {
        english: 'Tap to speak',
        hindi: 'बोलने के लिए टैप करें',
        marathi: 'बोलण्यासाठी टॅप करा'
      },
      fileReport: {
        english: 'File Report',
        hindi: 'रिपोर्ट दर्ज',
        marathi: 'रिपोर्ट दाखल करा'
      },
      fileReportSub: {
        english: 'रिपोर्ट दर्ज / रिपोर्ट दाखल करा',
        hindi: 'रिपोर्ट दर्ज / रिपोर्ट दाखल करा',
        marathi: 'रिपोर्ट दर्ज / रिपोर्ट दाखल करा'
      },
      checkStatus: {
        english: 'Check Status',
        hindi: 'स्थिति जांचें',
        marathi: 'स्थिती तपासा'
      },
      checkStatusSub: {
        english: 'स्थिति जांचें / स्थिती तपासा',
        hindi: 'स्थिति जांचें / स्थिती तपासा',
        marathi: 'स्थिति जांचें / स्थिती तपासा'
      },
      translation: {
        english: 'Translation Assistant',
        hindi: 'अनुवाद सहायक',
        marathi: 'भाषांतर सहाय्यक'
      },
      translationSub: {
        english: 'अनुवाद सहायक / भाषांतर सहाय्यक',
        hindi: 'अनुवाद सहायक / भाषांतर सहाय्यक',
        marathi: 'अनुवाद सहायक / भाषांतर सहाय्यक'
      },
      aiVoiceAssistantSub: {
        english: 'एआई आवाज सहायक / एआय आवाज सहाय्यक',
        hindi: 'एआई आवाज सहायक / एआय आवाज सहाय्यक',
        marathi: 'एआई आवाज सहायक / एआय आवाज सहाय्यक'
      },
      knowYourThana: {
        english: 'Know Your Thana',
        hindi: 'अपना थाना जानें',
        marathi: 'तुमचे ठाणे जाणा'
      },
      knowYourThanaSub: {
        english: 'अपना थाना जानें / तुमचे ठाणे जाणा',
        hindi: 'अपना थाना जानें / तुमचे ठाणे जाणा',
        marathi: 'अपना थाना जानें / तुमचे ठाणे जाणा'
      }
    };
    
    return translations[key as keyof typeof translations]?.[language] || '';
  };

  const featureCards = [
    { 
      id: 'fileReport' as Screen, 
      title: getText('fileReport'), 
      subtitle: getText('fileReportSub'),
      icon: FileText, 
      color: 'bg-white border-2 border-navy-blue hover:border-bright-yellow' 
    },
    { 
      id: 'checkStatus' as Screen, 
      title: getText('checkStatus'), 
      subtitle: getText('checkStatusSub'),
      icon: CheckCircle, 
      color: 'bg-white border-2 border-navy-blue hover:border-bright-yellow' 
    },
    { 
      id: 'translationAssistant' as Screen, 
      title: getText('translation'), 
      subtitle: getText('translationSub'),
      icon: Languages, 
      color: 'bg-white border-2 border-navy-blue hover:border-bright-yellow' 
    },
    { 
      id: 'knowYourThana' as Screen, 
      title: getText('knowYourThana'), 
      subtitle: getText('knowYourThanaSub'),
      icon: MapPin, 
      color: 'bg-white border-2 border-navy-blue hover:border-bright-yellow' 
    }
  ];

  return (
    <div className="min-h-full bg-gray-50 relative">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Feature Cards - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {featureCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`${card.color} p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-navy-blue text-center h-40 flex flex-col justify-center w-full`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-bright-yellow rounded-full flex items-center justify-center mb-3">
                    <IconComponent className="w-6 h-6 text-navy-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating AI Voice Assistant Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => onNavigate('aiVoiceAssistant')}
          className="bg-bright-yellow hover:bg-yellow-500 text-navy-blue p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-200 flex items-center space-x-3"
        >
          <Mic className="w-6 h-6" />
          <span className="font-bold text-lg">{getText('aiVoiceAssistant')}</span>
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;