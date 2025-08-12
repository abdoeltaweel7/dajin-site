-- تعطيل Row Level Security مؤقتاً للاختبار
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- أو إنشاء policies للسماح بجميع العمليات
DROP POLICY IF EXISTS "Enable read access for all users" ON services;
DROP POLICY IF EXISTS "Enable insert access for all users" ON services;
DROP POLICY IF EXISTS "Enable update access for all users" ON services;
DROP POLICY IF EXISTS "Enable delete access for all users" ON services;

CREATE POLICY "Enable read access for all users" ON services FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON services FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON services FOR DELETE USING (true);

-- نفس الشيء للطلبات
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable insert access for all users" ON orders;
DROP POLICY IF EXISTS "Enable update access for all users" ON orders;
DROP POLICY IF EXISTS "Enable delete access for all users" ON orders;

CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON orders FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON orders FOR DELETE USING (true);
