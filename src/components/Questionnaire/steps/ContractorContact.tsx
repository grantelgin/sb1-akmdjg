import React from 'react';
import { Shield, MessageCircle, Phone } from 'lucide-react';
import { FormData } from '../types';

interface Props {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

export default function ContractorContact({ formData, onComplete }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    onComplete({
      contactConsent: form.contactConsent.checked,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
          <Shield className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900">Free for homeowners</h3>
            <p className="text-sm text-blue-700">
              Get connected with verified contractors at no cost to you.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
          <MessageCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-green-900">Support at every step</h3>
            <p className="text-sm text-green-700">
              Our team is available via chat and social media to help you through the process.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
          <Phone className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-yellow-900">Protection from scammers</h3>
            <p className="text-sm text-yellow-700">
              All RRN contractors are thoroughly verified and monitored for quality.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="contactConsent"
            defaultChecked={true}
            className="mt-1"
            required
          />
          <span className="text-sm text-gray-700">
            Yes, I would like to be contacted by RRN contractors about my damage repair needs.
            I understand that I may receive calls or messages and can opt out at any time.
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
      >
        Continue
      </button>
    </form>
  );
}