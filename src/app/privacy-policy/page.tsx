import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10 text-gray-800 leading-relaxed">
        <h2 className="text-2xl font-bold mb-2">Privacy Policy</h2>
        <p className="text-sm text-gray-500 mb-6">Last Modified: Jan 01, 2025</p>

        <p className="mb-4">
          Big Delivery (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy outlines the types of information we may collect from you or that you may provide when you access or use our website,{" "}
          <Link href="https://app.big.delivery" className="text-blue-600 underline" target="_blank">www.big.delivery</Link>{" "}
          (the &ldquo;Website&rdquo;), and/or our mobile application (the &ldquo;App&rdquo;), collectively referred to as the &ldquo;Services.&rdquo; This policy describes our practices for collecting, using, maintaining, protecting, and disclosing your information.
        </p>

        <p className="mb-4">
          By using our Services, you agree to the collection and use of your information in accordance with this Privacy Policy. If you do not agree with this Privacy Policy, please do not use our Services.
        </p>

        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the &ldquo;Last Modified&rdquo; date will be updated accordingly. Please review this Privacy Policy periodically for any updates.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-2">Children Under 18</h3>
        <p className="mb-4">
          Our Services are not intended for children under 18, and we do not knowingly collect personal information from children under 18. If we learn that we have collected personal information from a child under 18, we will delete that information. If you believe we may have collected information from a child under 18, please contact us at{" "}
          <Link href="mailto:contact@big.delivery" className="text-blue-600 underline">contact@big.delivery</Link>.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-2">Information We Collect and How We Collect It</h3>
        <p className="mb-4">When you use our Services, we may ask you to provide information including but not limited to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Personal information: name, age, gender, postal address, delivery address, email address, telephone number, mobile number, payment information, and other details necessary for transaction processing and delivery.</li>
          <li>Account-related information: registration details, payment methods, and preferences.</li>
          <li>Order details: product orders, purchase frequency, and other relevant statistics.</li>
        </ul>

        <p className="mb-4">When you use our Services, we automatically collect certain information, including:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Device and Usage Information:</strong> We may collect details about the devices you use to access our Services, including device identifiers, IP address, operating system, browser type, and mobile network information.
          </li>
          <li>
            <strong>Location Information:</strong> We may collect real-time location data to provide location-based services such as recommending nearby delivery options or stores. You can choose not to share location data by adjusting your device settings.
          </li>
        </ul>

        <p className="mb-4">
          We use technologies such as cookies, web beacons, and session tracking to collect usage information and improve our services. You can configure your browser to block cookies, but this may affect your experience on our Website or App.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-2">How We Use Your Information</h3>
        <p className="mb-4">We use the information we collect in the following ways:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>To provide, manage, and improve our Services, including fulfilling your orders.</li>
          <li>To communicate with you, including sending order confirmations, promotional offers, and customer support updates.</li>
          <li>To customize and personalize your experience based on your preferences.</li>
          <li>To detect and prevent fraudulent activity and improve security.</li>
          <li>To notify you of updates to our Services and new offerings.</li>
          <li>To conduct analytics to improve the performance of our Website and App.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-2">Information Sharing</h3>
        <p className="mb-4">We may share your information in the following circumstances:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Service Providers:</strong> We may share your information with trusted third-party vendors who assist in operating our business, such as delivery services, payment processors, or customer support providers.</li>
          <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or if we believe disclosure is necessary to protect our rights, property, or the safety of others.</li>
          <li><strong>Business Transactions:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
        </ul>
        <p className="mb-4">We do not sell your personal information to third parties.</p>

        <h3 className="text-xl font-semibold mt-8 mb-2">Third-Party Information Collection</h3>
        <p className="mb-4">
          Our Services may contain links to third-party websites or services. These third parties may collect information about you when you interact with their content. We do not control the privacy practices of these third parties, and we encourage you to review their privacy policies.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-2">Your Choices</h3>
        <p className="mb-4">
          <strong>Cookies and Tracking Technologies:</strong> You can configure your browser settings to refuse cookies or alert you when cookies are being sent. However, disabling cookies may limit your ability to access certain features of our Services.
        </p>
        <p className="mb-4">
          <strong>Opt-Out of Marketing:</strong> If you no longer wish to receive promotional communications from us, you can opt out by following the unsubscribe instructions in the emails we send or by contacting us directly.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-2">Accessing and Correcting Your Information</h3>
        <p className="mb-4">
          You have the right to access, update, or delete your personal information. You can review and edit your information by logging into your account or by contacting us at{" "}
          <Link href="mailto:contact@big.delivery" className="text-blue-600 underline">contact@big.delivery</Link>. We may retain certain information as necessary for legal or operational purposes.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-2">Data Security</h3>
        <p className="mb-4">
          We take reasonable measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or mobile platforms is entirely secure, and we cannot guarantee absolute security.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-2">California Privacy Rights</h3>
        <p className="mb-4">
          California residents have the right to request information regarding our disclosure of personal information to third parties for direct marketing purposes. If you are a California resident and would like to make such a request, please contact us at{" "}
          <Link href="mailto:contact@big.delivery" className="text-blue-600 underline">contact@big.delivery</Link>.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-2">Changes to This Privacy Policy</h3>
        <p className="mb-4">
          We may update this Privacy Policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any changes will be posted on this page with the updated &ldquo;Last Modified&rdquo; date.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-2">Contact Us</h3>
        <p className="mb-2">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
        <address className="not-italic mb-8">
          Big Delivery<br />
          Email: <Link href="mailto:contact@big.delivery" className="text-blue-600 underline">contact@big.delivery</Link><br />
          Website: <Link href="https://www.big.delivery" className="text-blue-600 underline">www.big.delivery</Link>
        </address>

        <h2 className="text-2xl font-bold mb-2">CCPA Privacy Policy</h2>
        <p className="mb-4">
          Rakuten Advertising may collect personal information when you interact with our digital property, including IP addresses, digital identifiers, information about your web browsing and app usage, and how you interact with our properties and ads for a variety of purposes, such as personalization of offers or advertisements, analytics about how you engage with websites or ads, and other commercial purposes. For more information about the collection, use, and sale of your personal data and your rights, please use the below links.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="https://rakutenadvertising.com/legal-notices/services-privacy-policy/" className="text-blue-600 underline" target="_blank">
              Privacy policy
            </Link>
          </li>
          <li>
            <Link href="https://rakutenadvertising.com/legal-notices/services-privacy-rights-request-form/" className="text-blue-600 underline" target="_blank">
              Your rights
            </Link>
          </li>
        </ul>
      </main>

      <Footer />
    </div>
  );
}
