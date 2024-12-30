import React from 'react';

export default function TermsOfService() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <p className="text-gray-600 mb-8">Last Updated: {lastUpdated}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                Welcome to RestorationResponse Network ("we," "us," or "our"). By accessing or using our website, mobile application, or any other platform (collectively, the "Services"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to all of these Terms, do not use our Services.
              </p>
              <p className="text-gray-700 mt-4">
                We reserve the right to change these Terms at any time. We will post the most current version of these Terms on our website with the "Last Updated" date. Your continued use of the Services after any such changes are posted will constitute your acceptance of these changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligibility</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Legal Age</h3>
                  <p className="text-gray-700">
                    You must be at least the age of majority in your jurisdiction to use our Services. If you are under the age of 18, you are not permitted to access or use our Services without the direct supervision of a parent or legal guardian.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Compliance with Laws</h3>
                  <p className="text-gray-700">
                    You represent and warrant that you will comply with all applicable local, state, national, and international laws, rules, and regulations in using our Services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Account Registration</h3>
                  <p className="text-gray-700">
                    You may be required to register an account to access certain features of the Services. When you register, you agree to provide accurate and complete information. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Google OAuth and Other Integrations</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">OAuth Authentication</h3>
                  <p className="text-gray-700">
                    We offer account creation and login via Google OAuth. When you choose to authenticate through Google, you grant us access to certain information from your Google account, such as your name and email address. The use and storage of this information are governed by our Privacy Policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Third-Party Services</h3>
                  <p className="text-gray-700">
                    Our Services may integrate with or use third-party services (e.g., Supabase, payment processors). We are not responsible for the practices of third parties, and your interactions with such third parties are governed by their own terms and policies.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct</h2>
              <p className="text-gray-700 mb-4">When using the Services, you agree that you will not:</p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Violate Any Laws or Regulations</h3>
                  <p className="text-gray-700">
                    Use the Services in any way that violates any applicable federal, state, local, or international law or regulation.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Interfere with Other Users</h3>
                  <p className="text-gray-700">
                    Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which may harm us or other users.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Infringe Intellectual Property Rights</h3>
                  <p className="text-gray-700">
                    Post or transmit any content that infringes any patent, trademark, trade secret, copyright, or other proprietary right of any party.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-gray-700">
                <p>Email: support@restorationresponse.net</p>
                <p>Address: Stoneham, MA 02180</p>
                <p>Phone: (888) 691-8188</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 