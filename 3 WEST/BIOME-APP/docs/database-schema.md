# BIOME Database Schema

## Collections Overview Summary

The BIOME application's database is structured around the following core collections, each serving a specific purpose in the ecosystem:

### Core User Collections

1. **users**
   - Primary collection for all user accounts
   - Key fields and types:
     * `id`: string (Firebase Auth UID)
     * `role`: string (enum values: 'vendor', 'buyer', 'tourist', 'guide', 'admin')
     * `email`: string
     * `displayName`: string
     * `businessInfo`: map (optional)
     * `verificationStatus`: map
     * `stats`: map (contains number fields)
     * `preferences`: map
     * `isActive`: boolean
     * `lastActive`: timestamp

### Market and Product Collections

2. **categories**
   - Organizes products and services into hierarchical categories
   - Key fields and types:
     * `id`: string
     * `name`: string
     * `parentId`: string (optional)
     * `subCategories`: array of string
     * `seasonality`: map (optional)
     * `stats`: map (contains number fields)
     * `order`: number
     * `isActive`: boolean

3. **markets**
   - Represents physical marketplaces in Bantayan Island
   - Key fields and types:
     * `id`: string
     * `name`: string
     * `location`: map {
       - `coordinates`: geopoint,
       - `address`: string
     }
     * `sections`: array of map
     * `amenities`: map (contains boolean fields)
     * `operatingHours`: map
     * `status`: string (enum values: 'open', 'closed', 'holiday', 'maintenance')
     * `stats`: map (contains number fields)
     * `events`: array of map

4. **products**
   - Catalogs all items available for sale
   - Key fields and types:
     * `id`: string
     * `vendorId`: reference
     * `categoryId`: reference
     * `name`: string
     * `price`: map (contains number fields)
     * `stock`: map
     * `quality`: map
     * `variants`: array of map (optional)
     * `isAvailable`: boolean
     * `ratings`: map (contains number fields)

### Transaction Collections

5. **orders**
   - Records all marketplace transactions
   - Key fields and types:
     * `id`: string
     * `orderNumber`: string
     * `buyerId`: reference
     * `vendorId`: reference
     * `items`: array of map
     * `status`: string (enum values: 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')
     * `pricing`: map (contains number fields)
     * `payment`: map
     * `delivery`: map (optional)
     * `scheduledFor`: timestamp (optional)

### Tourism Collections

6. **tourPackages**
   - Defines available tourism experiences
   - Key fields and types:
     * `id`: string
     * `name`: string
     * `duration`: map
     * `pricing`: map (contains number fields)
     * `capacity`: map (contains number fields)
     * `itinerary`: array of map
     * `locations`: array of map {
       - `coordinates`: geopoint,
       - `details`: map
     }
     * `guides`: array of map
     * `status`: string (enum values: 'active', 'seasonal', 'full', 'maintenance')
     * `ratings`: map (contains number fields)

7. **tourBookings**
   - Manages tour reservations
   - Key fields and types:
     * `id`: string
     * `packageId`: reference
     * `touristId`: reference
     * `guideId`: reference (optional)
     * `date`: timestamp
     * `participants`: map (contains number fields)
     * `status`: string (enum values: 'pending', 'confirmed', 'completed', 'cancelled')
     * `paymentStatus`: string (enum values: 'pending', 'paid', 'refunded')

### Feedback and Service Collections

8. **reviews**
   - Stores user feedback for products, vendors, tours, and guides
   - Key fields and types:
     * `id`: string
     * `userId`: reference
     * `targetType`: string (enum values: 'product', 'vendor', 'tourPackage', 'guide')
     * `targetId`: reference
     * `rating`: number (1-5)
     * `comment`: string
     * `images`: array of string (optional)
     * `isVerified`: boolean

9. **serviceCategories**
   - Organizes additional services available in the ecosystem
   - Key fields and types:
     * `id`: string
     * `name`: string
     * `types`: array of string
     * `description`: string
     * `icon`: string
     * `isActive`: boolean

### Collection Relationships

- Users (vendors) → Products → Categories
- Markets → Sections → Vendors (users)
- TourPackages → TourBookings → Users (tourists/guides)
- Products/Services → Reviews → Users
- Orders → Products → Users (vendors/buyers)

### Common Features Across Collections

- Audit Fields:
  * `createdAt`: timestamp
  * `updatedAt`: timestamp
  * `isActive`: boolean (where applicable)
- Metadata Fields:
  * `seoTitle`: string
  * `seoDescription`: string
  * `keywords`: array of string
- Statistical Fields:
  * Views/counts: number
  * Ratings: map (contains number fields)
  * Performance metrics: number

## Collections Detail

### 1. users
Collection ID: `users`
```typescript
{
  id: string;                 // Auto-generated user ID (from Firebase Auth)
  email: string;             // User's email address
  displayName: string;       // User's display name
  role: 'vendor' | 'buyer' | 'tourist' | 'guide' | 'admin';  // User role
  phoneNumber?: string;      // Optional phone number
  address?: string;         // Physical address
  profileImage?: string;    // URL to profile image
  coverImage?: string;      // URL to cover/banner image
  bio?: string;            // User biography/description
  preferences?: {          // User preferences
    language: string;      // Preferred language
    currency: string;      // Preferred currency
    notifications: {       // Notification settings
      email: boolean;
      push: boolean;
      sms: boolean;
    }
  };
  socialLinks?: {          // Social media links
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  businessInfo?: {         // For vendors/guides
    businessName: string;
    businessType: string;
    licenseNumber?: string;
    taxId?: string;
    operatingHours?: {
      open: string;
      close: string;
      daysOpen: string[];  // ['Monday', 'Tuesday', etc.]
    }
  };
  verificationStatus: {    // Account verification
    isVerified: boolean;
    documents: {
      idCard?: string;    // URL to ID card image
      license?: string;   // URL to business license
      other?: string[];   // Other verification documents
    }
  };
  stats: {                // User statistics
    totalOrders: number;
    totalBookings: number;
    totalEarnings: number;
    joinDate: timestamp;
    lastLogin: timestamp;
  };
  ratings?: {              // Optional ratings summary
    average: number;
    count: number;
    breakdown: {           // Detailed rating breakdown
      5: number;          // Count of 5-star ratings
      4: number;
      3: number;
      2: number;
      1: number;
    }
  };
  createdAt: timestamp;     // Account creation date
  updatedAt: timestamp;     // Last update date
  isActive: boolean;        // Account status
  lastActive: timestamp;    // Last activity timestamp
}
```

### 2. categories
Collection ID: `categories`
```typescript
{
  id: string;              // Category ID (e.g., 'fresh_fish')
  name: string;            // Display name
  description: string;     // Category description
  icon: string;           // Emoji or icon identifier
  image: string;          // Category image URL
  banner: string;         // Category banner image URL
  parentId?: string;      // Parent category ID (for subcategories)
  subCategories?: string[]; // List of subcategory IDs
  metadata: {             // Additional metadata
    seoTitle: string;     // SEO optimized title
    seoDescription: string; // SEO description
    keywords: string[];    // SEO keywords
  };
  stats: {                // Category statistics
    productCount: number; // Number of products
    vendorCount: number;  // Number of vendors
    orderCount: number;   // Total orders
  };
  isActive: boolean;      // Whether category is active
  order: number;          // Display order
  createdAt: timestamp;
  updatedAt: timestamp;
  seasonality?: {         // Seasonal availability
    startMonth: number;   // 1-12
    endMonth: number;     // 1-12
    isSeasonal: boolean;
  }
}
```

### 3. markets
Collection ID: `markets`
```typescript
{
  id: string;              // Market ID
  name: string;            // Market name
  description: string;     // Market description
  shortDescription: string; // Brief description for listings
  location: {
    address: string;       // Physical address
    coordinates: {
      latitude: number;
      longitude: number;
    };
    directions: string;    // How to get there
    landmarks: string[];   // Nearby landmarks
    parkingInfo?: string;  // Parking information
  };
  operatingHours: {
    regular: {
      open: string;         // Opening time (24h format)
      close: string;        // Closing time (24h format)
      daysOpen: string[];   // ['Monday', 'Tuesday', etc.]
    };
    special?: {            // Special hours
      holiday: string;     // Holiday name
      date: timestamp;
      open: string;
      close: string;
    }[];
  };
  sections: {              // Enhanced market sections
    id: string;
    name: string;
    description: string;
    vendorCount: number;
    location: string;      // Location within market
  }[];
  amenities: {            // Available amenities
    hasParking: boolean;
    hasRestroom: boolean;
    hasATM: boolean;
    hasFoodCourt: boolean;
    isAccessible: boolean; // Wheelchair accessible
    hasWifi: boolean;
  };
  images: {               // Enhanced images
    url: string;
    caption: string;
    type: 'main' | 'section' | 'amenity';
    order: number;
  }[];
  contact: {              // Market contact info
    phone: string;
    email: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
    }
  };
  stats: {                // Market statistics
    vendorCount: number;
    dailyVisitors: number;
    averageRating: number;
    reviewCount: number;
  };
  events: {              // Market events
    id: string;
    name: string;
    description: string;
    date: timestamp;
    type: 'sale' | 'festival' | 'holiday';
  }[];
  isActive: boolean;      // Whether market is active
  status: 'open' | 'closed' | 'holiday' | 'maintenance';
  createdAt: timestamp;
  updatedAt: timestamp;
  lastInspection?: timestamp; // Last health/safety inspection
  certifications: string[]; // Health/safety certifications
}
```

### 4. products
Collection ID: `products`
```typescript
{
  id: string;              // Product ID
  vendorId: string;        // Reference to vendor's user ID
  categoryId: string;      // Reference to category
  name: string;            // Product name
  description: string;     // Product description
  shortDescription: string; // Brief description for listings
  price: {
    amount: number;        // Current price
    unit: string;         // Price unit (per kg, per piece)
    compareAt?: number;   // Original/compare at price
    wholesale?: {         // Wholesale pricing
      minQuantity: number;
      price: number;
    }[];
    currency: string;     // Currency code
  };
  stock: {
    available: number;     // Available quantity
    unit: string;         // Stock unit (kg, pieces)
    lowStockThreshold: number; // Low stock alert threshold
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
    sku?: string;         // Stock keeping unit
    batchNumber?: string; // Batch/lot number
  };
  quality: {              // Quality indicators
    grade?: string;       // Product grade
    freshness: 'fresh' | 'day_old' | 'frozen';
    certification?: string[]; // Quality certifications
  };
  source: {              // Product source info
    location: string;    // Source location
    method: string;      // Catching/farming method
    date: timestamp;     // Catch/harvest date
  };
  nutrition?: {          // Nutritional information
    servingSize: string;
    calories: number;
    protein: number;
    fat: number;
    ingredients?: string[];
  };
  storage: {            // Storage information
    temperature: string;
    method: string;
    shelfLife: string;
  };
  images: {             // Enhanced product images
    url: string;
    type: 'primary' | 'secondary' | 'detail';
    order: number;
    caption?: string;
  }[];
  isAvailable: boolean;   // Whether product is currently available
  availability: {
    isAvailable: boolean;
    nextAvailable?: timestamp;
    seasonality?: {
      startMonth: number; // 1-12
      endMonth: number;   // 1-12
    }
  };
  ratings: {
    average: number;      // Average rating
    count: number;        // Number of ratings
    breakdown: {          // Rating breakdown
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    }
  };
  tags: string[];         // Search tags
  metadata: {            // Product metadata
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
  };
  stats: {              // Product statistics
    views: number;
    orders: number;
    favorites: number;
    lastSold: timestamp;
  };
  variants?: {          // Product variants
    id: string;
    name: string;
    price: number;
    stock: number;
    attributes: {
      size?: string;
      weight?: string;
      type?: string;
    }
  }[];
  createdAt: timestamp;
  updatedAt: timestamp;
  lastPriceUpdate: timestamp;
}
```

### 5. orders
Collection ID: `orders`
```typescript
{
  id: string;              // Order ID
  orderNumber: string;     // Human-readable order number
  buyerId: string;         // Reference to buyer's user ID
  vendorId: string;        // Reference to vendor's user ID
  items: [{
    productId: string;     // Reference to product
    quantity: number;      // Quantity ordered
    price: number;         // Price at time of order
    unit: string;         // Unit of measurement
    notes?: string;       // Special instructions per item
    customizations?: {    // Custom requirements
      size?: string;
      preparation?: string;
      packaging?: string;
    }
  }];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  statusHistory: {        // Order status history
    status: string;
    timestamp: timestamp;
    note?: string;
  }[];
  pricing: {
    subtotal: number;     // Items subtotal
    tax: number;         // Tax amount
    deliveryFee?: number; // Delivery fee if applicable
    discount?: {
      code?: string;     // Discount code used
      amount: number;    // Discount amount
      type: 'percentage' | 'fixed';
    };
    totalAmount: number;  // Final total amount
    currency: string;    // Currency code
  };
  payment: {
    status: 'pending' | 'paid' | 'refunded' | 'failed';
    method?: string;     // Payment method used
    transactionId?: string; // Payment transaction ID
    paidAt?: timestamp;
    refundedAt?: timestamp;
    receipt?: string;    // Receipt URL or reference
  };
  delivery?: {           // Delivery information
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    instructions?: string;
    preferredTime?: string;
    contact: {
      name: string;
      phone: string;
    };
    tracking?: {
      status: string;
      updatedAt: timestamp;
      estimatedDelivery: timestamp;
    }
  };
  pickup?: {            // Pickup information
    location: string;
    preferredTime: string;
    code: string;      // Pickup verification code
  };
  communication: {      // Order communication
    messages: [{
      sender: string;  // User ID
      message: string;
      timestamp: timestamp;
      isRead: boolean;
    }];
    lastMessage: timestamp;
  };
  notes?: string;        // General order notes
  feedback?: {          // Order feedback
    rating: number;
    comment: string;
    timestamp: timestamp;
  };
  metadata: {
    source: 'app' | 'web' | 'market';
    deviceInfo?: string;
    ipAddress?: string;
  };
  createdAt: timestamp;
  updatedAt: timestamp;
  scheduledFor?: timestamp; // For pre-orders
  completedAt?: timestamp;
  cancelledAt?: timestamp;
  cancellationReason?: string;
}
```

### 6. tourPackages
Collection ID: `tourPackages`
```typescript
{
  id: string;              // Package ID
  name: string;            // Package name
  description: string;     // Detailed description
  shortDescription: string; // Brief description for listings
  duration: {              // Enhanced duration info
    length: string;        // e.g., "8 hours"
    startTime: string[];   // Available start times
    endTime: string[];     // Corresponding end times
    timezone: string;      // Local timezone
  };
  includes: string[];      // What's included
  excludes: string[];      // What's not included
  highlights: string[];    // Tour highlights
  itinerary: [{           // Detailed itinerary
    time: string;
    activity: string;
    duration: string;
    location: string;
    description: string;
  }];
  pricing: {
    regular: {
      adult: number;
      child: number;
      infant: number;
    };
    group: {              // Group pricing
      minSize: number;
      maxSize: number;
      pricePerPerson: number;
    }[];
    seasonal?: [{        // Seasonal pricing
      startDate: timestamp;
      endDate: timestamp;
      adult: number;
      child: number;
    }];
    currency: string;
  };
  capacity: {
    min: number;         // Minimum group size
    max: number;         // Maximum group size
    availability: {      // Daily availability
      [date: string]: number;
    }
  };
  images: {              // Enhanced images
    url: string;
    caption: string;
    type: 'main' | 'gallery' | 'map';
    order: number;
  }[];
  locations: [{          // Tour locations
    name: string;
    description: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    visitDuration: string;
    images: string[];
  }];
  meetingPoint: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    instructions: string;
    landmarks: string[];
  };
  requirements: {        // Tour requirements
    minAge?: number;
    fitness?: string;
    documents?: string[];
    equipment?: string[];
  };
  cancellation: {       // Cancellation policy
    policy: string;
    deadline: number;   // Hours before tour
    refundPercent: number;
  };
  weather: {           // Weather policy
    conditions: string;
    alternativePlan: string;
  };
  guides: [{           // Available guides
    guideId: string;
    name: string;
    languages: string[];
    specialties: string[];
    rating: number;
  }];
  languages: string[]; // Available languages
  accessibility: {     // Accessibility info
    wheelchair: boolean;
    elderly: boolean;
    children: boolean;
    pets: boolean;
  };
  tags: string[];     // Search/filter tags
  isActive: boolean;  // Whether package is active
  status: 'active' | 'seasonal' | 'full' | 'maintenance';
  ratings: {
    average: number;
    count: number;
    breakdown: {      // Rating breakdown
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    }
  };
  stats: {           // Package statistics
    views: number;
    bookings: number;
    completionRate: number;
    popularDays: string[];
  };
  metadata: {       // SEO metadata
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
  };
  createdAt: timestamp;
  updatedAt: timestamp;
  lastBooked: timestamp;
}
```

### 7. tourBookings
Collection ID: `tourBookings`
```typescript
{
  id: string;              // Booking ID
  packageId: string;       // Reference to tour package
  touristId: string;       // Reference to tourist's user ID
  guideId?: string;        // Reference to assigned guide's user ID
  date: timestamp;         // Tour date
  startTime: string;       // Start time
  participants: {
    adults: number;
    children: number;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;     // Total booking amount
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;  // Payment method used
  specialRequests?: string; // Special requests/notes
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### 8. reviews
Collection ID: `reviews`
```typescript
{
  id: string;              // Review ID
  userId: string;          // User who wrote the review
  targetType: 'product' | 'vendor' | 'tourPackage' | 'guide';
  targetId: string;        // ID of the reviewed item/person
  rating: number;          // Rating (1-5)
  comment: string;         // Review text
  images?: string[];       // Optional review images
  isVerified: boolean;     // Whether reviewer is verified purchaser
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### 9. serviceCategories
Collection ID: `serviceCategories`
```typescript
{
  id: string;              // Category ID
  name: string;            // Category name
  types: string[];         // Available service types
  description: string;     // Category description
  icon: string;           // Category icon/emoji
  isActive: boolean;      // Whether category is active
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

## Timestamps and Audit Fields

All collections should include the following audit fields:
- `createdAt`: Timestamp of when the document was created
- `updatedAt`: Timestamp of the last update
- `isActive`: Boolean indicating if the item is active (where applicable)

## Indexes

Required indexes will be created automatically by Firebase when needed. Custom indexes should be created for:
1. Products by category and rating
2. Orders by status and date
3. Tour bookings by date and status
4. Reviews by target type and rating

## Security Rules

Security rules are defined in `firestore.rules` and include:
- Role-based access control
- User authentication checks
- Data validation
- Protection against unauthorized modifications

## Data Validation

All string fields should:
- Not be empty
- Have reasonable maximum lengths
- Be properly sanitized before storage

All number fields should:
- Have minimum and maximum values where appropriate
- Be validated for reasonable ranges

All references should:
- Point to existing documents
- Be validated before storage 