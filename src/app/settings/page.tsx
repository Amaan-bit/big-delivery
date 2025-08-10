'use client';

import { useState,useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import React, { Suspense } from 'react';
import { fetchWishlist, removeFromWishlist, moveToCart, fetchOrders, changePassword } from '@/app/lib/api';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const TABS = ['orders', 'returns', 'saved', 'address', 'settings'];
const dummyStates = [
  { code: 'CA', name: 'California' },
  { code: 'NY', name: 'New York' },
  { code: 'TX', name: 'Texas' },
];

interface OrderItem  {
  id: number;
  quantity: number;
  sale_price: number;
  product: {
    name: string;
    thumbnail: string;
  }
};

interface Order  {
  id: number;
  created_at: string;
  payable_amount: number;
  status: string;
  items: OrderItem[];
};

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('orders');
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [movingItemId, setMovingItemId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeLoading, setChangeLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [wishlist, setWishlist] = useState<
    {
      id: number;
      product_id: number;
      variant_id: number;
      product_name: string;
      variant_name: string;
      thumbnail: string;
      price: number;
      total: number;
    }[]
  >([]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    try {
      setChangeLoading(true);
      await changePassword(oldPassword, newPassword, confirmPassword);
      setMessage("✅ Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error ) {
      if (typeof error === "object" && error !== null && "message" in error) {
        setMessage((error as { message?: string }).message || "❌ Failed to change password.");
      } else {
        setMessage("❌ Failed to change password.");
      }
    } finally {
      setChangeLoading(false);
    }
  };

  const fetchWishlistData = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    setLoading(true);

    fetchWishlist(token)
      .then((data) => {
        setWishlist(data.items || []);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to load wishlist');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchWishlistData();
    }
  }, [activeTab]);

  const handleRemoveFromWishlist = (itemId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    
    setRemovingItemId(itemId); // set removing item id

    removeFromWishlist(token, itemId)
      .then(() => {
        fetchWishlistData(); // refresh wishlist
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to remove item');
      })
      .finally(() => {
        setRemovingItemId(null); // reset removing item id
      });
  };

  const handleMoveToCart = (itemId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    setMovingItemId(itemId); // set moving item id

    moveToCart(token, itemId)
      .then(() => {
        fetchWishlistData(); // refresh wishlist
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to move item');
      })
      .finally(() => {
        setMovingItemId(null); // reset moving item id
      });
  };

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const fetchOrdersData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    setOrdersLoading(true);

    fetchOrders(token)
      .then((data) => {
        setOrders(data || []);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load orders");
      })
      .finally(() => {
        setOrdersLoading(false);
      });
  };

useEffect(() => {
  if (activeTab === "orders") {
    fetchOrdersData();
  }
}, [activeTab]);
  
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

  const [customer, setCustomer] = useState<{ name: string; email: string; wallet: number } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      try {
        setCustomer(JSON.parse(storedUser)); // parse the whole stored JSON
      } catch (err) {
        console.error("Failed to parse user details:", err);
      }
    }
  }, []);

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
                <div className="font-bold">{customer?.name}</div>
                <div className="text-sm text-gray-500">{customer?.email}</div>
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
              <strong>Wallet</strong>: ${customer?.wallet?.toFixed(2)}
            </div>
            <div className="bg-orange-400 p-4 text-white rounded shadow w-1/2 text-center">
              <strong>Rewards</strong>: $0.00
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

              {ordersLoading ? (
                <LoadingSpinner />
              ) : orders.length > 0 ? (
                orders.map((order) => {
                  return (
                    <div key={order.id} className="border rounded shadow">
                      {/* Desktop Order Header */}
                      <div
                        className="hidden md:flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 py-3"
                        onClick={() =>
                          setAccordionOpen(accordionOpen === order.id ? null : order.id)
                        }
                      >
                        <div className="w-1/4 px-5 text-blue-500">#{order.id}</div>
                        <div className="w-1/4 px-4">{order.created_at}</div>
                        <div className="w-1/4 px-4">${order.payable_amount.toFixed(2)}</div>
                        <div className="w-1/4 px-4 capitalize">{order.status}</div>
                      </div>

                      {/* Mobile Order Card */}
                      <div
                        className="flex md:hidden flex-col gap-2 p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          setAccordionOpen(accordionOpen === order.id ? null : order.id)
                        }
                      >
                        <div>
                          <strong>Order No:</strong> #{order.id}
                        </div>
                        <div>
                          <strong>Order Date:</strong>{" "}
                          {new Date(order.created_at.replace(" ", "T")).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div>
                          <strong>Total:</strong> ${order.payable_amount.toFixed(2)}
                        </div>
                        <div>
                          <strong>Status:</strong> {order.status}
                        </div>
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
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item: OrderItem) => (
                                <tr key={item.id} className="border-b">
                                  <td className="py-2">
                                    <div className="flex items-center gap-2">
                                      <Image
                                        src={item.product.thumbnail}
                                        alt={item.product.name}
                                        width={50}
                                        height={50}
                                        className="rounded"
                                      />
                                      <div>
                                        <div>{item.product.name}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{item.quantity}</td>
                                  <td>${item.sale_price.toFixed(2)}</td>
                                  <td>${(item.sale_price * item.quantity).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-600 py-10">
                  No orders found
                </div>
              )}
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
                   {message && (
                      <div
                        className={`px-4 py-3 rounded relative ${
                          message.includes("✅")
                            ? "bg-green-100 border border-green-400 text-green-700"
                            : "bg-red-100 border border-red-400 text-red-700"
                        }`}
                        role="alert"
                      >
                        <strong className="font-bold"></strong>
                        <span className="block sm:inline">{message}</span>
                      </div>
                    )}
                    <form className="space-y-4 max-w-md" onSubmit={handleChangePassword}>
                      <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        required
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        required
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                      <button
                        type="submit"
                        disabled={changeLoading}
                        className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
                      >
                        {changeLoading ? "Changing..." : "Change"}
                      </button>
                    </form>
                </div>
            </div>
         )}

          {/* Saved */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Saved Items</h3>
              {loading ? (
                <LoadingSpinner></LoadingSpinner>
              ) : wishlist.length > 0 ? (
                wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-300 p-4 rounded-md shadow-sm bg-white flex flex-col md:flex-row items-start md:items-center gap-4"
                  >
                    <div className="w-full md:w-1/3">
                      <Image
                        src={item.thumbnail}
                        alt={item.product_name}
                        width={60}
                        height={60}
                        className="rounded shadow-sm mt-2 w-24 h-auto object-cover"
                      />
                    </div>
                    <div className="w-full md:w-2/4">
                      <h5 className="text-sm font-semibold">{item.product_name}</h5>
                      <p className="mt-2 text-sm text-gray-600">{item.variant_name}</p>
                      <span className="mt-2 block text-base font-bold text-gray-800">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full md:w-1/4">
                      <button
                        onClick={() => handleMoveToCart(item.id)}
                        disabled={movingItemId === item.id}
                        className={`inline-block px-4 py-2 text-white text-sm cursor-pointer ml-3 rounded transition ${
                          movingItemId === item.id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-orange-400 hover:bg-orange-500'
                        }`}
                      >
                        {movingItemId === item.id ? 'Moving...' : 'Move to cart'}
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        disabled={removingItemId === item.id}
                        className={`inline-block px-4 py-2 text-white text-sm cursor-pointer ml-3 rounded transition ${
                          removingItemId === item.id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        {removingItemId === item.id ? 'Removing...' : 'Remove'}
                      </button>
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
