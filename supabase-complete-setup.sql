-- سكريپت إعداد قاعدة البيانات الكاملة لموقع دجين
-- نفذ هذا السكريپت في Supabase SQL Editor لإنشاء جميع الجداول والإعدادات

-- 1. إنشاء دالة التحديث التلقائي للوقت
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. إنشاء جدول الطلبات
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

-- 3. إنشاء جدول الخدمات
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

-- 4. إنشاء المؤشرات للبحث السريع
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_services_highlighted ON services(highlighted);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- 5. إنشاء المشغلات للتحديث التلقائي
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. تفعيل Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- 7. إنشاء سياسات الأمان
-- حذف السياسات الموجودة إذا كانت موجودة
DROP POLICY IF EXISTS "Allow public read access on services" ON services;
DROP POLICY IF EXISTS "Allow all access on services" ON services;
DROP POLICY IF EXISTS "Allow all access on orders" ON orders;

-- سماح بالقراءة العامة للخدمات
CREATE POLICY "Allow public read access on services" ON services
    FOR SELECT USING (true);

-- سماح بتعديل الخدمات (للأدمن فقط - يمكن تخصيصها لاحقاً)
CREATE POLICY "Allow all access on services" ON services
    FOR ALL USING (true);

-- سماح بجميع العمليات على الطلبات (يمكن تخصيصها لاحقاً)
CREATE POLICY "Allow all access on orders" ON orders
    FOR ALL USING (true);

-- 8. إدراج البيانات التجريبية للطلبات
INSERT INTO orders (client, email, phone, service, status, amount, description) VALUES
('أحمد محمد علي', 'ahmed@example.com', '+20 123 456 7890', 'تطوير موقع ويب', 'New', 5000, 'موقع تجارة إلكترونية متكامل مع نظام دفع'),
('فاطمة علي حسن', 'fatima@example.com', '+20 198 765 4321', 'تصميم لوجو', 'In Progress', 1500, 'تصميم هوية بصرية كاملة لشركة تقنية ناشئة'),
('محمد حسن أحمد', 'mohamed@example.com', '+20 112 233 4455', 'تطبيق جوال', 'Completed', 8000, 'تطبيق حجوزات وخدمات للعملاء مع نظام إشعارات'),
('سارة إبراهيم', 'sara@example.com', '+20 155 666 7788', 'صيانة موقع', 'New', 2000, 'صيانة وتطوير موقع شركة عقارات موجود'),
('عمر عبدالله', 'omar@example.com', '+20 177 888 9900', 'تطوير متجر إلكتروني', 'In Progress', 7500, 'متجر إلكتروني للملابس مع نظام إدارة المخزون')
ON CONFLICT (id) DO NOTHING;

-- 9. إدراج البيانات التجريبية للخدمات
INSERT INTO services (title, description, price, icon, active, highlighted, category, duration, features) VALUES
(
  'تطوير مواقع الويب',
  'تطوير مواقع ويب حديثة ومتجاوبة باستخدام أحدث التقنيات مثل React و Node.js مع تصميم عصري وواجهة مستخدم سهلة',
  5000,
  'Code',
  true,
  true,
  'Development',
  '2-4 أسابيع',
  ARRAY['تصميم متجاوب', 'أمان عالي', 'سرعة فائقة', 'SEO محسن', 'لوحة تحكم', 'دعم فني']
),
(
  'تصميم الهوية البصرية',
  'تصميم لوجو وهوية بصرية متكاملة لعلامتك التجارية تشمل الألوان والخطوط ودليل الاستخدام',
  1500,
  'Palette',
  true,
  true,
  'Design',
  '1-2 أسبوع',
  ARRAY['لوجو احترافي', 'دليل الهوية', 'ألوان متناسقة', 'خطوط مخصصة', 'تصميمات تطبيقية']
),
(
  'تطوير تطبيقات الجوال',
  'تطوير تطبيقات جوال أصلية ومتقدمة لنظامي iOS و Android مع واجهات حديثة وأداء ممتاز',
  8000,
  'Smartphone',
  true,
  false,
  'Mobile',
  '4-6 أسابيع',
  ARRAY['iOS & Android', 'واجهة سهلة', 'أداء سريع', 'تحديثات دورية', 'نشر في المتاجر']
),
(
  'الصيانة والدعم التقني',
  'خدمات صيانة ودعم تقني مستمر لمواقعك وتطبيقاتك مع مراقبة دائمة وتحديثات أمنية',
  2000,
  'Wrench',
  true,
  false,
  'Support',
  'مستمر',
  ARRAY['دعم 24/7', 'تحديثات أمنية', 'نسخ احتياطية', 'مراقبة مستمرة', 'تقارير شهرية']
),
(
  'تطوير متاجر إلكترونية',
  'إنشاء متاجر إلكترونية متكاملة مع نظام إدارة المنتجات وبوابات الدفع وتتبع الطلبات',
  6500,
  'Code',
  true,
  true,
  'E-commerce',
  '3-5 أسابيع',
  ARRAY['نظام دفع آمن', 'إدارة مخزون', 'تتبع طلبات', 'تقارير مبيعات', 'تطبيق جوال']
),
(
  'التسويق الرقمي',
  'حملات تسويق رقمي شاملة تشمل SEO ووسائل التواصل الاجتماعي والإعلانات المدفوعة',
  3000,
  'TrendingUp',
  true,
  false,
  'Marketing',
  '2-3 أسابيع',
  ARRAY['تحسين محركات البحث', 'إدارة السوشيال ميديا', 'الإعلانات المدفوعة', 'تحليل النتائج']
)
ON CONFLICT (id) DO NOTHING;

-- 10. إنشاء جدول للمستخدمين (للإدارة)
CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- مشغل التحديث التلقائي للمستخدمين
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- سياسات أمان للمستخدمين
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access on users" ON users;
CREATE POLICY "Allow read access on users" ON users
    FOR SELECT USING (true);

-- إدراج مستخدم إداري تجريبي
INSERT INTO users (email, full_name, role, status) VALUES
('admin@dajin.com', 'مدير النظام', 'admin', 'active'),
('manager@dajin.com', 'مدير المشاريع', 'manager', 'active')
ON CONFLICT (email) DO NOTHING;

-- تأكيد نجاح الإعداد
SELECT 'تم إنشاء قاعدة البيانات بنجاح!' as message;
SELECT 'عدد الطلبات: ' || count(*) as orders_count FROM orders;
SELECT 'عدد الخدمات: ' || count(*) as services_count FROM services;
SELECT 'عدد المستخدمين: ' || count(*) as users_count FROM users;
