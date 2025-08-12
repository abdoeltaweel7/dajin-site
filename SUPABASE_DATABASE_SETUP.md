# دليل إعداد قاعدة البيانات في Supabase

## خطوات الإعداد الكاملة

### 1. إنشاء مشروع Supabase جديد

1. اذهب إلى [supabase.com](https://supabase.com)
2. سجل دخول أو أنشئ حساب جديد
3. اضغط على "New Project"
4. اختر Organization أو أنشئ واحدة جديدة
5. أدخل تفاصيل المشروع:
   - **اسم المشروع**: dajin-web-forge
   - **كلمة مرور قاعدة البيانات**: أدخل كلمة مرور قوية
   - **المنطقة**: اختر أقرب منطقة جغرافية

### 2. إنشاء الجداول

#### طريقة 1: استخدام SQL Editor (موصى بها)

1. في لوحة تحكم Supabase، اذهب إلى **SQL Editor**
2. انسخ والصق محتوى ملف `supabase-orders-table.sql` كاملاً
3. اضغط **Run** لتنفيذ الأوامر
4. كرر نفس الخطوات مع ملف `supabase-services-table.sql`

#### طريقة 2: استخدام Table Editor

1. اذهب إلى **Table Editor**
2. اضغط **Create a new table**
3. أنشئ الجداول يدوياً حسب التصميم أدناه

### 3. تصميم الجداول

#### جدول Orders (الطلبات)
```sql
العمود               النوع                    القيم الافتراضية
id                  uuid                   gen_random_uuid()
client              text                   مطلوب
email               text                   مطلوب  
phone               text                   اختياري
service             text                   مطلوب
status              text                   'New'
amount              numeric                0
date                date                   CURRENT_DATE
deadline            date                   اختياري
description         text                   اختياري
progress            integer                0
assigned_to         text                   'Unassigned'
created_at          timestamp              now()
updated_at          timestamp              now()
```

#### جدول Services (الخدمات)
```sql
العمود               النوع                    القيم الافتراضية
id                  uuid                   gen_random_uuid()
title               text                   مطلوب
description         text                   مطلوب
price               numeric                0
icon                text                   'Code'
active              boolean                true
highlighted         boolean                false
category            text                   'Development'
duration            text                   '1-2 weeks'
features            text[]                 اختياري
created_at          timestamp              now()
updated_at          timestamp              now()
```

### 4. الحصول على مفاتيح API

1. اذهب إلى **Settings** > **API**
2. انسخ القيم التالية:
   - **Project URL**: `https://your-project.supabase.co`
   - **Project API Key (anon public)**: `eyJhbGc...`

### 5. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. إعداد Row Level Security (RLS)

لحماية البيانات، نفذ الأوامر التالية في SQL Editor:

```sql
-- تفعيل RLS للجداول
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- سماح للقراءة العامة للخدمات
CREATE POLICY "Allow public read access on services" ON services
    FOR SELECT USING (true);

-- سماح للكتابة في الطلبات للجميع (يمكن تخصيصها لاحقاً)
CREATE POLICY "Allow insert access on orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read access on orders" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Allow update access on orders" ON orders
    FOR UPDATE USING (true);
```

### 7. التحقق من الإعداد

1. شغل الموقع محلياً: `npm run dev`
2. تصفح الصفحات المختلفة
3. جرب إضافة طلب جديد
4. تحقق من ظهور البيانات في Supabase Dashboard

### 8. البيانات التجريبية

الجداول تحتوي على بيانات تجريبية:

**Orders:**
- 3 طلبات عينة بحالات مختلفة
- عميل أحمد، فاطمة، ومحمد

**Services:**
- 4 خدمات أساسية
- تطوير مواقع، تصميم، تطبيقات جوال، صيانة

### 9. استكشاف الأخطاء

#### مشكلة: لا تظهر البيانات
- تحقق من متغيرات البيئة
- تأكد من تفعيل RLS policies
- راجع console للأخطاء

#### مشكلة: خطأ في الإدراج
- تحقق من صحة أسماء الأعمدة
- تأكد من وجود policies للكتابة

#### مشكلة: خطأ في الاتصال
- تحقق من صحة URL و API Key
- تأكد من اتصال الإنترنت

### 10. الخطوات التالية

بعد الإعداد الناجح:
- يمكنك تخصيص البيانات التجريبية
- إضافة المزيد من الحقول حسب الحاجة
- تطوير نظام مصادقة للأدمن
- إضافة تقارير وإحصائيات متقدمة

---

**ملاحظة**: احفظ مفاتيح API في مكان آمن ولا تشاركها علانية!
