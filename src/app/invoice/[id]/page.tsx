"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchOrderById, Order } from "@/app/lib/api";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchOrderById(Number(id)); // Pass dynamic ID if needed
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  if (!order) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8" id="invoice">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Image src="/images/logo.png" alt="Logo" width={150} height={50} />
            <p className="text-gray-600 mt-2 text-sm mt-10">
              517 Main St, Malden, MA 02148, United States
            </p>
            <p className="text-gray-600 text-sm">contact@big.delivery</p>
            <p className="text-gray-600 text-sm">+1 781-322-0270</p>
          </div>
          <div className="text-right">
            <h4 className="text-lg font-semibold">
              Invoice #{order.id}
              <span
                className={`ml-2 text-xs text-white px-2 py-1 rounded ${
                  order.payment_status === "paid" ? "bg-green-500" : "bg-yellow-500"
                }`}
              >
                {order.payment_status}
              </span>
            </h4>
          </div>
        </div>

        <hr className="my-4" />

        {/* Billing Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-gray-700 text-lg font-medium mb-2">Billed To:</h5>
            <p className="text-gray-800 font-semibold">{order.address.name}</p>
            <p className="text-gray-600 text-sm">
              {order.address.street}, {order.address.area}, {order.address.city},{" "}
              {order.address.state}, {order.address.country} {order.address.postal_code}
            </p>
            <p className="text-gray-600 text-sm">{order.address.phone}</p>
          </div>

          <div className="text-right">
            <div>
              <h5 className="text-sm text-gray-600">Invoice No:</h5>
              <p className="text-gray-800">#{order.id}</p>
            </div>
            <div className="mt-4">
              <h5 className="text-sm text-gray-600">Invoice Date:</h5>
              <p className="text-gray-800">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4">
              <h5 className="text-sm text-gray-600">Order Status:</h5>
              <p className="text-gray-800">{order.status}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8">
          <h5 className="text-lg font-medium text-gray-700 mb-4">Order Summary</h5>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="text-gray-700 bg-gray-100">
                <tr>
                  <th className="px-4 py-2">No.</th>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">
                      <p className="font-medium text-gray-800">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.product.brand_name}</p>
                    </td>
                    <td className="px-4 py-2">${item.sale_price.toFixed(2)}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">
                      ${(item.sale_price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right font-medium">Sub Total</td>
                  <td className="px-4 py-2 text-right">${order.sub_total.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right">Discount</td>
                  <td className="px-4 py-2 text-right">- ${order.discount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right">Delivery Charges</td>
                  <td className="px-4 py-2 text-right">${order.delivery_charges.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right">Tax</td>
                  <td className="px-4 py-2 text-right">${order.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right font-semibold text-gray-900">
                    Total
                  </td>
                  <td className="px-4 py-2 text-right font-semibold text-gray-900">
                    ${order.payable_amount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 text-right">
          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            Print
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
