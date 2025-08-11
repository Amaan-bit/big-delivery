'use client';

import { useState,useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import React, { Suspense } from 'react';
import OrdersTab from '@/app/components/OrdersTab';
import AddressTab from '@/app/components/AddressTab';
import SavedTab from '@/app/components/SavedTab';
import SettingTab from '@/app/components/SettingTab';

const TABS = ['orders', 'saved', 'address', 'settings'];

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('orders');
  const searchParams = useSearchParams();
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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
          {activeTab === 'orders' && <OrdersTab />}

          {/* Settings */}
          {activeTab === 'settings' && <SettingTab />}

          {/* Saved */}
          {activeTab === 'saved' && <SavedTab />}

          {/* Address */}
          {activeTab === 'address' && <AddressTab />}
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
