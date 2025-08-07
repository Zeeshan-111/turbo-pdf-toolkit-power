
import React from 'react';
import { Shield, Eye, Lock } from 'lucide-react';

const PrivacyNotice: React.FC = () => {
  return (
    <section className="py-8 px-4 bg-gray-900/50 border-t border-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-green-400 mr-2" />
            <h3 className="text-xl font-semibold text-white">Your Privacy Matters</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Eye className="w-8 h-8 text-blue-400 mb-3" />
            <h4 className="text-lg font-medium text-white mb-2">Data Collection</h4>
            <p className="text-gray-400 text-sm">
              We only collect the information you voluntarily provide through our forms. 
              Your personal data is never shared with third parties.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <Lock className="w-8 h-8 text-green-400 mb-3" />
            <h4 className="text-lg font-medium text-white mb-2">Secure Processing</h4>
            <p className="text-gray-400 text-sm">
              All files are processed locally in your browser when possible. 
              We use industry-standard encryption for data transmission.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <Shield className="w-8 h-8 text-purple-400 mb-3" />
            <h4 className="text-lg font-medium text-white mb-2">Data Retention</h4>
            <p className="text-gray-400 text-sm">
              Customer feedback is automatically deleted after 2 years. 
              You can request immediate deletion by contacting us.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            By using our services, you agree to our privacy practices. 
            For questions about your data, please contact our support team.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyNotice;
