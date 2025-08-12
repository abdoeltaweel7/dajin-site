// API Client للتعامل مع Supabase مباشرة من React
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ipzupceovfjmguhjmnkr.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk';

console.log('Initializing Supabase client...');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_KEY ? 'Loaded' : 'Missing');

// إضافة timeout للطلبات
const TIMEOUT_MS = 10000; // 10 ثواني

// دالة مساعدة لإنشاء timeout للطلبات
const withTimeout = (promise: Promise<any>, timeoutMs: number = TIMEOUT_MS) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    fetch: (url, options = {}) => {
      // إضافة timeout لجميع الطلبات
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      
      return fetch(url, {
        ...options,
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
    }
  }
});

// اختبار الاتصال عند تحميل الوحدة
const directApiCall = async (endpoint: string, method: string = 'GET', body: any = null) => {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    mode: 'cors' as RequestMode,
    credentials: 'omit' as RequestCredentials
  };
  
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  
  console.log(`Direct API call to: ${url}`);
  console.log('Options:', options);
  
  const response = await withTimeout(fetch(url, options));
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`HTTP ${response.status}: ${errorText}`);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  console.log('Direct API response:', data);
  return data;
};
(async () => {
  try {
    const { data, error } = await supabase.from('services').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection successful');
    }
  } catch (err) {
    console.error('Supabase connection error:', err);
  }
})();

// API للطلبات
export const ordersAPI = {
  // جلب جميع الطلبات
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // إضافة طلب جديد
  async create(order: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // تحديث طلب
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // حذف طلب
  async delete(id: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// API للخدمات
export const servicesAPI = {
  // جلب جميع الخدمات
  async getAll() {
    try {
      console.log('Fetching services from Supabase...');
      const { data, error } = await supabase
        .from('services')
        .select('*');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('Services fetched successfully:', data);
      return data;
    } catch (err) {
      console.error('Network error:', err);
      throw err;
    }
  },

  // إضافة خدمة جديدة
  async create(service: any) {
    console.log('=== Starting service creation ===');
    console.log('Input service:', service);
    
    try {
      // تنظيف البيانات وضمان وجود الحقول المطلوبة
      const cleanService = {
        title: service.title || '',
        description: service.description || '',
        price: Number(service.price) || 0,
        icon: service.icon || 'Code',
        active: Boolean(service.active),
        highlighted: Boolean(service.highlighted),
        category: service.category || 'Development',
        duration: service.duration || '1-2 weeks',
        features: Array.isArray(service.features) ? service.features : []
      };
      
      console.log('Cleaned service data:', cleanService);
      
      // الطريقة الأولى: Supabase Client
      try {
        console.log('Trying Supabase client...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
        
        const { data, error } = await supabase
          .from('services')
          .insert([cleanService])
          .select()
          .abortSignal(controller.signal);
        
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('Supabase client error:', error);
          throw new Error(`Supabase error: ${error.message}`);
        }
        
        console.log('✅ Supabase client success:', data[0]);
        return data[0];
        
      } catch (supabaseError) {
        console.warn('❌ Supabase client failed, trying direct API...');
        console.error('Supabase error details:', supabaseError);
        
        // الطريقة الثانية: Direct API Call
        try {
          const result = await directApiCall('services', 'POST', cleanService);
          console.log('✅ Direct API success:', result);
          return Array.isArray(result) ? result[0] : result;
          
        } catch (directError) {
          console.error('❌ Direct API also failed:', directError);
          
          // الطريقة الثالثة: Simple fetch with different config
          try {
            console.log('Trying simple fetch as last resort...');
            
            const response = await fetch(`${SUPABASE_URL}/rest/v1/services`, {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_KEY,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(cleanService)
            });
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('✅ Simple fetch success:', result);
            return Array.isArray(result) ? result[0] : result;
            
          } catch (simpleError) {
            console.error('❌ All methods failed');
            throw new Error(`All connection methods failed. Last error: ${simpleError.message}`);
          }
        }
      }
      
    } catch (err) {
      console.error('=== Service creation failed ===');
      console.error('Final error:', err);
      
      if (err.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection and try again.');
      }
      
      if (err.message.includes('fetch')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      }
      
      throw err;
    }
  },

  // تحديث خدمة
  async update(id: string, updates: any) {
    try {
      console.log('Updating service:', id, updates);
      
      // محاولة أولى باستخدام Supabase client
      try {
        const { data, error } = await supabase
          .from('services')
          .update(updates)
          .eq('id', id)
          .select();
        
        if (error) {
          console.error('Supabase update error:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        console.log('Service updated successfully:', data[0]);
        return data[0];
      } catch (supabaseError) {
        console.log('Supabase client failed, trying direct fetch...');
        
        // محاولة ثانية باستخدام fetch مباشرة
        const response = await fetch(`${SUPABASE_URL}/rest/v1/services?id=eq.${id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(updates)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Service updated via direct fetch:', data);
        return Array.isArray(data) ? data[0] : data;
      }
    } catch (err) {
      console.error('Network update error:', err);
      throw err;
    }
  },

  // حذف خدمة
  async delete(id: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
