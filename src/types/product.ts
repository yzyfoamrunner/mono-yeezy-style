export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  images: string[];
  description: string;
  inStock: boolean;
}
