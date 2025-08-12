-- حل سريع لمشاكل الصلاحيات في Supabase
-- نفذ هذا السكريپت في Supabase SQL Editor

-- 1. تعطيل Row Level Security مؤقتاً
ALTER TABLE IF EXISTS services DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;

-- 2. منح جميع الصلاحيات للـ anon role
GRANT ALL ON TABLE services TO anon;
GRANT ALL ON TABLE orders TO anon;

-- 3. التأكد من وجود الجداول بالبنية الصحيحة
CREATE TABLE IF NOT EXISTS services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  price numeric DEFAULT 0,
  icon text DEFAULT 'Code',
  active boolean DEFAULT true,
  highlighted boolean DEFAULT false,
  category text DEFAULT 'Development',
  duration text DEFAULT '1-2 weeks',
  features text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. اختبار إدراج بيانات
INSERT INTO services (title, description, price, features) VALUES
('خدمة اختبار', 'وصف خدمة اختبار', 500, ARRAY['ميزة 1', 'ميزة 2']);

-- 5. عرض النتيجة
SELECT 'تم الإعداد بنجاح!' as status, count(*) as services_count FROM services;
