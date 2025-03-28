export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  category: string;
  subcategory: string;
  isFeatured: boolean;
  stockQuantity: number;
  createdAt: string;
  category_id?: string;
};

export type Category = {
  id: number;
  name: string;
  subcategories: { id: number; name: string }[];
};

export type Promotion = {
  id: number;
  text: string;
  active: boolean;
};

// Mock Products
export const products: Product[] = [
  {
    id: 1,
    name: "Vintage Comic Book (1960s)",
    description: "Rare vintage comic in excellent condition. A must-have for serious collectors featuring iconic superhero stories from the Silver Age.",
    price: 399.99,
    imageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1170&auto=format&fit=crop",
    category: "Comics",
    subcategory: "Silver Age",
    isFeatured: true,
    stockQuantity: 3,
    createdAt: "2023-01-15T12:00:00Z"
  },
  {
    id: 2,
    name: "Limited Edition Collector's Figurine",
    description: "Hand-painted limited edition figurine with certificate of authenticity. Only 500 made worldwide.",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1608278047522-58806a6ac85b?q=80&w=1170&auto=format&fit=crop",
    category: "Figurines",
    subcategory: "Limited Edition",
    isFeatured: true,
    stockQuantity: 15,
    createdAt: "2023-02-18T14:30:00Z"
  },
  {
    id: 3,
    name: "Signed Movie Memorabilia",
    description: "Original movie poster signed by the entire cast. Framed and ready to display.",
    price: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1170&auto=format&fit=crop",
    category: "Movie Memorabilia",
    subcategory: "Autographed Items",
    isFeatured: true,
    stockQuantity: 5,
    createdAt: "2023-03-10T09:15:00Z"
  },
  {
    id: 4,
    name: "Classic Video Game (Sealed)",
    description: "Factory sealed classic video game from the 1990s. Perfect condition, never opened.",
    price: 249.99,
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1170&auto=format&fit=crop",
    category: "Gaming",
    subcategory: "Retro Games",
    isFeatured: false,
    stockQuantity: 7,
    createdAt: "2023-04-05T16:45:00Z"
  },
  {
    id: 5,
    name: "Antique Coin Collection",
    description: "Complete set of rare coins from the early 20th century. Includes display case and certificate.",
    price: 599.99,
    imageUrl: "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=1102&auto=format&fit=crop",
    category: "Coins",
    subcategory: "Antique",
    isFeatured: true,
    stockQuantity: 2,
    createdAt: "2023-05-20T11:20:00Z"
  },
  {
    id: 6,
    name: "Sports Trading Card Set",
    description: "Complete set of championship season trading cards. Mint condition in protective sleeves.",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1176&auto=format&fit=crop",
    category: "Trading Cards",
    subcategory: "Sports",
    isFeatured: false,
    stockQuantity: 8,
    createdAt: "2023-06-12T10:00:00Z"
  },
  {
    id: 7,
    name: "First Edition Novel",
    description: "First edition, first printing of this award-winning novel. Signed by the author.",
    price: 349.99,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1074&auto=format&fit=crop",
    category: "Books",
    subcategory: "First Editions",
    isFeatured: true,
    stockQuantity: 4,
    createdAt: "2023-07-08T13:30:00Z"
  },
  {
    id: 8,
    name: "Vintage Record Collection",
    description: "Collection of original vinyl records from the 1970s. Includes rare pressings and limited releases.",
    price: 449.99,
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1170&auto=format&fit=crop",
    category: "Music",
    subcategory: "Vinyl",
    isFeatured: false,
    stockQuantity: 3,
    createdAt: "2023-08-15T15:15:00Z"
  }
];

// Mock Categories and Subcategories
export const categories: Category[] = [
  {
    id: 1,
    name: "Comics",
    subcategories: [
      { id: 1, name: "Silver Age" },
      { id: 2, name: "Golden Age" },
      { id: 3, name: "Modern" }
    ]
  },
  {
    id: 2,
    name: "Figurines",
    subcategories: [
      { id: 4, name: "Limited Edition" },
      { id: 5, name: "Action Figures" },
      { id: 6, name: "Statues" }
    ]
  },
  {
    id: 3,
    name: "Movie Memorabilia",
    subcategories: [
      { id: 7, name: "Posters" },
      { id: 8, name: "Props" },
      { id: 9, name: "Autographed Items" }
    ]
  },
  {
    id: 4,
    name: "Gaming",
    subcategories: [
      { id: 10, name: "Retro Games" },
      { id: 11, name: "Consoles" },
      { id: 12, name: "Accessories" }
    ]
  },
  {
    id: 5,
    name: "Coins",
    subcategories: [
      { id: 13, name: "Antique" },
      { id: 14, name: "Modern" },
      { id: 15, name: "Foreign" }
    ]
  },
  {
    id: 6,
    name: "Trading Cards",
    subcategories: [
      { id: 16, name: "Sports" },
      { id: 17, name: "Gaming" },
      { id: 18, name: "Collectible" }
    ]
  }
];

// Mock Promotions
export const promotions: Promotion[] = [
  { id: 1, text: "FREE SHIPPING on orders over $100! Limited time offer!", active: true },
  { id: 2, text: "Sign up today and get 10% off your first purchase!", active: true },
  { id: 3, text: "Flash Sale: 25% off all limited edition collectibles this weekend only!", active: true }
];

// Simulated API functions
export const fetchFeaturedProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.filter(product => product.isFeatured));
    }, 500);
  });
};

export const fetchAllProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 500);
  });
};

export const fetchProductById = (id: number): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.find(product => product.id === id));
    }, 500);
  });
};

export const fetchProductsByCategory = (category: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.filter(product => product.category === category));
    }, 500);
  });
};

export const fetchAllCategories = (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 500);
  });
};

export const fetchActivePromotions = (): Promise<Promotion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(promotions.filter(promo => promo.active));
    }, 500);
  });
};

export const searchProducts = (query: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase();
      resolve(products.filter(product => 
        product.name.toLowerCase().includes(normalizedQuery) || 
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)
      ));
    }, 500);
  });
};

export const filterProductsByPrice = (min: number, max: number): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.filter(product => 
        product.price >= min && product.price <= max
      ));
    }, 500);
  });
};
