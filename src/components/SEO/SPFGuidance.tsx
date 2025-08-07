
import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

const SPFGuidance: React.FC = () => {
  const spfRecord = 'v=spf1 include:_spf.google.com include:mailgun.org include:sendgrid.net ~all';
  
  return (
    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-6 mt-8">
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">
            SPF Record Setup Required
          </h3>
          <p className="text-gray-300 mb-4">
            To improve email deliverability and prevent spoofing, add this SPF record to your domain's DNS:
          </p>
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <code className="text-green-400 text-sm break-all">
              {spfRecord}
            </code>
          </div>
          <div className="text-sm text-gray-400">
            <p className="mb-2">
              <strong>DNS Record Type:</strong> TXT
            </p>
            <p className="mb-2">
              <strong>Name/Host:</strong> @ (or leave blank for root domain)
            </p>
            <p>
              <strong>Value:</strong> The SPF record above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPFGuidance;
