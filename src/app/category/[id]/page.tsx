import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";

export default function Category() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* Category Section */}
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Left Side Category List */}
        <div className="w-full lg:w-1/5 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="cursor-pointer bg-white shadow p-3 rounded-md flex items-center gap-3 hover:bg-gray-100 border-l-4 border-transparent hover:border-green-500"
            >
              <Image
                src="https://big-app.s3.amazonaws.com/products/2024-08-18/1724005176_Food-Grains.webp"
                alt="Category"
                width={48}
                height={48}
                className="rounded object-cover"
              />
              <span className="text-sm font-medium">Category {i + 1}</span>
            </div>
          ))}
        </div>

        {/* Right Side Products */}
        <div className="w-full lg:w-4/5 space-y-4">
          {/* Header Filter */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 bg-gray-100 p-3 rounded-md shadow">
            <h2 className="text-lg font-semibold">Category Title</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort By</span>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option>Low to High</option>
                <option>High to Low</option>
                <option>A to Z</option>
                <option>Z to A</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <ProductCard
                key={i}
                name={`Sample Product ${i + 1}`}
                weight="14 Oz"
                price="10.00"
                actualPrice="15.00"
                showDiscount={i % 2 === 0}
                discountText="25% Off"
                outOfStock={i % 3 === 0}
                image="https://big-app.s3.amazonaws.com/products/2024-08-18/1724005176_Food-Grains.webp"
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
