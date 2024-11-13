import { createClient } from '@supabase/supabase-js';
import { ContractorFormData } from '../components/ContractorQuestionnaire/types';
import { generateReportId } from './reportUtils';
import { getCoordinatesFromAddress } from './reportUtils';

import { supabase } from './supabase';
  
export async function storeContractorData(formData: ContractorFormData) {
  try {
    // Generate unique contractor ID
    const contractorId = generateReportId();

    // Get coordinates from address for future geo-queries
    const coordinates = await getCoordinatesFromAddress(formData.address);

    const contractorData = {
      contractor_id: contractorId,
      business_name: formData.businessName,
      contact_name: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      coordinates: coordinates,
      services: formData.services,
      property_types: formData.propertyTypes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      verified: false
    };

    const { data, error } = await supabase
      .from('contractors')
      .insert([contractorData]);

    if (error) throw error;

    return { contractorId, data };
  } catch (error) {
    console.error('Error storing contractor data:', error);
    throw error;
  }
}
