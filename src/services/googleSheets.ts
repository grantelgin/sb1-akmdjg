import { GoogleSpreadsheet } from 'google-spreadsheet';
import { FormData } from '../components/Questionnaire/types';

// These should be in your environment variables
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

export async function saveFormDataToSheet(formData: FormData) {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SHEETS_CLIENT_EMAIL!,
      private_key: GOOGLE_SHEETS_PRIVATE_KEY!,
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const row = {
      timestamp: new Date().toISOString(),
      propertyType: formData.propertyType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      address: formData.address,
      damageDate: formData.damageDate,
      roofDamage: formData.damageAssessment.roof,
      exteriorWallsDamage: formData.damageAssessment.exteriorWalls,
      windowsDamage: formData.damageAssessment.windows,
      doorsDamage: formData.damageAssessment.doors,
      interiorDamage: formData.damageAssessment.interior,
      chimneyDamage: formData.damageAssessment.chimney,
      systemsDamage: formData.damageAssessment.systems,
      landscapingDamage: formData.damageAssessment.landscaping,
      otherDamage: formData.damageAssessment.other,
      insuranceClaim: formData.insuranceClaim ? 'Yes' : 'No',
      imagesCount: formData.images.length,
      receiptsCount: formData.receipts.length,
      contactConsent: formData.contactConsent ? 'Yes' : 'No',
    };

    await sheet.addRow(row);
    return true;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw error;
  }
} 