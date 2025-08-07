'use client';
import { useEffect } from 'react';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeliveryModal = ({ isOpen, onClose }: DeliveryModalProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-gray-400 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white shadow-lg p-6 w-full max-w-lg rounded relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-2 right-3 text-red-500 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Delivery/Pickup Options */}
        <div className="mb-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="delivery"
                value="delivery"
                defaultChecked
              />
              <span className="text-sm">Delivery</span>
            </label>
            {/* Add pickup option here if needed */}
          </div>
        </div>

        {/* Pickup Address (hidden by default) */}
        <div className="hidden pickup-add text-sm mb-4">
          <p>Your Store:</p>
          <p className="text-gray-600">Balaji Indian Groceries</p>
          <p className="text-gray-500 text-xs">
            517 Main St, Malden, MA 02148, United States
          </p>
        </div>

        {/* Date and Slots */}
        <div id="calender" className="mb-4"></div>
        <div id="slots" className="space-y-2">
          <div id="date-data" className="flex flex-wrap gap-2"></div>
          <div id="slot-data" className="flex flex-wrap gap-2 justify-center"></div>

          <div className="text-center">
            <button
              id="cart-continue"
              className="btn btn-success shadow px-4 py-2 bg-green-500 text-white rounded mt-3"
              onClick={onClose}
            >
              Continue
            </button>
          </div>

          <form action="/create-order" method="POST" id="createOrderForm">
            <input type="hidden" name="slot" id="slot-val" />
            <input type="hidden" name="slot_date" id="slot-date" />
            <input type="hidden" name="order_type" id="order-type" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;
