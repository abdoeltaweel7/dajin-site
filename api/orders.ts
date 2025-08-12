import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ipzupceovfjmguhjmnkr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwenVwY2VvdmZqbWd1aGptbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTA5MjIsImV4cCI6MjA3MDU4NjkyMn0.PgNNlxueS3ylPyOwkuoA4pODnHxvIGk8ZQen6LDDRdk';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // جلب جميع الطلبات
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(data);
      
    } else if (req.method === 'POST') {
      // إضافة طلب جديد
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
      
      const { data, error } = await supabase.from('orders').insert([body]).select();
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json(data[0]);
      
    } else {
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
