import { FormData } from '../components/Questionnaire/types';
import { render } from '@react-email/render';
import DamageAssessmentEmail from '../emails/DamageAssessmentEmail';
//import twilio from 'twilio';

export class NotificationService {
//   private static readonly twilioClient = twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
//   );

  static async sendEmailNotification(formData: FormData, reportId: string) {
    try {
      const emailHtml = render(
        DamageAssessmentEmail({
          formData,
          reportId,
        })
      );

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.email,
          subject: `Your Storm Damage Assessment Report (${reportId})`,
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email notification');
      }

      return true;
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  }

  static async sendSMSNotification(formData: FormData, reportId: string) {
    try {
    //   const message = await this.twilioClient.messages.create({
    //     body: `Your storm damage assessment report (${reportId}) is ready. View it here: https://yourwebsite.com/report/${reportId}`,
    //     from: process.env.TWILIO_PHONE_NUMBER,
    //     to: formData.phone || '',
    //   });

    //   return message.sid;
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      throw error;
    }
  }

  static async notifyUser(formData: FormData, reportId: string) {
    const notifications = [];

    // Always send email
    notifications.push(this.sendEmailNotification(formData, reportId));

    // Send SMS if phone number is provided
    if (formData.phone) {
      notifications.push(this.sendSMSNotification(formData, reportId));
    }

    return Promise.all(notifications);
  }
}
