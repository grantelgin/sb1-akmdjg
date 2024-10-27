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
  { key: 'systems', label: 'Plumbing/Electrical/\nHVAC Systems' },
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                Category
              </th>
              {damageLevels.map(({ label }) => (
                <th key={label} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {damageCategories.map(({ key, label }) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs">
                  {label}
                </td>
                {damageLevels.map(({ value }) => (
                  <td key={value} className="px-6 py-4 whitespace-nowrap">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={key}
                        value={value}
                        defaultChecked={formData.damageAssessment[key as keyof typeof formData.damageAssessment] === value}
                        className="mr-2"
                        required
                      />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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