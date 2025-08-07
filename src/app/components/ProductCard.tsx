
import { SlidersHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  price: string;
  actualPrice?: string;
  weight: string;
  image?: string;
  outOfStock?: boolean;
  showDiscount?: boolean;
  discountText?: string;
}

const ProductCard = ({
  name,
  price,
  actualPrice,
  weight,
  image,
  outOfStock,
  showDiscount,
  discountText,
}: ProductCardProps) => {
  return (
    <div className="w-55 rounded bg-white shadow-sm relative p-2">
      {/* Top-left icon */}
      <div className="absolute top-1 left-1 flex items-center gap-0.5 text-gray-600 text-xs z-10">
        <SlidersHorizontal className="w-3 h-3" />
        <Plus className="w-2.5 h-2.5" />
      </div>

      {/* Top-right discount */}
      {showDiscount && discountText && (
        <div className="absolute top-0 right-0 bg-orange-400 text-white text-[10px] px-1 py-0.5 rounded-bl z-10">
          {discountText}
        </div>
      )}

      {/* Product Image */}
      <div className="h-40 w-full flex items-center justify-center bg-gray-100 my-2">
        {image ? (
          <Link href={`/product-details/${name}`}>
            <Image
              width={150}
              height={150}
              src={image}
              alt={image}
              className="object-cover"
              layout="responsive"
            />
          </Link>
        ) : (
          <span className="text-gray-400">Image</span>
        )}
      </div>

      {/* Product Info */}
      <div className="text-xs text-center">
        <p className="font-semibold text-gray-800 leading-snug line-clamp-2 h-8">{name}</p>

        <select className="border border-gray-300 rounded mt-1 text-xs w-full px-1 py-0.5">
          <option>{weight}</option>
        </select>

        {/* Price */}
        <div className="mt-1">
          <p className="text-sm font-bold text-gray-800">
            ${price}
            {actualPrice && (
              <span className="line-through text-gray-400 text-xs ml-1">${actualPrice}</span>
            )}
          </p>
        </div>

        {/* Add Button */}
        <div className="mt-2">
          {outOfStock ? (
            <button
              className="bg-gray-300 text-white text-xs py-2 w-full rounded cursor-not-allowed"
              disabled
            >
              ADD
            </button>
          ) : (
            <button className="bg-green-600 text-white text-xs py-2 w-40 rounded">ADD</button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center text-red-600 font-bold text-sm rounded">
            Out of stock
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
