/* ============================================================
   BIG MART — PRODUCTS DATA
   Add new products here. Filtered by `category` on each page.
   ============================================================ */

window.BIGMART_PRODUCTS = [
  /* ================= FRUITS ================= */
  {
    id: 'apple-red',
    name: 'Red Apples',
    tag: 'Fresh Fruits',
    category: 'fruits',
    image: 'apple',
    price: 3.99,
    oldPrice: 4.99,
    rating: 4.8,
    reviews: 142,
    badge: '-20%',
    description: 'Crisp, sweet, and perfect for snacking, baking, or salads.',
    inStock: true,
    isNew: false,
    added: 6
  },
  {
    id: 'banana',
    name: 'Ripe Bananas',
    tag: 'Fresh Fruits',
    category: 'fruits',
    image: 'banana',
    price: 2.49,
    oldPrice: null,
    rating: 4.7,
    reviews: 189,
    badge: 'Best Seller',
    description: 'Naturally sweet, energy-packed, and great for smoothies.',
    inStock: true,
    isNew: false,
    added: 5
  },
  {
    id: 'mango',
    name: 'Sweet Mangoes',
    tag: 'Fresh Fruits',
    category: 'fruits',
    image: 'mango',
    price: 5.50,
    oldPrice: null,
    rating: 4.9,
    reviews: 96,
    badge: 'New',
    description: 'Juicy, tropical, and bursting with natural sweetness.',
    inStock: true,
    isNew: true,
    added: 9
  },
  {
    id: 'grapes',
    name: 'Seedless Grapes',
    tag: 'Fresh Fruits',
    category: 'fruits',
    image: 'seedless grape',
    price: 4.25,
    oldPrice: 5.00,
    rating: 4.6,
    reviews: 78,
    badge: '-15%',
    description: 'Bite-sized bursts of sweetness — no seeds, all flavor.',
    inStock: true,
    isNew: false,
    added: 4
  },
  {
    id: 'orange',
    name: 'Fresh Oranges',
    tag: 'Fresh Fruits',
    category: 'fruits',
    image: 'orange',
    price: 3.20,
    oldPrice: null,
    rating: 4.7,
    reviews: 112,
    badge: null,
    description: 'Vitamin C-rich, zesty, and incredibly refreshing.',
    inStock: true,
    isNew: false,
    added: 3
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    tag: 'Fresh Fruits',
    category: 'fruits',
    image: 'watermelon',
    price: 6.99,
    oldPrice: 8.50,
    rating: 4.8,
    reviews: 64,
    badge: '-18%',
    description: 'Cool, hydrating, and the taste of summer itself.',
    inStock: true,
    isNew: false,
    added: 2
  },

  
  /* ================= VEGETABLES ================= */
  { id: 'broccoli',     name: 'Fresh Broccoli',    tag: 'Vegetables',   category: 'vegetables', image: 'broccoli',     price: 2.80, oldPrice: null, rating: 4.6, reviews:  98, badge: null,           description: 'Crisp, nutrient-dense florets — perfect for steaming or stir-fry.',         inStock: true, isNew: false, added: 5 },
  { id: 'tomatoes',     name: 'Ripe Tomatoes',     tag: 'Vegetables',   category: 'vegetables', image: 'tomatoes',     price: 2.20, oldPrice: 2.80, rating: 4.7, reviews: 156, badge: '-21%',         description: 'Juicy, vine-ripened tomatoes bursting with flavor.',                        inStock: true, isNew: false, added: 4 },
  { id: 'carrots',      name: 'Fresh Carrots',     tag: 'Vegetables',   category: 'vegetables', image: 'carrots',      price: 1.90, oldPrice: null, rating: 4.8, reviews: 134, badge: 'Best Seller',  description: 'Sweet, crunchy, and rich in beta-carotene.',                                 inStock: true, isNew: false, added: 6 },
  { id: 'spinach',      name: 'Baby Spinach',      tag: 'Vegetables',   category: 'vegetables', image: 'spinach',      price: 3.10, oldPrice: null, rating: 4.5, reviews:  72, badge: null,           description: 'Tender baby leaves — great raw in salads or wilted in dishes.',              inStock: true, isNew: true,  added: 8 },
  { id: 'bell-peppers', name: 'Bell Peppers',      tag: 'Vegetables',   category: 'vegetables', image: 'bell-peppers', price: 3.75, oldPrice: 4.50, rating: 4.6, reviews:  89, badge: '-16%',         description: 'Colorful, sweet, and crisp — perfect for grilling or salads.',               inStock: true, isNew: false, added: 3 },
  { id: 'cucumber',     name: 'Garden Cucumbers',  tag: 'Vegetables',   category: 'vegetables', image: 'cucumber',     price: 1.60, oldPrice: null, rating: 4.4, reviews:  61, badge: null,           description: 'Cool, crisp, and refreshing — ideal for salads and dips.',                    inStock: true, isNew: false, added: 2 },

  /* ================= DAIRY ================= */
  { id: 'milk-whole',     name: 'Whole Milk 1L',    tag: 'Dairy', category: 'dairy', image: 'milk-whole',     price: 2.20, oldPrice: 2.80, rating: 4.7, reviews:  89, badge: '-21%',         description: 'Creamy, farm-fresh whole milk — perfect for coffee, cereal, and cooking.',  inStock: true, isNew: false, added: 5 },
  { id: 'cheese-cheddar', name: 'Cheddar Cheese',   tag: 'Dairy', category: 'dairy', image: 'cheese-cheddar', price: 5.90, oldPrice: null, rating: 4.8, reviews: 112, badge: 'Best Seller',  description: 'Sharp, aged cheddar — great for sandwiches, snacking, and melting.',        inStock: true, isNew: false, added: 4 },
  { id: 'yogurt-greek',   name: 'Greek Yogurt',     tag: 'Dairy', category: 'dairy', image: 'yogurt-greek',   price: 3.40, oldPrice: null, rating: 4.7, reviews: 145, badge: null,           description: 'Thick, creamy, and protein-packed — perfect plain or with fruit.',           inStock: true, isNew: false, added: 6 },
  { id: 'butter',         name: 'Salted Butter',    tag: 'Dairy', category: 'dairy', image: 'butter',         price: 4.10, oldPrice: 4.90, rating: 4.6, reviews:  76, badge: '-16%',         description: 'Rich, creamy butter churned from fresh cream.',                              inStock: true, isNew: false, added: 3 },
  { id: 'eggs',           name: 'Farm Eggs (Dozen)',tag: 'Dairy', category: 'dairy', image: 'eggs',           price: 3.80, oldPrice: null, rating: 4.9, reviews: 210, badge: null,           description: 'Free-range eggs with rich golden yolks — perfect for every meal.',           inStock: true, isNew: true,  added: 8 },
  { id: 'cream-cheese',   name: 'Cream Cheese',     tag: 'Dairy', category: 'dairy', image: 'cream-cheese',   price: 3.20, oldPrice: null, rating: 4.5, reviews:  54, badge: null,           description: 'Smooth and tangy — ideal for bagels, dips, and cheesecake.',                  inStock: true, isNew: false, added: 2 },

  /* ================= BAKERY ================= */
  { id: 'sourdough',        name: 'Sourdough Bread',    tag: 'Bakery', category: 'bakery', image: 'sourdough',        price: 5.50,  oldPrice: null, rating: 4.6, reviews:  76, badge: 'New',          description: 'Rustic sourdough with a crisp crust and chewy crumb — baked fresh daily.',   inStock: true, isNew: true,  added: 9 },
  { id: 'croissant',        name: 'Butter Croissants',  tag: 'Bakery', category: 'bakery', image: 'croissant',        price: 4.20,  oldPrice: 5.20, rating: 4.8, reviews: 132, badge: '-19%',         description: 'Flaky, buttery, and baked to golden perfection.',                            inStock: true, isNew: false, added: 6 },
  { id: 'cake-chocolate',   name: 'Chocolate Cake',     tag: 'Bakery', category: 'bakery', image: 'cake-chocolate',   price: 12.99, oldPrice: null, rating: 4.9, reviews:  98, badge: 'Best Seller',  description: 'Rich, moist chocolate cake — perfect for celebrations.',                    inStock: true, isNew: false, added: 5 },
  { id: 'bagel',            name: 'Plain Bagels',       tag: 'Bakery', category: 'bakery', image: 'bagel',            price: 3.60,  oldPrice: null, rating: 4.5, reviews:  64, badge: null,           description: 'Soft, chewy bagels — perfect toasted with cream cheese.',                     inStock: true, isNew: false, added: 3 },
  { id: 'muffin-blueberry', name: 'Blueberry Muffins',  tag: 'Bakery', category: 'bakery', image: 'muffin-blueberry', price: 4.50,  oldPrice: 5.50, rating: 4.7, reviews: 108, badge: '-18%',         description: 'Moist muffins loaded with juicy blueberries.',                               inStock: true, isNew: false, added: 4 },
  { id: 'baguette',         name: 'French Baguette',    tag: 'Bakery', category: 'bakery', image: 'baguette',         price: 3.20,  oldPrice: null, rating: 4.6, reviews:  71, badge: null,           description: 'Crisp crust, soft inside — the classic French bread.',                       inStock: true, isNew: false, added: 2 },

  /* ================= BEVERAGES ================= */
  { id: 'orange-juice',   name: 'Orange Juice 1L',         tag: 'Beverages', category: 'beverages', image: 'orange-juice',   price: 3.99,  oldPrice: 4.99, rating: 4.8, reviews: 145, badge: '-20%',         description: '100% pure squeezed orange juice — no sugar, no additives.',                  inStock: true, isNew: false, added: 6 },
  { id: 'green-tea',      name: 'Green Tea (25 bags)',     tag: 'Beverages', category: 'beverages', image: 'green-tea',      price: 4.60,  oldPrice: null, rating: 4.6, reviews:  87, badge: null,           description: 'Delicate green tea leaves — soothing, refreshing, and antioxidant-rich.',    inStock: true, isNew: false, added: 4 },
  { id: 'coffee-beans',   name: 'Coffee Beans 500g',       tag: 'Beverages', category: 'beverages', image: 'coffee-beans',   price: 11.50, oldPrice: 13.90,rating: 4.9, reviews: 189, badge: 'Best Seller',  description: 'Freshly roasted arabica beans — rich, smooth, and aromatic.',                 inStock: true, isNew: false, added: 7 },
  { id: 'sparkling-water',name: 'Sparkling Water 6-pack',  tag: 'Beverages', category: 'beverages', image: 'sparkling-water',price: 5.40,  oldPrice: null, rating: 4.5, reviews:  62, badge: null,           description: 'Crisp, refreshing sparkling water — zero calories, all bubbles.',             inStock: true, isNew: true,  added: 8 },
  { id: 'lemonade',       name: 'Fresh Lemonade 1L',       tag: 'Beverages', category: 'beverages', image: 'lemonade',       price: 3.30,  oldPrice: null, rating: 4.7, reviews:  94, badge: null,           description: 'Sweet-tart lemonade made with real lemons.',                                  inStock: true, isNew: false, added: 3 },
  { id: 'smoothie-berry', name: 'Berry Smoothie Mix',      tag: 'Beverages', category: 'beverages', image: 'smoothie-berry', price: 7.50,  oldPrice: 8.90, rating: 4.6, reviews:  73, badge: '-16%',         description: 'A vibrant blend of berries — just add milk or yogurt.',                        inStock: true, isNew: false, added: 2 },

  /* ================= SNACKS ================= */
  { id: 'mixed-nuts',        name: 'Mixed Nuts 500g',           tag: 'Snacks', category: 'snacks', image: 'mixed-nuts',        price: 7.25, oldPrice: null, rating: 4.5, reviews:  60, badge: null,           description: 'A hearty mix of almonds, cashews, walnuts, and peanuts.',                    inStock: true, isNew: false, added: 5 },
  { id: 'potato-chips',      name: 'Potato Chips',              tag: 'Snacks', category: 'snacks', image: 'potato-chips',      price: 2.80, oldPrice: 3.50, rating: 4.6, reviews: 178, badge: '-20%',         description: 'Thin, crispy, and perfectly salted — the ultimate snack.',                    inStock: true, isNew: false, added: 6 },
  { id: 'cookies-chocolate', name: 'Chocolate Chip Cookies',    tag: 'Snacks', category: 'snacks', image: 'cookies-chocolate', price: 4.50, oldPrice: null, rating: 4.9, reviews: 214, badge: 'Best Seller',  description: 'Chewy, chocolatey, and baked to golden perfection.',                          inStock: true, isNew: false, added: 7 },
  { id: 'popcorn',           name: 'Butter Popcorn',            tag: 'Snacks', category: 'snacks', image: 'popcorn',           price: 3.10, oldPrice: null, rating: 4.4, reviews:  92, badge: null,           description: 'Light, fluffy popcorn with real butter flavor.',                              inStock: true, isNew: false, added: 3 },
  { id: 'granola-bars',      name: 'Granola Bars (6-pack)',     tag: 'Snacks', category: 'snacks', image: 'granola-bars',      price: 5.20, oldPrice: 6.30, rating: 4.7, reviews: 138, badge: '-17%',         description: 'Chewy, wholesome bars with oats, honey, and nuts.',                           inStock: true, isNew: true,  added: 8 },
  { id: 'pretzels',          name: 'Salted Pretzels',           tag: 'Snacks', category: 'snacks', image: 'pretzels',          price: 2.60, oldPrice: null, rating: 4.3, reviews:  55, badge: null,           description: 'Crunchy, golden, and perfectly salted — ideal for dipping.',                  inStock: true, isNew: false, added: 2 }
];