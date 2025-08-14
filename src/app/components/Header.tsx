'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks'; // ✅ get data from redux
import CartModal from '@/app/components/CartModal';
import Link from 'next/link';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { items: cartItems, payable_amount } = useAppSelector((state) => state.cart);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    window.location.href = "/";
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="max-w-9xl mx-auto px-4 py-2 flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl font-bold text-green-600">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={128}
                height={32}
                className="w-32 h-auto"
              />
            </Link>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Enter to search"
            className="border border-gray-300 px-3 py-1 rounded w-full max-w-xl"
          />

          {/* User + Cart */}
          <div className="flex items-center gap-4 relative">
            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen((prev) => !prev)}>
                <Image
                  src="/images/05.png"
                  alt="user"
                  width={32}
                  height={32}
                  className="w-8 h-8 border border-gray-300 mt-2 cursor-pointer"
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link href="/settings?tab=orders" className="block px-4 py-2 cursor-pointer hover:bg-gray-100">
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings?tab=saved" className="block px-4 py-2 cursor-pointer hover:bg-gray-100">
                        Saved Items
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings?tab=address" className="block px-4 py-2 cursor-pointer hover:bg-gray-100">
                        My Address
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings?tab=settings" className="block px-4 py-2 cursor-pointer hover:bg-gray-100">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        className="w-full text-left block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              className="bg-green-500 text-white px-4 py-1 rounded"
              onClick={() => setIsCartOpen(true)}
            >
              {totalItems} Item{totalItems !== 1 && 's'} <span>${payable_amount?.toFixed(2) || '0.00'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Header;
