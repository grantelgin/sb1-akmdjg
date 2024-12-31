import React, { useState } from 'react';
import { FormData, PropertyType } from '../types';

interface Props {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

export default function PersonalInfo({ formData, onComplete }: Props) {
  const [smsConsent, setSmsConsent] = useState(formData.smsConsent);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format the number as (XXX) XXX-XXXX
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    e.target.value = formattedNumber;
    
    // Auto-check SMS consent when user starts entering phone number
    if (formattedNumber.length > 0 && !smsConsent) {
      setSmsConsent(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    onComplete({
      propertyType: form.propertyType.value as PropertyType,
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      phoneNumber: form.phoneNumber.value,
      smsConsent: form.smsConsent.checked,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Is this for your business or home?
        </label>
        <div className="flex space-x-4">
          {['home', 'business'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="propertyType"
                value={type}
                defaultChecked={formData.propertyType === type}
                className="mr-2"
                required
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            defaultValue={formData.firstName}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            defaultValue={formData.lastName}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          defaultValue={formData.email}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          defaultValue={formData.phoneNumber}
          onChange={handlePhoneChange}
          placeholder="(555) 555-5555"
          maxLength={14}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          name="smsConsent"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
          className="mt-1 mr-2"
        />
        <label className="text-sm text-gray-600">
          I agree to receive SMS text messages regarding my project status. Message and data rates may apply. Reply STOP to unsubscribe.
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