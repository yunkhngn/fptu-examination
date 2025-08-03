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
          if (/practical_exam/i.test(e.description)) title += ' - PE';
          else if (/2nd_fe/i.test(e.description)) title += ' - 2NDFE';
          else if (/multiple_choices|final/i.test(e.description)) title += ' - FE';

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
  const syncButton = document.getElementById("syncBtn");
  const loadingEl = document.querySelector(".loading");
  const errorEl = document.querySelector(".error");

  if (syncButton && loadingEl && errorEl) {
    syncButton.addEventListener("click", () => {
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
    });
  }
});