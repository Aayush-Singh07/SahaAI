import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import LanguageSelection from './components/LanguageSelection';
import HomeScreen from './components/HomeScreen';
import KnowYourThanaScreen from './components/KnowYourThanaScreen';
import TranslationAssistantScreen from './components/TranslationAssistantScreen';
import FileReportScreen from './components/FileReportScreen';
import CheckStatusScreen from './components/CheckStatusScreen';
import DashboardScreen, { mockComplaints } from './components/DashboardScreen';
import AIVoiceAssistantScreen from './components/AIVoiceAssistantScreen';
import FeedbackScreen from './components/FeedbackScreen';
import FeedbackStatisticsScreen from './components/FeedbackStatisticsScreen';

// Local complaint interface
interface LocalComplaint {
  id: string;
  token_number: string;
  issue_type: string;
  personal_info: {
    name: string;
    phone: string;
    address: string;
  };
  case_info: Record<string, any>;
  documents: string[];
  status: 'pending' | 'under_action' | 'completed';
  officer_remarks?: string;
  created_at: string;
  updated_at: string;
}

export type Language = 'english' | 'hindi' | 'marathi';
export type Screen = 'splash' | 'language' | 'home' | 'fileReport' | 'checkStatus' | 'translation' | 'translationAssistant' | 'knowYourThana' | 'dashboard' | 'aiVoiceAssistant' | 'feedback' | 'feedbackStatistics';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const [allComplaints, setAllComplaints] = useState<LocalComplaint[]>(mockComplaints);

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const changeLanguage = (language: Language) => {
    setSelectedLanguage(language);
  };

  const addComplaint = (complaint: Omit<LocalComplaint, 'id' | 'created_at' | 'updated_at'>) => {
    const newComplaint: LocalComplaint = {
      ...complaint,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setAllComplaints(prev => [...prev, newComplaint]);
    return newComplaint;
  };

  const updateComplaint = (id: string, updates: Partial<LocalComplaint>) => {
    setAllComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id 
          ? { ...complaint, ...updates }
          : complaint
      )
    );
  };

  const generateTokenNumber = (): string => {
    const currentYear = new Date().getFullYear();
    if (allComplaints.length === 0) {
      return `${currentYear}/0001`;
    }
    
    // Extract numeric part from existing tokens (YYYY/XXXX format)
    const maxToken = Math.max(...allComplaints.map(c => {
      const parts = c.token_number.split('/');
      return parts.length === 2 ? parseInt(parts[1]) : parseInt(c.token_number);
    }));
    return `${currentYear}/${(maxToken + 1).toString().padStart(4, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {currentScreen === 'splash' && (
        <SplashScreen onNavigate={navigateToScreen} />
      )}
      {currentScreen === 'language' && (
        <LanguageSelection 
          onLanguageSelect={(language) => {
            changeLanguage(language);
            navigateToScreen('home');
          }}
        />
      )}
      
      {/* Main Content with Header and Footer */}
      {currentScreen !== 'splash' && currentScreen !== 'language' && (
        <>
          <Header 
            currentScreen={currentScreen}
            language={selectedLanguage}
            onBack={() => navigateToScreen('home')}
            showBackButton={currentScreen !== 'home'}
            onNavigate={navigateToScreen}
            onExit={() => navigateToScreen('feedback')}
          />
          
          <div className="flex-1">
            {currentScreen === 'home' && (
              <HomeScreen 
                language={selectedLanguage}
                onNavigate={navigateToScreen}
                onLanguageChange={changeLanguage}
              />
            )}
            {currentScreen === 'knowYourThana' && (
              <KnowYourThanaScreen 
                language={selectedLanguage}
                onBack={() => navigateToScreen('home')}
              />
            )}
            {currentScreen === 'translationAssistant' && (
              <TranslationAssistantScreen 
                language={selectedLanguage}
                onBack={() => navigateToScreen('home')}
              />
            )}
            {currentScreen === 'fileReport' && (
              <FileReportScreen 
                language={selectedLanguage}
                onBack={() => navigateToScreen('home')}
                allComplaints={allComplaints}
                onAddComplaint={addComplaint}
                generateTokenNumber={generateTokenNumber}
              />
            )}
            {currentScreen === 'checkStatus' && (
              <CheckStatusScreen 
                language={selectedLanguage}
                onBack={() => navigateToScreen('home')}
                complaints={allComplaints}
              />
            )}
            {currentScreen === 'dashboard' && (
              <DashboardScreen 
                language={selectedLanguage}
                onBack={() => navigateToScreen('home')}
                complaints={allComplaints}
                onUpdateComplaint={updateComplaint}
                onNavigate={navigateToScreen}
              />
            )}
            {currentScreen === 'aiVoiceAssistant' && (
              <AIVoiceAssistantScreen 
                language={selectedLanguage}
                onBack={() => navigateToScreen('home')}
              />
            )}
            {currentScreen === 'feedback' && (
              <FeedbackScreen 
                language={selectedLanguage}
                onSkip={() => navigateToScreen('splash')}
                onSubmit={() => navigateToScreen('splash')}
              />
            )}
            {currentScreen === 'feedbackStatistics' && (
              <FeedbackStatisticsScreen 
                language={selectedLanguage}
                onBack={() => navigateToScreen('dashboard')}
              />
            )}
            {currentScreen === 'translation' && (
              <PlaceholderScreen 
                title={getScreenTitle(currentScreen, selectedLanguage)}
                onBack={() => navigateToScreen('home')}
              />
            )}
          </div>
          
          {currentScreen !== 'feedback' && <Footer />}
        </>
      )}
    </div>
  );
}

const PlaceholderScreen: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div className="min-h-full bg-gray-50 flex items-center justify-center">
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold text-navy-blue mb-4">{title}</h1>
      <p className="text-gray-600 mb-6">This feature is coming soon...</p>
      <button 
        onClick={onBack}
        className="bg-bright-yellow hover:bg-yellow-500 text-navy-blue px-6 py-3 rounded-lg transition-colors font-bold"
      >
        Back to Home
      </button>
    </div>
  </div>
);

const getScreenTitle = (screen: Screen, language: Language): string => {
  const titles = {
    translation: {
      english: 'Translation Assistant',
      hindi: 'अनुवाद सहायक',
      marathi: 'भाषांतर सहाय्यक'
    },
    knowYourThana: {
      english: 'Know Your Thana',
      hindi: 'अपना थाना जानें',
      marathi: 'तुमचे ठाणे जाणा'
    }
  };
  
  return titles[screen as keyof typeof titles]?.[language] || '';
};

export default App;