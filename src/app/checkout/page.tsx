"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { RootState, AppDispatch } from "@/store/store";
import { getCart } from "@/store/cartSlice";
import { fetchAddresses } from '@/app/lib/api';
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(getCart(token));
      }
    }
  }, [dispatch]);

  // Read cart data from Redux
  const {
    items,
    sub_total,
    discount,
    tax,
    payable_amount
  } = useSelector((state: RootState) => state.cart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressOpen, setAddressOpen] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [user, setUser] = useState({
      id: 100123,
      name: 'John Doe',
      email: 'john@example.com',
      addresses: [] as Address[],
    });
  interface ApiAddress {
    id: number;
    user_id: number;
    label: string;
    name: string;
    street: string;
    landmark: string | null;
    area: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
    latitude: string | null;
    longitude: string | null;
    is_default: number;
    created_at: string;
    updated_at: string;
  }

  interface Address {
    id: number;
    name: string;
    street: string;
    area: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
    address: string;
    checked: boolean;
  }

  useEffect(() => {
      async function loadAddresses() {
        setLoading(true);
        setError(null);
        try {
          const addressesFromApi = await fetchAddresses();
  
          // Map API response to your Address type and format address string
          const addresses: Address[] = addressesFromApi.map((addr: ApiAddress) => ({
            id: addr.id,
            name: addr.name,
            street: addr.street || '',
            area: addr.area || '',
            city: addr.city || '',
            state: addr.state || '',
            country: addr.country || '',
            postal_code: addr.postal_code || '',
            phone: addr.phone || '',
            address: `${addr.street}, ${addr.area}, ${addr.city}, ${addr.state}, ${addr.country}, ${addr.postal_code}`,
            checked: addr.is_default === 1, // mark checked if is_default=1
          }));
  
          // If none is default, mark first one as checked
          const anyChecked = addresses.some((a) => a.checked);
          if (!anyChecked && addresses.length > 0) {
            addresses[0].checked = true;
          }
  
          setUser((prev) => ({
            ...prev,
            addresses,
          }));
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      }
  
      loadAddresses();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto p-6 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column - Address + Payment */}
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
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-[max-height] duration-300 ${
                addressOpen ? "max-h-[1000px]" : "max-h-0"
              }`}
            >
              <div className="space-y-6">

                {/* Example addresses */}
                {user.addresses.map(({ id, name, address, checked }, i) => (
                  <label
                    key={id}
                    className={`relative flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition ${
                      checked ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={checked}
                      onChange={() => {
                        setUser((prev) => ({
                          ...prev,
                          addresses: prev.addresses.map((addr, idx) => ({
                            ...addr,
                            checked: idx === i,
                          })),
                        }));
                      }}
                      className="mt-1 accent-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{name}</p>
                      <p className="text-sm text-gray-700">{address}</p>
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
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-[max-height] duration-300 ${
                paymentOpen ? "max-h-[2000px]" : "max-h-0"
              }`}
            >
              <div className="space-y-6">
                {/* Payment options */}
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
                    <label className="block text-sm font-medium text-gray-700">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Name on Card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="password"
                      className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="1111 1111 1111 1111"
                      maxLength={19}
                      inputMode="numeric"
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="flex gap-5">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Expiry Month
                      </label>
                      <select className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
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
                          <option
                            key={idx}
                            value={String(idx + 1).padStart(2, "0")}
                          >
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Expiry Year
                      </label>
                      <select className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                        {[2025, 2026, 2027, 2028].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        CVV
                      </label>
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
                    Pay ${payable_amount?.toFixed(2) || "0.00"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column - Bill Details */}
        <aside className="lg:col-span-5 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Bill Details
          </h2>

          <div className="space-y-4">
            {items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-6 border border-gray-300 rounded-lg p-2 shadow-md transition"
              >
                <Image
                  src={item.thumbnail || "/images/default-product.jpg"}
                  alt={item.product_name}
                  width={45}
                  height={45}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.product_name}
                  </p>
                  {item.variant_name && (
                    <p className="text-xs text-gray-600">{item.variant_name} x {item.quantity}</p>
                  )}
                  <p className="text-sm font-semibold text-gray-800">
                    ${(item.price ?? 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-6 border-gray-300" />

          <div className="text-gray-700 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>${sub_total?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>- ${discount?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>$ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charges</span>
              <span>$ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Handling Charges</span>
              <span>$ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-4 border-t pt-3">
              <span>Total</span>
              <span>${payable_amount?.toFixed(2) || "0.00"}</span>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
