import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Contact Form */}
          <div className="w-full md:w-2/3 bg-white shadow-md border border-gray-300 rounded p-6">
            <form action="#" method="POST">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                  Query
                </label>
                <textarea
                  id="query"
                  name="equery"
                  rows={4}
                  placeholder="Query"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="mt-4 bg-orange-400 text-white px-5 py-2 rounded hover:bg-orange-500 transition"
              >
                Send
              </button>
            </form>
          </div>

          {/* Contact Details Card */}
          <div className="w-full md:w-1/3">
            <div className="bg-white shadow-md rounded p-4 h-full">
              <div
                className="rounded-tl-[30px] bg-[#fc8019] text-white px-4 py-2 text-lg font-semibold mb-3"
              >
                Contact Details
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  <i className="fa fa-map-marker mr-2 text-orange-500" />
                  <span className="font-medium">Address:</span> 517 Main St, Malden, MA 02148, United States
                </p>

                <p>
                  <i className="fa fa-phone mr-2 text-orange-500" />
                  <span className="font-medium">Phone Support:</span>{" "}
                  <a href="tel:+17813220270" className="text-blue-600 hover:underline">+1 781-322-0270</a>
                </p>

                <p>
                  <i className="fa fa-envelope mr-2 text-orange-500" />
                  <span className="font-medium">General Enquiry:</span><br />
                  <a href="mailto:query@big.delivery" className="text-blue-600 hover:underline">query@big.delivery</a>
                </p>

                <p>
                  <i className="fa fa-envelope mr-2 text-orange-500" />
                  <span className="font-medium">Order Support:</span><br />
                  <a href="mailto:ordersupport@big.delivery" className="text-blue-600 hover:underline">ordersupport@big.delivery</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}   