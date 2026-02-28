import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#3E8BF5]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[#3E8BF5]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3E8BF5]/10 border border-[#3E8BF5]/20 backdrop-blur-sm mb-6">
              <span className="text-sm text-[#3E8BF5] font-medium">Legal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Privacy <span className="text-[#3E8BF5]">Policy</span>
            </h1>
            <p className="text-slate-400">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative pb-32">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 sm:p-12">
            <div className="prose prose-invert prose-slate max-w-none">
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-slate-300 leading-relaxed">
                  Persistent Momentum (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us through various channels.
                </p>
                <p className="text-slate-300 leading-relaxed mt-4">
                  Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">1</span>
                  Information We Collect
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">1.1 Personal Information</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Name and contact information (email address, phone number, mailing address)</li>
                  <li>Company name and business information</li>
                  <li>Communication preferences</li>
                  <li>Any other information you choose to provide in forms or communications</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">1.2 Automatically Collected Information</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  When you access our website or services, we may automatically collect:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages viewed, links clicked, time spent on pages)</li>
                  <li>Location information (general geographic location based on IP address)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">1.3 Third-Party Information</h3>
                <p className="text-slate-300 leading-relaxed">
                  We may receive information about you from third-party platforms and services when you connect your accounts or interact with us through social media platforms. This may include your public profile information, email address, and other data you have made available through those platforms.
                </p>
              </div>

              {/* How We Use Your Information */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">2</span>
                  How We Use Your Information
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>To provide, maintain, and improve our services</li>
                  <li>To respond to your inquiries and communicate with you</li>
                  <li>To send you marketing communications (with your consent where required)</li>
                  <li>To send you text messages (SMS) if you have opted in to receive them</li>
                  <li>To personalize your experience and deliver relevant content</li>
                  <li>To analyze usage patterns and optimize our website</li>
                  <li>To detect, prevent, and address technical issues or fraudulent activity</li>
                  <li>To comply with legal obligations and enforce our terms</li>
                </ul>
              </div>

              {/* SMS/Text Messaging */}
              <div className="mb-12 bg-[#3E8BF5]/5 border border-[#3E8BF5]/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">3</span>
                  SMS and Text Messaging
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3">3.1 Consent</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  By providing your phone number and checking the SMS consent box on our forms, you expressly consent to receive text messages from Persistent Momentum at the phone number you provided. Your consent is not a condition of purchasing any goods or services.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Message Frequency</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  Message frequency varies depending on your interactions with us and the services you request. You may receive appointment confirmations, service updates, promotional messages, and other communications related to our services.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3 Opt-Out</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  You can opt out of receiving text messages at any time by:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Replying <strong>STOP</strong> to any text message you receive from us</li>
                  <li>Contacting us at info@persistentmomentum.com</li>
                  <li>Calling us at (407) 801-2515</li>
                </ul>
                <p className="text-slate-300 leading-relaxed mt-3">
                  After you opt out, you will receive one final confirmation message. You may continue to receive messages briefly while your request is being processed.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.4 Message and Data Rates</h3>
                <p className="text-slate-300 leading-relaxed">
                  Message and data rates may apply based on your mobile carrier&apos;s plan. Please contact your wireless provider for information about your messaging plan and rates. We are not responsible for any charges incurred from your mobile carrier.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.5 Support</h3>
                <p className="text-slate-300 leading-relaxed">
                  For support or questions about our text messaging program, reply <strong>HELP</strong> to any message or contact us at info@persistentmomentum.com.
                </p>
              </div>

              {/* Information Sharing */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">4</span>
                  How We Share Your Information
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  We may share your information in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.1 Service Providers</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  We may share your information with third-party service providers who perform services on our behalf, including:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Email and communication services</li>
                  <li>SMS/text messaging platforms</li>
                  <li>Analytics and website optimization services</li>
                  <li>Customer relationship management (CRM) systems</li>
                  <li>Payment processing services</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 Business Transfers</h3>
                <p className="text-slate-300 leading-relaxed">
                  If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of our assets, your information may be transferred as part of that transaction.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 Legal Requirements</h3>
                <p className="text-slate-300 leading-relaxed">
                  We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court orders, subpoenas, government investigations).
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.4 With Your Consent</h3>
                <p className="text-slate-300 leading-relaxed">
                  We may share your information with third parties when you have given us explicit consent to do so.
                </p>
              </div>

              {/* Your Rights and Choices */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">5</span>
                  Your Rights and Choices
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  You have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li><strong>Access:</strong> You can request access to the personal information we hold about you</li>
                  <li><strong>Correction:</strong> You can request that we correct inaccurate information</li>
                  <li><strong>Deletion:</strong> You can request that we delete your personal information</li>
                  <li><strong>Opt-Out:</strong> You can opt out of marketing communications and text messages</li>
                  <li><strong>Data Portability:</strong> You can request a copy of your data in a structured format</li>
                  <li><strong>Restriction:</strong> You can request that we restrict the processing of your data</li>
                </ul>
                <p className="text-slate-300 leading-relaxed mt-4">
                  To exercise any of these rights, please contact us at info@persistentmomentum.com or call (407) 801-2515.
                </p>
              </div>

              {/* Cookies and Tracking */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">6</span>
                  Cookies and Tracking Technologies
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  We may use both session cookies (which expire when you close your browser) and persistent cookies (which stay on your device until deleted) for analytics, personalization, and advertising purposes.
                </p>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">7</span>
                  Data Security
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              {/* Data Retention */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">8</span>
                  Data Retention
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">9</span>
                  Children&apos;s Privacy
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information from our systems.
                </p>
              </div>

              {/* Third-Party Links */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">10</span>
                  Third-Party Websites and Services
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  Our website may contain links to third-party websites or services that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policy of every site you visit.
                </p>
              </div>

              {/* International Users */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">11</span>
                  International Data Transfers
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ. By providing your information, you consent to the transfer of your information to the United States and other jurisdictions.
                </p>
              </div>

              {/* Changes to Policy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">12</span>
                  Changes to This Privacy Policy
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-0">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">13</span>
                  Contact Us
                </h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <p className="text-white font-semibold mb-2">Persistent Momentum</p>
                  <p className="text-slate-300">Email: <a href="mailto:info@persistentmomentum.com" className="text-[#3E8BF5] hover:text-[#3E8BF5]/80 transition-colors">info@persistentmomentum.com</a></p>
                  <p className="text-slate-300">Phone: <a href="tel:+14078012515" className="text-[#3E8BF5] hover:text-[#3E8BF5]/80 transition-colors">(407) 801-2515</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
