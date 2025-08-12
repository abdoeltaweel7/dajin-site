-- اختبار وإنشاء جدول الخدمات إذا لم يكن موجود
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

-- اختبار إدراج بيانة تجريبية
INSERT INTO services (title, description, price, features) VALUES
('خدمة تجريبية', 'وصف تجريبي للخدمة', 100, ARRAY['ميزة 1', 'ميزة 2']);

-- عرض البيانات
SELECT * FROM services;
