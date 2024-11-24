// services/category-service.ts
export interface Category {
  id: string;
  name: string;
  description?: string;
}

export const CategoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch('/api/templates/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    const response = await fetch('/api/templates/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const response = await fetch(`/api/templates/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`/api/templates/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete category');
  },
};
