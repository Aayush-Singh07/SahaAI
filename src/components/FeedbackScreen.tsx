import React, { useState, useRef } from 'react';
import { Mic, MicOff, Send, X } from 'lucide-react';
import { saveFeedback } from '../lib/supabase';
import type { Language } from '../App';

interface FeedbackScreenProps {
  language: Language;
  onSkip: () => void;
  onSubmit: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ language, onSkip, onSubmit }) => {
  const [selectedRating, setSelectedRating] = useState<'good' | 'medium' | 'poor' | null>(null);
  const [comment, setComment] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const getText = (key: string) => {
    const translations = {
      howWasExperience: {
        english: 'How was your experience?',
        hindi: 'आपका अनुभव कैसा था?',
        marathi: 'तुमचा अनुभव कसा होता?'
      },
      good: {
        english: 'Good',
        hindi: 'अच्छा',
        marathi: 'चांगला'
      },
      medium: {
        english: 'Average',
        hindi: 'औसत',
        marathi: 'सरासरी'
      },
      poor: {
        english: 'Poor',
        hindi: 'खराब',
        marathi: 'वाईट'
      },
      commentPlaceholder: {
        english: 'Share your thoughts... (optional)',
        hindi: 'अपने विचार साझा करें... (वैकल्पिक)',
        marathi: 'तुमचे विचार सामायिक करा... (पर्यायी)'
      },
      submit: {
        english: 'Submit Feedback',
        hindi: 'फीडबैक जमा करें',
        marathi: 'फीडबॅक सबमिट करा'
      },
      skip: {
        english: 'Skip',
        hindi: 'छोड़ें',
        marathi: 'वगळा'
      },
      listening: {
        english: 'Listening...',
        hindi: 'सुन रहा है...',
        marathi: 'ऐकत आहे...'
      },
      submitting: {
        english: 'Submitting...',
        hindi: 'जमा कर रहे हैं...',
        marathi: 'सबमिट करत आहे...'
      },
      thankYou: {
        english: 'Thank you for your feedback!',
        hindi: 'आपके फीडबैक के लिए धन्यवाद!',
        marathi: 'तुमच्या फीडबॅकसाठी धन्यवाद!'
      }
    };
    
    return translations[key as keyof typeof translations]?.[language] || '';
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

  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = getLanguageCode(language);

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setComment(prev => prev + (prev ? ' ' : '') + transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      alert('Error accessing microphone');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    if (!selectedRating) {
      alert('Please select a rating before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await saveFeedback({
        rating: selectedRating,
        comment: comment.trim() || undefined,
        language: language
      });

      if (result.success) {
        alert(getText('thankYou'));
        onSubmit();
      } else {
        alert('Failed to submit feedback. Please try again.');
        console.error('Feedback submission error:', result.error);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingOptions = [
    {
      id: 'good' as const,
      emoji: '😊',
      color: 'text-green-500 border-green-500',
      selectedColor: 'bg-green-500 text-white border-green-500',
      label: getText('good')
    },
    {
      id: 'medium' as const,
      emoji: '😐',
      color: 'text-yellow-500 border-yellow-500',
      selectedColor: 'bg-yellow-500 text-white border-yellow-500',
      label: getText('medium')
    },
    {
      id: 'poor' as const,
      emoji: '😞',
      color: 'text-red-500 border-red-500',
      selectedColor: 'bg-red-500 text-white border-red-500',
      label: getText('poor')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-navy-blue mb-2">
            {getText('howWasExperience')}
          </h2>
        </div>

        {/* Rating Options */}
        <div className="flex justify-center space-x-6 mb-8">
          {ratingOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedRating(option.id)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                selectedRating === option.id
                  ? option.selectedColor
                  : `${option.color} bg-white hover:bg-gray-50`
              }`}
            >
              <div className="text-4xl mb-2">{option.emoji}</div>
              <span className="text-sm font-bold">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Comment Section */}
        <div className="mb-6">
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={getText('commentPlaceholder')}
              rows={4}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bright-yellow focus:border-transparent resize-none"
            />
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`absolute right-3 top-3 p-2 rounded-full transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
              }`}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </div>
          {isRecording && (
            <p className="text-sm text-red-500 mt-2 text-center">
              {getText('listening')}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onSkip}
            className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors font-bold"
          >
            {getText('skip')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedRating || isSubmitting}
            className="flex-1 px-6 py-3 bg-bright-yellow hover:bg-yellow-500 text-navy-blue rounded-lg transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy-blue"></div>
                <span>{getText('submitting')}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{getText('submit')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackScreen;