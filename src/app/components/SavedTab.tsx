'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { fetchWishlist, removeFromWishlist, moveToCart } from '@/app/lib/api';

export default function SavedTab() {
    const [removingItemId, setRemovingItemId] = useState<number | null>(null);
    const [movingItemId, setMovingItemId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [wishlist, setWishlist] = useState<
        {
            id: number;
            product_id: number;
            variant_id: number;
            product_name: string;
            variant_name: string;
            thumbnail: string;
            price: number;
            total: number;
        }[]
        >([]);

  const fetchWishlistData = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        return;
      }
      setLoading(true);
  
      fetchWishlist(token)
        .then((data) => {
          setWishlist(data.items || []);
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to load wishlist');
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    const handleRemoveFromWishlist = (itemId: number) => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        return;
      }
      
      setRemovingItemId(itemId); // set removing item id
  
      removeFromWishlist(token, itemId)
        .then(() => {
          fetchWishlistData(); // refresh wishlist
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to remove item');
        })
        .finally(() => {
          setRemovingItemId(null); // reset removing item id
        });
    };
  
    const handleMoveToCart = (itemId: number) => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        return;
      }
  
      setMovingItemId(itemId); // set moving item id
  
      moveToCart(token, itemId)
        .then(() => {
          fetchWishlistData(); // refresh wishlist
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to move item');
        })
        .finally(() => {
          setMovingItemId(null); // reset moving item id
        });
    };

  useEffect(() => {
    fetchWishlistData();
  }, []);

  return (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Saved Items</h3>
        {loading ? (
        <LoadingSpinner></LoadingSpinner>
        ) : wishlist.length > 0 ? (
        wishlist.map((item) => (
            <div
            key={item.id}
            className="border border-gray-300 p-4 rounded-md shadow-sm bg-white flex flex-col md:flex-row items-start md:items-center gap-4"
            >
            <div className="w-full md:w-1/3">
                <Image
                src={item.thumbnail}
                alt={item.product_name}
                width={60}
                height={60}
                className="rounded shadow-sm mt-2 w-24 h-auto object-cover"
                />
            </div>
            <div className="w-full md:w-2/4">
                <h5 className="text-sm font-semibold">{item.product_name}</h5>
                <p className="mt-2 text-sm text-gray-600">{item.variant_name}</p>
                <span className="mt-2 block text-base font-bold text-gray-800">
                ${item.price.toFixed(2)}
                </span>
            </div>
            <div className="w-full md:w-1/4">
                <button
                onClick={() => handleMoveToCart(item.id)}
                disabled={movingItemId === item.id}
                className={`inline-block px-4 py-2 text-white text-sm cursor-pointer ml-3 rounded transition ${
                    movingItemId === item.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-400 hover:bg-orange-500'
                }`}
                >
                {movingItemId === item.id ? 'Moving...' : 'Move to cart'}
                </button>
                <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                disabled={removingItemId === item.id}
                className={`inline-block px-4 py-2 text-white text-sm cursor-pointer ml-3 rounded transition ${
                    removingItemId === item.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
                >
                {removingItemId === item.id ? 'Removing...' : 'Remove'}
                </button>
            </div>
            </div>
        ))
        ) : (
        <div className="text-center text-gray-600 py-10">No items saved</div>
        )}
    </div>
  );
}
