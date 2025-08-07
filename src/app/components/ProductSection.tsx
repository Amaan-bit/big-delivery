import ProductCard from "./ProductCard";

const ProductSection = ({ title }: { title: string }) => {
  return (
    <section className="py-4 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-green-700">{title}</h2>
          <button className="text-sm text-orange-500 font-semibold">See All</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Dummy data */}
          <ProductCard
            name="Priyems Dosa Batter"
            weight="14 Oz"
            price="7.20"
            actualPrice="8.23"
            showDiscount
            discountText="13% Off"
            image="https://big-app.s3.amazonaws.com/products/2024-08-18/1724005176_Food-Grains.webp"
          />
          <ProductCard
            name="Verka Paneer"
            weight="14 Oz"
            price="7.20"
            actualPrice="8.23"
            showDiscount
            discountText="13% Off"
            image="https://big-app.s3.amazonaws.com/products/2024-08-18/1724005176_Food-Grains.webp"
          />
          <ProductCard
            name="Swad Paneer"
            weight="14 Oz"
            price="7.20"
            actualPrice="8.23"
            showDiscount
            discountText="13% Off"
            image="https://big-app.s3.amazonaws.com/products/2024-08-18/1724005176_Food-Grains.webp"
          />
          <ProductCard
            name="Uncooked Phulka Fresh"
            weight="14 Oz"
            price="7.20"
            actualPrice="8.23"
            showDiscount
            discountText="13% Off"
            image="https://big-app.s3.amazonaws.com/products/2024-08-18/1724005176_Food-Grains.webp"
          />
          <ProductCard
            name="Red Onion 10 Lb"
            weight="14 Oz"
            price="7.20"
            actualPrice="8.23"
            showDiscount
            discountText="13% Off"
            image="https://big-app.s3.amazonaws.com/products/2024-08-18/1724005176_Food-Grains.webp"
          />
        </div>
      </div>
    </section>
  );
};
export default ProductSection;
