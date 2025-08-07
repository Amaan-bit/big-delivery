'use client';

import { useState,useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import React, { Suspense } from 'react';

const TABS = ['orders', 'returns', 'saved', 'address', 'settings'];

const dummyOrders = [
  {
    id: 1,
    order_date: '2025-08-07',
    total_amount: 4800,
    delivery_status: 'delivered',
    items: [
      {
        id: 1,
        qty: 2,
        is_return: 0,
        product: {
          name: 'Product A',
          v_name: 'Variant A',
          price: 1200,
          image: 'https://big-app.s3.amazonaws.com/products/2024-08-18/1724004219_Tea-Coffe.webp',
        },
      },
      {
        id: 2,
        qty: 2,
        is_return: 1,
        product: {
          name: 'Product B',
          v_name: 'Variant B',
          price: 1200,
          image: 'https://big-app.s3.amazonaws.com/products/2024-08-18/1724004219_Tea-Coffe.webp',
        },
      },
    ],
  },
];

const products = [
  {
    id: 1,
    name: 'Priyems Dosa Batter',
    v_name: '14 Oz',
    price: 19999,
    image: 'https://big-app.s3.amazonaws.com/products/2024-08-18/1724005176_Food-Grains.webp',
  },
];

const dummyStates = [
  { code: 'CA', name: 'California' },
  { code: 'NY', name: 'New York' },
  { code: 'TX', name: 'Texas' },
];

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('orders');
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const [accordionOpen, setAccordionOpen] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [states] = useState(dummyStates);
  const [user, setUser] = useState({
    id: 100123,
    name: 'John Doe',
    email: 'john@example.com',
    addresses: [
      {
        name: 'Amaan Ansari',
        address: '2 floor, Street Road, USA, FL, us, 32003',
        checked: true,
      },
      {
        name: 'Amaan Ansari',
        address: '99 florance st, Malden, MA, us, 02148',
        checked: false,
      },
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const newAddress = {
      name: `${data.get('first_name')} ${data.get('last_name')}`,
      address: `${data.get('addA')}, ${data.get('addB')}, ${data.get('city')}, ${data.get('state')}, us, ${data.get('zip')}`,
      checked: true,
    };

    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => ({ ...a, checked: false })).concat(newAddress),
    }));

    alert('Address saved!');
    setShowAddressForm(false);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Sidebar */}
        <aside className="hidden md:block w-1/4">
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center gap-4 border-b pb-4">
              <Image
                src="/images/05.png"
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <div className="font-bold">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <div className="text-xs text-gray-400">ID: {user.id}</div>
              </div>
            </div>
            <ul className="mt-6 space-y-2">
              {TABS.map((tab) => (
                <li
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer px-4 py-2 rounded hover:bg-gray-100 ${
                    activeTab === tab ? 'bg-orange-100 text-orange-400 font-semibold' : ''
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Mobile Tabs */}
        <div className="md:hidden">
          <div className="bg-white rounded shadow p-4 flex flex-wrap gap-2 justify-around">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm px-2 py-1 rounded ${
                  activeTab === tab ? 'bg-orange-100 text-orange-400' : 'bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 space-y-4">
          {/* Wallet & Rewards */}
          <div className="flex gap-4 mb-2">
            <div className="bg-orange-400 p-4 text-white rounded shadow w-1/2 text-center">
              <strong>Wallet</strong>: $100.00
            </div>
            <div className="bg-orange-400 p-4 text-white rounded shadow w-1/2 text-center">
              <strong>Rewards</strong>: $50.00
            </div>
          </div>

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="hidden md:flex w-full text-sm font-semibold border-b py-2">
                <div className="w-1/4 px-5 text-base">Order No.</div>
                <div className="w-1/4 px-4 text-base">Order Date</div>
                <div className="w-1/4 px-4 text-base">Order Amount</div>
                <div className="w-1/4 px-4 text-base">Order Status</div>
              </div>

              {dummyOrders.map((order) => {
                const total = order.items.reduce(
                  (acc, item) => acc + item.qty * item.product.price,
                  0
                );

                return (
                  <div key={order.id} className="border rounded shadow">
                    <div
                      className="hidden md:flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 py-3"
                      onClick={() =>
                        setAccordionOpen(accordionOpen === order.id ? null : order.id)
                      }
                    >
                      <div className="w-1/4 px-5 text-blue-500">#{order.id + 100000}</div>
                      <div className="w-1/4 px-4">{order.order_date}</div>
                      <div className="w-1/4 px-4">${(total / 100).toFixed(2)}</div>
                      <div className="w-1/4 px-4 capitalize">{order.delivery_status}</div>
                    </div>

                    {/* Mobile Order */}
                    <div
                      className="flex md:hidden flex-col gap-2 p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        setAccordionOpen(accordionOpen === order.id ? null : order.id)
                      }
                    >
                      <div><strong>Order No:</strong> #{order.id + 100000}</div>
                      <div><strong>Order Date:</strong> {order.order_date}</div>
                      <div><strong>Total:</strong> ${(total / 100).toFixed(2)}</div>
                      <div><strong>Status:</strong> {order.delivery_status}</div>
                    </div>

                    {/* Accordion Items */}
                    {accordionOpen === order.id && (
                      <div className="p-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left border-b">
                              <th>Item</th>
                              <th>Qty</th>
                              <th>Price</th>
                              <th>Total</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.id} className="border-b">
                                <td className="py-2">
                                  <div className="flex items-center gap-2">
                                    <Image
                                      src={item.product.image}
                                      alt={item.product.name}
                                      width={50}
                                      height={50}
                                      className="rounded"
                                    />
                                    <div>
                                      <div>{item.product.name}</div>
                                      <div className="text-xs text-gray-500">{item.product.v_name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>{item.qty}</td>
                                <td>${(item.product.price / 100).toFixed(2)}</td>
                                <td>${((item.product.price / 100) * item.qty).toFixed(2)}</td>
                                <td>
                                  {item.is_return === 0 && <span className="text-blue-500">Eligible</span>}
                                  {item.is_return === 1 && <span className="text-yellow-500">Pending</span>}
                                  {item.is_return === 2 && <span className="text-green-500">Approved</span>}
                                  {item.is_return === 3 && <span className="text-red-500">Rejected</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Choose Avatar</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {[...Array(6)].map((_, idx) => (
                    <div className='shadow-md p-3 flex justify-center items-center' key={idx}>
                        <Image
                        src="/images/05.png"
                        alt={`Avatar ${idx + 1}`}
                        width={180}
                        height={80}
                        className="cursor-pointer hover:scale-105 transition-transform"
                        />
                    </div>
                ))}
                </div>

                <div className="space-y-4 shadow-md p-4">
                    <h3 className="text-lg font-semibold mt-4">Change Password</h3>
                    <form className="space-y-4 max-w-md">
                    <input
                        type="password"
                        placeholder="Old Password"
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    <button className="px-4 py-2 bg-orange-400 text-white rounded">Change</button>
                    </form>
                </div>
            </div>
         )}

          {/* Saved */}
         {activeTab === 'saved' && (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Saved Items</h3>
                {products.length > 0 ? (
                    products.map((product) => (
                        <div
                        key={product.id}
                        className="border border-gray-300 p-4 rounded-md shadow-sm bg-white flex flex-col md:flex-row items-start md:items-center gap-4"
                        >
                        {/* Product Image */}
                        <div className="w-full md:w-1/3">
                            <Image
                            src={product.image}
                            alt={product.name}
                            width={60}
                            height={60}
                            className="rounded shadow-sm mt-2 w-24 h-auto object-cover"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="w-full md:w-2/4">
                            <h5 className="text-sm font-semibold">{product.name}</h5>
                            <p className="mt-2 text-sm text-gray-600">{product.v_name}</p>
                            <span className="mt-2 block text-base font-bold text-gray-800">
                            ${(product.price / 100).toFixed(2)}
                            </span>
                        </div>

                        {/* Action Button */}
                        <div className="w-full md:w-1/4">
                            <Link
                            href={`/cart/move/${product.id}`}
                            className="inline-block px-4 py-2 bg-orange-400 text-white text-sm rounded hover:bg-orange-500 transition"
                            >
                            Move to cart
                            </Link>
                        </div>
                        </div>
                    ))
                    ) : (
                    <div className="text-center text-gray-600 py-10">No items saved</div>
                )}
            </div>
        )}

          {/* Address */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold">Address</h3>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-blue-500 px-4 py-2 cursor-pointer rounded-md text-sm"
                >
                  Add +
                </button>
              </div>

              {user.addresses.map(({ name, address, checked }, i) => (
                <label
                  key={`${name}-${i}`}
                  className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition ${
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
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-gray-700">{address}</p>
                  </div>
                </label>
              ))}

              {showAddressForm && (
                <div className="border p-4 rounded-md shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-md font-semibold">Add Address</h5>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="text-red-600 text-xl font-bold"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <select name="country" className="w-full border rounded px-3 py-2 text-sm">
                      <option value="us">USA</option>
                    </select>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" name="first_name" placeholder="First Name" required className="border rounded px-3 py-2" />
                      <input type="text" name="last_name" placeholder="Last Name" required className="border rounded px-3 py-2" />
                    </div>

                    <input name="addA" placeholder="Apt, Suite..." required className="border rounded px-3 py-2 w-full" />
                    <input name="addB" placeholder="Street Address" className="border rounded px-3 py-2 w-full" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="text" name="city" placeholder="County" required className="border rounded px-3 py-2" />
                      <select name="state" required className="border rounded px-3 py-2">
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.code} value={state.code}>{state.name}</option>
                        ))}
                      </select>
                      <input
                        name="zip"
                        placeholder="ZIP Code"
                        required
                        className="border rounded px-3 py-2"
                        onKeyDown={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                      />
                    </div>

                    <input
                      name="phone"
                      placeholder="Phone"
                      required
                      className="border rounded px-3 py-2 w-full"
                      onKeyDown={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    />

                    <div className="flex justify-center">
                      <button type="submit" className="bg-orange-400 text-white px-6 py-2 rounded hover:bg-orange-500">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
export default function SettingsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPage />
    </Suspense>
  );
}
