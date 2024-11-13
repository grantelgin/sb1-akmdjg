import React, { useState } from 'react';
import { Send, Mail, MessageSquare, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { NotificationService } from '../services/NotificationService';
import { FormData } from '../components/Questionnaire/types';

export default function NotificationsTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleTestNotifications = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create test form data
      const testData: FormData = {
        propertyType: 'home',
        firstName: 'Test',
        lastName: 'User',
        email: email,
        phone: phone, // Add this to your FormData type if not already present
        address: '123 Test St, Test City, TS 12345',
        damageDate: new Date().toISOString(),
        damageAssessment: {
          roof: 'moderate',
          exteriorWalls: 'minor',
          windows: 'none',
          doors: 'none',
          interior: 'minor',
          chimney: 'none',
          systems: 'none',
          landscaping: 'moderate',
          other: 'none',
        },
        contactConsent: true,
        insuranceClaim: false,
        images: [],
        receipts: []
      };

      const testReportId = `TEST-${Date.now()}`;
      await NotificationService.notifyUser(testData, testReportId);
      setSuccess('Test notifications sent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Test Notifications
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Send test email and SMS notifications
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="test@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number (optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1234567890"
              />
            </div>

            {/* Status Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleTestNotifications}
                disabled={loading || !email}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Notifications
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="px-6 py-4 bg-gray-50 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>Email notification will be sent to the provided email</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MessageSquare className="w-4 h-4" />
              <span>SMS will be sent if phone number is provided</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
