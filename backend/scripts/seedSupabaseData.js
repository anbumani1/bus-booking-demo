require('dotenv').config();
const { supabase } = require('../database/supabase');

const seedData = async () => {
  console.log('🌱 Starting Supabase data seeding...');

  try {
    // Check if cities already exist
    const { data: existingCities, error: checkError } = await supabase
      .from('cities')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking cities:', checkError);
      return;
    }

    if (existingCities && existingCities.length > 0) {
      console.log('✅ Data already exists');
      return;
    }

    console.log('📍 Inserting cities...');
    
    // Insert cities one by one
    const cities = [
      { name: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, population: 12442373, is_popular: true },
      { name: 'Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.2090, population: 16787941, is_popular: true },
      { name: 'Bangalore', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, population: 8443675, is_popular: true },
      { name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, population: 4646732, is_popular: true },
      { name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, population: 3124458, is_popular: true },
      { name: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, population: 6809970, is_popular: true },
      { name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, population: 4496694, is_popular: false },
      { name: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, population: 5570585, is_popular: false },
      { name: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, population: 3046163, is_popular: false },
      { name: 'Goa', state: 'Goa', latitude: 15.2993, longitude: 74.1240, population: 1457723, is_popular: true }
    ];

    const { data: insertedCities, error: citiesError } = await supabase
      .from('cities')
      .insert(cities)
      .select();

    if (citiesError) {
      console.error('Error inserting cities:', citiesError);
    } else {
      console.log(`✅ Inserted ${insertedCities.length} cities`);
    }

    console.log('🚌 Inserting bus operators...');
    
    // Insert bus operators
    const operators = [
      { name: 'RedBus', logo: '🚌', rating: 4.2, total_reviews: 125847, primary_color: '#D84E55', founded_year: 2006, headquarters: 'Bangalore', fleet_size: 2500, total_routes: 100000 },
      { name: 'VRL Travels', logo: '🚍', rating: 4.1, total_reviews: 89234, primary_color: '#1E40AF', founded_year: 1976, headquarters: 'Hubli', fleet_size: 1800, total_routes: 850 },
      { name: 'SRS Travels', logo: '🚐', rating: 4.0, total_reviews: 67891, primary_color: '#059669', founded_year: 1995, headquarters: 'Chennai', fleet_size: 1200, total_routes: 650 },
      { name: 'Orange Tours', logo: '🚌', rating: 4.3, total_reviews: 94567, primary_color: '#EA580C', founded_year: 1999, headquarters: 'Mumbai', fleet_size: 2200, total_routes: 1200 },
      { name: 'Patel Travels', logo: '🚍', rating: 3.9, total_reviews: 45623, primary_color: '#7C3AED', founded_year: 1985, headquarters: 'Ahmedabad', fleet_size: 800, total_routes: 450 },
      { name: 'Kallada Travels', logo: '🚌', rating: 4.4, total_reviews: 78912, primary_color: '#DC2626', founded_year: 1962, headquarters: 'Kerala', fleet_size: 1500, total_routes: 800 }
    ];

    const { data: insertedOperators, error: operatorsError } = await supabase
      .from('bus_operators')
      .insert(operators)
      .select();

    if (operatorsError) {
      console.error('Error inserting operators:', operatorsError);
    } else {
      console.log(`✅ Inserted ${insertedOperators.length} bus operators`);
    }

    console.log('🎉 Data seeding completed successfully!');

    // Verify the data
    const { data: finalCities } = await supabase.from('cities').select('*');
    const { data: finalOperators } = await supabase.from('bus_operators').select('*');
    
    console.log(`📊 Final counts: ${finalCities?.length || 0} cities, ${finalOperators?.length || 0} operators`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

// Run if called directly
if (require.main === module) {
  seedData().then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedData };
