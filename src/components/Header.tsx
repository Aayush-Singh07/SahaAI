import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import type { Screen, Language } from '../App';

interface HeaderProps {
  currentScreen: Screen;
  language: Language;
  onBack?: () => void;
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
  onNavigate?: (screen: Screen) => void;
  onExit?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentScreen, 
  language,
  onBack, 
  showBackButton = false, 
  title,
  subtitle,
  onNavigate,
  onExit
}) => {
  const getExitText = () => {
    const translations = {
      exit: {
        english: 'Exit',
        hindi: 'बाहर निकलें',
        marathi: 'बाहेर पडा'
      }
    };
    
    return translations.exit[language] || 'Exit';
  };

  const getDefaultTitle = () => {
    switch (currentScreen) {
      case 'home':
        return 'SahaAI- Goa Police';
      case 'fileReport':
        return 'File Report';
      case 'checkStatus':
        return 'Check Status';
      case 'translationAssistant':
        return 'Translation Assistant';
      case 'knowYourThana':
        return 'Know Your Thana';
      case 'dashboard':
        return 'Police Dashboard';
      case 'aiVoiceAssistant':
        return 'AI Voice Assistant';
      default:
        return 'SahAI – AI Visitor Assistant';
    }
  };

  const getDefaultSubtitle = () => {
    switch (currentScreen) {
      case 'home':
        return 'Digital Police Station Services';
      case 'fileReport':
        return 'Submit your complaint or report';
      case 'checkStatus':
        return 'Track your complaint status in real-time';
      case 'translationAssistant':
        return 'Real-time Police-Visitor Communication';
      case 'knowYourThana':
        return 'Panjim Police Station Information';
      case 'dashboard':
        return 'Complaint Management System';
      case 'aiVoiceAssistant':
        return 'Police Station AI Assistant';
      default:
        return 'शांति • सेवा • न्याय | Peace • Service • Justice';
    }
  };

  return (
    <div className="bg-navy-blue text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo, Title and Back Button */}
          <div className="flex items-center space-x-4">
            {showBackButton && onBack && (
              <button 
                onClick={onBack}
                className="p-2 hover:bg-navy-blue/80 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            
            {/* Goa Police Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src="/gplogotrans.png"
                  alt="Goa Police Logo"
                  className="w-full h-full object-contain rounded-full shadow-lg"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">{title || getDefaultTitle()}</h1>
                <p className="text-blue-200 text-sm">{subtitle || getDefaultSubtitle()}</p>
              </div>
            </div>
          </div>
          
          {/* Right Side - Action Buttons (only on home screen) */}
          <div className="flex items-center space-x-3">
            {/* Dashboard Button - Only on home screen */}
            {currentScreen === 'home' && (
              <button 
                onClick={() => onNavigate?.('dashboard')}
                className="bg-bright-yellow hover:bg-yellow-500 text-navy-blue px-4 py-2 rounded-lg transition-colors font-bold"
              >
                Dashboard
              </button>
            )}
            
            {/* Exit Button - Always visible */}
            <button 
              onClick={onExit}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-bold"
            >
              {getExitText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;