import React from 'react';
import { Shield } from 'lucide-react';
import type { Screen } from '../App';

interface SplashScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  const onNavigateToScreen = (screen: Screen) => {
    onNavigate(screen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-lg w-full border border-gray-200">
        
{/* Goa Police Logo - Use Image File */}
<div className="mb-8">
  <div className="w-32 h-32 mx-auto flex items-center justify-center relative">
    <img 
      src="/GPLOGO.jpg" 
      alt="Goa Police Logo" 
      className="w-full h-full object-contain rounded-full"
    />
  </div>
</div>

        
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-blue mb-2 leading-tight">
            GOA POLICE - SahaAI
          </h1>
          
          {/* Hindi Translation */}
          <p className="text-lg text-navy-blue/80 mb-1 font-medium">
            गोवा पुलिस - सहाय
          </p>
          
          {/* Marathi Translation */}
          <p className="text-lg text-navy-blue/80 font-medium">
            गोवा पोलीस - सहाय्य
          </p>
          
          {/* Decorative Line */}
          <div className="w-24 h-1 bg-bright-yellow mx-auto mt-4 rounded-full"></div>
        </div>
        
        {/* Start Button */}
        <div className="mb-8">
          <button 
            onClick={() => onNavigate('language')}
            className="bg-navy-blue hover:bg-navy-blue/90 text-white font-bold py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
          >
            <span className="flex items-center space-x-2">
              <span>Start Assistant</span>
              <span className="text-xl">→</span>
            </span>
          </button>
          
          {/* Button Translations */}
          <div className="mt-3 space-y-1">
            <p className="text-sm text-navy-blue/70 font-medium">
              सहायक शुरू करें • सहाय्यक सुरू करा
            </p>
          </div>
        </div>
        
        {/* Peace Service Justice Tagline */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-navy-blue/60 text-sm font-medium">
            शांति • सेवा • न्याय
          </p>
          <p className="text-navy-blue/60 text-sm font-medium mt-1">
            Peace • Service • Justice
          </p>
        </div>
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-navy-blue to-bright-yellow rounded-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;