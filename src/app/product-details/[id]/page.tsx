"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { fetchProductById } from "@/app/lib/api";

interface Variant {
  id: number;
  variant_name: string;
  mrp: number;
  sale_price: number;
  discount_percentage: number;
  is_active: boolean;
  quantity: number;
}
interface Product {
  id: number;
  name: string;
  images: string[];
  thumbnail: string;
  variants: Variant[];
  description: string;
}

export default function ProductDetails() {
  const { id } = useParams(); // from /product-details/[id]
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchProductById(id.toString()).then((data) => {
        // If no images, use thumbnail as only image
        const imageList = data.images?.length ? data.images : [data.thumbnail];
        setProduct({ ...data, images: imageList });
        setSelectedImage(imageList[0]);
      });
    }
  }, [id]);

  if (!product) {
    return (
        <LoadingSpinner />
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* Product Details */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2">
            {product.images.map((img: string, index: number) => (
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
              alt={product.name}
              width={300}
              height={300}
              className="rounded-md object-cover w-full h-auto shadow"
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>

          {/* Variant Selector */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Select Variant</h4>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => {
                const isOutOfStock = variant.quantity === 0;

                return (
                  <div
                    key={variant.id}
                    className={`border w-30 px-4 pt-2 text-center rounded shadow 
                      ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-green-100"}
                    `}
                    onClick={() => {
                      if (!isOutOfStock) {
                        console.log(`Selected variant: ${variant.variant_name}`);
                        // here you could also store the selected variant in state
                      }
                    }}
                  >
                    <p className="text-sm text-green-600 font-semibold">
                      ${variant.sale_price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {variant.variant_name}
                    </p>
                    {variant.mrp > variant.sale_price && (
                      <p className="text-xs text-gray-500 line-through">
                        ${variant.mrp.toFixed(2)}
                      </p>
                    )}
                    {isOutOfStock && (
                      <p className="text-xs text-red-500">Out of Stock</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Actions */}
          <div className="flex items-center gap-4">
            <button className="w-60 bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700">
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
        <h3 className="text-xl font-semibold mb-4">
          Product Description
        </h3>
        <div className="prose" dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>

      <Footer />
    </div>
  );
}
