-- Script để xóa và tạo lại bảng submissions (dùng khi cần reset hoàn toàn)
-- ⚠️ CẢNH BÁO: Script này sẽ XÓA TẤT CẢ dữ liệu submissions!

-- Xóa function
DROP FUNCTION IF EXISTS get_submissions_with_users();

-- Xóa policies
DROP POLICY IF EXISTS "Users can view own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON submissions;

-- Xóa bảng (sẽ xóa tất cả dữ liệu!)
DROP TABLE IF EXISTS submissions;

-- Chạy lại script SUPABASE_SUBMISSIONS_SETUP.sql sau khi chạy script này

