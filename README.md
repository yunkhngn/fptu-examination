

# fptu-exam-to-calendar

Extension Chrome giúp trích xuất lịch thi từ trang [fap.fpt.edu.vn](https://fap.fpt.edu.vn/Exam/ScheduleExams.aspx) và xuất ra file `.ics` có thể import vào Apple Calendar, Google Calendar hoặc Outlook.

## Tính năng
- Tự động lấy dữ liệu lịch thi từ trang FAP.
- Nhận diện loại bài thi (PE, FE, 2NDFE) và ghi chú tương ứng.
- Tạo file `.ics` chuẩn định dạng iCalendar.
- Thiết lập nhắc nhở trước 1 giờ mỗi sự kiện.
- Giao diện đơn giản, tiếng Việt.

## Cài đặt thủ công
1. Clone repo:
   ```bash
   git clone https://github.com/yunkhngn/fptu-exam-to-calendar.git
   ```
2. Mở `chrome://extensions/`
3. Bật **Chế độ dành cho nhà phát triển** (Developer mode)
4. Chọn **Tải tiện ích chưa đóng gói** (Load unpacked)
5. Chọn thư mục vừa clone

## Hướng dẫn sử dụng
1. Truy cập trang `https://fap.fpt.edu.vn/Exam/ScheduleExams.aspx`
2. Đăng nhập tài khoản FPT
3. Mở extension, nhấn **Tải lịch**
4. File `lich-thi.ics` sẽ được tải về
5. Mở bằng ứng dụng lịch để import

## Credits
- Made by [@yunkhngn](https://github.com/yunkhngn)