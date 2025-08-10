import { BASE_URL } from '@/app/lib/config';


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

// Login 
type LoginPayload = {
  username: string;
  password: string;
};

type LoginResponse = {
  status: string;
  message: string;
  token?: string;
};

export async function loginUser(payload: LoginPayload): Promise<LoginResponse | null> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data: LoginResponse = await res.json();

    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
}

// Home page

export async function fetchHomePageData() {
  const res = await fetch(`${BASE_URL}/home-page`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch home page data');
  }

  const json = await res.json();
  return json.data;
}

// section items
export async function fetchSectionItems(slug: string, sortby: string = "latest") {
  console.log(sortby);
  const res = await fetch(`${BASE_URL}/section-items/${slug}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
    body: JSON.stringify({ sortby }), // send sortby in the request body
  });

  if (!res.ok) {
    throw new Error("Failed to fetch section items");
  }

  const data = await res.json();
  return data.data;
}

// Category children
export async function fetchChildrenCategories(slug: string) {
  const res = await fetch(`${BASE_URL}/get-child-categories/${slug}`, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch section items");
  }

  const data = await res.json();
  return data.data;
}

// get products by child category
export async function fetchCategoryProducts(categoryId: number, sortby: string = "latest") {
  const res = await fetch(`${BASE_URL}/get-child-category-products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category_id: categoryId,
      sortby: sortby,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

// get product by id (product details)
export async function fetchProductById(id: string | number) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    cache: "no-store", // ensures fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await res.json();
  return data.data;
}

// Add to wishlist
export async function addToWishlist(productId: number, variantId: number) {
  const token = localStorage.getItem("token"); 
  const res = await fetch(`${BASE_URL}/wishlist/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify({
      product_id: productId,
      variant_id: variantId,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to add to wishlist");
  }

  return await res.json();
}

// Get wishlist
export async function fetchWishlist(token: string) {
  const res = await fetch(`${BASE_URL}/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch wishlist');
  }
  const json = await res.json();
  return json.data;
}

// Remove wishlist
export async function removeFromWishlist(token: string, itemId: number) {
  const res = await fetch(`${BASE_URL}/wishlist/remove/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to remove item from wishlist');
  }

  return res.json();
}

// Move to cart
export async function moveToCart(token: string, itemId: number) {
  const res = await fetch(`${BASE_URL}/wishlist/move-to-cart/${itemId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to move item to cart');
  }

  return res.json();
}

// Customer Detail
export async function getCustomerDetail() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(`${BASE_URL}/customer-details`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json(); // parse JSON body once

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch customer detail");
  }

  // If API returns user details, save it
  if (data?.data) {
    localStorage.setItem("userDetails", JSON.stringify(data.data));
  }

  return data;
}

// fetch orders
export async function fetchOrders(token: string) {
  const res = await fetch(`${BASE_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data = await res.json();
  return data.data; // return the array directly
}

// Change-password
export async function changePassword(old_password: string, password: string, password_confirmation: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${BASE_URL}/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      old_password,
      password,
      password_confirmation,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to change password");
  }

  return response.json();
}
