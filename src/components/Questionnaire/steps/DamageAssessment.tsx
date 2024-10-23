import React from 'react';
import { FormData, DamageLevel } from '../types';

interface Props {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

const damageCategories = [
  { key: 'roof', label: 'Roof' },
  { key: 'exteriorWalls', label: 'Exterior Walls' },
  { key: 'windows', label: 'Windows' },
  { key: 'doors', label: 'Doors' },
  { key: 'interior', label: 'Interior' },
  { key: 'chimney', label: 'Chimney' },
  { key: 'systems', label: 'Plumbing/Electrical/HVAC Systems' },
  { key: 'landscaping', label: 'Landscaping/Trees' },
  { key: 'other', label: 'Other' },
] as const;

const damageLevels: { value: DamageLevel; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'minor', label: 'Minor Damage' },
  { value: 'moderate', label: 'Moderate Damage' },
  { value: 'severe', label: 'Severe Damage' },
];

export default function DamageAssessment({ formData, onComplete }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const damageAssessment = damageCategories.reduce((acc, { key }) => ({
      ...acc,
      [key]: form[key].value as DamageLevel,
    }), {} as Record<string, DamageLevel>);

    onComplete({ damageAssessment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {damageCategories.map(({ key, label }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {label}
          </label>
          <div className="grid grid-cols-2 gap-4">
            {damageLevels.map(({ value, label }) => (
              <label key={value} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name={key}
                  value={value}
                  defaultChecked={formData.damageAssessment[key as keyof typeof formData.damageAssessment] === value}
                  className="mr-2"
                  required
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
      >
        Continue
      </button>
    </form>
  );
}