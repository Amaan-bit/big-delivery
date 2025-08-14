"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchOrderById, Order } from "@/app/lib/api";
import LoadingSpinner from "@/app/components/LoadingSpinner";


export default function OrderSuccess() {
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
    <div className="min-h-screen bg-white overflow-x-hidden flex flex-col">
      <Header />

      <main className="flex-grow w-150 mx-auto p-6">
        <div className="bg-white shadow-sm rounded-md p-6 flex flex-col gap-6">
          <Link
            className="self-start bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded transition"
            href="/"
          >
            Shop More
          </Link>

          <div className="px-2">
            <div className="flex justify-between gap-3 mb-4">
              <h5 className="uppercase text-gray-700 font-semibold text-lg">
                Hi! {order.address?.name}
              </h5>
              <h6 className="text-gray-800 text-lg">
                Order ID: <b>{order.id}</b>
              </h6>
            </div>
            <h4 className="mt-5 mb-5 text-2xl font-bold text-green-600">
              Thanks for your order
            </h4>

            <span className="text-green-600 font-semibold block mt-6 mb-3">
              Payment Summary
            </span>

            <hr className="border-gray-300 mb-5" />

            <table className="w-full text-sm">
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="text-left py-1">{item.product.name}</td>
                    <td className="text-left py-1">{item.quantity}</td>
                    <td className="text-right py-1">${item.sale_price}</td>
                  </tr>
                ))}
                <tr className="font-semibold border-t border-gray-300">
                  <td className="text-left py-2">Total</td>
                  <td></td>
                  <td className="text-right py-2">${order.sub_total}</td>
                </tr>
              </tbody>
            </table>

            <div className="space-y-2 mt-6 text-gray-700 text-sm font-medium">
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>${order.delivery_charges}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charges</span>
                <span>${order.service_charges}</span>
              </div>
              <div className="flex justify-between">
                <span>Handling Charges</span>
                <span>${order.handling_charges}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 border-t border-gray-300 pt-3 text-green-600">
                <span>Total</span>
                <span>${order.payable_amount}</span>
              </div>
            </div>

            <hr className="my-6 border-gray-300" />

            <div className="flex justify-between text-gray-700 text-sm">
              <span>Pay By {order.payment_method}</span>
              <span>${order.wallet_use}</span>
            </div>
          </div>

          <Link
            href="/settings?tab=orders"
            className="block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition"
          >
            View your orders
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
