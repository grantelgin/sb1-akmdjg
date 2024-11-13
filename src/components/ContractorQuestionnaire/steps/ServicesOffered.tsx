import React, { useState } from 'react';
import { ContractorFormData, serviceOptions } from '../types';

interface Props {
  formData: ContractorFormData;
  onComplete: (data: Partial<ContractorFormData>) => void;
}

export default function ServicesOffered({ formData, onComplete }: Props) {
  const [localServices, setLocalServices] = useState(formData.services);

  const handleServiceToggle = (category: keyof typeof serviceOptions, service: string) => {
    setLocalServices(prev => ({
      ...prev,
      [category]: prev[category].includes(service)
        ? prev[category].filter(s => s !== service)
        : [...prev[category], service]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasServices = Object.values(localServices).some(category => category.length > 0);
    if (!hasServices) {
      alert('Please select at least one service');
      return;
    }
    
    onComplete({ services: localServices });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-16rem)]">
      <div className="flex-1 overflow-y-auto pb-4 space-y-6 pt-8">
        {Object.entries(serviceOptions).map(([category, options]) => (
          <div key={category} className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <div className="flex flex-wrap gap-3">
              {options.map(service => (
                <button
                  type="button"
                  key={service}
                  onClick={() => handleServiceToggle(category as keyof typeof serviceOptions, service)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${localServices[category as keyof typeof serviceOptions].includes(service)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t bg-white">
        <div className="flex items-center justify-between space-x-4">
          <p className="text-sm text-gray-600">
            Select all services that your business provides for storm damage repair
          </p>
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </form>
  );
}
