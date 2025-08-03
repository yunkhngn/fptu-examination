document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    if (url.includes("https://fap.fpt.edu.vn/Exam/ScheduleExams.aspx")) {
      autoSyncSchedule();
    }
  });
});

function autoSyncSchedule() {
  const loadingEl = document.querySelector(".loading");
  const errorEl = document.querySelector(".error");

  loadingEl.style.display = "block";
  errorEl.style.display = "none";

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"]
    }, () => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractSchedule" }, function (response) {
        loadingEl.style.display = "none";
        if (!response || !response.events) {
          errorEl.style.display = "block";
          return;
        }
        localStorage.setItem("examSchedule", JSON.stringify(response.events));
        location.reload();
      });
    });
  });
}

function renderExamList(events) {
  const examList = document.getElementById("examList");
  if (!examList) return;

  examList.innerHTML = ""; // clear
  if (!events.length) {
    examList.innerHTML = "<div class='error'>Không có lịch thi nào.</div>";
    return;
  }

  events.forEach(e => {
    console.log("Event:", JSON.stringify(e, null, 2));
    const desc = (e.description + ' ' + e.title).toLowerCase();
    const examType = (e.examType || "").toLowerCase();
    const tagType = (() => {
      const tag = (e.tag || examType || "").toLowerCase();
      if (tag.includes("2ndfe") || desc.includes("2ndfe") || desc.includes("2nd fe")) return "2NDFE";
      if (tag.includes("2ndpe") || desc.includes("2ndpe") || desc.includes("2nd pe")) return "2NDPE";
      if (tag === "pe" || desc.includes("practical_exam") || desc.includes("project presentation")) return "PE";
      if (tag === "fe" || desc.includes("fe") || desc.includes("final") || desc.includes("multiple_choices") || desc.includes("speaking")) return "FE";
      return null;
    })();
    console.log("→ Tag from content.js:", tagType);
    const row = document.createElement("div");
    row.className = "exam-item";

    const start = new Date(e.start);
    const end = new Date(e.end);
    const formatTime = d => d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const formatDate = d => d.toLocaleDateString("vi-VN");

    const tag = (() => {
      if (tagType === "2NDFE") return '<span class="tag secondfe">2NDFE</span>';
      if (tagType === "2NDPE") return '<span class="tag secondpe">2NDPE</span>';
      if (tagType === "PE") return '<span class="tag pe">PE</span>';
      if (tagType === "FE") return '<span class="tag fe">FE</span>';
      return '';
    })();

    row.innerHTML = `
      <div class="exam-card">
        <div class="exam-header">
          <div class="exam-title">${e.title} ${tag}</div>
          <div class="exam-desc">${e.description}</div>
        </div>
        <div class="exam-detail">
          <div class="line"><span class="label room">Phòng:</span> ${e.location || "Chưa rõ"}</div>
          <div class="line"><span class="label date">Ngày thi:</span> ${formatDate(start)}</div>
          <div class="line"><span class="label time">Thời gian:</span> ${formatTime(start)} - ${formatTime(end)}</div>
        </div>
      </div>
    `;
    examList.appendChild(row);
  });
}
const loadingEl = document.querySelector(".loading");
const errorEl = document.querySelector(".error");

document.getElementById("syncButton").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://fap.fpt.edu.vn/Exam/ScheduleExams.aspx" });
});


document.getElementById("exportBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"]
    }, () => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractSchedule" }, function (response) {
        if (!response || !response.events) {
          alert("Không lấy được lịch thi.");
          return;
        }

        const events = response.events;

        const ICS = function (uid = "fptu", prod = "exam-exporter") {
          const SEPARATOR = '\r\n';
          let eventsData = [];
          const calendarStart = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:' + prod,
            'CALSCALE:GREGORIAN'
          ].join(SEPARATOR);
          const calendarEnd = 'END:VCALENDAR';

          return {
            addEvent: function (title, desc, loc, start, end) {
              const now = new Date();
              const fmt = d => {
                let s = d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '') + 'Z';
                if (s.endsWith('ZZ')) s = s.slice(0, -1);
                return s;
              };
              let stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '') + 'Z';
              if (stamp.endsWith('ZZ')) stamp = stamp.slice(0, -1);
              const uidStr = fmt(now) + '-' + Math.random().toString(36).substring(2, 8) + '@' + prod;
              eventsData.push([
                'BEGIN:VEVENT',
                'UID:' + uidStr,
                'DTSTAMP:' + stamp,
                'DTSTART:' + fmt(start),
                'DTEND:' + fmt(end),
                'SUMMARY:' + title,
                'DESCRIPTION:' + desc,
                'LOCATION:' + loc,
                'BEGIN:VALARM',
                'TRIGGER:-PT1H',
                'ACTION:DISPLAY',
                'DESCRIPTION:Reminder',
                'END:VALARM',
                'END:VEVENT'
              ].join(SEPARATOR));
            },
            build: function () {
              return calendarStart + SEPARATOR + eventsData.join(SEPARATOR) + SEPARATOR + calendarEnd;
            }
          };
        };

        const cal = new ICS();
        events.forEach(e => {
          let title = e.title;
          if (/2nd_fe/i.test(e.description)) title += ' - 2NDFE';
          else if (/practical_exam/i.test(e.description)) title += ' - PE';
          else if (/multiple_choices|final|fe/i.test(e.description)) title += ' - FE';

          cal.addEvent(title, e.description, e.location, new Date(e.start), new Date(e.end));
        });

        const blob = new Blob([cal.build()], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'lich-thi.ics');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const data = localStorage.getItem("examSchedule");
  if (data) {
    try {
      renderExamList(JSON.parse(data));
    } catch (e) {
      console.error("Parse failed:", e);
    }
  }
});