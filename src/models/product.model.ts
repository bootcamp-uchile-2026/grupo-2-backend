export class Product {
  id: number;
  subcategoryId: number;
  entrepreneurId: number;
  brand: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  images: string[];
  stock: number;
  rating: number | null;
  salesLastMonth: number;
  createdAt: Date;
  colors?: string[];
  sizes?: string[];
}
