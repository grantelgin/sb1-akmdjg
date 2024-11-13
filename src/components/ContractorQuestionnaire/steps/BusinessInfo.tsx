import React, { useState } from 'react';
import { ContractorFormData } from '../types';

interface Props {
  formData: ContractorFormData;
  onComplete: (data: Partial<ContractorFormData>) => void;
}

export default function BusinessInfo({ formData, onComplete }: Props) {
  const [localFormData, setLocalFormData] = useState({
    businessName: formData.businessName,
    contactName: formData.contactName,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(localFormData);
  };

  const handleChange = (field: keyof typeof localFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // If address field is being changed, fetch suggestions
    if (field === 'address' && e.target.value.length > 2) {
      getSuggestions(e.target.value);
    } else if (field === 'address') {
      setSuggestions([]);
    }
  };

  const getSuggestions = (query: string) => {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('Mapbox access token is not defined');
      return;
    }
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${accessToken}&autocomplete=true&types=address&limit=5&country=us`)
      .then(response => response.json())
      .then(data => {
        const suggestions = data.features.map((item: any) => item.place_name);
        setSuggestions(suggestions);
      })
      .catch(err => console.error(err));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalFormData(prev => ({
      ...prev,
      address: suggestion
    }));
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={localFormData.businessName}
            onChange={handleChange('businessName')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={localFormData.contactName}
            onChange={handleChange('contactName')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={localFormData.email}
            onChange={handleChange('email')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={localFormData.phone}
            onChange={handleChange('phone')}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Business Address</label>
        <input
          type="text"
          required
          placeholder="Start typing an address..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={localFormData.address}
          onChange={handleChange('address')}
        />
        {suggestions.length > 0 && (
          <ul className="mt-2 border border-gray-300 rounded-md shadow-sm">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
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
