"use client";

import { useEffect, useState } from "react";
import { fetchBanners, Banner as BannerType } from "../lib/api";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchBanners();
      setBanners(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-center py-6">Loading banners...</div>;

  // React Slick settings, tweak as you like
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,     // Show 1 banner at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    pauseOnHover: true,
  };

  return (
    <div className="w-full px-2 md:px-4 my-4">
      <Slider {...settings}>
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={`/product/${banner.product_id}`} // link to product page
            className="block w-full"
          >
            <Image
              src={banner.image}
              alt={banner.title || 'Banner'}
              className="object-cover rounded-md"
              width={500}
              height={300}
              layout="responsive"
            />
          </a>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
