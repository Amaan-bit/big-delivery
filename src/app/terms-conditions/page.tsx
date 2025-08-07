import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10 text-gray-800">
        <h2 className="text-3xl font-bold mb-2">Terms of Use</h2>
        <p className="text-sm text-gray-500 mb-8">Last Modified: Jan 06, 2025</p>

        {/* Section: Acceptance */}
        <h1 className="text-2xl font-semibold mt-10 mb-4">Acceptance of the Terms of Use</h1>
        <p className="mb-4">
          These terms of use are entered into by and between You and big.delivery...
          {/* Truncated here for brevity */}
        </p>

        {/* Repeat similar structure for each section... */}
        <h1 className="text-2xl font-semibold mt-10 mb-4">Changes to the Terms of Use</h1>
        <p className="mb-4">We reserve the right to modify and update these Terms of Use...</p>

        <h1 className="text-2xl font-semibold mt-10 mb-4">Accessing the Services and Account Security</h1>
        <p className="mb-4">We may modify, suspend, or discontinue any part of the Website...</p>

        {/* Example of List Section */}
        <h1 className="text-2xl font-semibold mt-10 mb-4">Replacement Policy</h1>
        <p className="mb-2">A replacement can be requested if you are dissatisfied with an item for any of the following reasons:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Damaged during shipping</li>
          <li>Defective item</li>
          <li>Missing item(s)</li>
          <li>Lack of freshness</li>
          <li>Unsatisfactory quality</li>
          <li>Incorrect item shipped</li>
        </ul>

        {/* Add remaining sections similarly with Tailwind */}
        <h1 className="text-2xl font-semibold mt-10 mb-4">Shipping Policy</h1>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <strong>Delivery Areas:</strong> big.delivery is committed to delivering products nationwide...
          </li>
          <li>
            <strong>Delivery Time:</strong> We aim for prompt delivery...
          </li>
          <li>
            <strong>Delivery Charges:</strong> To offer free delivery, we set a minimum order of $50...
          </li>
          {/* Continue other points... */}
        </ul>

        {/* Contact Section */}
        <h2 className="text-xl font-semibold mt-10 mb-4">Your Comments and Concerns</h2>
        <p className="mb-2">The Services are operated by big.delivery.</p>
        <p className="mb-2">
          For copyright infringement claims, contact{" "}
          <a href="mailto:contact@big.delivery" className="text-blue-600 underline">contact@big.delivery</a>
        </p>
        <p className="mb-2">
          For technical support or feedback, reach us at{" "}
          <a href="mailto:support@big.delivery" className="text-blue-600 underline">support@big.delivery</a>
        </p>
      </main>
      <Footer />
    </div>
  );
}
