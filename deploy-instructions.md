# Hướng Dẫn Triển Khai Hệ Thống EU AI Act Compliance Platform

Tài liệu này cung cấp hướng dẫn chi tiết để triển khai hệ thống EU AI Act Compliance Platform từ môi trường phát triển lên môi trường sản xuất trên Replit.

## Bước 1: Chuẩn Bị Cơ Sở Dữ Liệu

Trước khi triển khai, cần đảm bảo cơ sở dữ liệu PostgreSQL đã được khởi tạo và chứa dữ liệu ban đầu:

1. Kiểm tra kết nối đến cơ sở dữ liệu:
   ```
   node check-db.js
   ```

2. Thiết lập các bảng và dữ liệu ban đầu:
   ```
   node init-db.ts
   ```

3. Tạo các tài khoản demo với nhiều vai trò khác nhau:
   ```
   node create-demo-users.js
   ```

4. Thêm các mô-đun đào tạo với nội dung tương tác:
   ```
   node seed-training-modules.js
   ```

## Bước 2: Triển Khai lên Replit Deployments

Để triển khai ứng dụng lên Replit Deployments, thực hiện các bước sau:

1. Trong giao diện Replit, nhấp vào nút "Deploy" ở trên cùng bên phải
2. Chọn phân nhánh bạn muốn triển khai (thường là `main`)
3. Cấu hình thiết lập triển khai:
   - Tên triển khai: `eu-ai-act-compliance-platform`
   - Lệnh khởi động: `npm run start` (không phải `npm run dev`)
   - Các biến môi trường sẽ được tự động đồng bộ từ môi trường phát triển

4. Nhấp vào "Deploy" để bắt đầu quá trình triển khai

## Bước 3: Đăng Nhập và Kiểm Tra

Sau khi triển khai thành công, bạn có thể đăng nhập và kiểm tra hệ thống:

1. Truy cập URL của ứng dụng đã triển khai
2. Đăng nhập với một trong các tài khoản demo:
   - Admin: admin@demo.com / Admin123!
   - Technical: technical@demo.com / Technical123!
   - Legal: legal@demo.com / Legal123!
   - Decision Maker: decision@demo.com / Decision123!
   - Operator: operator@demo.com / Operator123!

3. Kiểm tra các tính năng theo vai trò:
   - Module đào tạo với nội dung cá nhân hóa theo vai trò
   - Các bài tập tương tác và bài kiểm tra
   - Hệ thống cấp chứng chỉ và theo dõi tiến độ

## Tính Năng Nâng Cao

Các tính năng sau đã được cải thiện trong phiên bản triển khai này:

### 1. Học Tập Cá Nhân Hóa
- Nội dung được điều chỉnh theo vai trò của người dùng
- Thông tin về mức độ liên quan của nội dung cho từng vai trò
- Gợi ý học tập dựa trên vai trò

### 2. Tương Tác và Đánh Giá
- Câu đố tương tác tích hợp trong nội dung slide
- Bài đánh giá tình huống dựa trên kịch bản thực tế
- Phản hồi ngay lập tức và giải thích sau mỗi câu hỏi

### 3. Hệ Thống Bài Tập
- Bài tập thực hành được thiết kế theo vai trò
- Bài tập phân tích tình huống thực tế
- Hướng dẫn chi tiết và tiêu chí đánh giá rõ ràng

### 4. Quản Lý Chứng Chỉ
- Chứng chỉ có thời hạn với ngày hết hạn
- Thông báo khi chứng chỉ sắp hết hạn
- Lưu trữ lịch sử chứng chỉ và yêu cầu cập nhật định kỳ

## Xử Lý Sự Cố

Nếu gặp vấn đề trong quá trình triển khai:

1. Kiểm tra logs của ứng dụng trong Replit Deployments
2. Đảm bảo kết nối đến cơ sở dữ liệu PostgreSQL hoạt động
3. Xác nhận các biến môi trường đã được cấu hình đúng
4. Nếu cần, khởi động lại ứng dụng từ giao diện Replit Deployments

## Liên Hệ Hỗ Trợ

Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ:
- Email: support@euaiacttool.com
- Hoặc tạo issue trên kho lưu trữ GitHub của dự án