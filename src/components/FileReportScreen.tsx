import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, FileText, Volume2, VolumeX, CheckCircle, Download, Mic, MicOff } from 'lucide-react';
import { complaintData, getIssueById, getIssueNameByLanguage, type IssueType } from '../data/complaintData';
import type { Language } from '../App';
import jsPDF from 'jspdf';
import { sendAcknowledgementSMS, formatPhoneNumber, isValidPhoneNumber } from '../utils/smsService';

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

interface FileReportScreenProps {
  language: Language;
  onBack: () => void;
  allComplaints: LocalComplaint[];
  onAddComplaint: (complaint: Omit<LocalComplaint, 'id' | 'created_at' | 'updated_at'>) => LocalComplaint;
  generateTokenNumber: () => string;
}

interface PersonalInfo {
  name: string;
  phone: string;
  address: string;
}

interface CaseInfo {
  [key: string]: string | number;
}

const FileReportScreen: React.FC<FileReportScreenProps> = ({ language, onBack, allComplaints, onAddComplaint, generateTokenNumber }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIssueType, setSelectedIssueType] = useState<string>('');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    phone: '',
    address: ''
  });
  const [caseInfo, setCaseInfo] = useState<CaseInfo>({});
  const [checkedDocuments, setCheckedDocuments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; tokenNumber?: string; error?: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const getText = (key: string) => {
    const translations = {
      fileReport: {
        english: 'File Report',
        hindi: 'रिपोर्ट दर्ज करें',
        marathi: 'तक्रार नोंदवा'
      },
      selectIssue: {
        english: 'Select Issue Type',
        hindi: 'समस्या का प्रकार चुनें',
        marathi: 'समस्येचा प्रकार निवडा'
      },
      rightsAndProcedure: {
        english: 'Rights & Procedure',
        hindi: 'अधिकार और प्रक्रिया',
        marathi: 'हक्क आणि प्रक्रिया'
      },
      fillInformation: {
        english: 'Fill Information',
        hindi: 'जानकारी भरें',
        marathi: 'माहिती भरा'
      },
      documentChecklist: {
        english: 'Document Checklist',
        hindi: 'दस्तावेज़ सूची',
        marathi: 'कागदपत्रांची यादी'
      },
      reviewAndSubmit: {
        english: 'Review & Submit',
        hindi: 'समीक्षा और जमा करें',
        marathi: 'पुनरावलोकन आणि सबमिट करा'
      },
      next: {
        english: 'Next',
        hindi: 'आगे',
        marathi: 'पुढे'
      },
      back: {
        english: 'Back',
        hindi: 'पीछे',
        marathi: 'मागे'
      },
      submit: {
        english: 'Submit Report',
        hindi: 'रिपोर्ट जमा करें',
        marathi: 'तक्रार सबमिट करा'
      },
      personalInformation: {
        english: 'Personal Information',
        hindi: 'व्यक्तिगत जानकारी',
        marathi: 'वैयक्तिक माहिती'
      },
      name: {
        english: 'Full Name',
        hindi: 'पूरा नाम',
        marathi: 'पूर्ण नाव'
      },
      phone: {
        english: 'Phone Number',
        hindi: 'फोन नंबर',
        marathi: 'फोन नंबर'
      },
      address: {
        english: 'Address',
        hindi: 'पता',
        marathi: 'पत्ता'
      },
      caseInformation: {
        english: 'Case Information',
        hindi: 'मामले की जानकारी',
        marathi: 'प्रकरणाची माहिती'
      },
      requiredDocuments: {
        english: 'Required Documents',
        hindi: 'आवश्यक दस्तावेज़',
        marathi: 'आवश्यक कागदपत्रे'
      },
      reviewDetails: {
        english: 'Review Your Details',
        hindi: 'अपनी जानकारी की समीक्षा करें',
        marathi: 'तुमच्या तपशीलांचे पुनरावलोकन करा'
      },
      issueType: {
        english: 'Issue Type',
        hindi: 'समस्या का प्रकार',
        marathi: 'समस्येचा प्रकार'
      },
      tokenGenerated: {
        english: 'Token Number Generated',
        hindi: 'टोकन नंबर जेनरेट हुआ',
        marathi: 'टोकन नंबर तयार झाला'
      },
      downloadReceipt: {
        english: 'Download Receipt',
        hindi: 'रसीद डाउनलोड करें',
        marathi: 'पावती डाउनलोड करा'
      },
      submissionSuccess: {
        english: 'Your complaint has been successfully submitted!',
        hindi: 'आपकी शिकायत सफलतापूर्वक दर्ज हो गई है!',
        marathi: 'तुमची तक्रार यशस्वीरित्या सबमिट झाली आहे!'
      },
      submissionError: {
        english: 'Error submitting complaint. Please try again.',
        hindi: 'शिकायत दर्ज करने में त्रुटि। कृपया पुनः प्रयास करें।',
        marathi: 'तक्रार सबमिट करताना त्रुटी. कृपया पुन्हा प्रयत्न करा.'
      }
    };
    
    return translations[key as keyof typeof translations]?.[language] || '';
  };

  const steps = [
    getText('selectIssue'),
    getText('rightsAndProcedure'),
    getText('fillInformation'),
    getText('documentChecklist'),
    getText('reviewAndSubmit')
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleIssueSelect = (issueId: string) => {
    setSelectedIssueType(issueId);
    setCaseInfo({}); // Reset case info when issue type changes
    handleNext();
  };

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCaseInfoChange = (fieldId: string, value: string | number) => {
    setCaseInfo(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleDocumentCheck = (doc: string) => {
    setCheckedDocuments(prev => 
      prev.includes(doc) 
        ? prev.filter(d => d !== doc)
        : [...prev, doc]
    );
  };

  const speakText = (text: string) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hindi' ? 'hi-IN' : language === 'marathi' ? 'mr-IN' : 'en-US';
    utterance.rate = 0.8;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const startVoiceInput = (fieldId: string) => {
    if (isRecording) {
      stopVoiceInput();
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    // Set language based on selected language
    switch (language) {
      case 'hindi':
        recognition.lang = 'hi-IN';
        break;
      case 'marathi':
        recognition.lang = 'mr-IN';
        break;
      default:
        recognition.lang = 'en-US';
    }

    recognition.onstart = () => {
      setIsRecording(true);
      setActiveField(fieldId);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      
      // Update the appropriate field based on fieldId
      if (fieldId === 'name') {
        handlePersonalInfoChange('name', transcript);
      } else if (fieldId === 'phone') {
        handlePersonalInfoChange('phone', transcript);
      } else if (fieldId === 'address') {
        handlePersonalInfoChange('address', transcript);
      } else {
        handleCaseInfoChange(fieldId, transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'Speech recognition error occurred.';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone was found. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your internet connection.';
          break;
      }
      
      alert(errorMessage);
      setIsRecording(false);
      setActiveField(null);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setActiveField(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setActiveField(null);
  };

  const generatePDFReceipt = (tokenNumber: string, issueType: IssueType) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    const logoBase64 = "data:image/jpeg;base64,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";
  doc.addImage(logoBase64, 'PNG', 80, 10, 50, 20); 
    doc.text('GOA POLICE', 105, 30, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Panaji Police Station', 105, 45, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Complaint Receipt', 105, 60, { align: 'center' });
    
    // Token Number
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`Token Number: ${tokenNumber}`, 20, 80);
    doc.setFont(undefined, 'normal');
    
    // Personal Info
    doc.setFontSize(12);
    doc.text(`Name: ${personalInfo.name}`, 20, 100);
    doc.text(`Phone: ${personalInfo.phone}`, 20, 115);
    doc.text(`Address: ${personalInfo.address}`, 20, 130);
    
    // Issue Type
    doc.text(`Issue Type: ${getIssueNameByLanguage(issueType, language)}`, 20, 150);
    
    // Date
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 170);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 185);
    
    // Additional Information
    doc.setFontSize(10);
    doc.text('Station Address: Altinho, Panaji, Goa, 403001', 20, 210);
    doc.text('Helpline: +91 832 1000 999', 20, 225);
    
    // Footer
    doc.setFontSize(10);
    doc.text('This is a computer generated receipt.', 105, 250, { align: 'center' });
    doc.text('Please keep this receipt for future reference.', 105, 260, { align: 'center' });
    
    // Download
    doc.save(`complaint-receipt-${tokenNumber}.pdf`);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const tokenNumber = generateTokenNumber();
      const issueType = getIssueById(selectedIssueType);
      
      if (!issueType) {
        throw new Error('Invalid issue type');
      }

      const complaint: Omit<LocalComplaint, 'id' | 'created_at' | 'updated_at'> = {
        token_number: tokenNumber,
        issue_type: selectedIssueType,
        personal_info: personalInfo,
        case_info: caseInfo,
        documents: checkedDocuments,
        status: 'pending',
        officer_remarks: ''
      };

      const savedComplaint = onAddComplaint(complaint);
      
      // Send SMS acknowledgment
      const formattedPhone = formatPhoneNumber(personalInfo.phone);
      if (isValidPhoneNumber(personalInfo.phone)) {
        const smsResult = await sendAcknowledgementSMS({
          phoneNumber: formattedPhone,
          tokenNumber: tokenNumber,
          issueType: getIssueNameByLanguage(issueType, language),
          policeStation: 'Panaji Police Station',
          dateTime: new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        });

        if (!smsResult.success) {
          console.warn('SMS sending failed:', smsResult.error);
          // Don't fail the entire submission if SMS fails
        } else {
          console.log('SMS acknowledgment sent successfully');
        }
      } else {
        console.warn('Invalid phone number format, SMS not sent:', personalInfo.phone);
      }
      
      setSubmissionResult({ success: true, tokenNumber });
      generatePDFReceipt(tokenNumber, issueType);
      
    } catch (error) {
      setSubmissionResult({ success: false, error: error instanceof Error ? error.message : 'Failed to submit complaint' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedIssueType !== '';
      case 3:
        return personalInfo.name && personalInfo.phone && personalInfo.address;
      default:
        return true;
    }
  };

  const selectedIssue = selectedIssueType ? getIssueById(selectedIssueType) : null;

  if (submissionResult?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{getText('tokenGenerated')}</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-mono text-2xl">{submissionResult.tokenNumber}</p>
          </div>
          <p className="text-gray-600 mb-6">{getText('submissionSuccess')}</p>
          <button
            onClick={onBack}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 <= currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  index + 1 <= currentStep ? 'text-green-600 font-medium' : 'text-gray-500'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    index + 1 < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Select Issue */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{getText('selectIssue')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complaintData.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => handleIssueSelect(issue.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      selectedIssueType === issue.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <FileText className="w-6 h-6 text-green-600 mb-2" />
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {getIssueNameByLanguage(issue, language)}
                    </h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Rights & Procedure */}
          {currentStep === 2 && selectedIssue && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{getText('rightsAndProcedure')}</h2>
                <button
                  onClick={() => speakText(selectedIssue.procedure[language])}
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                >
                  {isSpeaking ? (
                    <VolumeX className="w-5 h-5 text-red-600" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              </div>
              {isSpeaking && (
                <div className="mb-4 text-center">
                  <span className="text-blue-600 font-medium">Speaking...</span>
                </div>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3">
                  {getIssueNameByLanguage(selectedIssue, language)}
                </h3>
                <p className="text-blue-700 leading-relaxed">
                  {selectedIssue.procedure[language]}
                </p>
                <div className="mt-4 text-xs text-blue-600">
                  💡 Click the speaker icon above to hear this text read aloud in {language === 'english' ? 'English' : language === 'hindi' ? 'Hindi' : 'Marathi'}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Fill Information */}
          {currentStep === 3 && selectedIssue && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{getText('fillInformation')}</h2>
              
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{getText('personalInformation')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText('name')} *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={personalInfo.name}
                        onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                        className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => startVoiceInput('name')}
                        disabled={isRecording}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all ${
                          isRecording && activeField === 'name'
                            ? 'bg-red-500 animate-pulse'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } disabled:opacity-50`}
                        title={isRecording && activeField === 'name' ? 'Stop recording' : 'Start voice input'}
                      >
                        {isRecording && activeField === 'name' ? (
                          <MicOff className="w-3 h-3 text-white" />
                        ) : (
                          <Mic className="w-3 h-3 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText('phone')} *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => startVoiceInput('phone')}
                        disabled={isRecording}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all ${
                          isRecording && activeField === 'phone'
                            ? 'bg-red-500 animate-pulse'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } disabled:opacity-50`}
                        title={isRecording && activeField === 'phone' ? 'Stop recording' : 'Start voice input'}
                      >
                        {isRecording && activeField === 'phone' ? (
                          <MicOff className="w-3 h-3 text-white" />
                        ) : (
                          <Mic className="w-3 h-3 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText('address')} *
                    </label>
                    <div className="relative">
                      <textarea
                        value={personalInfo.address}
                        onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => startVoiceInput('address')}
                        disabled={isRecording}
                        className={`absolute right-2 top-2 p-2 rounded-lg transition-all ${
                          isRecording && activeField === 'address'
                            ? 'bg-red-500 animate-pulse'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } disabled:opacity-50`}
                        title={isRecording && activeField === 'address' ? 'Stop recording' : 'Start voice input'}
                      >
                        {isRecording && activeField === 'address' ? (
                          <MicOff className="w-3 h-3 text-white" />
                        ) : (
                          <Mic className="w-3 h-3 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{getText('caseInformation')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedIssue.caseInfoFields.map((field) => (
                    <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label[language]} {field.required && '*'}
                      </label>
                      {field.type === 'textarea' ? (
                        <div className="relative">
                          <textarea
                            value={caseInfo[field.id] || ''}
                            onChange={(e) => handleCaseInfoChange(field.id, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required={field.required}
                          />
                          <button
                            type="button"
                            onClick={() => startVoiceInput(field.id)}
                            disabled={isRecording}
                            className={`absolute right-2 top-2 p-2 rounded-lg transition-all ${
                              isRecording && activeField === field.id
                                ? 'bg-red-500 animate-pulse'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } disabled:opacity-50`}
                            title={isRecording && activeField === field.id ? 'Stop recording' : 'Start voice input'}
                          >
                            {isRecording && activeField === field.id ? (
                              <MicOff className="w-3 h-3 text-white" />
                            ) : (
                              <Mic className="w-3 h-3 text-white" />
                            )}
                          </button>
                        </div>
                      ) : field.type === 'select' ? (
                        <select
                          value={caseInfo[field.id] || ''}
                          onChange={(e) => handleCaseInfoChange(field.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required={field.required}
                        >
                          <option value="">Select...</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="relative">
                          <input
                            type={field.type}
                            value={caseInfo[field.id] || ''}
                            onChange={(e) => handleCaseInfoChange(field.id, e.target.value)}
                            className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required={field.required}
                          />
                          <button
                            type="button"
                            onClick={() => startVoiceInput(field.id)}
                            disabled={isRecording}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all ${
                              isRecording && activeField === field.id
                                ? 'bg-red-500 animate-pulse'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } disabled:opacity-50`}
                            title={isRecording && activeField === field.id ? 'Stop recording' : 'Start voice input'}
                          >
                            {isRecording && activeField === field.id ? (
                              <MicOff className="w-3 h-3 text-white" />
                            ) : (
                              <Mic className="w-3 h-3 text-white" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Document Checklist */}
          {currentStep === 4 && selectedIssue && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{getText('documentChecklist')}</h2>
              <div className="space-y-3">
                {selectedIssue.requiredDocs[language].map((doc, index) => (
                  <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={checkedDocuments.includes(doc)}
                      onChange={() => handleDocumentCheck(doc)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-gray-700">{doc}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && selectedIssue && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{getText('reviewDetails')}</h2>
              <div className="space-y-6">
                {/* Issue Type */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{getText('issueType')}</h3>
                  <p className="text-gray-600">{getIssueNameByLanguage(selectedIssue, language)}</p>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{getText('personalInformation')}</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p><strong>Name:</strong> {personalInfo.name}</p>
                    <p><strong>Phone:</strong> {personalInfo.phone}</p>
                    <p><strong>Address:</strong> {personalInfo.address}</p>
                  </div>
                </div>

                {/* Case Information */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{getText('caseInformation')}</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedIssue.caseInfoFields.map((field) => (
                      <p key={field.id}>
                        <strong>{field.label[language]}:</strong> {caseInfo[field.id] || 'Not provided'}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{getText('requiredDocuments')}</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {checkedDocuments.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {checkedDocuments.map((doc, index) => (
                          <li key={index} className="text-gray-700">{doc}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No documents selected</p>
                    )}
                  </div>
                </div>
              </div>

              {submissionResult?.error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{getText('submissionError')}</p>
                  <p className="text-sm text-red-600">{submissionResult.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{getText('back')}</span>
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{getText('next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !canProceed()}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>{getText('submit')}</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileReportScreen;