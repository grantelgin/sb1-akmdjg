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

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Account Creation and Authentication</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4">
                    <li>To create and manage your account.</li>
                    <li>To authenticate you when you log in, including via Google OAuth.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Damage Assessment and Reporting</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4">
                    <li>To generate a personalized damage assessment report.</li>
                    <li>To communicate with you regarding your damage assessment or any related services.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Sharing with Authorized Contractors</h3>
                  <p className="text-gray-700">
                    If you explicitly authorize or request, we will share your name, address, email, phone number, and damage assessment report with contractors. These contractors may reach out to you to provide estimates or to complete work on your property.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Service Improvement and Analytics</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4">
                    <li>To analyze how you use our Services so we can improve functionality and user experience.</li>
                    <li>To develop new products, services, or features.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Legal Compliance and Protection</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4">
                    <li>To comply with applicable legal requirements, court orders, and government requests.</li>
                    <li>To enforce our Terms of Service and other agreements, or to protect our rights and the safety of others.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Share Your Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Service Providers and Contractors</h3>
                  <p className="text-gray-700">
                    We may share your personal information with selected third-party service providers or contractors to perform functions such as hosting, analytics, and customer support. These third parties have access to personal information only for the purposes of performing their tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Contractors for Damage Repair</h3>
                  <p className="text-gray-700">
                    If you consent, we share your personal information and damage assessment report with contractors who may contact you to provide estimates and/or complete repair work.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Legal Requirements</h3>
                  <p className="text-gray-700">
                    We may disclose your personal information to government agencies or other third parties if required by law, legal process, or if we believe disclosure is necessary to protect our rights or the rights of others.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Business Transactions</h3>
                  <p className="text-gray-700">
                    If we are involved in a merger, acquisition, financing, reorganization, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Storage and Security</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Supabase Storage</h3>
                  <p className="text-gray-700">
                    We use Supabase for database storage and authentication. Your data is encrypted at rest and in transit where possible. We have row-level security (RLS) enabled to ensure only authorized users can access their specific data.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Security Measures</h3>
                  <p className="text-gray-700">
                    We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. These measures include internal reviews of our data collection, storage, and processing practices.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Data Retention</h3>
                  <p className="text-gray-700">
                    We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, unless a longer retention period is required by law.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Account Information</h3>
                  <p className="text-gray-700">
                    You can review, correct, or update your personal information at any time by accessing your account settings in the application or by contacting us directly.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Access and Deletion Requests</h3>
                  <p className="text-gray-700">
                    You have the right to request access to the personal information we hold about you, and to request that we delete it. We will comply with such requests in accordance with applicable laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Consent Withdrawal</h3>
                  <p className="text-gray-700">
                    You can withdraw your consent for us to share your personal information with contractors at any time. Please note that withdrawing consent will not affect the lawfulness of processing based on consent before its withdrawal.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Communications</h3>
                  <p className="text-gray-700">
                    You can opt out of receiving marketing communications by following the unsubscribe link in any email or by contacting us directly. Please note that even if you opt out of marketing messages, we may still send you administrative or account-related messages that are necessary to provide our Services.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700">
                Our Services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we might have any information from or about a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700">
                If you are accessing our Services from outside of the country where our servers are located, your information may be transferred, stored, and processed in a jurisdiction where privacy laws may not be as protective as those in your jurisdiction. By using our Services, you consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Links</h2>
              <p className="text-gray-700">
                Our Services may contain links to third-party websites or services. We have no control over and assume no responsibility for the privacy policies or practices of any third-party sites or services. We encourage you to read the privacy policies of any third-party site you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Updates to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy here with an updated "Last Updated" date. Your continued use of our Services after any changes to this Privacy Policy will signify your acceptance of the updated policy.
              </p>
            </section>

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