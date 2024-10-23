import React, { useState } from 'react';
import { FormData } from '../types';

interface Props {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

const structureMaterials = ['Concrete', 'Steel', 'Wood'];
const wallMaterials = [
  'Architectural Cladding',
  'Brick Veneer',
  'Concrete Panels',
  'EIFS',
  'Fiber Cement Siding',
  'Glass Curtain Walls',
  'Metal Panels',
  'Stone Veneer',
  'Stucco',
  'Tilt-Up Concrete Panels',
  'Vinyl Siding',
  'Wood Siding',
];
const roofMaterials = [
  'Asphalt Shingles',
  'Built-Up Roof',
  'Metal Roof',
  'Modified Bitumen',
  'Single-Ply Membrane',
  'Tile Roof',
  'Vegetated Roof',
];

export default function PropertyAddress({ formData, onComplete }: Props) {
  const [address, setAddress] = useState(formData.address);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data: Partial<FormData> = { address };

    if (formData.propertyType === 'business') {
      data.buildingMaterials = {
        structure: form.structure.value,
        wall: form.wall.value,
        roof: form.roof.value,
      };
    }

    onComplete(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Start typing an address..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {formData.propertyType === 'business' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Structure Material
            </label>
            <select
              name="structure"
              defaultValue=""
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>Select material...</option>
              {structureMaterials.map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wall Material
            </label>
            <select
              name="wall"
              defaultValue=""
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>Select material...</option>
              {wallMaterials.map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roof Material
            </label>
            <select
              name="roof"
              defaultValue=""
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>Select material...</option>
              {roofMaterials.map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
      >
        Continue
      </button>
    </form>
  );
}