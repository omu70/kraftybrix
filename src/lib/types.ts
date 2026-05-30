export type Category =
  | "Hypercars"
  | "Supercars"
  | "Racing Cars"
  | "SUVs & Trucks"
  | "Smoking Cars"
  | "Landmarks"
  | "Limited Editions";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Master";

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string; // the in-universe marque, e.g. "Velocita"
  category: Category;
  tagline: string;
  description: string;
  price: number;
  salePrice?: number | null;
  rating: number;
  reviewCount: number;
  pieces: number;
  buildHours: number;
  difficulty: Difficulty;
  ageRange: string;
  scale: string;
  inStock: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  limited?: boolean;
  // 3D procedural body colour (hex) used by the brick-car renderer
  bodyColor: string;
  accentColor: string;
  images: ProductImage[];
  whatsIncluded: string[];
  specs: { label: string; value: string }[];
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number; // effective unit price
  image: string;
  bodyColor: string;
  qty: number;
}
