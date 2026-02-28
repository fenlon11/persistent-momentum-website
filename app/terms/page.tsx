import Footer from '@/components/Footer';

export default function TermsOfService() {
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
              Terms of <span className="text-[#3E8BF5]">Service</span>
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
                  These Terms of Service (&quot;Terms&quot;) govern your access to and use of the website, services, and applications provided by Persistent Momentum (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our services, you agree to be bound by these Terms.
                </p>
                <p className="text-slate-300 leading-relaxed mt-4">
                  IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR USE OUR SERVICES.
                </p>
              </div>

              {/* Acceptance of Terms */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">1</span>
                  Acceptance of Terms
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  By accessing or using our website or services, you represent and warrant that:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>You are at least 18 years of age</li>
                  <li>You have the legal capacity to enter into these Terms</li>
                  <li>You will comply with all applicable laws and regulations</li>
                  <li>All information you provide is accurate, current, and complete</li>
                </ul>
              </div>

              {/* Services Description */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">2</span>
                  Description of Services
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  Persistent Momentum provides business automation solutions, including:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Sales automation consulting and implementation</li>
                  <li>Operations automation and workflow optimization</li>
                  <li>Communication and marketing automation services</li>
                  <li>Custom automation solutions tailored to your business needs</li>
                </ul>
                <p className="text-slate-300 leading-relaxed mt-4">
                  We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice.
                </p>
              </div>

              {/* SMS Terms - TCPA Compliant */}
              <div className="mb-12 bg-[#3E8BF5]/5 border border-[#3E8BF5]/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">3</span>
                  SMS Text Messaging Terms
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3">3.1 Program Description</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  By opting in to receive text messages from Persistent Momentum, you agree to receive informational and promotional text messages, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Service updates and notifications</li>
                  <li>Appointment reminders and confirmations</li>
                  <li>Marketing and promotional offers</li>
                  <li>Customer service communications</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Consent to Receive Messages</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  By providing your mobile phone number and checking the consent box:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>You expressly consent to receive automated text messages from us at the mobile number you provided</li>
                  <li>Your consent is not required as a condition of purchasing any goods or services</li>
                  <li>You certify that you are the account holder or have authorization to provide the phone number</li>
                  <li>You acknowledge that you may receive messages sent by an automatic telephone dialing system</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3 Message Frequency</h3>
                <p className="text-slate-300 leading-relaxed">
                  Message frequency varies based on your interactions with us and the services you request. You may receive multiple messages per week, but frequency will depend on your specific needs and activities.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.4 How to Opt Out</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  You may opt out of receiving text messages at any time by:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Texting <strong>STOP</strong>, <strong>END</strong>, <strong>CANCEL</strong>, <strong>UNSUBSCRIBE</strong>, or <strong>QUIT</strong> to any text message</li>
                  <li>Emailing us at info@persistentmomentum.com with your phone number and opt-out request</li>
                  <li>Calling us at (407) 801-2515</li>
                </ul>
                <p className="text-slate-300 leading-relaxed mt-3">
                  After opting out, you will receive a confirmation message, and no further messages will be sent unless you opt back in.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.5 Help and Support</h3>
                <p className="text-slate-300 leading-relaxed">
                  For help with our text messaging program, text <strong>HELP</strong> to any message or contact us at info@persistentmomentum.com or (407) 801-2515.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.6 Message and Data Rates</h3>
                <p className="text-slate-300 leading-relaxed">
                  Message and data rates may apply for any messages sent to you from us and to us from you. The number of messages you receive will vary based on your interactions with us. If you have questions about your text plan or data plan, contact your wireless provider.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.7 Supported Carriers</h3>
                <p className="text-slate-300 leading-relaxed">
                  Our text messaging service is available to users on participating carriers. Supported carriers are not liable for delayed or undelivered messages.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.8 SMS Terms Modification</h3>
                <p className="text-slate-300 leading-relaxed">
                  We reserve the right to modify or terminate our text messaging program at any time without notice. We may send you a text message notifying you of material changes to these SMS Terms.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.9 Privacy</h3>
                <p className="text-slate-300 leading-relaxed">
                  We will not share your phone number with third parties for their marketing purposes without your consent. Please review our <a href="/privacy" className="text-[#3E8BF5] hover:text-[#3E8BF5]/80 transition-colors">Privacy Policy</a> for more information about how we collect, use, and protect your information.
                </p>
              </div>

              {/* User Responsibilities */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">4</span>
                  User Responsibilities and Prohibited Conduct
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  When using our services, you agree not to:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Provide false, inaccurate, or misleading information</li>
                  <li>Use the services for any unlawful purpose or in violation of these Terms</li>
                  <li>Interfere with or disrupt the services or servers</li>
                  <li>Attempt to gain unauthorized access to any portion of the services</li>
                  <li>Use any automated system to access the services without permission</li>
                  <li>Transmit viruses, malware, or other harmful code</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Impersonate any person or entity</li>
                  <li>Collect or store personal data about other users</li>
                </ul>
              </div>

              {/* Intellectual Property */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">5</span>
                  Intellectual Property Rights
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  All content, features, and functionality of our services, including but not limited to text, graphics, logos, images, software, and design, are owned by Persistent Momentum or our licensors and are protected by intellectual property laws.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, republish, download, store, or transmit any of our content without our prior written consent, except as necessary for your authorized use of the services.
                </p>
              </div>

              {/* Disclaimers */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">6</span>
                  Disclaimers
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                  <li>Warranties that the services will be uninterrupted, secure, or error-free</li>
                  <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
                </ul>
                <p className="text-slate-300 leading-relaxed mt-4">
                  We do not warrant that the services will meet your requirements or expectations. Your use of the services is at your sole risk.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">7</span>
                  Limitation of Liability
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, PERSISTENT MOMENTUM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                  <li>Damages resulting from your access to or use of (or inability to access or use) the services</li>
                  <li>Damages resulting from any conduct or content of third parties</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                </ul>
                <p className="text-slate-300 leading-relaxed mt-4">
                  Our total liability for all claims arising out of or relating to these Terms or the services shall not exceed the amount you paid us, if any, during the twelve (12) months prior to the claim, or $100, whichever is greater.
                </p>
              </div>

              {/* Indemnification */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">8</span>
                  Indemnification
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  You agree to indemnify, defend, and hold harmless Persistent Momentum and its officers, directors, employees, contractors, agents, and affiliates from any claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising from:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-3">
                  <li>Your use of or access to the services</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Any content you submit or transmit through the services</li>
                </ul>
              </div>

              {/* Termination */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">9</span>
                  Termination
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  We reserve the right to suspend or terminate your access to the services at any time, with or without cause, and with or without notice, for any reason including if:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>You breach these Terms</li>
                  <li>We are required to do so by law</li>
                  <li>We decide to discontinue providing the services</li>
                </ul>
                <p className="text-slate-300 leading-relaxed mt-4">
                  Upon termination, your right to use the services will immediately cease. Sections of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property provisions, disclaimers, and limitations of liability.
                </p>
              </div>

              {/* Governing Law */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">10</span>
                  Governing Law and Dispute Resolution
                </h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Any disputes arising out of or relating to these Terms or the services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except that either party may seek injunctive or other equitable relief in any court of competent jurisdiction.
                </p>
              </div>

              {/* Changes to Terms */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">11</span>
                  Changes to These Terms
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the &quot;Last Updated&quot; date. Your continued use of the services after changes become effective constitutes your acceptance of the revised Terms.
                </p>
              </div>

              {/* Severability */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">12</span>
                  Severability and Waiver
                </h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.
                </p>
              </div>

              {/* Entire Agreement */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">13</span>
                  Entire Agreement
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  These Terms, together with our Privacy Policy and any other legal notices published by us on the services, constitute the entire agreement between you and Persistent Momentum concerning the services and supersede all prior agreements and understandings.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-0">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3E8BF5]/10 rounded-lg flex items-center justify-center text-[#3E8BF5] text-sm">14</span>
                  Contact Us
                </h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  If you have any questions about these Terms, please contact us:
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
