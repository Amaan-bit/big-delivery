import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10">
          {/* Left Image Section */}
          <div className="w-full lg:w-1/2 xl:w-[45%]">
            <Image
              src="/images/cont.jpg"
              alt="Big.Delivery Online Grocery"
              width={400}
              height={400}
              className="rounded w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Right Text Section */}
          <div className="w-full lg:w-1/2 xl:w-[55%] bg-white shadow-md rounded p-5">
            <div className="space-y-4">
              <h2 className="text-white text-lg font-semibold px-3 py-2 rounded" style={{ backgroundColor: "cadetblue" }}>
                About Us
              </h2>

              <h5 className="text-xl font-semibold">Welcome to Big.Delivery</h5>

              <p className="text-secondary text-[18px]">
                Your one-stop shop for convenient, reliable, and fresh online grocery shopping.
              </p>

              <p className="text-sm text-gray-700">
                We believe that your grocery experience should be simple, fast, and tailored to your needs. That’s why we’ve created a platform designed to bring the best of your local grocery store directly to your door.
              </p>

              <h3 className="text-white text-lg font-semibold px-3 py-2 rounded" style={{ backgroundColor: "#f87e3a" }}>
                Why Choose Us?
              </h3>

              <ul className="list-disc list-inside space-y-3 text-sm text-gray-700">
                <li>
                  <strong>Freshness Guaranteed:</strong> We pride ourselves on providing the freshest fruits, vegetables, meats, and more.
                </li>
                <li>
                  <strong>Wide Selection:</strong> From organic products to international foods, we have everything you need and more.
                </li>
                <li>
                  <strong>Easy Ordering:</strong> With our user-friendly website and mobile app, grocery shopping is just a few clicks away.
                </li>
                <li>
                  <strong>Fast & Reliable Delivery:</strong> We offer quick and efficient delivery to your doorstep, whenever you need it.
                </li>
              </ul>

              <h3 className="text-white text-lg font-semibold px-3 py-2 rounded" style={{ backgroundColor: "#f87e3a" }}>
                Our Mission
              </h3>

              <p className="text-sm text-gray-700">
                Our mission is to make grocery shopping hassle-free. We’ve partnered with trusted suppliers and use a streamlined delivery process to ensure that every item arrives fresh, on time, and at competitive prices.
              </p>

              <p className="text-base text-gray-800">
                At Big.Delivery, we are more than just a grocery service – we are your partner in making life easier, healthier, and more convenient. Thank you for choosing Big.Delivery!
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
