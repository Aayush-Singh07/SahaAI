import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="bg-navy-blue text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-200">
            © 2025 Goa Police. All rights reserved.
          </div>
          <div className="text-sm text-blue-200">
            An initiative by Goverment of Goa
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;