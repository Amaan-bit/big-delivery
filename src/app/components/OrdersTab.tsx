'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { fetchOrders } from '@/app/lib/api';

interface OrderItem {
  id: number;
  quantity: number;
  sale_price: number;
  product: {
    name: string;
    thumbnail: string;
  };
}

interface Order {
  id: number;
  created_at: string;
  payable_amount: number;
  status: string;
  items: OrderItem[];
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<number | null>(null);

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
    fetchOrdersData();
  }, []);

  return (
    <div className="space-y-4">
      {/* Table Header for Desktop */}
      <div className="hidden md:flex w-full text-sm font-semibold border-b py-2">
        <div className="w-1/4 px-5 text-base">Order No.</div>
        <div className="w-1/4 px-4 text-base">Order Date</div>
        <div className="w-1/4 px-4 text-base">Order Amount</div>
        <div className="w-1/4 px-4 text-base">Order Status</div>
      </div>

      {ordersLoading ? (
        <LoadingSpinner />
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className="border rounded shadow">
            {/* Desktop Order Header */}
            <div
              className="hidden md:flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 py-3"
              onClick={() => setAccordionOpen(accordionOpen === order.id ? null : order.id)}
            >
              <div className="w-1/4 px-5 text-blue-500">#{order.id}</div>
              <div className="w-1/4 px-4">{order.created_at}</div>
              <div className="w-1/4 px-4">${order.payable_amount.toFixed(2)}</div>
              <div className="w-1/4 px-4 capitalize">{order.status}</div>
            </div>

            {/* Mobile Order Card */}
            <div
              className="flex md:hidden flex-col gap-2 p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
              onClick={() => setAccordionOpen(accordionOpen === order.id ? null : order.id)}
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
        ))
      ) : (
        <div className="text-center text-gray-600 py-10">
          No orders found
        </div>
      )}
    </div>
  );
}
