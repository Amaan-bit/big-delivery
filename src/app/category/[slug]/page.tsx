"use client";

import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchChildrenCategories, fetchCategoryProducts } from "@/app/lib/api";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface Category {
  id: number;
  name: string;
  image_path: string;
  slug: string;
  thumbnail: string;
}

interface Product {
  id: number;
  image: string;
  name: string;
  thumbnail: string;
  variants: Variant[];
}

interface Variant {
  id: number;
  variant_name: string;
  mrp: number;
  sale_price: number;
  discount_percentage: number;
  is_active: boolean;
}

export default function Category() {
  const params = useParams();
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true); // for initial category load
  const [loadingProducts, setLoadingProducts] = useState(false); // for products only
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [sortby, setSortby] = useState("");

  // Fetch categories first
  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError("");

    fetchChildrenCategories(slug)
      .then((data: Category[] | null) => {
        const cats = data || [];
        setCategories(cats);
        setActiveIndex(0);

        if (cats.length > 0) {
          loadProducts(cats[0].id, sortby);
        }
      })
      .catch(() => setError("Failed to load category"))
      .finally(() => setLoading(false));
  }, [slug, sortby]);

  // Fetch products by category
  const loadProducts = async (categoryId: number, sort: string) => {
    setLoadingProducts(true);
    try {
      const data = await fetchCategoryProducts(categoryId, sort);
      setProducts(data.data || []);
    } catch (err) {
      setError("Failed to load products:" + (err as Error).message);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Handle category click
  const handleCategoryClick = (index: number) => {
    setActiveIndex(index);
    loadProducts(categories[index].id, sortby);
  };

  // Handle sorting change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    setSortby(sortValue);
    if (categories[activeIndex]) {
      loadProducts(categories[activeIndex].id, sortValue);
    }
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* Category Section */}
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Left Side Category List */}
        <div className="w-full lg:w-1/5 space-y-2">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => handleCategoryClick(i)}
              className={`cursor-pointer shadow p-3 rounded-md flex items-center gap-3 border-l-4 transition-colors ${
                activeIndex === i
                  ? "bg-gray-100 border-green-500"
                  : "bg-white border-transparent hover:bg-gray-100 hover:border-green-500"
              }`}
            >
              <Image
                src={cat.image_path}
                alt={cat.name}
                width={48}
                height={48}
                className="rounded object-cover"
              />
              <span className="text-sm font-medium">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Right Side Products */}
        <div className="w-full lg:w-4/5 space-y-4">
          {/* Header Filter */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 bg-gray-100 p-3 rounded-md shadow">
            <h2 className="text-lg font-semibold">
              {categories[activeIndex]?.name || "Category Title"}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort By</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={sortby}
                onChange={handleSortChange}
              >
                <option value="latest">Latest</option>
                <option value="a-z">A to Z</option>
                <option value="z-a">Z to A</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {loadingProducts ? (
              <LoadingSpinner />
            ) : products.length > 0 ? (
              products.map((p, i) => (
                <ProductCard
                  key={i}
                  id={p.id}
                  name={p.name}
                  image={p.thumbnail}
                  variants={p.variants}
                />
              ))
            ) : (
              <div className="col-span-full text-gray-500">No products found</div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
