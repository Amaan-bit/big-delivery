'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const subTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subTotal * 0.1;
  const total = subTotal + tax;

  return (
    <div
      className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 shadow-sm">
        <span className="text-red-600 text-xl cursor-pointer" onClick={onClose}>
          &#10005;
        </span>
        <span className="text-green-600 font-semibold text-lg">My Cart</span>
      </div>

      <div className="p-4 pb-36 overflow-y-auto h-[calc(100%-200px)]">
        {cartItems.length === 0 ? (
          <div className="text-center">
            <Image
              src="/images/empty-cart.jpg"
              alt="Empty Cart"
              width={200}
              height={400}
              className="mx-auto mb-4"
            />
            <h5 className="font-bold">You do not have any items in your cart</h5>
            <h6 className="text-sm text-gray-500 mb-4">Your favourite items are just a click away</h6>
            <button
              onClick={onClose}
              className="bg-green-600 px-4 py-2 text-white rounded"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 border-b pb-3">
                <div className="w-1/3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="w-2/3">
                  <h5 className="font-medium text-sm">{item.name}</h5>
                  <p className="text-xs text-gray-500">{item.weight}</p>
                  <p className="text-sm text-green-700 font-semibold mt-2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <button className="px-2 py-1 bg-gray-200 rounded text-sm">-</button>
                    <span className="text-sm">{item.quantity}</span>
                    <button className="px-2 py-1 bg-gray-200 rounded text-sm">+</button>
                  </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="mt-10">
            <h5 className="font-bold">Bill Details</h5>
            <hr className="my-2" />
            <div className="flex justify-between text-sm">
              <span>Sub Total</span>
              <span>${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full max-w-sm p-4 bg-green-600 text-white text-center cursor-pointer">
          <Link href="/checkout" className="block">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartModal;
