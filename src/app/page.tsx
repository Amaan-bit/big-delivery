import Header from "./components/Header";
import Banner from "./components/Banner";
import CategoryGrid from "./components/CategoryGrid";
import ProductSection from "./components/ProductSection";
import Footer from "./components/Footer";


export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <Banner />
      <CategoryGrid />
      <ProductSection title="Fresh & Refrigerator" />
      <ProductSection title="Fruits & Vegetables" />
      <ProductSection title="Paan Corner" />
      <Footer />
    </div>
  );
}
