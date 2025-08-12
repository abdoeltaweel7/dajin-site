# 🚀 Dajin Web Forge - نظام إدارة الخدمات المتقدم

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Vite](https://img.shields.io/badge/Vite-5+-purple)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## � نظرة عامة

Dajin Web Forge هو نظام إدارة خدمات متقدم مبني بـ React و TypeScript، يتميز بنظام هجين ذكي لحفظ البيانات يضمن عدم فقدان أي معلومات حتى في حالة انقطاع الإنترنت.

### ✨ المزايا الرئيسية

- 🔄 **نظام هجين ذكي**: يجمع بين Supabase و localStorage
- 🌐 **يعمل بدون إنترنت**: حفظ محلي مع مزامنة تلقائية
- 🎨 **واجهة عصرية**: مبنية بـ shadcn/ui و Tailwind CSS
- 📱 **متجاوب تماماً**: يعمل على جميع الأجهزة
- 🛠️ **أدوات تشخيص متقدمة**: لحل مشاكل الشبكة
- ⚡ **أداء فائق**: مع Hot Module Replacement

## 🏗️ التقنيات المستخدمة

### Frontend
- **React 18+** - مكتبة واجهة المستخدم
- **TypeScript** - للتطوير الآمن
- **Vite** - أداة البناء السريعة
- **Tailwind CSS** - للتصميم
- **shadcn/ui** - مكونات واجهة جاهزة
- **Lucide React** - أيقونات عصرية

### Backend & Database
- **Supabase** - قاعدة بيانات PostgreSQL
- **REST API** - للاتصال بقاعدة البيانات
- **localStorage** - تخزين محلي احتياطي

### أدوات التطوير
- **ESLint** - فحص جودة الكود
- **PostCSS** - معالجة CSS
- **Git** - نظام إدارة الإصدارات

## 🚀 التثبيت والتشغيل

### المتطلبات الأساسية
```bash
Node.js 18+ أو Bun
Git
```

### 1. استنساخ المشروع
```bash
git clone https://github.com/YOUR_USERNAME/dajin-web-forge.git
cd dajin-web-forge
```

### 2. تثبيت التبعيات
```bash
# باستخدام npm
npm install

# أو باستخدام Bun
bun install
```

### 3. تشغيل الخادم المحلي
```bash
# باستخدام npm
npm run dev

# أو باستخدام Bun
bun run dev
```

الموقع سيكون متاحاً على: `http://localhost:8080`

## 🔧 النظام الهجين للبيانات

### كيف يعمل النظام؟

1. **المحاولة الأولى**: الاتصال عبر Proxy محلي (يتجنب مشاكل CORS)
2. **المحاولة الثانية**: الاتصال المباشر بـ Supabase
3. **الخطة البديلة**: حفظ في localStorage مع مزامنة لاحقة

### مزايا النظام
- ✅ **لا تضيع البيانات أبداً**
- ✅ **يعمل بدون إنترنت**
- ✅ **مزامنة تلقائية عند عودة الاتصال**
- ✅ **مؤشرات حالة واضحة**

## 🛠️ أدوات التشخيص

المشروع يحتوي على أدوات تشخيص متقدمة:

### 1. أداة التشخيص المتقدم
```bash
# افتح في المتصفح
open advanced-network-test.html
```

### 2. اختبار النظام الهجين
```bash
# افتح في المتصفح
open hybrid-system-test.html
```

### 3. اختبار CORS
```bash
# افتح في المتصفح
open cors-test.html
```

## 🎯 الميزات الرئيسية

### إدارة الخدمات
- ✅ إنشاء وتعديل وحذف الخدمات
- ✅ تصنيف الخدمات
- ✅ إدارة الأسعار والمدة
- ✅ نظام الحالة (نشط/غير نشط)
- ✅ تمييز الخدمات المهمة

### لوحة الإدارة
- 📊 إحصائيات شاملة
- 🔄 مؤشرات حالة المزامنة
- 🛠️ أدوات الصيانة
- 📱 واجهة متجاوبة

## 🚀 النشر

### نشر على Vercel
```bash
vercel --prod
```

### نشر على Netlify
```bash
npm run build
# رفع مجلد dist إلى Netlify
```

## � الدعم

- 🐛 **البلاغات**: GitHub Issues
- 💬 **الأسئلة**: GitHub Discussions

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

---

<div align="center">
  <h3>🚀 صنع بـ ❤️ في مصر</h3>
</div>
