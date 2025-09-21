import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, MessageCircle, TrendingUp, Users } from 'lucide-react';
import { getFeedbackStats, type FeedbackStats } from '../lib/supabase';
import type { Language } from '../App';

interface FeedbackStatisticsScreenProps {
  language: Language;
  onBack: () => void;
}

const FeedbackStatisticsScreen: React.FC<FeedbackStatisticsScreenProps> = ({ language, onBack }) => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getText = (key: string) => {
    const translations = {
      feedbackStatistics: {
        english: 'Feedback Statistics',
        hindi: 'फीडबैक आंकड़े',
        marathi: 'फीडबॅक आकडेवारी'
      },
      totalFeedback: {
        english: 'Total Feedback',
        hindi: 'कुल फीडबैक',
        marathi: 'एकूण फीडबॅक'
      },
      excellent: {
        english: 'Good',
        hindi: 'अच्छा',
        marathi: 'चांगला'
      },
      average: {
        english: 'Average',
        hindi: 'औसत',
        marathi: 'सरासरी'
      },
      poor: {
        english: 'Poor',
        hindi: 'खराब',
        marathi: 'वाईट'
      },
      recentComments: {
        english: 'Recent Comments',
        hindi: 'हाल की टिप्पणियां',
        marathi: 'अलीकडील टिप्पण्या'
      },
      noComments: {
        english: 'No comments available',
        hindi: 'कोई टिप्पणी उपलब्ध नहीं',
        marathi: 'कोणत्याही टिप्पण्या उपलब्ध नाहीत'
      },
      loadingStats: {
        english: 'Loading statistics...',
        hindi: 'आंकड़े लोड हो रहे हैं...',
        marathi: 'आकडेवारी लोड होत आहे...'
      },
      errorLoading: {
        english: 'Error loading feedback statistics',
        hindi: 'फीडबैक आंकड़े लोड करने में त्रुटि',
        marathi: 'फीडबॅक आकडेवारी लोड करताना त्रुटी'
      },
      satisfactionRate: {
        english: 'Satisfaction Rate',
        hindi: 'संतुष्टि दर',
        marathi: 'समाधान दर'
      }
    };
    
    return translations[key as keyof typeof translations]?.[language] || '';
  };

  useEffect(() => {
    loadFeedbackStats();
  }, []);

  const loadFeedbackStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getFeedbackStats();
      
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to load statistics');
      }
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Error loading feedback stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSatisfactionRate = () => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.good / stats.total) * 100);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRatingEmoji = (rating: string) => {
    switch (rating) {
      case 'good':
        return '😊';
      case 'medium':
        return '😐';
      case 'poor':
        return '😞';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bright-yellow mx-auto mb-4"></div>
          <p className="text-gray-600">{getText('loadingStats')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <BarChart3 className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-red-600 mb-4">{getText('errorLoading')}</p>
          <button
            onClick={loadFeedbackStats}
            className="bg-bright-yellow hover:bg-yellow-500 text-navy-blue px-4 py-2 rounded-lg font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-navy-blue" />
          </button>
          <h1 className="text-2xl font-bold text-navy-blue">{getText('feedbackStatistics')}</h1>
        </div>

        {stats && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Total Feedback */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{getText('totalFeedback')}</p>
                    <p className="text-2xl font-bold text-navy-blue">{stats.total}</p>
                  </div>
                </div>
              </div>

              {/* Good Feedback */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">😊</span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{getText('excellent')}</p>
                    <p className="text-2xl font-bold text-green-600">{stats.good}</p>
                  </div>
                </div>
              </div>

              {/* Average Feedback */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">😐</span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{getText('average')}</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
                  </div>
                </div>
              </div>

              {/* Poor Feedback */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">😞</span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{getText('poor')}</p>
                    <p className="text-2xl font-bold text-red-600">{stats.poor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Satisfaction Rate */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-bright-yellow mr-2" />
                <h2 className="text-xl font-bold text-navy-blue">{getText('satisfactionRate')}</h2>
              </div>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                  <div 
                    className="bg-bright-yellow h-4 rounded-full transition-all duration-500"
                    style={{ width: `${calculateSatisfactionRate()}%` }}
                  ></div>
                </div>
                <span className="text-2xl font-bold text-navy-blue">{calculateSatisfactionRate()}%</span>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Based on positive feedback ({stats.good} out of {stats.total} responses)
              </p>
            </div>

            {/* Recent Comments */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-6 h-6 text-bright-yellow mr-2" />
                <h2 className="text-xl font-bold text-navy-blue">{getText('recentComments')}</h2>
              </div>
              
              {stats.recent_comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{getText('noComments')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recent_comments.map((comment, index) => (
                    <div key={index} className="border-l-4 border-bright-yellow pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getRatingEmoji(comment.rating)}</span>
                          <span className={`font-bold capitalize ${getRatingColor(comment.rating)}`}>
                            {comment.rating}
                          </span>
                          <span className="text-gray-400 text-sm">
                            ({comment.language})
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 italic">"{comment.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackStatisticsScreen;