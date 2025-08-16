"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { RootState, AppDispatch } from "@/store/store";
import { getCart } from "@/store/cartSlice";
import { fetchAddresses } from "@/app/lib/api";
import { BASE_URL } from '@/app/lib/config';
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

  // States
  const [selectedDate, setSelectedDate] = useState<{ raw: Date; formatted: string; label: string } | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    holder: "",
    number: "",
    month: "",
    year: "",
    cvv: "",
  });

  // Generate next 10 days
  const today = new Date();
  const dates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      raw: d,
      label: d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
    };
  });

  // Slots
  const slots = [
    { label: "Morning (8AM - 11AM)", value: "morning", endHour: 11 },
    { label: "Afternoon (12PM - 3PM)", value: "afternoon", endHour: 15 },
    { label: "Evening (4PM - 7PM)", value: "evening", endHour: 19 },
    { label: "Night (8PM - 10PM)", value: "night", endHour: 22 },
  ];
  const now = new Date();
  const isSlotAvailable = (date: Date, endHour: number) => {
    const isToday = date.toDateString() === today.toDateString();
    if (!isToday) return true;
    return now.getHours() < endHour;
  };

  const handleDateSelect = (dateObj: { raw: Date; label: string }) => {
    const formatted = dateObj.raw.toISOString().split("T")[0];
    setSelectedDate({
      raw: dateObj.raw,
      formatted,
      label: dateObj.label,
    });
    const firstAvailable = slots.find((slot) => isSlotAvailable(dateObj.raw, slot.endHour));
    setSelectedSlot(firstAvailable ? firstAvailable.value : null);
  };

  const [customer, setCustomer] = useState<{ name: string; email: string; wallet: number } | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      try {
        setCustomer(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user details:", err);
      }
    }
  }, []);

  // Redux Cart
  const { items, sub_total, discount, tax, payable_amount } = useSelector((state: RootState) => state.cart);

  // Address state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressOpen, setAddressOpen] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [user, setUser] = useState({
    id: 100123,
    name: "John Doe",
    email: "john@example.com",
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

  interface CheckoutPayload {
    wallet_use: boolean;
    coupon_id?: number;
    tip?: number;
    address_id: number;
    delivery_date: string; // yyyy-mm-dd
    deliverable: boolean;
    card_number?: string;
    card_holder_name?: string;
    expire_month?: number;
    expire_year?: number;
    cvv?: number;
    delivery_instraction?: string;
    delivery_Note?: string;
    delivery_time: string;
    delivery_type: "express" | "standard";
    delivery_in: string; // e.g. "1HR"
  }

  useEffect(() => {
    async function loadAddresses() {
      setLoading(true);
      setError(null);
      try {
        const addressesFromApi = await fetchAddresses();
        const addresses: Address[] = addressesFromApi.map((addr: ApiAddress) => ({
          id: addr.id,
          name: addr.name,
          street: addr.street || "",
          area: addr.area || "",
          city: addr.city || "",
          state: addr.state || "",
          country: addr.country || "",
          postal_code: addr.postal_code || "",
          phone: addr.phone || "",
          address: `${addr.street}, ${addr.area}, ${addr.city}, ${addr.state}, ${addr.country}, ${addr.postal_code}`,
          checked: addr.is_default === 1,
        }));

        if (!addresses.some((a) => a.checked) && addresses.length > 0) {
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

  // 🚀 Handle Pay
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    // Validation
    const selectedAddress = user.addresses.find((a) => a.checked);
    if (!selectedAddress) return setCheckoutError("Please select a delivery address");
    if (!selectedDate) return setCheckoutError("Please select a delivery date");
    if (!selectedSlot) return setCheckoutError("Please select a delivery slot");

    // Wallet logic
    const walletCoversAll = useWallet && customer && customer.wallet >= (payable_amount ?? 0);

    if (!walletCoversAll) {
      if (!cardDetails.number || !cardDetails.holder || !cardDetails.month || !cardDetails.year || !cardDetails.cvv) {
        return setCheckoutError("Please enter valid card details");
      }
    }

    try {
      setCheckoutLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const payload: CheckoutPayload = {
        wallet_use: useWallet,
        address_id: selectedAddress.id,
        delivery_date: selectedDate.formatted,
        deliverable: true,
        delivery_time: selectedSlot,
        delivery_type: "standard",
        delivery_in: "1HR",
      };

      if (!walletCoversAll) {
        payload.card_number = cardDetails.number;
        payload.card_holder_name = cardDetails.holder;
        payload.expire_month = Number(cardDetails.month);
        payload.expire_year = Number(cardDetails.year);
        payload.cvv = Number(cardDetails.cvv);
      }

      const res = await fetch(`${BASE_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Checkout failed");
      }

      const data: { message: string; order: { id: number } } = await res.json();
      window.location.href = `/order-success/${data.order.id}`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCheckoutError(err.message);
        console.log(err);
      } else {
        setCheckoutError("Something went wrong during checkout.");
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

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

          {/* Make Delivery Slot Accordion */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <button
              onClick={() => setDeliveryOpen(!deliveryOpen)}
              className="flex justify-between items-center w-full text-left text-2xl font-semibold mb-6 text-gray-900 focus:outline-none"
              aria-expanded={deliveryOpen}
            >
              Choose Delivery Time & Slot
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${
                  deliveryOpen ? "rotate-180" : ""
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
                deliveryOpen ? "max-h-[2000px]" : "max-h-0"
              }`}
            >
              <div className="space-y-6">
                {/* Date Selector */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Choose Delivery Date</h3>
                  <div className="flex flex-wrap gap-3">
                    {dates.map((dateObj) => {
                        const formatted = dateObj.raw.toISOString().split("T")[0];
                        return (
                          <button
                            key={formatted}
                            onClick={() => handleDateSelect(dateObj)}
                            className={`px-4 py-2 rounded-lg border transition 
                              ${selectedDate?.formatted === formatted
                                ? "bg-orange-500 text-white border-orange-600"
                                : "bg-white text-gray-800 border-gray-300 hover:border-gray-500"
                              }`}
                          >
                            {dateObj.label}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Slot Selector */}
                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Choose Time Slot ({selectedDate.label})
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {slots.map((slot) => {
                        const available = isSlotAvailable(selectedDate.raw, slot.endHour);

                        return (
                          <button
                            key={slot.value}
                            onClick={() => available && setSelectedSlot(slot.value)}
                            disabled={!available}
                            className={`px-4 py-2 rounded-lg border transition
                              ${!available
                                ? "bg-red-100 text-red-500 border-red-400 cursor-not-allowed"
                                : selectedSlot === slot.value
                                ? "bg-orange-500 text-white border-orange-600"
                                : "bg-white text-gray-800 border-gray-300 hover:border-gray-500"
                              }`}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Payment Accordion */}
          <div>
            <button
              onClick={() => setPaymentOpen(!paymentOpen)}
              className="flex justify-between items-center w-full text-left text-2xl font-semibold mb-6 text-gray-900 focus:outline-none"
            >
              Make Payment
              <svg className={`w-6 h-6 transition-transform duration-300 ${paymentOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`overflow-hidden transition-[max-height] duration-300 ${paymentOpen ? "max-h-[2000px]" : "max-h-0"}`}>
              <form className="space-y-6" onSubmit={handlePay}>
                {/* Wallet */}
                <div className="flex flex-wrap gap-5">
                  <label className="inline-flex items-center cursor-pointer relative">
                    <input type="checkbox" className="hidden peer" checked={useWallet} onChange={(e) => setUseWallet(e.target.checked)} />
                    <span className="px-4 py-1 border rounded-full text-sm text-gray-700 peer-checked:bg-orange-500 peer-checked:text-white transition">
                      Wallet ${customer?.wallet?.toFixed(2)}
                    </span>
                  </label>
                </div>

                {/* Card Form (only show if wallet not covering full amount) */}
                {(!useWallet || (customer && customer.wallet < (payable_amount ?? 0))) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Card Holder Name</label>
                      <input type="text" value={cardDetails.holder} onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value })} className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Card Number</label>
                      <input type="text" value={cardDetails.number} onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg" />
                    </div>
                    <div className="flex gap-5">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Expiry Month</label>
                        <input type="number" value={cardDetails.month} onChange={(e) => setCardDetails({ ...cardDetails, month: e.target.value })} className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Expiry Year</label>
                        <input type="number" value={cardDetails.year} onChange={(e) => setCardDetails({ ...cardDetails, year: e.target.value })} className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">CVV</label>
                        <input type="password" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-lg" />
                      </div>
                    </div>
                  </>
                )}

                {checkoutError && <p className="text-red-500">{checkoutError}</p>}

                <button type="submit" disabled={checkoutLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
                  {checkoutLoading ? "Processing..." : `Pay $${payable_amount?.toFixed(2) || "0.00"}`}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Right Column - Bill */}
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
