import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, CheckCircle, Clock, AlertCircle, FileText, BarChart3 } from 'lucide-react';
import type { Language } from '../App';

interface DashboardScreenProps {
  language: Language;
  onBack: () => void;
  complaints: LocalComplaint[];
  onUpdateComplaint: (id: string, updates: Partial<LocalComplaint>) => void;
  onNavigate?: (screen: string) => void;
}

type ComplaintStatus = 'pending' | 'under_action' | 'completed';

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
  status: ComplaintStatus;
  officer_remarks?: string;
  created_at: string;
  updated_at: string;
}

// Mock data for demonstration
export const mockComplaints: LocalComplaint[] = [
  {
    id: '1',
    token_number: '2025/0001',
    issue_type: 'mobile_theft',
    personal_info: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      address: 'Panaji, Goa'
    },
    case_info: {
      phone_brand: 'iPhone 14',
      imei_number: '123456789012345',
      incident_date: '2024-01-15',
      incident_location: 'Miramar Beach'
    },
    documents: ['Purchase invoice', 'SIM details'],
    status: 'pending',
    officer_remarks: '',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    token_number: '2025/0002',
    issue_type: 'cyber_fraud',
    personal_info: {
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      address: 'Margao, Goa'
    },
    case_info: {
      fraud_type: 'UPI Fraud',
      amount_lost: 25000,
      incident_date: '2024-01-14',
      fraud_details: 'Received fake UPI payment request'
    },
    documents: ['Screenshots', 'Bank statement'],
    status: 'under_action',
    officer_remarks: 'Investigation started. Contacted bank for transaction details.',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-16T09:15:00Z'
  },
  {
    id: '3',
    token_number: '2025/0003',
    issue_type: 'house_burglary',
    personal_info: {
      name: 'Amit Desai',
      phone: '+91 76543 21098',
      address: 'Vasco da Gama, Goa'
    },
    case_info: {
      incident_date: '2024-01-13',
      incident_time: '02:30',
      items_stolen: 'Gold jewelry, cash, electronics',
      estimated_value: 150000
    },
    documents: ['CCTV footage', 'Photos of damage'],
    status: 'completed',
    officer_remarks: 'Case solved. Suspects arrested and stolen items recovered.',
    created_at: '2024-01-13T08:45:00Z',
    updated_at: '2024-01-18T16:30:00Z'
  },
  {
    id: '4',
    token_number: '2025/0004',
    issue_type: 'pickpocketing',
    personal_info: {
      name: 'Maria Fernandes',
      phone: '+91 65432 10987',
      address: 'Calangute, Goa'
    },
    case_info: {
      incident_date: '2024-01-16',
      incident_time: '18:45',
      incident_location: 'Calangute Beach',
      items_stolen: 'Wallet with cash and cards'
    },
    documents: ['Witness details'],
    status: 'pending',
    officer_remarks: '',
    created_at: '2024-01-16T19:00:00Z',
    updated_at: '2024-01-16T19:00:00Z'
  },
  {
    id: '5',
    token_number: '2025/0005',
    issue_type: 'lost_found',
    personal_info: {
      name: 'Suresh Naik',
      phone: '+91 54321 09876',
      address: 'Mapusa, Goa'
    },
    case_info: {
      item_type: 'Documents',
      item_description: 'Driving license and Aadhaar card',
      incident_date: '2024-01-17',
      incident_location: 'Mapusa Market'
    },
    documents: ['ID proof'],
    status: 'under_action',
    officer_remarks: 'Checking with local shops and police stations.',
    created_at: '2024-01-17T11:15:00Z',
    updated_at: '2024-01-17T15:20:00Z'
  }
];

