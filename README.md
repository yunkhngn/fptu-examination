# FPTU Examination Calendar Exporter

🎓 Extension Chrome hiện đại giúp sinh viên FPT University trích xuất và quản lý lịch thi một cách dễ dàng từ hệ thống FAP.

## ✨ Tính năng nổi bật

### 📅 Quản lý lịch thi thông minh
- **Giao diện tab**: Phân chia rõ ràng giữa kỳ thi sắp tới và đã hoàn thành
- **Đếm ngược thời gian**: Hiển thị số ngày còn lại đến kỳ thi với mã màu trực quan
  - 🔴 **Khẩn cấp**: ≤ 3 ngày (màu đỏ)
  - 🟢 **An toàn**: > 3 ngày (màu xanh)
  - ⚫ **Đã thi**: Kỳ thi đã qua (màu xám)

### 🏷️ Phân loại bài thi tự động
- **FE** (Final Exam): Thi cuối kỳ
- **PE** (Practical Exam): Thi thực hành  
- **2NDFE** (Second Final Exam): Thi lại cuối kỳ
- **2NDPE** (Second Practical Exam): Thi lại thực hành

### 🔍 Bộ lọc thông minh
- Lọc theo loại kỳ thi (FE, PE, 2NDFE, 2NDPE)
- Lưu tùy chọn lọc tự động
- Giao diện modal hiện đại với các nút tiện ích

### 📱 Thiết kế hiện đại
- Giao diện Material Design sạch sẽ
- Responsive trên nhiều kích thước màn hình
- Dark mode tự động theo hệ thống
- Animation mượt mà

### 📤 Xuất lịch thông minh
- **Chỉ xuất kỳ thi sắp tới** có phòng thi xác định
- Tương thích với Apple Calendar, Google Calendar, Outlook
- Nhắc nhở tự động:
  - 🔔 1 ngày trước kỳ thi
  - ⏰ 1 giờ trước kỳ thi

## 🚀 Cài đặt

### Cài đặt thủ công (Developer Mode)
1. **Clone repository**:
   ```bash
   git clone https://github.com/yunkhngn/fptu-exam-calendar-exporter.git
   ```
2. **Mở Chrome Extensions**:
   - Truy cập `chrome://extensions/`
   - Bật **Developer mode** ở góc trên bên phải
3. **Load extension**:
   - Nhấn **Load unpacked**
   - Chọn thư mục vừa clone

### Cài đặt từ Chrome Web Store
🔜 *Đang chờ review từ Google*

## 📖 Hướng dẫn sử dụng

### Bước 1: Truy cập hệ thống FAP
1. Mở `https://fap.fpt.edu.vn/Exam/ScheduleExams.aspx`
2. Đăng nhập bằng tài khoản sinh viên FPT

### Bước 2: Sử dụng Extension
1. **Nhấn icon extension** trên thanh công cụ Chrome
2. **Tự động đồng bộ**: Extension sẽ tự động tải lịch thi nếu đang ở trang FAP
3. **Đồng bộ thủ công**: Nhấn nút **Sync** để tải lại dữ liệu

### Bước 3: Quản lý lịch thi
- **Xem kỳ thi sắp tới**: Tab "📅 Chưa thi"
- **Xem lịch sử**: Tab "✅ Đã thi"  
- **Lọc theo loại**: Nhấn **Filter** để chọn loại kỳ thi hiển thị

### Bước 4: Xuất lịch
1. **Nhấn "📅 Tải xuống lịch .ics"**
2. **Chờ file tải về**: `lich-thi.ics`
3. **Import vào ứng dụng lịch**:
   - **macOS**: Mở bằng Calendar
   - **Windows**: Mở bằng Outlook
   - **Mobile**: Google Calendar, Apple Calendar

## 🛠️ Công nghệ sử dụng

- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Chrome APIs**: Tabs, Scripting, Storage
- **Standards**: iCalendar (RFC 5545)
- **Design**: Material Design principles

## 🎨 Giao diện

### Light Theme
- Màu chủ đạo: Xanh dương (#3b82f6)
- Background: Trắng (#ffffff) 
- Text: Xám đậm (#1f2937)

### Component Design
- **Cards**: Bo góc 12px, shadow nhẹ
- **Buttons**: Hover effects, transition mượt
- **Tags**: Rounded, color-coded theo loại thi
- **Modal**: Overlay với backdrop blur

## 🔧 Cấu trúc dự án

```
fptu-exam-calendar-exporter/
├── manifest.json          # Extension manifest
├── popup.html             # Main popup interface  
├── popup.css              # Styling
├── popup.js               # Main logic
├── content.js             # FAP page interaction
├── icons/                 # Extension icons
└── README.md              # Documentation
```

## 🤝 Đóng góp

Hoan nghênh mọi đóng góp! Vui lòng:

1. **Fork** repository
2. **Tạo branch** cho feature mới
3. **Commit** thay đổi với message rõ ràng
4. **Push** lên branch
5. **Tạo Pull Request**

## 📝 Changelog

### v2.0.0 (2024)
- ✨ Thêm hệ thống tab (Chưa thi/Đã thi)
- ✨ Đếm ngược thời gian với mã màu
- ✨ Bộ lọc theo loại kỳ thi
- ✨ Giao diện Material Design mới
- 🐛 Chỉ xuất kỳ thi sắp tới có phòng xác định

### v1.0.0 (2024)
- 🎉 Phiên bản đầu tiên
- 📅 Xuất lịch thi cơ bản
- 🏷️ Nhận diện loại bài thi

## ❤️ Tác giả

**Được phát triển với 💛 bởi:**
- [@yunkhngn](https://github.com/yunkhngn) - Developer & Designer

**I 💛 FPTU** - *Tự hào sinh viên FPT University*

## 📞 Hỗ trợ

- 🐛 **Bug Report**: [GitHub Issues](https://github.com/yunkhngn/fptu-exam-calendar-exporter/issues)
- 💡 **Feature Request**: [GitHub Discussions](https://github.com/yunkhngn/fptu-exam-calendar-exporter/discussions)
- 📧 **Email**: [Liên hệ tác giả](https://github.com/yunkhngn)

## 📄 License

MIT License - Xem chi tiết trong file [LICENSE](LICENSE)

---

⭐ **Nếu extension hữu ích, hãy star repository để ủng hộ tác giả!**