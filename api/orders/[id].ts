import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ipzupceovfjmguhjmnkr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    if (method === 'PUT') {
      // تحديث طلب موجود
      let body = req.body;
      if (!body || Object.keys(body).length === 0) {
        try {
          body = JSON.parse(await new Promise((resolve, reject) => {
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', () => resolve(data));
            req.on('error', reject);
          }));
        } catch (e) {
          return res.status(400).json({ error: 'Invalid JSON' });
        }
      }
      
      const { data, error } = await supabase
        .from('orders')
        .update(body)
        .eq('id', id)
        .select();
        
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(data[0]);
      
    } else if (method === 'DELETE') {
      // حذف طلب
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
        
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json({ message: 'Order deleted successfully' });
      
    } else {
      res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