const DashboardScreen: React.FC<DashboardScreenProps> = ({ language, onBack, complaints, onUpdateComplaint, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<ComplaintStatus>('pending');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<LocalComplaint | null>(null);
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const getText = (key: string) => {
    const translations = {
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
      searchPlaceholder: {
        english: 'Search by token number or name...',
        hindi: 'टोकन नंबर या नाम से खोजें...',
        marathi: 'टोकन नंबर किंवा नावाने शोधा...'
      },
      tokenNumber: {
        english: 'Token',
        hindi: 'टोकन',
        marathi: 'टोकन'
      },
      complainantName: {
        english: 'Complainant',
        hindi: 'शिकायतकर्ता',
        marathi: 'तक्रारदार'
      },
      issueType: {
        english: 'Issue Type',
        hindi: 'समस्या प्रकार',
        marathi: 'समस्या प्रकार'
      },
      dateSubmitted: {
        english: 'Date Submitted',
        hindi: 'जमा करने की तारीख',
        marathi: 'सबमिट केलेली तारीख'
      },
      noComplaints: {
        english: 'No complaints found',
        hindi: 'कोई शिकायत नहीं मिली',
        marathi: 'कोणत्याही तक्रारी सापडल्या नाहीत'
      },
      complaintDetails: {
        english: 'Complaint Details',
        hindi: 'शिकायत विवरण',
        marathi: 'तक्रार तपशील'
      },
      personalInformation: {
        english: 'Personal Information',
        hindi: 'व्यक्तिगत जानकारी',
        marathi: 'वैयक्तिक माहिती'
      },
      caseInformation: {
        english: 'Case Information',
        hindi: 'मामले की जानकारी',
        marathi: 'प्रकरण माहिती'
      },
      officerRemarks: {
        english: 'Officer Remarks',
        hindi: 'अधिकारी टिप्पणी',
        marathi: 'अधिकारी शेरा'
      },
      moveToUnderAction: {
        english: 'Move to Under Action',
        hindi: 'कार्रवाई में ले जाएं',
        marathi: 'कारवाईत न्या'
      },
      markCompleted: {
        english: 'Mark as Completed',
        hindi: 'पूर्ण के रूप में चिह्नित करें',
        marathi: 'पूर्ण म्हणून चिन्हांकित करा'
      },
      close: {
        english: 'Close',
        hindi: 'बंद करें',
        marathi: 'बंद करा'
      },
      saveRemarks: {
        english: 'Save Remarks',
        hindi: 'टिप्पणी सेव करें',
        marathi: 'शेरा जतन करा'
      },
      viewFeedback: {
        english: 'View Feedback',
        hindi: 'फीडबैक देखें',
        marathi: 'फीडबॅक पहा'
      }
    };
    
    return translations[key as keyof typeof translations]?.[language] || '';
  };

  const updateComplaintStatus = (complaintId: string, newStatus: ComplaintStatus, remarks?: string) => {
    setIsUpdating(true);
    
    // Simulate API delay
    setTimeout(() => {
      const updates: Partial<LocalComplaint> = {
        status: newStatus,
        officer_remarks: remarks || selectedComplaint?.officer_remarks || '',
        updated_at: new Date().toISOString()
      };
      
      onUpdateComplaint(complaintId, updates);
      
      setIsUpdating(false);
      setSelectedComplaint(null);
      setOfficerRemarks('');
      
      const statusText = newStatus === 'under_action' ? 'Under Action' : 'Completed';
      alert(`Complaint moved to ${statusText} successfully!`);
    }, 500);
  };

  const saveRemarksOnly = (complaintId: string, remarks: string) => {
    setIsUpdating(true);
    
    // Simulate API delay
    setTimeout(() => {
      const updates: Partial<LocalComplaint> = {
        officer_remarks: remarks,
        updated_at: new Date().toISOString()
      };
      
      onUpdateComplaint(complaintId, updates);
      
      // Update the selected complaint with new remarks
      if (selectedComplaint) {
        setSelectedComplaint({
          ...selectedComplaint,
          officer_remarks: remarks
        });
      }
      
      setIsUpdating(false);
      alert('Officer remarks saved as draft successfully!');
    }, 300);
  };

  const filteredComplaints = complaints
    .filter(complaint => complaint.status === activeTab)
    .filter(complaint => {
      const searchLower = searchTerm.toLowerCase();
      return (
        complaint.token_number.toLowerCase().includes(searchLower) ||
        complaint.personal_info.name?.toLowerCase().includes(searchLower) ||
        complaint.issue_type.toLowerCase().includes(searchLower)
      );
    });

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'under_action':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-bright-yellow" />;
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_action':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: ComplaintStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'under_action':
        return 'Under Action';
      case 'completed':
        return 'Completed';
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            {(['pending', 'under_action', 'completed'] as ComplaintStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === status
                    ? 'border-b-2 border-bright-yellow text-navy-blue bg-yellow-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {getStatusIcon(status)}
                  <span className="font-bold">{getText(status === 'under_action' ? 'underAction' : status)}</span>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {complaints.filter(c => c.status === status).length}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={getText('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bright-yellow focus:border-transparent"
              />
            </div>
            <button
              onClick={() => onNavigate?.('feedbackStatistics')}
              className="bg-bright-yellow hover:bg-yellow-500 text-navy-blue px-4 py-2 rounded-lg transition-colors font-bold flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{getText('viewFeedback')}</span>
            </button>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bright-yellow mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading complaints...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">{getText('noComplaints')}</p>
              <p className="text-sm text-gray-400">Click on any row to view and manage complaint details</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-navy-blue uppercase tracking-wider">
                      {getText('tokenNumber')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-navy-blue uppercase tracking-wider">
                      {getText('complainantName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-navy-blue uppercase tracking-wider">
                      {getText('issueType')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-navy-blue uppercase tracking-wider">
                      {getText('dateSubmitted')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComplaints.map((complaint) => (
                    <tr 
                      key={complaint.id} 
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setOfficerRemarks(complaint.officer_remarks || '');
                      }}
                      className="hover:bg-yellow-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-navy-blue">
                            #{complaint.token_number}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-navy-blue">{complaint.personal_info.name}</div>
                        <div className="text-sm text-gray-500">{complaint.personal_info.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.issue_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-navy-blue">
                  {getText('complaintDetails')} - #{selectedComplaint.token_number}
                </h2>
                <button
                  onClick={() => {
                    setSelectedComplaint(null);
                    setOfficerRemarks('');
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-navy-blue mb-3">{getText('personalInformation')}</h3>
                  <div className="space-y-2">
                    <p><strong className="text-navy-blue">Name:</strong> {selectedComplaint.personal_info.name}</p>
                    <p><strong className="text-navy-blue">Phone:</strong> {selectedComplaint.personal_info.phone}</p>
                    <p><strong className="text-navy-blue">Address:</strong> {selectedComplaint.personal_info.address}</p>
                  </div>
                </div>

                {/* Case Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-navy-blue mb-3">{getText('caseInformation')}</h3>
                  <div className="space-y-2">
                    <p><strong className="text-navy-blue">Issue Type:</strong> {selectedComplaint.issue_type.replace('_', ' ')}</p>
                    <p><strong className="text-navy-blue">Status:</strong> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(selectedComplaint.status)}`}>
                        {getStatusText(selectedComplaint.status)}
                      </span>
                    </p>
                    <p><strong className="text-navy-blue">Date:</strong> {new Date(selectedComplaint.created_at).toLocaleString()}</p>
                    {Object.entries(selectedComplaint.case_info).map(([key, value]) => (
                      <p key={key}><strong className="text-navy-blue">{key.replace('_', ' ')}:</strong> {String(value)}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Officer Remarks */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-navy-blue">
                    {getText('officerRemarks')}
                  </label>
                  {selectedComplaint.officer_remarks && (
                    <span className="text-xs text-navy-blue bg-yellow-100 px-2 py-1 rounded font-bold">
                      Previously saved
                    </span>
                  )}
                </div>
                <textarea
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bright-yellow focus:border-transparent"
                  placeholder="Add your remarks here... (will be saved as draft)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Your remarks are saved as draft. Use "Save Remarks" to persist them.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => {
                    setSelectedComplaint(null);
                    setOfficerRemarks('');
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  {getText('close')}
                </button>

                <div className="flex space-x-2">
                  {/* Save Remarks Button */}
                  <button
                    onClick={() => saveRemarksOnly(selectedComplaint.id, officerRemarks)}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 font-bold"
                  >
                    {isUpdating ? 'Saving...' : getText('saveRemarks')}
                  </button>

                  {/* Move to Under Action Button */}
                  <button
                    onClick={() => updateComplaintStatus(selectedComplaint.id, 'under_action', officerRemarks)}
                    disabled={isUpdating || selectedComplaint.status === 'completed'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  >
                    {isUpdating ? 'Updating...' : getText('moveToUnderAction')}
                  </button>

                  {/* Mark as Completed Button */}
                  <button
                    onClick={() => updateComplaintStatus(selectedComplaint.id, 'completed', officerRemarks)}
                    disabled={isUpdating || selectedComplaint.status === 'completed'}
                    className="px-4 py-2 bg-bright-yellow hover:bg-yellow-500 text-navy-blue rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  >
                    {isUpdating ? 'Updating...' : getText('markCompleted')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;