export interface CategoriesI {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id: null;
  order: number;
  status_id: number;
  created_at?: string;
  updated_at?: string;
}
