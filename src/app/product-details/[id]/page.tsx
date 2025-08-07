"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Category() {
  const images = [
    "https://big-app.s3.amazonaws.com/products/2024-08-18/1724005176_Food-Grains.webp",
    "https://big-app.s3.amazonaws.com/products/2024-08-18/1724004219_Tea-Coffe.webp",
    "https://big-app.s3.amazonaws.com/products/2024-08-12/1723488222_Frozen1.jpg",
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* Product Details */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Thumbnail Images */}
          <div className="flex sm:flex-col gap-2">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={60}
                height={60}
                className={`rounded-md shadow-md object-cover w-[60px] h-[60px] cursor-pointer ${
                  selectedImage === img ? "ring-2 ring-green-500" : ""
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* Main Preview */}
          <div className="flex-1">
            <Image
              src={selectedImage}
              alt="Main Product"
              width={500}
              height={500}
              className="rounded-md object-cover w-full h-auto shadow"
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Sample Product Name</h2>

          {/* Variant Selector */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Select Variant</h4>
            <div className="flex flex-wrap gap-3">
              {["Small", "Medium", "Large"].map((variant, i) => (
                <div
                  key={i}
                  className="border w-30 px-4 pt-2 text-center rounded shadow cursor-pointer hover:bg-green-100"
                >
                  <p className="text-sm text-green-600 font-semibold">$10.00</p>
                  <p className="text-xs text-gray-500 line-through">$15.00</p>
                  {i === 1 && (
                    <p className="text-xs text-red-500">Out of Stock</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cart Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border px-3 py-1 rounded shadow">
              <button className="text-lg font-bold">-</button>
              <span className="text-sm">1</span>
              <button className="text-lg font-bold">+</button>
            </div>
            <button className="bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700">
              Add to Cart
            </button>
          </div>

          {/* Delivery & Offers */}
          <div className="grid grid-cols-1 mt-10">
            <div className="flex gap-3 mb-8">
              <Image
                src="/images/10_minute_delivery.avif"
                alt="Delivery"
                width={60}
                height={60}
              />
              <div>
                <p className="font-semibold">Convenient Delivery</p>
                <p className="text-sm text-gray-600">
                  Get your order delivered at your doorstep at your convenience.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Image
                src="/images/Best_Prices_Offers.avif"
                alt="Offers"
                width={60}
                height={60}
              />
              <div>
                <p className="font-semibold">Best Price & Offers</p>
                <p className="text-sm text-gray-600">
                  Best price destination with offers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="prose">
          <h3>Product Description</h3>
          <p>
            This is a sample description of the product. It provides insights
            about the product quality, usage, and other important information.
          </p>

          <h4>Return Policy</h4>
          <p>
            The product is non-returnable. However, if you receive a damaged,
            spoiled, or incorrect item, you can request a replacement within 24
            hours of delivery.
          </p>

          <h4>Disclaimer</h4>
          <p>
            Every effort is made to ensure the accuracy of all information
            provided. Actual product packaging and materials may contain
            different information.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
