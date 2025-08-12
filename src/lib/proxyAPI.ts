// API بديل يستخدم proxy لتجنب مشاكل CORS
export const proxySupabaseAPI = {
  // استخدام الـ proxy المحلي بدلاً من الاتصال المباشر
  async getAll() {
    try {
      console.log('🔄 Trying Supabase via proxy...');
      
      const response = await fetch('/api/supabase/rest/v1/services?select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Proxy Supabase success:', data.length, 'services');
        return data;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('❌ Proxy Supabase failed:', error.message);
      throw error;
    }
  },

  async create(service: any) {
    try {
      console.log('🚀 Creating service via proxy...');
      
      const response = await fetch('/api/supabase/rest/v1/services', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(service)
      });
      
      if (response.ok) {
        const data = await response.json();
        const createdService = Array.isArray(data) ? data[0] : data;
        console.log('✅ Proxy create success:', createdService);
        return createdService;
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.warn('❌ Proxy create failed:', error.message);
      throw error;
    }
  }
};
