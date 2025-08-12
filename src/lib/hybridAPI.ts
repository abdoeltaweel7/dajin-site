// حل بديل مؤقت - استخدام LocalStorage بدلاً من Supabase
export const localStorageAPI = {
  // جلب جميع الخدمات
  getAll() {
    try {
      const services = localStorage.getItem('services');
      return services ? JSON.parse(services) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // إضافة خدمة جديدة
  create(service: any) {
    try {
      const services = this.getAll();
      const newService = {
        ...service,
        id: 'service_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      services.push(newService);
      localStorage.setItem('services', JSON.stringify(services));
      return newService;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw error;
    }
  },

  // تحديث خدمة
  update(id: string, updates: any) {
    try {
      const services = this.getAll();
      const index = services.findIndex((s: any) => s.id === id);
      if (index === -1) {
        throw new Error('Service not found');
      }
      services[index] = {
        ...services[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('services', JSON.stringify(services));
      return services[index];
    } catch (error) {
      console.error('Error updating localStorage:', error);
      throw error;
    }
  },

  // حذف خدمة
  delete(id: string) {
    try {
      const services = this.getAll();
      const filteredServices = services.filter((s: any) => s.id !== id);
      localStorage.setItem('services', JSON.stringify(filteredServices));
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      throw error;
    }
  }
};

// حلول متعددة للخدمات مع مزامنة ذكية
import { proxySupabaseAPI } from './proxyAPI';

export const hybridServicesAPI = {
  // محاولة متعددة: Proxy أولاً، ثم Direct، ثم localStorage
  async getAll() {
    // المحاولة الأولى: استخدام الـ proxy
    try {
      console.log('🔄 Trying Supabase via proxy...');
      const data = await proxySupabaseAPI.getAll();
      
      // حفظ في localStorage كنسخة احتياطية
      localStorage.setItem('services', JSON.stringify(data));
      localStorage.setItem('services_source', 'supabase-proxy');
      localStorage.setItem('services_last_sync', new Date().toISOString());
      
      // محاولة مزامنة أي بيانات محلية معلقة
      await this.syncPendingChanges();
      
      return data;
    } catch (proxyError) {
      console.warn('❌ Proxy failed:', proxyError.message);
      
      // المحاولة الثانية: الاتصال المباشر
      try {
        console.log('🔄 Trying direct Supabase...');
        
        // إنشاء timeout controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 ثوان timeout
        
        const response = await fetch('https://ipzupceovfjmguhjmnkr.supabase.co/rest/v1/services?select=*', {
          signal: controller.signal,
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Direct Supabase success:', data.length, 'services loaded from database');
          // حفظ في localStorage كنسخة احتياطية
          localStorage.setItem('services', JSON.stringify(data));
          localStorage.setItem('services_source', 'supabase-direct');
          localStorage.setItem('services_last_sync', new Date().toISOString());
          
          // محاولة مزامنة أي بيانات محلية معلقة
          await this.syncPendingChanges();
          
          return data;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (directError) {
        const errorMessage = directError.name === 'AbortError' ? 'Connection timeout (5s)' : directError.message;
        console.warn('❌ Direct Supabase failed:', errorMessage);
        console.warn('📱 Switching to localStorage mode');
        
        const localData = localStorageAPI.getAll();
        console.log('📱 Using localStorage:', localData.length, 'services');
        localStorage.setItem('services_source', 'localStorage');
        return localData;
      }
    }
  },

  // مزامنة البيانات المعلقة
  async syncPendingChanges() {
    try {
      const pending = JSON.parse(localStorage.getItem('pending_changes') || '[]');
      if (pending.length === 0) return;

      console.log('🔄 Syncing', pending.length, 'pending changes...');
      
      for (const change of pending) {
        try {
          if (change.type === 'create') {
            await this.create(change.data, false); // false = لا تحفظ في pending مرة أخرى
          } else if (change.type === 'update') {
            await this.update(change.id, change.data, false);
          } else if (change.type === 'delete') {
            await this.delete(change.id, false);
          }
        } catch (err) {
          console.warn('Failed to sync change:', change, err);
        }
      }
      
      // مسح البيانات المعلقة بعد المزامنة
      localStorage.removeItem('pending_changes');
      console.log('✅ Sync completed');
    } catch (error) {
      console.warn('Sync failed:', error);
    }
  },

  async create(service: any, saveToPending = true) {
    // المحاولة الأولى: استخدام الـ proxy
    try {
      console.log('🚀 Trying to create service via proxy...');
      const createdService = await proxySupabaseAPI.create(service);
      
      // تحديث localStorage أيضاً
      const localServices = localStorageAPI.getAll();
      localServices.push(createdService);
      localStorage.setItem('services', JSON.stringify(localServices));
      
      return createdService;
    } catch (proxyError) {
      console.warn('❌ Proxy create failed:', proxyError.message);
      
      // المحاولة الثانية: الاتصال المباشر
      try {
        console.log('🚀 Trying to create service directly...');
        
        // إنشاء timeout controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 ثوان للإرسال
        
        const response = await fetch('https://ipzupceovfjmguhjmnkr.supabase.co/rest/v1/services', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(service)
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          const createdService = Array.isArray(data) ? data[0] : data;
          console.log('✅ Direct create success:', createdService);
          
          // تحديث localStorage أيضاً
          const localServices = localStorageAPI.getAll();
          localServices.push(createdService);
          localStorage.setItem('services', JSON.stringify(localServices));
          
          return createdService;
        } else {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      } catch (directError) {
        const errorMessage = directError.name === 'AbortError' ? 
          'Network connection failed - check your internet' : 
          directError.message;
          
        console.warn('❌ Direct create failed:', errorMessage);
        console.warn('💾 Saving to localStorage with pending sync');
        
        // حفظ في localStorage
        const newService = localStorageAPI.create(service);
        
        // إضافة للتغييرات المعلقة للمزامنة لاحقاً
        if (saveToPending) {
          const pending = JSON.parse(localStorage.getItem('pending_changes') || '[]');
          pending.push({
            type: 'create',
            data: service,
            timestamp: new Date().toISOString(),
            tempId: newService.id
          });
          localStorage.setItem('pending_changes', JSON.stringify(pending));
          console.log('💾 Added to pending changes for later sync');
        }
        
        // لا نرمي error هنا لأن البيانات محفوظة محلياً
        return newService;
      }
    }
  },

  async update(id: string, updates: any, saveToPending = true) {
    try {
      console.log('🔄 Trying to update service in Supabase...');
      const response = await fetch(`https://ipzupceovfjmguhjmnkr.supabase.co/rest/v1/services?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        const data = await response.json();
        const updatedService = Array.isArray(data) ? data[0] : data;
        console.log('✅ Supabase update success:', updatedService);
        
        // تحديث localStorage أيضاً
        const updatedLocalService = localStorageAPI.update(id, updates);
        
        return updatedService || updatedLocalService;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('❌ Supabase update failed, using localStorage with pending sync:', error.message);
      
      // تحديث في localStorage
      const updatedService = localStorageAPI.update(id, updates);
      
      // إضافة للتغييرات المعلقة
      if (saveToPending) {
        const pending = JSON.parse(localStorage.getItem('pending_changes') || '[]');
        pending.push({
          type: 'update',
          id: id,
          data: updates,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('pending_changes', JSON.stringify(pending));
        console.log('💾 Added update to pending changes for later sync');
      }
      
      return updatedService;
    }
  },

  async delete(id: string, saveToPending = true) {
    try {
      console.log('🗑️ Trying to delete service in Supabase...');
      const response = await fetch(`https://ipzupceovfjmguhjmnkr.supabase.co/rest/v1/services?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk'
        }
      });
      
      if (response.ok) {
        console.log('✅ Supabase delete success');
        // حذف من localStorage أيضاً
        localStorageAPI.delete(id);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('❌ Supabase delete failed, using localStorage with pending sync:', error.message);
      
      // حذف من localStorage
      localStorageAPI.delete(id);
      
      // إضافة للتغييرات المعلقة
      if (saveToPending) {
        const pending = JSON.parse(localStorage.getItem('pending_changes') || '[]');
        pending.push({
          type: 'delete',
          id: id,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('pending_changes', JSON.stringify(pending));
        console.log('💾 Added delete to pending changes for later sync');
      }
    }
  },
  
  // وظائف مساعدة لمراقبة حالة النظام
  getStatus() {
    const source = localStorage.getItem('services_source') || 'unknown';
    const lastSync = localStorage.getItem('services_last_sync');
    const pending = JSON.parse(localStorage.getItem('pending_changes') || '[]');
    const services = localStorageAPI.getAll();
    
    return {
      source,
      lastSync,
      pendingChanges: pending.length,
      totalServices: services.length,
      isOnline: navigator.onLine
    };
  },
  
  // مسح جميع البيانات المحلية
  clearLocalData() {
    localStorage.removeItem('services');
    localStorage.removeItem('pending_changes');
    localStorage.removeItem('services_source');
    localStorage.removeItem('services_last_sync');
    console.log('🧹 Local data cleared');
  },
  
  // محاولة مزامنة فورية
  async forceSync() {
    console.log('🔄 Force sync initiated...');
    await this.syncPendingChanges();
    return await this.getAll();
  }
};

// إضافة مستمع لحالة الاتصال
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    console.log('🌐 Internet connection restored, attempting sync...');
    try {
      await hybridServicesAPI.forceSync();
    } catch (error) {
      console.warn('Auto-sync failed:', error);
    }
  });
  
  window.addEventListener('offline', () => {
    console.log('📱 Internet connection lost, switching to offline mode');
  });
}
