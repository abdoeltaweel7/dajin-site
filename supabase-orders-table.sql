-- سكريپت إنشاء جدول الطلبات في Supabase
-- هذا الجدول يحتوي على جميع الحقول المطلوبة للطلبات

CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client text NOT NULL,
  email text NOT NULL,
  phone text,
  service text NOT NULL,
  status text DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Completed', 'Cancelled')),
  amount numeric DEFAULT 0,
  date date DEFAULT CURRENT_DATE,
  deadline date,
  description text,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  assigned_to text DEFAULT 'Unassigned',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- إنشاء مؤشرات للبحث السريع
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date);

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء المشغل للتحديث التلقائي
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إدراج بعض البيانات التجريبية
INSERT INTO orders (client, email, phone, service, status, amount, description) VALUES
('أحمد محمد', 'ahmed@example.com', '01234567890', 'تطوير موقع ويب', 'New', 5000, 'موقع تجارة إلكترونية'),
('فاطمة علي', 'fatima@example.com', '01987654321', 'تصميم لوجو', 'In Progress', 1500, 'لوجو لشركة تقنية'),
('محمد حسن', 'mohamed@example.com', '01122334455', 'تطبيق جوال', 'Completed', 8000, 'تطبيق حجوزات');ت إنشاء جدول الطلبات في Supabase
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  phone text,
  service text,
  created_at timestamp with time zone DEFAULT now()
);
