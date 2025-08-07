"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";

export default function Checkout() {
  const [addressOpen, setAddressOpen] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto p-6 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column */}
        <section className="lg:col-span-7 bg-white shadow-lg rounded-lg p-8">
          {/* Choose Address Accordion */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <button
              onClick={() => setAddressOpen(!addressOpen)}
              className="flex justify-between items-center w-full text-left text-2xl font-semibold mb-4 text-gray-900 focus:outline-none"
              aria-expanded={addressOpen}
            >
              Choose Address
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${
                  addressOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ${
                addressOpen ? "max-h-[1000px]" : "max-h-0"
              }`}
            >
              <div className="space-y-6">
                <button className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-700 transition">
                  <i className="fa fa-plus" />
                  Add New Address
                </button>

                {/* Address Options */}
                {[
                  {
                    name: "Amaan Ansari",
                    address: "2 floor, Street Road, USA, FL, us, 32003",
                    checked: true,
                  },
                  {
                    name: "Amaan Ansari",
                    address: "99 florance st, Malden, MA, us, 02148",
                    checked: false,
                  },
                ].map(({ name, address, checked }, i) => (
                  <label
                    key={i}
                    className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition 
                      ${checked ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      defaultChecked={checked}
                      className="mt-1 cursor-pointer accent-blue-600"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-gray-700 text-sm leading-snug">{address}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Make Payment Accordion */}
          <div>
            <button
              onClick={() => setPaymentOpen(!paymentOpen)}
              className="flex justify-between items-center w-full text-left text-2xl font-semibold mb-6 text-gray-900 focus:outline-none"
              aria-expanded={paymentOpen}
            >
              Make Payment
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${
                  paymentOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ${
                paymentOpen ? "max-h-[2000px]" : "max-h-0"
              }`}
            >
              <div className="space-y-6">
                <div className="flex flex-wrap gap-5">
                  {[
                    { label: "Wallet $183.61", tooltip: false },
                    { label: "Rewards $1.52", tooltip: true },
                  ].map(({ label, tooltip }, i) => (
                    <label
                      key={i}
                      className="inline-flex items-center cursor-pointer relative"
                    >
                      <input type="checkbox" className="hidden peer" />
                      <span className="px-4 py-1 border rounded-full text-sm text-gray-700 peer-checked:bg-blue-600 peer-checked:text-white transition">
                        {label}
                      </span>
                      {tooltip && (
                        <span className="ml-2 text-xs text-gray-500 cursor-help group relative">
                          !
                          <span className="absolute left-1/2 -translate-x-1/2 -top-6 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            How Rewards Work?
                          </span>
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                {/* Card Form */}
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Card Holder Name</label>
                    <input
                      type="text"
                      className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Name on Card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      type="password"
                      className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="1111 1111 1111 1111"
                      maxLength={19}
                      inputMode="numeric"
                    />
                  </div>
                  <div className="flex gap-5">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Expiry Month</label>
                      <select
                        className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((month, idx) => (
                          <option key={idx} value={String(idx + 1).padStart(2, "0")}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Expiry Year</label>
                      <select
                        className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        {[2025, 2026, 2027, 2028].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">CVV</label>
                      <input
                        type="password"
                        className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        maxLength={3}
                        placeholder="123"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Pay $26.51
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column */}
        <aside className="lg:col-span-5 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Bill Details</h2>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Delivery Address:{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">
                Change Address
              </span>
            </p>
            <p className="text-gray-800 font-medium mt-1 leading-snug">
              99 florance st, Malden, MA, us, 02148
            </p>
          </div>

          <div className="space-y-6">
            {[{
              name: "Priyems Idli Dosa Batter",
              weight: "2.97 Lbs",
              price: 8.23,
              image: "https://big-app.s3.amazonaws.com/products/2024-08-18/1724005176_Food-Grains.webp",
            }, {
              name: "Priyems Dosa Batter",
              weight: "3.96 Lbs",
              price: 10.29,
              image: "https://big-app.s3.amazonaws.com/products/2024-08-18/1724004219_Tea-Coffe.webp",
            }].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-5 border border-gray-300 rounded-lg p-3 shadow-md transition"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="text-md font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.weight}</p>
                  <p className="text-md font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-6 border-gray-300" />

          <div className="text-gray-700 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>$5.99</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charges</span>
              <span>$1.00</span>
            </div>
            <div className="flex justify-between">
              <span>Handling Charges</span>
              <span>$1.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-4 border-t pt-3">
              <span>Total</span>
              <span>$26.51</span>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
