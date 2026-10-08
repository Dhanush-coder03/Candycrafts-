const INITIAL_CATEGORIES = [
  {
    id: "cat_bouquets",
    name: "Handmade Bouquets",
    slug: "handmade-bouquets",
    tagline: "Everlasting Floral Arrangements",
    description: "Handcrafted fabric and crepe paper bouquets designed to stay forever in full bloom.",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80",
    itemCount: 4
  },
  {
    id: "cat_paper_flowers",
    name: "Paper Flowers",
    slug: "paper-flowers",
    tagline: "Artisanal Botanical Sculptures",
    description: "Intricately folded and textured Italian crepe petals mimicking nature's finest blossoms.",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80",
    itemCount: 3
  },
  {
    id: "cat_gift_crafts",
    name: "Gift Crafts",
    slug: "gift-crafts",
    tagline: "Memorable Keepsakes",
    description: "Thoughtfully assembled gift arrangements, floral boxes, and personalized tokens.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80",
    itemCount: 3
  },
  {
    id: "cat_decorative",
    name: "Decorative Crafts",
    slug: "decorative-crafts",
    tagline: "Living Space Accents",
    description: "Aesthetic dried floral bell jars, wall frames, and artisanal mantle showpieces.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    itemCount: 2
  },
  {
    id: "cat_idols",
    name: "Handmade Idols",
    slug: "handmade-idols",
    tagline: "Spiritual Clay Artistry",
    description: "Eco-friendly, hand-sculpted miniature terracotta and clay idols with delicate metallic accents.",
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80",
    itemCount: 2
  },
  {
    id: "cat_custom",
    name: "Custom Creations",
    slug: "custom-creations",
    tagline: "Tailored to Your Heart",
    description: "Bespoke color palettes, bridal flower keepsakes, and anniversary personalized sculptures.",
    image: "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=800&auto=format&fit=crop&q=80",
    itemCount: 2
  }
];

