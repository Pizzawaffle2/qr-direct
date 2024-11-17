export interface Template {
    id: string;
    name: string;
    description: string;
    type: 'qr' | 'calendar';
    thumbnail: string;
    isPro: boolean;
    isPublic: boolean;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
    data?: any; // Template-specific data
    settings?: {
      theme?: string;
      layout?: string;
      customization?: Record<string, any>;
    };
  }
  
  export interface TemplateFilters {
    search?: string;
    type?: 'qr' | 'calendar' | 'all';
    isPro?: boolean;
    isPublic?: boolean;
    isFavorite?: boolean;
  }
  
  export interface TemplateActions {
    create: () => void;
    duplicate: (id: string) => void;
    edit: (id: string) => void;
    delete: (id: string) => void;
    share: (id: string) => void;
    toggleFavorite: (id: string) => void;
    togglePublic: (id: string) => void;
  }