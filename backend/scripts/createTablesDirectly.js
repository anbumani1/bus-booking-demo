require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseKey);

const createTables = async () => {
  console.log('🚀 Creating tables directly...');

  try {
    // Test basic connection
    console.log('Testing connection...');
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    console.log('Connection test result:', { data, error });

    // Try to create a simple test table first
    console.log('Creating test table...');
    const { data: createResult, error: createError } = await supabase.rpc('create_test_table');
    console.log('Create test table result:', { createResult, createError });

    // List all tables
    console.log('Listing tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    console.log('Tables:', tables);
    console.log('Tables error:', tablesError);

  } catch (error) {
    console.error('Error:', error);
  }
};

createTables().then(() => {
  console.log('✅ Done');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Failed:', error);
  process.exit(1);
});