const INITIAL_PRODUCTS = [
  {
    id: "product_001",
    name: "Pure Ivory White Floral Bouquet",
    price: 899,
    originalPrice: 1199,
    category: "Handmade Bouquets",
    description: "An ethereal composition of white handmade paper peonies, delicate baby's breath, and preserved ivory hydrangeas. Hand-tied in artisan textured kraft paper with a soft chiffon ribbon.",
    details: {
      materials: "180g Italian Crepe paper, floral wire, dried lagurus, textured craft wrap, chiffon ribbon",
      dimensions: "36 cm height x 22 cm width",
      craftTime: "5 hours hand-shaping",
      care: "Keep away from high humidity and direct water; gently dust when needed."
    },
    images: [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80"
    ],
    featured: true,
    available: true,
    rating: 4.9,
    reviewsCount: 42
  },
  {
    id: "product_002",
    name: "Blushing Rose & Peony Bouquet",
    price: 999,
    originalPrice: 1299,
    category: "Handmade Bouquets",
    description: "Delicately sculpted in soft pastel blush, dusty rose, and tea-pink tones. Each petal is individually rolled, stretched, and brushed with subtle botanical pigment for authentic texture.",
    details: {
      materials: "Sculpted archival crepe paper, floral tape, eucalyptus foliage, organic linen wrap",
      dimensions: "38 cm height x 25 cm width",
      craftTime: "6 hours hand-sculpting",
      care: "Avoid direct prolonged sunlight to maintain gentle pastel hues."
    },
    images: [
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=800&auto=format&fit=crop&q=80"
    ],
    featured: true,
    available: true,
    rating: 5.0,
    reviewsCount: 57
  },
  {
    id: "product_003",
    name: "Enchanted Lavender & Violet Bunch",
    price: 849,
    originalPrice: 1099,
    category: "Handmade Bouquets",
    description: "An inspiring blend of deep amethyst, soft lilac, and lavender paper ranunculus blossoms accented with dried thistle and silver dollar eucalyptus.",
    details: {
      materials: "Hand-dyed crepe paper, steel stems, preserved bunny tails, plum organza ribbon",
      dimensions: "34 cm height x 20 cm width",
      craftTime: "4.5 hours hand-crafting",
      care: "Dust lightly with a soft brush."
    },
    images: [
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80"
    ],
    featured: true,
    available: true,
    rating: 4.8,
    reviewsCount: 29
  },
  {
    id: "product_004",
    name: "Serene Azure Blue Hydrangea Bouquet",
    price: 949,
    originalPrice: 1199,
    category: "Handmade Bouquets",
    description: "Captivating cornflower blue and soft sky hues woven together with over 40 intricate micro-florets. Designed as an heirloom centerpiece.",
    details: {
      materials: "High-grade Japanese origami and crepe papers, silk twine, wire armature",
      dimensions: "35 cm height x 22 cm width",
      craftTime: "7 hours detailed hand assembly",
      care: "Keep in a dry indoor space."
    },
    images: [
      "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80"
    ],
    featured: false,
    available: true,
    rating: 4.9,
    reviewsCount: 31
  },
  {
    id: "product_005",
    name: "Golden Meadow Sunflower Bouquet",
    price: 799,
    originalPrice: 999,
    category: "Handmade Bouquets",
    description: "Radiant sunny yellow handmade sunflowers with rich textured chocolate centers. Accompanied by rustic dried wheat stalks and botanical greens.",
    details: {
      materials: "Textured paper, velvet dust core, wire stem, hessian burlap wrap",
      dimensions: "40 cm height x 25 cm width",
      craftTime: "5 hours artisanal work",
      care: "Keep away from wet surfaces."
    },
    images: [
      "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80"
    ],
    featured: true,
    available: true,
    rating: 4.9,
    reviewsCount: 48
  },
  {
    id: "product_006",
    name: "Velvet Crimson Rose Handmade Bouquet",
    price: 1099,
    originalPrice: 1399,
    category: "Handmade Bouquets",
    description: "Rich, passionate deep scarlet and ruby hand-formed roses with curled petal edges that mirror fresh morning blooms. Timeless keepsake.",
    details: {
      materials: "Imported German heavy crepe paper, florist stem wrap, wax seal tag, satin ribbon",
      dimensions: "38 cm height x 26 cm width",
      craftTime: "6.5 hours precision crafting",
      care: "Dust occasionally; do not wash with water."
    },
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80"
    ],
    featured: true,
    available: true,
    rating: 5.0,
    reviewsCount: 64
  },
  {
    id: "product_007",
    name: "Artisan Multicolor Botanical Arrangement",
    price: 1199,
    originalPrice: 1499,
    category: "Decorative Crafts",
    description: "A breathtaking symphony of coral, sage, lavender, and buttercup blossoms gathered in an artisanal ceramic urn style.",
    details: {
      materials: "Mixed premium papers, hand-twisted paper leaves, ceramic pedestal base included",
      dimensions: "32 cm height x 30 cm width",
      craftTime: "8 hours master assemblage",
      care: "Clean with soft blower or feather duster."
    },
    images: [
      "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80"
    ],
    featured: true,
    available: true,
    rating: 4.9,
    reviewsCount: 36
  },
  {
    id: "product_008",
    name: "Handcrafted Clay Terracotta Ganesha Idol",
    price: 749,
    originalPrice: 949,
    category: "Handmade Idols",
    description: "Mindfully hand-sculpted using pure organic natural clay with subtle gold leaf accents on the crown and modak. Auspicious and plastic-free.",
    details: {
      materials: "Organic unbaked terracotta clay, non-toxic water pigments, natural lacquer seal",
      dimensions: "15 cm height x 11 cm width x 9 cm depth",
      craftTime: "4 hours sculpting & slow sun curing",
      care: "Wipe with a clean dry microfiber cloth."
    },
    images: [
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1567591414240-e2b26002008f?w=800&auto=format&fit=crop&q=80"
    ],
    featured: true,
    available: true,
    rating: 5.0,
    reviewsCount: 52
  },
  {
    id: "product_009",
    name: "Minimalist Calming Buddha Clay Idol",
    price: 699,
    originalPrice: 899,
    category: "Handmade Idols",
    description: "An artisan-crafted meditative Buddha statuette finished in a muted stone wash and warm earthy patina. Ideal for peaceful home sanctuaries.",
    details: {
      materials: "Clay stoneware composite, mineral wash, protective matte wax",
      dimensions: "17 cm height x 12 cm width",
      craftTime: "3.5 hours hand-carving",
      care: "Clean with a dry lint-free cloth."
    },
    images: [
      "https://images.unsplash.com/photo-1567591414240-e2b26002008f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80"
    ],
    featured: false,
    available: true,
    rating: 4.8,
    reviewsCount: 22
  },
  {
    id: "product_010",
    name: "Bespoke Keepsake Memory Gift Box",
    price: 1299,
    originalPrice: 1599,
    category: "Gift Crafts",
    description: "A luxury hardcover handcrafted gift box adorned with a cluster of handmade miniature roses, scented dried lavender pods, and a personalized message card.",
    details: {
      materials: "Sturdy linen-wrapped bookbinding board, handmade paper blossoms, metallic foil letterpress",
      dimensions: "22 cm x 18 cm x 9 cm",
      craftTime: "5 hours hand-finishing",
      care: "Store in a dry cool area."
    },
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80"
    ],
    featured: true,
    available: true,
    rating: 4.9,
    reviewsCount: 39
  },
  {
    id: "product_011",
    name: "Everlasting Peony Glass Cloche Dome",
    price: 1149,
    originalPrice: 1449,
    category: "Paper Flowers",
    description: "A single, magnificent blush pink handmade crepe peony nestled amidst moss and tiny wild seeds under an elegant crystal-clear glass dome with a solid wood base.",
    details: {
      materials: "Borosilicate glass dome, solid beechwood base, hand-folded crepe peony, preserved moss",
      dimensions: "20 cm height x 13 cm diameter base",
      craftTime: "4 hours artisan assembly",
      care: "Glass dome can be wiped with standard glass cleaner."
    },
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80"
    ],
    featured: false,
    available: true,
    rating: 4.9,
    reviewsCount: 34
  },
  {
    id: "product_012",
    name: "Custom Bridal Keepsake Flora Set",
    price: 1599,
    originalPrice: 1899,
    category: "Custom Creations",
    description: "Custom commissioned bouquet tailored to your specific wedding dress and palette. Includes matching boutonnière, mini flower girl wand, and an archival display stand.",
    details: {
      materials: "Italian crepe paper, custom hand-dyed silk ribbons, pearl accents, steel wire",
      dimensions: "Custom sizing (standard: 38 cm x 28 cm)",
      craftTime: "10-12 hours personalized hand-crafting",
      care: "Packaged in an archival preservation box."
    },
    images: [
      "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80"
    ],
    featured: true,
    available: true,
    rating: 5.0,
    reviewsCount: 47
  }
];

const DEFAULT_CONTACT_INFO = {
  brandName: 'Candy Crafts',
  tagline: 'Artisan Studio & Workshop',
  address: 'Craft Sanctuary 42, Blossom Lane, Heritage Cultural Quarter, New Delhi - 110001',
  email: 'candycraftssstudio@gmail.com',
  ownerEmail: 'candycraftssstudio@gmail.com',
  emailPass: '',
  phone: '+91 98765 43210',
  hours: 'Monday – Saturday, 10:00 AM – 6:30 PM',
  instagramUrl: 'https://www.instagram.com/candycrafts2026?stkn=cTY2bnZ3M2Z0dHhy',
  instagramHandle: '@candycrafts2026'
};

module.exports = {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  DEFAULT_CONTACT_INFO
};
