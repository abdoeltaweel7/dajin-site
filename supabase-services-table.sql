-- سكريپت إنشاء جدول الخدمات في Supabase
-- هذا الجدول يحتوي على جميع الحقول المطلوبة للخدمات

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
  features text[], -- قائمة بالميزات
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- إنشاء مؤشرات للبحث السريع
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_services_highlighted ON services(highlighted);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- إنشاء مشغل للتحديث التلقائي
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إدراج بعض الخدمات التجريبية
INSERT INTO services (title, description, price, icon, active, highlighted, category, features) VALUES
(
  'تطوير مواقع الويب',
  'تطوير مواقع ويب حديثة ومتجاوبة باستخدام أحدث التقنيات',
  5000,
  'Code',
  true,
  true,
  'Development',
  ARRAY['تصميم متجاوب', 'أمان عالي', 'سرعة فائقة', 'SEO محسن']
),
(
  'تصميم الهوية البصرية',
  'تصميم لوجو وهوية بصرية متكاملة لعلامتك التجارية',
  1500,
  'Palette',
  true,
  true,
  'Design',
  ARRAY['لوجو احترافي', 'دليل الهوية', 'ألوان متناسقة', 'خطوط مخصصة']
),
(
  'تطوير تطبيقات الجوال',
  'تطوير تطبيقات جوال أصلية ومتقدمة لنظامي iOS و Android',
  8000,
  'Smartphone',
  true,
  false,
  'Mobile',
  ARRAY['iOS & Android', 'واجهة سهلة', 'أداء سريع', 'تحديثات دورية']
),
(
  'الصيانة والدعم التقني',
  'خدمات صيانة ودعم تقني مستمر لمواقعك وتطبيقاتك',
  2000,
  'Wrench',
  true,
  false,
  'Support',
  ARRAY['دعم 24/7', 'تحديثات أمنية', 'نسخ احتياطية', 'مراقبة مستمرة']
);ت إنشاء جدول الخدمات في Supabase
CREATE TABLE services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  description text,
  price numeric,
  created_at timestamp with time zone DEFAULT now()
);
