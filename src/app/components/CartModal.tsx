'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { getCart, incrementCart, decrementCart } from '@/store/cartSlice';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: cartItems, loading, sub_total, discount, net_amount, tax, payable_amount } =
    useSelector((state: RootState) => state.cart);

  // Fetch cart only when modal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        dispatch(getCart(token));
      }
    }
  }, [isOpen, dispatch]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    }
  }, [isOpen]);

  const handleIncrement = (product_id: number, variant_id: number) => {
    dispatch(
      incrementCart({
        product_id,
        variant_id,
        token: localStorage.getItem('token') || null,
      })
    );
  };

  const handleDecrement = (product_id: number, variant_id: number) => {
    dispatch(
      decrementCart({
        product_id,
        variant_id,
        token: localStorage.getItem('token') || null,
      })
    );
  };

  return (
    <div
      className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 shadow-sm">
        <span className="text-red-600 text-xl cursor-pointer" onClick={onClose}>
          &#10005;
        </span>
        <span className="text-green-600 font-semibold text-lg">My Cart</span>
      </div>

      {/* Cart Items */}
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
            <h6 className="text-sm text-gray-500 mb-4">
              Your favourite items are just a click away
            </h6>
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
              <div
                key={`${item.product_id}-${item.variant_id}`}
                className="flex gap-3 border-b pb-3 items-center"
              >
                {/* Product Image */}
                <div className="w-1/3">
                  <Image
                    src={item.thumbnail || '/images/default-product.jpg'}
                    alt={item.product_name || 'Product'}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="w-2/3">
                  <h5 className="font-medium text-sm">
                    {item.product_name || 'Unnamed Product'}
                  </h5>
                  {item.variant_name && (
                    <p className="text-xs text-gray-500">{item.variant_name}</p>
                  )}
                  <p className="text-sm text-green-700 font-semibold mt-2">
                    ${(item.price ?? 0 * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded text-sm"
                    onClick={() =>
                      handleDecrement(item.product_id, item.variant_id)
                    }
                    disabled={loading}
                  >
                    -
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded text-sm"
                    onClick={() =>
                      handleIncrement(item.product_id, item.variant_id)
                    }
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bill Details */}
        {cartItems.length > 0 && (
          <div className="mt-10">
            <h5 className="font-bold">Bill Details</h5>
            <hr className="my-2" />
            <div className="flex justify-between text-sm">
              <span>Sub Total</span>
              <span>${sub_total?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span>${discount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Net Amount</span>
              <span>${net_amount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-2">
              <span>Payable Amount</span>
              <span>${payable_amount?.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Button */}
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
