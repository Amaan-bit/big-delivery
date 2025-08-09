"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Banner from "@/app/components/Banner";
import CategoryGrid from "@/app/components/CategoryGrid";
import ProductCard from "@/app/components/ProductCard";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import LoadingSpinner from "@/app/components/LoadingSpinner"; // from previous spinner component example
import { fetchHomePageData } from "@/app/lib/api";

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

interface MainCategory {
  id: number;
  name: string;
  slug: string;
}

interface Section {
  id: number;
  name: string;
  maincategory: MainCategory;
  products: Product[];
}

export default function HomeClient() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchHomePageData()
      .then((data) => {
        setSections(data);
      })
      .catch(() => setError("Failed to load home page data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <p className="text-center p-8 text-red-600">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <Banner />
      <CategoryGrid />
      {sections.length > 0 ? (
        sections.map((section) => (
          <section key={section.id} className="py-4 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-green-700">{section.name}</h2>
                <Link
                  href={`/section-items/${section.maincategory.slug}`}
                  className="text-sm text-orange-500 hover:text-white hover:bg-orange-400 font-semibold px-3 py-2 border rounded-lg"
                >
                  See All
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {section.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.thumbnail}
                    variants={product.variants}
                  />
                ))}
              </div>
            </div>
          </section>
        ))
      ) : (
        <p className="text-center p-8 text-gray-500">No sections available.</p>
      )}
      <Footer />
    </div>
  );
}
