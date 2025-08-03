# FPTU Examination Calendar Exporter

A modern Chrome extension that helps FPT University students easily extract and manage their exam schedules from the FAP system.

## Key Features

### Smart Exam Schedule Management
- **Tab Interface**: Clear separation between upcoming and completed exams
- **Countdown Timer**: Visual time remaining until exam with color coding
  - **Urgent**: 3 days or less (red)
  - **Safe**: More than 3 days (green)
  - **Completed**: Past exams (gray)

### Automatic Exam Classification
- **FE** (Final Exam): End-of-term examinations
- **PE** (Practical Exam): Practical/lab examinations
- **2NDFE** (Second Final Exam): Final exam retakes
- **2NDPE** (Second Practical Exam): Practical exam retakes

### Smart Filtering System
- Filter by exam type (FE, PE, 2NDFE, 2NDPE)
- Automatic filter preference saving
- Modern modal interface with utility buttons

### Modern Design
- Clean Material Design interface
- Responsive across different screen sizes
- Automatic dark mode following system preferences
- Smooth animations and transitions

### Intelligent Calendar Export
- **Export only upcoming exams** with confirmed room assignments
- Compatible with Apple Calendar, Google Calendar, Outlook
- Automatic reminders:
  - 1 day before exam
  - 1 hour before exam
- **Works from any website** using stored data

## Installation

### Manual Installation (Developer Mode)
1. **Clone repository**:
   ```bash
   git clone https://github.com/yunkhngn/fptu-exam-calendar-exporter.git
   ```
2. **Open Chrome Extensions**:
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** in the top right corner
3. **Load extension**:
   - Click **Load unpacked**
   - Select the cloned folder

### Chrome Web Store Installation
Coming soon - pending Google review

## Usage Guide

### Step 1: Access FAP System
1. Open `https://fap.fpt.edu.vn/Exam/ScheduleExams.aspx`
2. Login with your FPT student account

### Step 2: Use Extension
1. **Click extension icon** in Chrome toolbar
2. **Auto-sync**: Extension automatically loads exam schedule when on FAP page
3. **Manual sync**: Click **Sync** button to reload data

### Step 3: Manage Exam Schedule
- **View upcoming exams**: "Chưa thi" tab
- **View exam history**: "Đã thi" tab
- **Filter by type**: Click **Filter** to select exam types to display

### Step 4: Export Calendar
1. **Click "Tải xuống lịch .ics"** button
2. **Wait for download**: `lich-thi.ics` file
3. **Import to calendar app**:
   - **macOS**: Open with Calendar
   - **Windows**: Open with Outlook
   - **Mobile**: Google Calendar, Apple Calendar

Note: Calendar export works from any website using previously synced data.

## Technology Stack

- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Chrome APIs**: Tabs, Scripting, Storage
- **Standards**: iCalendar (RFC 5545)
- **Design**: Material Design principles

## Interface Design

### Light Theme
- Primary color: Blue (#3b82f6)
- Background: White (#ffffff)
- Text: Dark gray (#1f2937)

### Component Design
- **Cards**: 12px border radius, subtle shadows
- **Buttons**: Hover effects, smooth transitions
- **Tags**: Rounded, color-coded by exam type
- **Modal**: Overlay with backdrop blur

## Project Structure

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

## Contributing

Contributions are welcome! Please:

1. **Fork** the repository
2. **Create branch** for new feature
3. **Commit** changes with clear messages
4. **Push** to branch
5. **Create Pull Request**

## Changelog

### v2.0.0 (2024)
- Added tab system (Upcoming/Completed exams)
- Added countdown timer with color coding
- Added exam type filtering system
- New Material Design interface
- Export only upcoming exams with confirmed rooms
- Calendar export works from any website

### v1.0.0 (2024)
- Initial release
- Basic exam schedule export
- Exam type recognition

## Author

**Developed with love by:**
- [@yunkhngn](https://github.com/yunkhngn) - Developer & Designer & Guitarist

**I love FPTU** 

## License

MIT License - See [LICENSE](LICENSE) file for details

---

**If this extension is helpful, please star the repository to support the author!**