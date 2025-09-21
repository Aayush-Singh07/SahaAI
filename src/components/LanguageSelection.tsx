import React from 'react';
import type { Language } from '../App';

interface LanguageSelectionProps {
  onLanguageSelect: (language: Language) => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onLanguageSelect }) => {
  const languages = [
    { code: 'english' as Language, name: 'English', nativeName: 'English' },
    { code: 'hindi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'marathi' as Language, name: 'Marathi', nativeName: 'मराठी' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Navy Blue Header Bar */}
        <div className="w-full h-4 bg-navy-blue rounded-t-lg mb-8"></div>
        
{/* Goa Police Logo */}
<div className="mb-8">
  <div className="w-32 h-32 mx-auto flex items-center justify-center">
    <img 
      src="/GPLOGO.jpg" 
      alt="Goa Police Logo" 
      className="w-full h-full object-contain rounded-full shadow-lg border-4 border-navy-blue"
    />
  </div>
</div>


        {/* Header */}
        <div className="mb-12">
          <h1 className="text-navy-blue text-3xl font-bold mb-4">
            Please select your language
          </h1>
          <h2 className="text-gray-600 text-lg mb-2">
            कृपया अपनी भाषा चुनें
          </h2>
          <h3 className="text-gray-600 text-lg">
            तुमची भाषा निवडा
          </h3>
        </div>
        
        {/* Language Buttons */}
        <div className="flex justify-center space-x-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageSelect(lang.code)}
              className="bg-white hover:bg-bright-yellow text-navy-blue font-bold py-4 px-8 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 border-2 border-navy-blue hover:border-bright-yellow"
            >
              <div className="text-xl">{lang.nativeName}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;