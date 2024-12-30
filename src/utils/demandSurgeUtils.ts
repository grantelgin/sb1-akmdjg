import { TigerDataService } from '../services/TigerDataService';

export interface DemandSurgeEstimate {
  level: 'Low' | 'Medium' | 'High';
  buildingCounts: {
    singleFamily: number;
    multiFamily: number;
    commercial: number;
    industrial: number;
    total: number;
  };
  description: string;
}

export async function estimateDemandSurge(lat: number, lon: number): Promise<DemandSurgeEstimate> {
  // Use default counts for now
  const counts = {
    singleFamily: 100,
    multiFamily: 25,
    commercial: 15,
    industrial: 5
  };
  
  const total = counts.singleFamily + counts.multiFamily + counts.commercial + counts.industrial;

  // Calculate residential units (assuming average of 4 units per multi-family building)
  const residentialUnits = counts.singleFamily + (counts.multiFamily * 4);
  
  // Determine demand level based on total potential impact
  let level: 'Low' | 'Medium' | 'High';
  let description: string;

  if (total < 1000) {
    level = 'Low';
    description = 'Local contractors should be able to handle repair demand. Expect normal material availability and permit processing times.';
  } else if (total < 5000) {
    level = 'Medium';
    description = 'Moderate competition for contractors and materials. Consider booking contractors early and expect slightly longer permit processing times.';
  } else {
    level = 'High';
    description = 'High demand for contractors and materials likely. Extended wait times for repairs possible. Consider temporary repairs while securing long-term contractors.';
  }

  return {
    level,
    buildingCounts: {
      ...counts,
      total
    },
    description
  };
} 