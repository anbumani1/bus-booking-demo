// Mock data for the bus booking demo

export const cities = [
  { id: 1, name: 'Mumbai', state: 'Maharashtra', popular: true },
  { id: 2, name: 'Delhi', state: 'Delhi', popular: true },
  { id: 3, name: 'Bangalore', state: 'Karnataka', popular: true },
  { id: 4, name: 'Chennai', state: 'Tamil Nadu', popular: true },
  { id: 5, name: 'Pune', state: 'Maharashtra', popular: true },
  { id: 6, name: 'Hyderabad', state: 'Telangana', popular: true },
  { id: 7, name: 'Kolkata', state: 'West Bengal', popular: false },
  { id: 8, name: 'Ahmedabad', state: 'Gujarat', popular: false },
  { id: 9, name: 'Jaipur', state: 'Rajasthan', popular: false },
  { id: 10, name: 'Goa', state: 'Goa', popular: true },
  { id: 11, name: 'Kochi', state: 'Kerala', popular: false },
  { id: 12, name: 'Indore', state: 'Madhya Pradesh', popular: false },
];

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

// Generate mock bus schedules
export const generateBusSchedules = (fromCity, toCity, date) => {
  const schedules = [];
  const operators = busOperators;
  const types = busTypes;
  
  // Generate 8-12 buses for the route
  const busCount = Math.floor(Math.random() * 5) + 8;
  
  for (let i = 0; i < busCount; i++) {
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const busType = types[Math.floor(Math.random() * types.length)];
    
    // Generate departure time (6 AM to 11 PM)
    const hour = Math.floor(Math.random() * 17) + 6;
    const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    const departureTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Calculate arrival time (4-12 hours later)
    const travelHours = Math.floor(Math.random() * 8) + 4;
    const arrivalHour = (hour + travelHours) % 24;
    const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Generate price (₹500-₹3000)
    const basePrice = Math.floor(Math.random() * 2500) + 500;
    
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
      duration: `${travelHours}h ${Math.floor(Math.random() * 60)}m`,
      price: basePrice,
      originalPrice: Math.floor(basePrice * 1.2),
      discount: Math.floor(Math.random() * 20) + 5,
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
