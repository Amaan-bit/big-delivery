"use client";

import { Heart, Check } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addToWishlist } from "@/app/lib/api";

interface Variant {
  id: number;
  variant_name: string;
  mrp: number;
  sale_price: number;
  discount_percentage: number;
  is_active: boolean;
}

interface ProductCardProps {
  id: number;
  name: string;
  image?: string;
  variants?: Variant[];
}

const ProductCard = ({ id, name, image, variants = [] }: ProductCardProps) => {
  const initialVariant = variants.find((v) => v.is_active) || variants[0] || null;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(initialVariant);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variantId = Number(e.target.value);
    const variant = variants.find((v) => v.id === variantId) || null;
    setSelectedVariant(variant);
  };

  const handleWishlistClick = async () => {
    if (!selectedVariant) return;
    try {
      setLoading(true);
      await addToWishlist(id, selectedVariant.id);
      setIsInWishlist(true); // change icon
    } catch (error) {
      console.error(error);
      alert("Failed to add to wishlist");
    } finally {
      setLoading(false);
    }
  };
  const outOfStock = !selectedVariant;

  return (
    <div className="w-55 rounded bg-white shadow-sm relative p-2">
      {/* Top-left icon */}
      <div
        className="absolute top-1 left-1 flex items-center gap-0.5 text-gray-600 text-xs z-10"
        onClick={handleWishlistClick}
      >
        {isInWishlist ? (
          <Check className="w-5 h-5 text-green-500 cursor-pointer" />
        ) : (
          <Heart
            className={`w-5 h-5 cursor-pointer ${loading ? "opacity-50" : ""}`}
          />
        )}
      </div>

      {/* Top-right discount */}
      {selectedVariant && selectedVariant.discount_percentage > 0 && (
        <div className="absolute top-0 right-0 bg-orange-400 text-white text-[10px] px-1 py-0.5 rounded-bl z-10">
          {selectedVariant.discount_percentage}% Off
        </div>
      )}

      {/* Product Image */}
      <div className="h-40 w-full flex items-center justify-center my-2">
        {image ? (
          <Link href={`/product-details/${id}`}>
            <Image
              width={100}
              height={100}
              src={image}
              alt={name}
              className="object-cover"
              layout="responsive"
              style={{ height: "auto", objectFit: "contain" }}
              priority
            />
          </Link>
        ) : (
          <span className="text-gray-400">Image</span>
        )}
      </div>

      {/* Product Info */}
      <div className="text-xs text-center">
        <p className="font-semibold text-gray-800 leading-snug line-clamp-2 h-8 mt-10">{name}</p>

        {variants.length > 0 ? (
          <select
            className="border border-gray-300 rounded mt-1 text-xs w-full px-1 py-0.5"
            onChange={handleVariantChange}
            value={selectedVariant?.id || ""}
            disabled={variants.length === 0}
          >
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.variant_name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-red-600 mt-2 font-semibold">Out of stock</p>
        )}

        {/* Price */}
        {!outOfStock && selectedVariant && (
          <div className="mt-1">
            <p className="text-sm font-bold text-gray-800">
              ${selectedVariant.sale_price.toFixed(2)}
              {selectedVariant.discount_percentage > 0 && (
                <span className="line-through text-gray-400 text-xs ml-1">
                  ${selectedVariant.mrp.toFixed(2)}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Add Button */}
        <div className="my-3">
          {outOfStock ? (
            <button
              className="bg-gray-300 text-white font-bold text-xs py-2 w-full rounded cursor-not-allowed"
              disabled
            >
              ADD
            </button>
          ) : (
            <button className="bg-green-600 text-white text-xs py-2 w-full rounded font-bold">ADD</button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-opacity-10 bg-[#ffffff6b] flex items-center justify-center text-red-600 font-bold text-sm rounded">
            Out of stock
          </div>

        )}
      </div>
    </div>
  );
};

export default ProductCard;
