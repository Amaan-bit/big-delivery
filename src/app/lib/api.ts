import { BASE_URL } from './config';


// Categories
export interface Category {
  id: number;
  name: string;
  image_path: string;
  slug: string;
  description: string | null;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Banners
export interface Banner {
  id: number;
  title: string;
  product_id: number;
  image: string;
}

export async function fetchBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(`${BASE_URL}/banners`); // Use full API URL if needed
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return [];
  }
}

