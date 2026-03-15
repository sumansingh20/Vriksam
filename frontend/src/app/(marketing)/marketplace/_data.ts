// =============================================================================
// VRIKSHAM Marketplace - Mock Plant Data
// =============================================================================

export interface PlantCareInstructions {
  light: string;
  water: string;
  temperature: string;
  humidity: string;
}

export interface Plant {
  id: number;
  name: string;
  scientificName: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string[];
  light: 'Low' | 'Medium' | 'Bright';
  size: 'Small' | 'Medium' | 'Large';
  health: 'Excellent' | 'Good';
  description: string;
  careInstructions: PlantCareInstructions;
  benefits: string[];
  gradient: string;
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviews: number;
}

/**
 * Formats a price in INR without decimals.
 * @example formatPrice(1299) // "₹1,299"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const plants: Plant[] = [
  {
    id: 1,
    name: 'Areca Palm',
    scientificName: 'Dypsis lutescens',
    slug: 'areca-palm',
    price: 599,
    originalPrice: 799,
    category: ['Indoor', 'Palms', 'Air Purifying'],
    light: 'Bright',
    size: 'Large',
    health: 'Excellent',
    description:
      'The Areca Palm is a stunning tropical plant that brings lush, feathery elegance to any room. A top-rated NASA air purifier, it naturally humidifies your space while removing harmful toxins like formaldehyde and xylene. Its graceful, arching fronds create a calming, resort-like atmosphere that transforms any corner into a tropical retreat.',
    careInstructions: {
      light:
        'Thrives in bright, indirect light. Shield from harsh direct sun which can scorch delicate fronds.',
      water:
        'Water when the top 2-3 inches of soil feel dry. Enjoys consistent moisture but despises waterlogged roots.',
      temperature:
        '18-27\u00B0C (65-80\u00B0F). Protect from cold drafts and temperatures below 10\u00B0C.',
      humidity:
        'Loves humidity above 50%. Mist daily or place near a humidifier for best growth.',
    },
    benefits: [
      'Removes formaldehyde, xylene & toluene from air',
      'Acts as a natural room humidifier',
      'Non-toxic and safe for pets and children',
      'Proven to reduce stress and boost productivity',
    ],
    gradient: 'from-emerald-400 to-teal-500',
    isBestseller: true,
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 2,
    name: 'Money Plant Golden',
    scientificName: 'Epipremnum aureum',
    slug: 'money-plant-golden',
    price: 249,
    category: ['Indoor', 'Air Purifying'],
    light: 'Low',
    size: 'Small',
    health: 'Excellent',
    description:
      'The Money Plant Golden is one of the most beloved and low-maintenance houseplants in India. With cascading heart-shaped golden-green leaves, it is said to bring prosperity and good fortune. Perfect for beginners and experienced plant parents alike, it thrives in almost any condition and looks stunning in hanging baskets or trailing from shelves.',
    careInstructions: {
      light:
        'Adaptable to low to bright indirect light. Avoid direct sun which can burn leaves.',
      water:
        'Water when soil is dry to touch. Tolerant of occasional missed watering sessions.',
      temperature:
        '15-30\u00B0C (59-86\u00B0F). Very adaptable to a wide range of indoor temperatures.',
      humidity:
        'Adapts to normal household humidity. Benefits from occasional misting in dry months.',
    },
    benefits: [
      'Excellent air purifier \u2014 removes formaldehyde & benzene',
      'Extremely low maintenance and beginner-friendly',
      'Believed to attract wealth and prosperity (Vastu)',
      'Thrives equally well in water or soil',
    ],
    gradient: 'from-yellow-300 to-emerald-400',
    isBestseller: true,
    rating: 4.7,
    reviews: 512,
  },
  {
    id: 3,
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    slug: 'snake-plant',
    price: 349,
    category: ['Indoor', 'Succulents', 'Air Purifying'],
    light: 'Low',
    size: 'Medium',
    health: 'Excellent',
    description:
      'The Snake Plant, also called Mother-in-Law\u2019s Tongue, is an architectural masterpiece of nature. Its tall, sword-like leaves with striking yellow-edged variegation make it a stunning decor piece. One of the hardiest houseplants known, it thrives on neglect and is nearly impossible to kill.',
    careInstructions: {
      light:
        'Thrives in any light from low to bright indirect. Incredibly adaptable to different rooms.',
      water:
        'Water sparingly every 2-3 weeks. Allow soil to dry completely between waterings.',
      temperature:
        '13-30\u00B0C (55-86\u00B0F). Remarkably drought and temperature tolerant.',
      humidity:
        'Thrives in normal household humidity. No special requirements needed.',
    },
    benefits: [
      'NASA top air purifier \u2014 converts CO\u2082 to O\u2082 at night',
      'Perfect bedroom plant for better sleep quality',
      'Virtually indestructible \u2014 ideal for beginners',
      'Removes toxins including benzene and formaldehyde',
    ],
    gradient: 'from-green-600 to-emerald-800',
    rating: 4.9,
    reviews: 387,
  },
  {
    id: 4,
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    slug: 'peace-lily',
    price: 449,
    category: ['Indoor', 'Flowering', 'Air Purifying'],
    light: 'Low',
    size: 'Medium',
    health: 'Good',
    description:
      'The Peace Lily is a timeless classic with glossy dark leaves and elegant white spathes that bloom reliably even in low light. One of the few flowering plants that thrive in shade, it is both beautiful and functional as a powerful air purifier that also removes mold spores from the air.',
    careInstructions: {
      light:
        'Prefers low to medium indirect light. Avoid direct sunlight which scorches leaves.',
      water:
        'Keep soil evenly moist. Wilts dramatically when thirsty but recovers quickly after watering.',
      temperature:
        '18-28\u00B0C (65-82\u00B0F). Sensitive to cold drafts near windows and doors.',
      humidity:
        'Appreciates high humidity above 50%. Mist leaves regularly or use a pebble tray.',
    },
    benefits: [
      'Blooms beautiful white flowers even in low light',
      'Top NASA air purifier for indoor spaces',
      'Removes mold spores and allergens from the air',
      'Signals when it needs water by wilting gently',
    ],
    gradient: 'from-slate-200 to-emerald-300',
    isNew: true,
    rating: 4.6,
    reviews: 198,
  },
  {
    id: 5,
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    slug: 'fiddle-leaf-fig',
    price: 899,
    originalPrice: 1199,
    category: ['Indoor'],
    light: 'Bright',
    size: 'Large',
    health: 'Good',
    description:
      'The Fiddle Leaf Fig is the undisputed star of interior design. With its large, violin-shaped leaves and tall, architectural form, it makes a bold statement in any room. A favourite of designers and plant enthusiasts worldwide, it transforms ordinary spaces into magazine-worthy interiors.',
    careInstructions: {
      light:
        'Needs bright, indirect light for healthy growth. Rotate weekly for even leaf development.',
      water:
        'Water when top inch of soil is dry. A consistent watering schedule is the key to success.',
      temperature:
        '18-24\u00B0C (65-75\u00B0F). Dislikes sudden temperature fluctuations and drafts.',
      humidity:
        'Prefers humidity above 40%. Mist leaves regularly or use a nearby humidifier.',
    },
    benefits: [
      'Stunning architectural focal point for any room',
      'Improves indoor air quality significantly',
      'Boosts mood, creativity, and mental well-being',
      'Long-lived plant that grows with you for years',
    ],
    gradient: 'from-green-400 to-emerald-600',
    rating: 4.5,
    reviews: 156,
  },
  {
    id: 6,
    name: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    slug: 'rubber-plant',
    price: 399,
    category: ['Indoor', 'Air Purifying'],
    light: 'Medium',
    size: 'Medium',
    health: 'Excellent',
    description:
      'The Rubber Plant is a bold, glossy-leaved beauty that adds instant drama to any space. Its thick, dark burgundy-green leaves have an almost leather-like sheen that catches the light beautifully. Easy to care for and moderately fast-growing, it is a stunning air-purifying champion.',
    careInstructions: {
      light:
        'Bright to medium indirect light. Tolerates some direct morning sun without issues.',
      water:
        'Water when the top half of soil is dry. Prefers slightly dry conditions over soggy roots.',
      temperature:
        '16-27\u00B0C (60-80\u00B0F). Keep away from cold windows during winter months.',
      humidity:
        'Adapts to average household humidity. Wipe leaves regularly to maintain their glossy sheen.',
    },
    benefits: [
      'Powerful air purifier that removes formaldehyde',
      'Easy to propagate and share with friends',
      'Tolerant of various light conditions',
      'Adds a bold, tropical aesthetic to interiors',
    ],
    gradient: 'from-emerald-700 to-green-900',
    rating: 4.7,
    reviews: 289,
  },
  {
    id: 7,
    name: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    slug: 'spider-plant',
    price: 199,
    category: ['Indoor', 'Air Purifying'],
    light: 'Medium',
    size: 'Small',
    health: 'Excellent',
    description:
      'The Spider Plant is a beloved classic known for its graceful arching leaves and adorable baby plantlets that dangle like tiny green spiders. Extremely adaptable and nearly impossible to kill, it is the perfect first plant and makes a stunning display in hanging baskets or on high shelves.',
    careInstructions: {
      light:
        'Thrives in bright to medium indirect light. Tolerates low light but grows slower.',
      water:
        'Water when the top inch of soil feels dry. Prefers consistent, even moisture levels.',
      temperature:
        '13-27\u00B0C (55-80\u00B0F). Very adaptable to typical indoor temperatures.',
      humidity:
        'Happy in normal household humidity. Browning leaf tips may indicate the air is too dry.',
    },
    benefits: [
      'Produces oxygen and removes carbon monoxide from air',
      'Completely safe for pets and children',
      'Produces baby plants you can share with others',
      'One of the easiest plants to grow successfully',
    ],
    gradient: 'from-lime-300 to-green-500',
    isBestseller: true,
    rating: 4.8,
    reviews: 445,
  },
  {
    id: 8,
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    slug: 'zz-plant',
    price: 549,
    category: ['Indoor'],
    light: 'Low',
    size: 'Medium',
    health: 'Excellent',
    description:
      'The ZZ Plant is the ultimate low-maintenance houseplant with waxy, emerald-green leaves that look almost artificial in their perfection. It stores water in its thick rhizomes, making it incredibly drought-tolerant and forgiving of missed watering. A modern, sculptural beauty for any minimalist space.',
    careInstructions: {
      light:
        'Thrives in low to bright indirect light. One of the best plants for dimly lit rooms.',
      water:
        'Water every 2-3 weeks at most. Extremely drought tolerant thanks to water-storing rhizomes.',
      temperature:
        '18-28\u00B0C (65-82\u00B0F). Adaptable to most standard indoor conditions.',
      humidity:
        'Perfectly happy in normal household humidity. No misting or special treatment needed.',
    },
    benefits: [
      'Thrives on neglect \u2014 perfect for busy lifestyles',
      'Excellent air purifier for enclosed spaces',
      'Glossy leaves add a modern, sculptural aesthetic',
      'Drought tolerant with built-in water reserves',
    ],
    gradient: 'from-emerald-500 to-green-700',
    rating: 4.6,
    reviews: 167,
  },
  {
    id: 9,
    name: 'Jade Plant',
    scientificName: 'Crassula ovata',
    slug: 'jade-plant',
    price: 299,
    category: ['Indoor', 'Outdoor', 'Succulents'],
    light: 'Bright',
    size: 'Small',
    health: 'Good',
    description:
      'The Jade Plant is a stunning succulent with thick, glossy oval leaves on woody stems, resembling a miniature bonsai tree. Often called the Money Tree or Lucky Plant, it is treasured across cultures for its beauty and symbolism of prosperity. With proper care, it can live for decades.',
    careInstructions: {
      light:
        'Prefers bright, direct to indirect light. Needs at least 4 hours of sunlight daily.',
      water:
        'Water sparingly only when soil is completely dry. Overwatering is the most common mistake.',
      temperature:
        '15-24\u00B0C (59-75\u00B0F). Protect from frost and extreme cold at all times.',
      humidity:
        'Prefers dry air conditions. Avoid misting as excess moisture can cause leaf rot.',
    },
    benefits: [
      'Traditional symbol of good luck and prosperity',
      'Can live for decades with minimal care',
      'Beautiful bonsai-like appearance that improves with age',
      'Very low water and maintenance requirements',
    ],
    gradient: 'from-emerald-300 to-green-500',
    rating: 4.4,
    reviews: 203,
  },
  {
    id: 10,
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    slug: 'monstera-deliciosa',
    price: 1299,
    originalPrice: 1599,
    category: ['Indoor'],
    light: 'Bright',
    size: 'Large',
    health: 'Excellent',
    description:
      'The Monstera Deliciosa, or Swiss Cheese Plant, is a showstopping tropical beauty with iconic split and perforated leaves. A fast grower that makes an impressive statement, it has become one of the most photographed and beloved houseplants in the world. Each new leaf unfurls with more dramatic fenestrations than the last.',
    careInstructions: {
      light:
        'Bright, indirect light produces the best leaf fenestrations. Can tolerate medium light.',
      water:
        'Water when the top 2 inches of soil are dry. Likes consistent moisture but not soggy soil.',
      temperature:
        '18-30\u00B0C (65-86\u00B0F). A tropical plant that truly loves warmth and humidity.',
      humidity:
        'High humidity preferred, above 60%. Mist regularly or group with other tropical plants.',
    },
    benefits: [
      'Iconic, Instagram-worthy split leaves that mature beautifully',
      'Fast growing \u2014 visible progress on a weekly basis',
      'Excellent natural air purifier for large rooms',
      'A true statement piece that elevates any interior',
    ],
    gradient: 'from-green-500 to-teal-600',
    isNew: true,
    rating: 4.9,
    reviews: 178,
  },
  {
    id: 11,
    name: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    slug: 'boston-fern',
    price: 349,
    category: ['Indoor', 'Ferns'],
    light: 'Medium',
    size: 'Medium',
    health: 'Good',
    description:
      'The Boston Fern is a lush, graceful fern with cascading feathery fronds that create a stunning display in hanging baskets or on elevated plant stands. Known as one of the best natural air purifiers and humidifiers, it adds a touch of woodland elegance and freshness to any indoor space.',
    careInstructions: {
      light:
        'Prefers bright, indirect light but adapts to medium conditions. Avoid direct sun exposure.',
      water:
        'Keep soil consistently moist but never soggy. Never allow it to dry out completely.',
      temperature:
        '16-24\u00B0C (60-75\u00B0F). Dislikes hot, dry conditions near heaters or vents.',
      humidity:
        'Requires high humidity above 50%. Mist daily or place on a humidity tray.',
    },
    benefits: [
      'Top-ranked NASA air purifier for homes',
      'Natural humidifier that benefits dry rooms',
      'Creates a lush, calming woodland atmosphere',
      'Non-toxic and completely safe for pets and children',
    ],
    gradient: 'from-lime-400 to-emerald-500',
    rating: 4.5,
    reviews: 134,
  },
  {
    id: 12,
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    slug: 'aloe-vera',
    price: 199,
    category: ['Indoor', 'Outdoor', 'Succulents'],
    light: 'Bright',
    size: 'Small',
    health: 'Excellent',
    description:
      'Aloe Vera is nature\u2019s medicine cabinet in plant form. This striking succulent with thick, fleshy leaves filled with soothing healing gel has been used for centuries in skincare and traditional medicine. Beautiful, practical, and incredibly easy to grow \u2014 a must-have for every home.',
    careInstructions: {
      light:
        'Loves bright, direct light. Ideally receives at least 6 hours of sunlight daily.',
      water:
        'Water deeply but infrequently. Let soil dry out completely between watering sessions.',
      temperature:
        '13-27\u00B0C (55-80\u00B0F). Protect from frost and freezing temperatures.',
      humidity:
        'Prefers dry conditions typical of most homes. Do not mist the leaves.',
    },
    benefits: [
      'Healing gel soothes burns, cuts, and skin irritation',
      'Air purifying \u2014 removes formaldehyde & benzene',
      'Medicinal properties used in Ayurveda for centuries',
      'Extremely low maintenance and drought tolerant',
    ],
    gradient: 'from-green-300 to-emerald-500',
    rating: 4.7,
    reviews: 356,
  },
];
