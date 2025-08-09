"use client";

import { useEffect, useState } from "react";
import { fetchCategories, Category } from "@/app/lib/api";
import Link from "next/link";

const Footer = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    getCategories();
  }, []);
  return (
    <footer className="bg-blue-50 py-8 text-sm text-gray-700 mt-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-bold mb-2">Usefull Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="text-gray-700 hover:text-orange-400 transition">
                ABOUT
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-700 hover:text-orange-400 transition">
                CONTACT
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="text-gray-700 hover:text-orange-400 transition">
                PRIVACY POLICY
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="text-gray-700 hover:text-orange-400 transition">
                TERMS &amp; CONDITION
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">All Categories</h4>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="text-gray-700 hover:text-orange-400 transition">
                    {cat.name}
                  </Link>
                </li>
            ))}
          </ul>
        </div>
        <div className="text-center md:col-span-3 mt-4">
          <p>© Big Delivery , 2025</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
