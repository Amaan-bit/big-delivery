import React from "react";
import Image from "next/image";

const Invoice = () => {
  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8" id="invoice">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Image src="/images/logo.png" alt="Logo" width={150} height={50} />
            <p className="text-gray-600 mt-2 text-sm mt-10">517 Main St, Malden, MA 02148, United States</p>
            <p className="text-gray-600 text-sm flex items-center">
              contact@big.delivery
            </p>
            <p className="text-gray-600 text-sm flex items-center">
              +1 781-322-0270
            </p>
          </div>
          <div className="text-right">
            <h4 className="text-lg font-semibold">Invoice #123456 <span className="ml-2 text-xs text-white bg-green-500 px-2 py-1 rounded">Paid</span></h4>
          </div>
        </div>

        <hr className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-gray-700 text-lg font-medium mb-2">Billed To:</h5>
            <p className="text-gray-800 font-semibold">John Doe</p>
            <p className="text-gray-600 text-sm">1234 Sample St, City, State, Country, 12345</p>
            <p className="text-gray-600 text-sm flex items-center">
              john@example.com
            </p>
            <p className="text-gray-600 text-sm flex items-center">
              +1 999-999-9999
            </p>
          </div>

          <div className="text-right">
            <div>
              <h5 className="text-sm text-gray-600">Invoice No:</h5>
              <p className="text-gray-800">#123456</p>
            </div>
            <div className="mt-4">
              <h5 className="text-sm text-gray-600">Invoice Date:</h5>
              <p className="text-gray-800">Aug 07, 2025</p>
            </div>
            <div className="mt-4">
              <h5 className="text-sm text-gray-600">Order No:</h5>
              <p className="text-gray-800">#987654</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h5 className="text-lg font-medium text-gray-700 mb-4">Order Summary</h5>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="text-gray-700 bg-gray-100">
                <tr>
                  <th className="px-4 py-2">No.</th>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2].map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">
                      <p className="font-medium text-gray-800">Product Name</p>
                      <p className="text-xs text-gray-500">Variant Name</p>
                    </td>
                    <td className="px-4 py-2">$10.00</td>
                    <td className="px-4 py-2">2</td>
                    <td className="px-4 py-2 text-right">$20.00</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right font-medium">Sub Total</td>
                  <td className="px-4 py-2 text-right">$40.00</td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right">Discount</td>
                  <td className="px-4 py-2 text-right">- $5.00</td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right">Delivery Charges</td>
                  <td className="px-4 py-2 text-right">$3.00</td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right">Tax</td>
                  <td className="px-4 py-2 text-right">$1.50</td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right font-semibold text-gray-900">Total</td>
                  <td className="px-4 py-2 text-right font-semibold text-gray-900">$39.50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            <i className="fas fa-print mr-1"></i> Print
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            <i className="fas fa-file-pdf mr-1"></i> PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
