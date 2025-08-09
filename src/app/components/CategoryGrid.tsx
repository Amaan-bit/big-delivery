"use client";

import { useEffect, useState } from "react";
import { fetchCategories, Category } from "@/app/lib/api";
import Image from "next/image";
import Link from "next/link";

const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    getCategories();
  }, []);

  return (
    <section className="bg-white py-4">
      <div className="max-w-7xl mx-auto mb-5 px-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center rounded-md shadow-md py-8 text-sm text-center cursor-pointer hover:shadow-lg transition"
          >
            <div className="w-20 h-20 md:w-30 md:h-30 overflow-hidden mb-2">
              <Image
                width={150}
                height={150}
                src={cat.image_path}
                alt={cat.name}
                className="object-cover"
                layout="responsive"
              />
            </div>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
export default CategoryGrid;
