"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { fetchSectionItems } from "@/app/lib/api";

interface Variant {
  id: number;
  variant_name: string;
  mrp: number;
  sale_price: number;
  discount_percentage: number;
  is_active: boolean;
}

interface Product {
  id: number;
  name: string;
  thumbnail: string;
  variants: Variant[];
}

interface Section {
  id: number;
  name: string;
  products: Product[];
}

export default function SectionItemsPage() {
  const params = useParams();

  // Handle slug safely - sometimes params.slug might be string[] or undefined
  const slug =
    typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("latest");

useEffect(() => {
  if (!slug) return;

  setLoading(true);
  setError("");

  fetchSectionItems(slug, sortBy)
    .then((data: Section[]) => {
      if (Array.isArray(data) && data.length > 0) {
        setSectionTitle(data[0].name || slug);
        setProducts(data[0].products || []);
      } else {
        setSectionTitle(slug);
        setProducts([]);
      }
    })
    .catch(() => setError("Failed to load products"))
    .finally(() => setLoading(false));
}, [slug, sortBy]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) return <p className="text-center p-8 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      <div className="flex flex-col lg:flex-row gap-4 p-4">
        <div className="w-full space-y-4">
          {/* Header Filter */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 bg-gray-100 p-3 rounded-md shadow">
            <h2 className="text-lg font-semibold">{sectionTitle}</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort By</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="a-z">A to Z</option>
                <option value="z-a">Z to A</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.thumbnail}
                  variants={product.variants}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No products found in this section.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
