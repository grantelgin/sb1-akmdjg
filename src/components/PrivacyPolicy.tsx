import React from 'react';

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <p className="text-gray-600 mb-8">Last Updated: {lastUpdated}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to Restoration Response Network ("we," "us," or "our"). We respect your privacy and are committed to protecting it through our compliance with this policy. This Privacy Policy describes how we collect, use, disclose, and protect your personal information when you use our website, mobile application, or any other platform (collectively, the "Services") that references this Privacy Policy.
              </p>
              <p className="text-gray-700 mt-4">
                By accessing or using our Services, you agree to this Privacy Policy. If you do not agree, please do not use our Services. We reserve the right to make changes to this Privacy Policy at any time. We will notify you of significant changes by posting the updated policy here with a new "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Personal Information Provided by You</h3>
                  <p className="text-gray-700">We collect the following personal information when you sign up or otherwise provide it voluntarily:</p>
                  <ul className="list-disc list-inside text-gray-700 ml-4 mt-2">
                    <li>Name</li>
                    <li>Address</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Google OAuth Data</h3>
                  <p className="text-gray-700">
                    We use Google OAuth for sign-in and account creation. When you choose to sign in with Google, we may receive some of your profile information, such as your email address and name, from Google. The data received from Google is limited to the information you explicitly authorize us to access.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Damage Assessment Information</h3>
                  <p className="text-gray-700">
                    If you choose to request a damage assessment, we will collect the details of your damage report, including any attachments or supplementary information you provide.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Usage Data</h3>
                  <p className="text-gray-700">
                    We may collect certain data automatically as you use our Services, such as your IP address, browser type, device information, and other usage statistics. This information helps us improve our Services and enhance your experience.
                  </p>
                </div>
              </div>
            </section>

            {/* Add remaining sections following the same pattern */}
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
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