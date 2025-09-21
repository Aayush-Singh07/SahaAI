import React from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Shield, Users, FileText, HelpCircle, Clock, Car, Wifi, Search } from 'lucide-react';
import type { Language } from '../App';

interface KnowYourThanaScreenProps {
  language: Language;
  onBack: () => void;
}

const KnowYourThanaScreen: React.FC<KnowYourThanaScreenProps> = ({ language, onBack }) => {
  const getText = (key: string) => {
    const translations = {
      knowYourThana: {
        english: 'Know Your Thana',
        hindi: 'अपना थाना जानें',
        marathi: 'तुमचे ठाणे जाणा'
      },
      panjimPoliceStation: {
        english: 'Panjim Police Station',
        hindi: 'पंजिम पुलिस स्टेशन',
        marathi: 'पणजी पोलीस स्टेशन'
      },
      contactOfficers: {
        english: 'Contact Officers',
        hindi: 'संपर्क अधिकारी',
        marathi: 'संपर्क अधिकारी'
      },
      generalInfo: {
        english: 'General Information',
        hindi: 'सामान्य जानकारी',
        marathi: 'सामान्य माहिती'
      },
      services: {
        english: 'Services',
        hindi: 'सेवाएं',
        marathi: 'सेवा'
      },
      facilities: {
        english: 'Facilities',
        hindi: 'सुविधाएं',
        marathi: 'सुविधा'
      },
      location: {
        english: 'Location',
        hindi: 'स्थान',
        marathi: 'स्थान'
      },
      address: {
        english: 'Address',
        hindi: 'पता',
        marathi: 'पत्ता'
      },
      nearestLandmark: {
        english: 'Nearest Landmark',
        hindi: 'निकटतम स्थल',
        marathi: 'जवळचे ठिकाण'
      },
      jurisdiction: {
        english: 'Jurisdiction',
        hindi: 'क्षेत्राधिकार',
        marathi: 'अधिकारक्षेत्र'
      },
      stationCode: {
        english: 'Station Code',
        hindi: 'स्टेशन कोड',
        marathi: 'स्टेशन कोड'
      },
      helpline: {
        english: '24/7 Helpline',
        hindi: '24/7 हेल्पलाइन',
        marathi: '24/7 हेल्पलाइन'
      }
    };
    
    return translations[key as keyof typeof translations]?.[language] || '';
  };

  const officers = [
    {
      name: 'Rahul Gupta, IPS',
      role: 'Superintendent of Police',
      email: 'rahul.gupta@gov.goa.in',
      phone: '+91 98765 43210',
      image: '/rahulsirips.jpeg'
    },
    {
      name: 'Ramesh Gaonkar',
      role: 'Station House Officer',
      email: 'ramesh.gaonkar@goapolice.gov.in',
      phone: '+91 91234 56789',
      image: '/sho.jpeg'
    }
  ];

  const services = [
    { icon: FileText, text: 'FIR registration (house theft, assault, pickpocketing)' },
    { icon: Users, text: 'Domestic dispute reporting' },
    { icon: Shield, text: 'Police Clearance Certificate (PCC)' },
    { icon: Search, text: 'Verification for tenant/employee/passport' }
  ];

  const facilities = [
    { icon: Users, text: "Women's Help Desk (dedicated support for women-related complaints)" },
    { icon: Car, text: 'Traffic Unit (traffic control and management)' },
    { icon: Wifi, text: 'Cyber Cell coordination (handling cyber complaints)' },
    { icon: Search, text: 'Lost & Found counter (items submission and retrieval)' },
    { icon: HelpCircle, text: 'Public Grievance Redressal (every 2nd Saturday of the month)' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Contact Officers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-green-600" />
            {getText('contactOfficers')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {officers.map((officer, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
  <img 
    src={officer.image} 
    alt={officer.name} 
    className="w-full h-full object-cover" 
  />
</div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{officer.name}</h3>
                    <p className="text-green-600 font-medium mb-3">{officer.role}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm">{officer.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="text-sm">{officer.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* General Information */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-green-600" />
            {getText('generalInfo')}
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{getText('address')}</h4>
                  <p className="text-gray-600">Panjim Police Station, Altinho, Panaji, Goa, 403001</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{getText('nearestLandmark')}</h4>
                  <p className="text-gray-600">Near Altinho View Point / Goa State Museum</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{getText('jurisdiction')}</h4>
                  <p className="text-gray-600">Panaji City limits including Altinho, Patto, Ribandar, Miramar</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{getText('stationCode')}</h4>
                  <p className="text-gray-600">PGS-011</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{getText('helpline')}</h4>
                  <div className="flex items-center text-green-600 font-semibold">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>+91 832 1000 999</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services and Facilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-green-600" />
              {getText('services')}
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-4">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <IconComponent className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{service.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Facilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <HelpCircle className="w-6 h-6 mr-2 text-green-600" />
              {getText('facilities')}
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-4">
                {facilities.map((facility, index) => {
                  const IconComponent = facility.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <IconComponent className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{facility.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Map */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-green-600" />
            {getText('location')}
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-full h-96 rounded-lg overflow-hidden">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3479.26511294524!2d73.82170627512403!3d15.49985668510012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfc089582e5e99%3A0x512083eaa638b8fb!2zRXN0YcOnw6NvIGRlIFBvbMOtY2lhIGRlIFBhbmdpbQ!5e1!3m2!1sen!2sin!4v1758349338341!5m2!1sen!2sin" 
               width="600" 
               height="450" 
               style={{ border: 0 }}
               allowFullScreen={true}
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               title="Panjim Police Station Location"
             />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default KnowYourThanaScreen;