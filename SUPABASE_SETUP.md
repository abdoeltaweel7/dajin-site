# إعداد Supabase للموقع

## نظرة عامة
تم تحويل الموقع من استخدام localStorage إلى قاعدة بيانات Supabase. النظام الآن مربوط بالكامل مع قاعدة البيانات.

## الملفات المهمة

### API Endpoints
- `api/orders.ts` - واجهة برمجة التطبيقات للطلبات
- `api/services.ts` - واجهة برمجة التطبيقات للخدمات

### قواعد البيانات
- `supabase-orders-table.sql` - جدول الطلبات
- `supabase-services-table.sql` - جدول الخدمات

## إعداد Supabase

1. إنشاء مشروع جديد في Supabase
2. تشغيل ملفات SQL لإنشاء الجداول:
   ```sql
   -- نفذ محتوى supabase-orders-table.sql
   -- نفذ محتوى supabase-services-table.sql
   ```

3. إضافة متغيرات البيئة:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## الملفات المحولة

### تم تحويلها من dataManager إلى axios + Supabase:
- ✅ `src/pages/Order.tsx`
- ✅ `src/pages/Services.tsx`  
- ✅ `src/pages/OrderForm.tsx`
- ✅ `src/pages/Contact.tsx`
- ✅ `src/pages/Home.tsx`
- ✅ `src/pages/admin/Orders.tsx`
- ✅ `src/pages/admin/Services.tsx`
- ✅ `src/pages/admin/Dashboard.tsx`

### لم يتم تحويلها بعد:
- ⏳ `src/pages/admin/Users.tsx` (اختياري)

## كيفية التشغيل

1. تثبيت المتطلبات:
   ```bash
   npm install
   ```

2. تشغيل الخادم المحلي:
   ```bash
   npm run dev
   ```

3. زيارة الموقع:
   ```
   http://localhost:8081
   ```

## الميزات الجديدة

- 🗄️ قاعدة بيانات Supabase
- 🔄 API endpoints للطلبات والخدمات
- ⚡ التحديث الفوري للبيانات
- 🔒 أمان أفضل للبيانات
- 📊 إمكانية التحليل والإحصائيات

## حالة التطوير

✅ **مكتمل**: الموقع يعمل بالكامل مع Supabase
✅ **مكتمل**: جميع أخطاء التجميع تم إصلاحها
✅ **مكتمل**: الخادم المحلي يعمل بنجاح
✅ **مكتمل**: الواجهة الأمامية مربوطة مع الـ API

## المتطلبات التقنية

- Node.js
- npm أو yarn
- حساب Supabase (مجاني)
- متصفح حديث

## الدعم

الموقع جاهز للاستخدام! جميع الوظائف تعمل مع قاعدة البيانات الجديدة.
