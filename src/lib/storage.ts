import { Product } from "@/types/product";

const PRODUCTS_KEY = "shop_products";
const ADMIN_PASSWORD_KEY = "admin_password";

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const addProduct = (product: Product) => {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
};

export const updateProduct = (id: string, updatedProduct: Product) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = updatedProduct;
    saveProducts(products);
  }
};

export const deleteProduct = (id: string) => {
  const products = getProducts();
  saveProducts(products.filter(p => p.id !== id));
};

export const getAdminPassword = (): string | null => {
  return localStorage.getItem(ADMIN_PASSWORD_KEY);
};

export const setAdminPassword = (password: string) => {
  localStorage.setItem(ADMIN_PASSWORD_KEY, password);
};
