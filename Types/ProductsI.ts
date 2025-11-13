export interface ProductsI {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: string;
  has_discount: boolean;
  includes_tax: boolean;
  includes_shipping: boolean;
  stock: number;
  status_id: number;
  max_quantity: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}
