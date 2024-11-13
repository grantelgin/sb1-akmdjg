import React, { useState } from 'react';
import { ContractorFormData } from '../types';

interface Props {
  formData: ContractorFormData;
  onComplete: (data: Partial<ContractorFormData>) => void;
}

export default function PropertyTypes({ formData, onComplete }: Props) {
  const [localPropertyTypes, setLocalPropertyTypes] = useState<string[]>(formData.propertyTypes);

  const propertyTypes = [
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'industrial', label: 'Industrial' }
  ];

  const handlePropertyTypeToggle = (type: string) => {
    setLocalPropertyTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localPropertyTypes.length === 0) {
      alert('Please select at least one property type');
      return;
    }
    onComplete({ propertyTypes: localPropertyTypes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-8">
      <div className="flex flex-wrap gap-4">
        {propertyTypes.map(type => (
          <button
            type="button"
            key={type.id}
            onClick={() => handlePropertyTypeToggle(type.id)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors
              ${localPropertyTypes.includes(type.id)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {type.label}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Continue
      </button>
    </form>
  );
}
