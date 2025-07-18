// Real-world data for Indian bus booking system

export const cities = [
  {
    id: 1,
    name: 'Mumbai',
    state: 'Maharashtra',
    popular: true,
    coordinates: { lat: 19.0760, lng: 72.8777 },
    population: 12442373
  },
  {
    id: 2,
    name: 'Delhi',
    state: 'Delhi',
    popular: true,
    coordinates: { lat: 28.6139, lng: 77.2090 },
    population: 16787941
  },
  {
    id: 3,
    name: 'Bangalore',
    state: 'Karnataka',
    popular: true,
    coordinates: { lat: 12.9716, lng: 77.5946 },
    population: 8443675
  },
  {
    id: 4,
    name: 'Chennai',
    state: 'Tamil Nadu',
    popular: true,
    coordinates: { lat: 13.0827, lng: 80.2707 },
    population: 4646732
  },
  {
    id: 5,
    name: 'Pune',
    state: 'Maharashtra',
    popular: true,
    coordinates: { lat: 18.5204, lng: 73.8567 },
    population: 3124458
  },
  {
    id: 6,
    name: 'Hyderabad',
    state: 'Telangana',
    popular: true,
    coordinates: { lat: 17.3850, lng: 78.4867 },
    population: 6809970
  },
  {
    id: 7,
    name: 'Kolkata',
    state: 'West Bengal',
    popular: false,
    coordinates: { lat: 22.5726, lng: 88.3639 },
    population: 4496694
  },
  {
    id: 8,
    name: 'Ahmedabad',
    state: 'Gujarat',
    popular: false,
    coordinates: { lat: 23.0225, lng: 72.5714 },
    population: 5570585
  },
  {
    id: 9,
    name: 'Jaipur',
    state: 'Rajasthan',
    popular: false,
    coordinates: { lat: 26.9124, lng: 75.7873 },
    population: 3046163
  },
  {
    id: 10,
    name: 'Goa',
    state: 'Goa',
    popular: true,
    coordinates: { lat: 15.2993, lng: 74.1240 },
    population: 1457723
  },
];

// Real distance matrix between major Indian cities (in kilometers)
export const distanceMatrix = {
  'Mumbai-Delhi': 1154,
  'Mumbai-Bangalore': 984,
  'Mumbai-Chennai': 1338,
  'Mumbai-Pune': 149,
  'Mumbai-Hyderabad': 711,
  'Mumbai-Kolkata': 1968,
  'Mumbai-Ahmedabad': 524,
  'Mumbai-Jaipur': 1176,
  'Mumbai-Goa': 464,

  'Delhi-Bangalore': 2077,
  'Delhi-Chennai': 2180,
  'Delhi-Pune': 1472,
  'Delhi-Hyderabad': 1569,
  'Delhi-Kolkata': 1472,
  'Delhi-Ahmedabad': 934,
  'Delhi-Jaipur': 280,
  'Delhi-Goa': 1874,

  'Bangalore-Chennai': 347,
  'Bangalore-Pune': 844,
  'Bangalore-Hyderabad': 569,
  'Bangalore-Kolkata': 1871,
  'Bangalore-Ahmedabad': 1506,
  'Bangalore-Jaipur': 2054,
  'Bangalore-Goa': 560,

  'Chennai-Pune': 1183,
  'Chennai-Hyderabad': 629,
  'Chennai-Kolkata': 1663,
  'Chennai-Ahmedabad': 1839,
  'Chennai-Jaipur': 2387,
  'Chennai-Goa': 697,

  'Pune-Hyderabad': 559,
  'Pune-Kolkata': 1819,
  'Pune-Ahmedabad': 665,
  'Pune-Jaipur': 1213,
  'Pune-Goa': 464,

  'Hyderabad-Kolkata': 1500,
  'Hyderabad-Ahmedabad': 1035,
  'Hyderabad-Jaipur': 1583,
  'Hyderabad-Goa': 594,

  'Kolkata-Ahmedabad': 2038,
  'Kolkata-Jaipur': 1586,
  'Kolkata-Goa': 2161,

  'Ahmedabad-Jaipur': 652,
  'Ahmedabad-Goa': 1010,

  'Jaipur-Goa': 1658
};

// Get real distance between two cities
export const getDistance = (city1, city2) => {
  const key1 = `${city1}-${city2}`;
  const key2 = `${city2}-${city1}`;
  return distanceMatrix[key1] || distanceMatrix[key2] || null;
};

// Calculate real travel time based on distance and bus type
export const getTravelTime = (distance, busType) => {
  const averageSpeed = {
    'AC Seater': 65,
    'Non-AC Seater': 55,
    'AC Sleeper': 70,
    'Volvo AC': 75,
    'Mercedes': 80
  };

  const speed = averageSpeed[busType] || 65;
  const timeInHours = distance / speed;
  const hours = Math.floor(timeInHours);
  const minutes = Math.round((timeInHours - hours) * 60);

  return {
    hours,
    minutes,
    formatted: `${hours}h ${minutes}m`
  };
};

// Calculate real pricing based on distance and factors
export const calculateRealPrice = (distance, busType, departureTime) => {
  const basePricePerKm = {
    'AC Seater': 1.2,
    'Non-AC Seater': 0.8,
    'AC Sleeper': 1.8,
    'Volvo AC': 2.2,
    'Mercedes': 2.8
  };

  const basePrice = distance * (basePricePerKm[busType] || 1.0);

  // Time-based pricing
  const hour = parseInt(departureTime.split(':')[0]);
  let timeMultiplier = 1.0;
  if (hour >= 6 && hour < 10) timeMultiplier = 1.1; // Morning rush
  if (hour >= 18 && hour < 22) timeMultiplier = 1.2; // Evening rush
  if (hour >= 22 || hour < 6) timeMultiplier = 0.9; // Night

  // Weekend/demand multiplier (random for demo)
  const demandMultiplier = Math.random() > 0.7 ? 1.3 : Math.random() > 0.4 ? 1.1 : 1.0;

  const finalPrice = Math.round(basePrice * timeMultiplier * demandMultiplier);
  const originalPrice = Math.round(basePrice * 1.2);

  return {
    finalPrice,
    originalPrice,
    discount: Math.max(0, Math.round((originalPrice - finalPrice) / originalPrice * 100))
  };
};

export const busOperators = [
  {
    id: 1,
    name: 'RedBus Express',
    logo: '🚌',
    rating: 4.5,
    totalReviews: 2847,
    primaryColor: '#DC2626',
    features: ['GPS Tracking', 'Live Chat Support', 'Mobile Tickets']
  },
  {
    id: 2,
    name: 'VRL Travels',
    logo: '🚍',
    rating: 4.3,
    totalReviews: 1923,
    primaryColor: '#2563EB',
    features: ['Premium Seats', 'Onboard Entertainment', 'Meal Service']
  },
  {
    id: 3,
    name: 'SRS Travels',
    logo: '🚐',
    rating: 4.2,
    totalReviews: 1456,
    primaryColor: '#059669',
    features: ['AC Buses', 'Comfortable Seats', 'Punctual Service']
  },
  {
    id: 4,
    name: 'Orange Tours',
    logo: '🚌',
    rating: 4.4,
    totalReviews: 2156,
    primaryColor: '#EA580C',
    features: ['Luxury Coaches', 'WiFi', 'Charging Points']
  },
  {
    id: 5,
    name: 'Patel Travels',
    logo: '🚍',
    rating: 4.1,
    totalReviews: 987,
    primaryColor: '#7C3AED',
    features: ['Budget Friendly', 'Multiple Routes', 'Easy Booking']
  }
];

export const busTypes = [
  { id: 1, name: 'AC Seater', icon: '❄️', description: 'Air conditioned seater bus' },
  { id: 2, name: 'Non-AC Seater', icon: '🪑', description: 'Regular seater bus' },
  { id: 3, name: 'AC Sleeper', icon: '🛏️', description: 'Air conditioned sleeper bus' },
  { id: 4, name: 'Non-AC Sleeper', icon: '🛌', description: 'Regular sleeper bus' },
  { id: 5, name: 'Volvo AC', icon: '⭐', description: 'Premium Volvo AC bus' },
  { id: 6, name: 'Mercedes', icon: '💎', description: 'Luxury Mercedes bus' }
];

export const amenities = [
  { id: 1, name: 'WiFi', icon: '📶' },
  { id: 2, name: 'Charging Point', icon: '🔌' },
  { id: 3, name: 'Entertainment', icon: '📺' },
  { id: 4, name: 'Blanket', icon: '🧥' },
  { id: 5, name: 'Pillow', icon: '🛏️' },
  { id: 6, name: 'Water Bottle', icon: '💧' },
  { id: 7, name: 'Snacks', icon: '🍪' },
  { id: 8, name: 'Reading Light', icon: '💡' },
  { id: 9, name: 'GPS Tracking', icon: '📍' },
  { id: 10, name: 'CCTV', icon: '📹' }
];

// Generate realistic bus schedules with real calculations
export const generateBusSchedules = (fromCity, toCity, date) => {
  const distance = getDistance(fromCity, toCity);
  if (!distance) return [];

  const schedules = [];
  const operators = busOperators;
  const types = busTypes;

  // Generate 8-12 buses for the route
  const busCount = Math.floor(Math.random() * 5) + 8;

  for (let i = 0; i < busCount; i++) {
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const busType = types[Math.floor(Math.random() * types.length)];

    // Generate departure time (5 AM to 11 PM)
    const hour = Math.floor(Math.random() * 18) + 5;
    const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    const departureTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    // Calculate real travel time
    const travelTime = getTravelTime(distance, busType.name);
    const arrivalHour = (hour + travelTime.hours) % 24;
    const arrivalMinute = (minute + travelTime.minutes) % 60;
    const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;

    // Calculate real pricing
    const pricing = calculateRealPrice(distance, busType.name, departureTime);
    
    // Generate seat availability
    const totalSeats = busType.name.includes('Sleeper') ? 40 : 45;
    const bookedSeats = Math.floor(Math.random() * 20) + 5;
    const availableSeats = totalSeats - bookedSeats;
    
    // Generate random amenities
    const busAmenities = amenities
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 6) + 3);
    
    schedules.push({
      id: `bus_${i + 1}`,
      operator,
      busType,
      busNumber: `${operator.name.split(' ')[0].toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
      departureTime,
      arrivalTime,
      duration: travelTime.formatted,
      distance,
      price: pricing.finalPrice,
      originalPrice: pricing.originalPrice,
      discount: pricing.discount,
      totalSeats,
      availableSeats,
      bookedSeats,
      amenities: busAmenities,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 50,
      cancellationPolicy: 'Free cancellation up to 2 hours before departure',
      pickupPoints: [
        `${fromCity} Central Bus Station`,
        `${fromCity} Railway Station`,
        `${fromCity} Airport`
      ],
      dropPoints: [
        `${toCity} Central Bus Station`,
        `${toCity} Railway Station`,
        `${toCity} City Center`
      ],
      // Mock current location for tracking
      currentLocation: {
        lat: 19.0760 + (Math.random() - 0.5) * 0.1,
        lng: 72.8777 + (Math.random() - 0.5) * 0.1,
        status: Math.random() > 0.7 ? 'On Route' : 'At Station',
        nextStop: `${fromCity} Junction`,
        estimatedArrival: '2h 30m'
      }
    });
  }
  
  // Sort by departure time
  return schedules.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
};

// Generate seat layout for different bus types
export const generateSeatLayout = (busType, totalSeats) => {
  const layout = [];
  
  if (busType.name.includes('Sleeper')) {
    // Sleeper bus layout (2x1 configuration)
    const rows = Math.ceil(totalSeats / 3);
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      
      // Left side (2 seats)
      if ((row - 1) * 3 + 1 <= totalSeats) {
        rowSeats.push({
          number: (row - 1) * 3 + 1,
          type: 'lower',
          position: 'left-lower',
          isBooked: Math.random() < 0.3,
          isLadies: Math.random() < 0.1
        });
      }
      
      if ((row - 1) * 3 + 2 <= totalSeats) {
        rowSeats.push({
          number: (row - 1) * 3 + 2,
          type: 'upper',
          position: 'left-upper',
          isBooked: Math.random() < 0.3,
          isLadies: Math.random() < 0.1
        });
      }
      
      // Right side (1 seat)
      if ((row - 1) * 3 + 3 <= totalSeats) {
        rowSeats.push({
          number: (row - 1) * 3 + 3,
          type: 'single',
          position: 'right',
          isBooked: Math.random() < 0.3,
          isLadies: Math.random() < 0.15
        });
      }
      
      layout.push(rowSeats);
    }
  } else {
    // Seater bus layout (2x2 configuration)
    const rows = Math.ceil(totalSeats / 4);
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      
      // Left side (2 seats)
      for (let i = 0; i < 2; i++) {
        const seatNumber = (row - 1) * 4 + i + 1;
        if (seatNumber <= totalSeats) {
          rowSeats.push({
            number: seatNumber,
            type: 'seater',
            position: i === 0 ? 'left-window' : 'left-aisle',
            isBooked: Math.random() < 0.3,
            isLadies: Math.random() < 0.1
          });
        }
      }
      
      // Right side (2 seats)
      for (let i = 0; i < 2; i++) {
        const seatNumber = (row - 1) * 4 + i + 3;
        if (seatNumber <= totalSeats) {
          rowSeats.push({
            number: seatNumber,
            type: 'seater',
            position: i === 0 ? 'right-aisle' : 'right-window',
            isBooked: Math.random() < 0.3,
            isLadies: Math.random() < 0.1
          });
        }
      }
      
      layout.push(rowSeats);
    }
  }
  
  return layout;
};

// Popular routes for quick selection
export const popularRoutes = [
  { from: 'Mumbai', to: 'Pune', duration: '3h 30m', price: '₹450' },
  { from: 'Delhi', to: 'Jaipur', duration: '5h 15m', price: '₹650' },
  { from: 'Bangalore', to: 'Chennai', duration: '6h 45m', price: '₹850' },
  { from: 'Mumbai', to: 'Goa', duration: '12h 30m', price: '₹1200' },
  { from: 'Hyderabad', to: 'Bangalore', duration: '8h 15m', price: '₹950' },
  { from: 'Pune', to: 'Goa', duration: '10h 00m', price: '₹1100' }
];

// Mock reviews
export const generateReviews = (busId) => {
  const reviewTexts = [
    "Excellent service! Clean bus and comfortable seats.",
    "Driver was very professional and reached on time.",
    "Good value for money. Would recommend to others.",
    "Bus was clean but could improve the air conditioning.",
    "Great experience overall. Will book again.",
    "Comfortable journey with good amenities.",
    "Staff was helpful and courteous throughout the trip.",
    "Bus arrived on time and the journey was smooth."
  ];
  
  const names = [
    "Rahul S.", "Priya M.", "Amit K.", "Sneha P.", "Vikram R.",
    "Anita D.", "Suresh N.", "Kavya L.", "Ravi T.", "Meera J."
  ];
  
  const reviews = [];
  const reviewCount = Math.floor(Math.random() * 8) + 3;
  
  for (let i = 0; i < reviewCount; i++) {
    reviews.push({
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)],
      rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
      comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      helpful: Math.floor(Math.random() * 20) + 1
    });
  }
  
  return reviews;
};
