import React, { useState } from 'react';
import { ArrowLeft, Search, Clock, AlertCircle, CheckCircle, FileText, User, Phone, MapPin, Calendar } from 'lucide-react';
import type { Language } from '../App';

interface CheckStatusScreenProps {
  language: Language;
  onBack: () => void;
  complaints: LocalComplaint[];
}

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

const CheckStatusScreen: React.FC<CheckStatusScreenProps> = ({ language, onBack, complaints }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [foundComplaint, setFoundComplaint] = useState<LocalComplaint | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const getText = (key: string) => {
    const translations = {
      enterToken: {
        english: 'Enter Token Number',
        hindi: 'टोकन नंबर दर्ज करें',
        marathi: 'टोकन नंबर टाका'
      },
      tokenPlaceholder: {
        english: 'Enter your token number (e.g., 2025/0001)',
        hindi: 'अपना टोकन नंबर दर्ज करें (जैसे, 2025/0001)',
        marathi: 'तुमचा टोकन नंबर टाका (उदा., 2025/0001)'
      },
      search: {
        english: 'Search',
        hindi: 'खोजें',
        marathi: 'शोधा'
      },
      complaintDetails: {
        english: 'Complaint Details',
        hindi: 'शिकायत विवरण',
        marathi: 'तक्रार तपशील'
      },
      tokenNumber: {
        english: 'Token Number',
        hindi: 'टोकन नंबर',
        marathi: 'टोकन नंबर'
      },
      complainantName: {
        english: 'Complainant Name',
        hindi: 'शिकायतकर्ता का नाम',
        marathi: 'तक्रारदाराचे नाव'
      },
      phoneNumber: {
        english: 'Phone Number',
        hindi: 'फोन नंबर',
        marathi: 'फोन नंबर'
      },
      address: {
        english: 'Address',
        hindi: 'पता',
        marathi: 'पत्ता'
      },
      issueType: {
        english: 'Issue Type',
        hindi: 'समस्या प्रकार',
        marathi: 'समस्या प्रकार'
      },
      status: {
        english: 'Status',
        hindi: 'स्थिति',
        marathi: 'स्थिती'
      },
      dateSubmitted: {
        english: 'Date Submitted',
        hindi: 'जमा करने की तारीख',
        marathi: 'सबमिट केलेली तारीख'
      },
      lastUpdated: {
        english: 'Last Updated',
        hindi: 'अंतिम अपडेट',
        marathi: 'शेवटचे अपडेट'
      },
      officerRemarks: {
        english: 'Officer Remarks',
        hindi: 'अधिकारी टिप्पणी',
        marathi: 'अधिकारी शेरा'
      },
      caseInformation: {
        english: 'Case Information',
        hindi: 'मामले की जानकारी',
        marathi: 'प्रकरण माहिती'
      },
      documents: {
        english: 'Documents Submitted',
        hindi: 'जमा किए गए दस्तावेज़',
        marathi: 'सबमिट केलेली कागदपत्रे'
      },
      pending: {
        english: 'Pending',
        hindi: 'लंबित',
        marathi: 'प्रलंबित'
      },
      underAction: {
        english: 'Under Action',
        hindi: 'कार्रवाई में',
        marathi: 'कारवाई अंतर्गत'
      },
      completed: {
        english: 'Completed',
        hindi: 'पूर्ण',
        marathi: 'पूर्ण'
      },
      complaintNotFound: {
        english: 'Complaint not found',
        hindi: 'शिकायत नहीं मिली',
        marathi: 'तक्रार सापडली नाही'
      },
      noComplaintMessage: {
        english: 'No complaint found with this token number. Please check your token number and try again.',
        hindi: 'इस टोकन नंबर के साथ कोई शिकायत नहीं मिली। कृपया अपना टोकन नंबर जांचें और पुनः प्रयास करें।',
        marathi: 'या टोकन नंबरसह कोणतीही तक्रार सापडली नाही. कृपया तुमचा टोकन नंबर तपासा आणि पुन्हा प्रयत्न करा.'
      },
      noRemarksYet: {
        english: 'No remarks added yet',
        hindi: 'अभी तक कोई टिप्पणी नहीं जोड़ी गई',
        marathi: 'अजून कोणत्याही शेरा जोडल्या नाहीत'
      },
      searchInstruction: {
        english: 'Enter your token number above and click search to check your complaint status.',
        hindi: 'अपनी शिकायत की स्थिति जांचने के लिए ऊपर अपना टोकन नंबर दर्ज करें और खोजें पर क्लिक करें।',
        marathi: 'तुमच्या तक्रारीची स्थिती तपासण्यासाठी वर तुमचा टोकन नंबर टाका आणि शोधा वर क्लिक करा.'
      }
    };
    
    return translations[key as keyof typeof translations]?.[language] || '';
  };

  const handleSearch = async () => {
    if (!tokenInput.trim()) {
      return;
    }

    setIsSearching(true);
    setSearchAttempted(true);
    
    // Simulate search delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Search for complaint by token number
    const complaint = complaints.find(c => 
      c.token_number.toLowerCase() === tokenInput.trim().toLowerCase()
    );
    
    setFoundComplaint(complaint || null);
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusIcon = (status: LocalComplaint['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'under_action':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-bright-yellow" />;
    }
  };

  const getStatusColor = (status: LocalComplaint['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_action':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: LocalComplaint['status']) => {
    switch (status) {
      case 'pending':
        return getText('pending');
      case 'under_action':
        return getText('underAction');
      case 'completed':
        return getText('completed');
    }
  };

  const formatIssueType = (issueType: string) => {
    return issueType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-navy-blue mb-6">{getText('enterToken')}</h2>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getText('tokenPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bright-yellow focus:border-transparent text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !tokenInput.trim()}
              className="px-6 py-3 bg-bright-yellow hover:bg-yellow-500 text-navy-blue rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-bold"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-blue"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>{getText('search')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {searchAttempted && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            {foundComplaint ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-navy-blue">{getText('complaintDetails')}</h2>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor(foundComplaint.status)}`}>
                    {getStatusIcon(foundComplaint.status)}
                    <span className="font-bold">{getStatusText(foundComplaint.status)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-bold text-navy-blue mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-bright-yellow" />
                        Basic Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{getText('tokenNumber')}:</span>
                          <span className="font-mono font-bold text-bright-yellow">#{foundComplaint.token_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{getText('issueType')}:</span>
                          <span className="font-bold">{formatIssueType(foundComplaint.issue_type)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{getText('dateSubmitted')}:</span>
                          <span>{new Date(foundComplaint.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{getText('lastUpdated')}:</span>
                          <span>{new Date(foundComplaint.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-bold text-navy-blue mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-bright-yellow" />
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600 mr-2">{getText('complainantName')}:</span>
                          <span className="font-bold">{foundComplaint.personal_info.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600 mr-2">{getText('phoneNumber')}:</span>
                          <span className="font-bold">{foundComplaint.personal_info.phone}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-1" />
                          <span className="text-gray-600 mr-2">{getText('address')}:</span>
                          <span className="font-bold">{foundComplaint.personal_info.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Case Information & Officer Remarks */}
                  <div className="space-y-6">
                    {/* Case Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-bold text-navy-blue mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-bright-yellow" />
                        {getText('caseInformation')}
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(foundComplaint.case_info).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                            <span className="font-bold text-right max-w-xs">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Documents */}
                    {foundComplaint.documents.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-bold text-navy-blue mb-4 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-bright-yellow" />
                          {getText('documents')}
                        </h3>
                        <ul className="space-y-2">
                          {foundComplaint.documents.map((doc, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-bright-yellow" />
                              <span className="text-gray-700">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Officer Remarks */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-bold text-navy-blue mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-bright-yellow" />
                        {getText('officerRemarks')}
                      </h3>
                      {foundComplaint.officer_remarks ? (
                        <div className="bg-white rounded-lg p-4 border border-yellow-200">
                          <p className="text-navy-blue leading-relaxed font-medium">{foundComplaint.officer_remarks}</p>
                          <div className="mt-3 text-xs text-gray-600">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Last updated: {new Date(foundComplaint.updated_at).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-bright-yellow" />
                          <p className="text-navy-blue font-bold">{getText('noRemarksYet')}</p>
                          <p className="text-gray-600 text-sm mt-1">Officer will add remarks as the case progresses</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-navy-blue mb-2">{getText('complaintNotFound')}</h3>
                <p className="text-gray-600 max-w-md mx-auto">{getText('noComplaintMessage')}</p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!searchAttempted && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-bright-yellow" />
            <h3 className="text-xl font-bold text-navy-blue mb-2">Track Your Complaint</h3>
            <p className="text-gray-600 max-w-md mx-auto">{getText('searchInstruction')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckStatusScreen;