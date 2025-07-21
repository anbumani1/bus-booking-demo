// Demo booking data for non-authenticated users
export const initializeDemoBookings = () => {
  const existingBookings = localStorage.getItem('demoBookingHistory');
  
  if (!existingBookings) {
    const demoBookings = [
      {
        bookingId: 'DEMO1640995200000',
        bookingNumber: 'BUS1640995200000',
        status: 'confirmed',
        bookingDate: '2024-01-15T10:30:00Z',
        bus: {
          busNumber: 'MH12AB1234',
          operator: 'VRL Travels',
          type: 'AC Sleeper',
          route: {
            from: 'Mumbai',
            to: 'Pune',
            distance: 149
          },
          departureDate: '2024-12-25',
          departureTime: '14:30',
          arrivalTime: '17:45'
        },
        selectedSeats: ['A1', 'A2'],
        totalAmount: 1200,
        passengers: [
          { name: 'John Doe', age: 30, gender: 'male', seatNumber: 'A1' },
          { name: 'Jane Doe', age: 28, gender: 'female', seatNumber: 'A2' }
        ]
      },
      {
        bookingId: 'DEMO1640908800000',
        bookingNumber: 'BUS1640908800000',
        status: 'confirmed',
        bookingDate: '2024-01-10T15:45:00Z',
        bus: {
          busNumber: 'DL01CD5678',
          operator: 'RedBus',
          type: 'Volvo AC',
          route: {
            from: 'Delhi',
            to: 'Jaipur',
            distance: 280
          },
          departureDate: '2024-01-12',
          departureTime: '09:00',
          arrivalTime: '13:30'
        },
        selectedSeats: ['B5'],
        totalAmount: 800,
        passengers: [
          { name: 'Demo User', age: 25, gender: 'male', seatNumber: 'B5' }
        ]
      },
      {
        bookingId: 'DEMO1640822400000',
        bookingNumber: 'BUS1640822400000',
        status: 'completed',
        bookingDate: '2023-12-20T08:15:00Z',
        bus: {
          busNumber: 'KA05EF9012',
          operator: 'SRS Travels',
          type: 'AC Seater',
          route: {
            from: 'Bangalore',
            to: 'Chennai',
            distance: 346
          },
          departureDate: '2023-12-22',
          departureTime: '22:00',
          arrivalTime: '06:30'
        },
        selectedSeats: ['C3', 'C4'],
        totalAmount: 1400,
        passengers: [
          { name: 'Alice Smith', age: 32, gender: 'female', seatNumber: 'C3' },
          { name: 'Bob Smith', age: 35, gender: 'male', seatNumber: 'C4' }
        ]
      }
    ];

    localStorage.setItem('demoBookingHistory', JSON.stringify(demoBookings));
    console.log('✅ Demo booking history initialized');
  }
};

// Call this function when the app loads
export const setupDemoEnvironment = () => {
  initializeDemoBookings();
};
