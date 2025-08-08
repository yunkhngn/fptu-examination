document.addEventListener("DOMContentLoaded", () => {
  const syncButton = document.getElementById("syncButton");
  const exportBtn = document.getElementById("exportBtn");
  const settingsButton = document.getElementById("settingsButton");
  const filterModal = document.getElementById("filterModal");
  const closeFilter = document.getElementById("closeFilter");
  const docsLink = document.getElementById("docsLink");
  
  // Tab switching functionality - add this right after the other element declarations
  const upcomingTab = document.getElementById("upcomingTab");
  const completedTab = document.getElementById("completedTab");
  const upcomingContent = document.getElementById("upcomingExams");
  const completedContent = document.getElementById("completedExams");
  const scheduleTabBtn = document.getElementById("scheduleTabBtn");
  const scheduleContent = document.getElementById("scheduleTab");
  const examActionsRow = document.getElementById("examActions");
  const scheduleActionsRow = document.getElementById("scheduleActions");
  if (examActionsRow) examActionsRow.style.display = "flex";
  if (scheduleActionsRow) scheduleActionsRow.style.display = "none";

  if (upcomingTab && completedTab && upcomingContent && completedContent) {
    const activateTab = (name) => {
      [upcomingTab, completedTab, scheduleTabBtn].forEach(btn => btn && btn.classList.remove("active"));
      [upcomingContent, completedContent, scheduleContent].forEach(c => c && c.classList.remove("active"));
      if (name === "upcoming") {
        upcomingTab.classList.add("active");
        upcomingContent.classList.add("active");
        if (examActionsRow) examActionsRow.style.display = "flex";
        if (scheduleActionsRow) scheduleActionsRow.style.display = "none";
      } else if (name === "completed") {
        completedTab.classList.add("active");
        completedContent.classList.add("active");
        if (examActionsRow) examActionsRow.style.display = "flex";
        if (scheduleActionsRow) scheduleActionsRow.style.display = "none";
      } else if (name === "schedule") {
        if (scheduleTabBtn) scheduleTabBtn.classList.add("active");
        if (scheduleContent) scheduleContent.classList.add("active");
        if (examActionsRow) examActionsRow.style.display = "none";
        if (scheduleActionsRow) scheduleActionsRow.style.display = "flex";
      }
    };

    upcomingTab.addEventListener("click", () => activateTab("upcoming"));
    completedTab.addEventListener("click", () => activateTab("completed"));
    if (scheduleTabBtn) {
      scheduleTabBtn.addEventListener("click", () => activateTab("schedule"));
    }
    activateTab(document.querySelector('.tab-btn.active')?.id === 'completedTab' ? 'completed' : 'upcoming');
  }

  // Load filter preferences
  const filterPrefs = JSON.parse(localStorage.getItem("examFilter") || '{"FE":true,"PE":true,"2NDFE":true,"2NDPE":true}');
  
  // Set initial filter states
  if (document.getElementById("filterFE")) {
    document.getElementById("filterFE").checked = filterPrefs.FE;
    document.getElementById("filterPE").checked = filterPrefs.PE;
    document.getElementById("filter2NDFE").checked = filterPrefs["2NDFE"];
    document.getElementById("filter2NDPE").checked = filterPrefs["2NDPE"];
  }

  // Filter modal events
  if (settingsButton && filterModal) {
    settingsButton.addEventListener("click", () => {
      filterModal.style.display = "block";
    });
  }

  if (closeFilter && filterModal) {
    closeFilter.addEventListener("click", () => {
      filterModal.style.display = "none";
    });
  }

  // Close modal when clicking outside
  if (filterModal) {
    filterModal.addEventListener("click", (e) => {
      if (e.target === filterModal) {
        filterModal.style.display = "none";
      }
    });
  }

  // Remove the immediate filter change events - comment them out completely
  // ["filterFE", "filterPE", "filter2NDFE", "filter2NDPE"].forEach(id => {
  //   const element = document.getElementById(id);
  //   if (element) {
  //     element.addEventListener("change", () => {
  //       saveFilterPrefs();
  //       applyFilters();
  //     });
  //   }
  // });

  // Select/Deselect all buttons
  const selectAllBtn = document.getElementById("selectAll");
  const deselectAllBtn = document.getElementById("deselectAll");
  const applyFilterBtn = document.getElementById("applyFilter");
  
  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", () => {
      ["filterFE", "filterPE", "filter2NDFE", "filter2NDPE"].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.checked = true;
      });
    });
  }

  if (deselectAllBtn) {
    deselectAllBtn.addEventListener("click", () => {
      ["filterFE", "filterPE", "filter2NDFE", "filter2NDPE"].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.checked = false;
      });
    });
  }

  if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", () => {
      console.log("Apply filter clicked"); // Debug log
      saveFilterPrefs();
      applyFilters();
      filterModal.style.display = "none";
    });
  }

  function saveFilterPrefs() {
    const prefs = {
      FE: document.getElementById("filterFE")?.checked || false,
      PE: document.getElementById("filterPE")?.checked || false,
      "2NDFE": document.getElementById("filter2NDFE")?.checked || false,
      "2NDPE": document.getElementById("filter2NDPE")?.checked || false
    };
    console.log("Saving filter prefs:", prefs); // Debug log
    localStorage.setItem("examFilter", JSON.stringify(prefs));
  }

  function applyFilters() {
    console.log("Applying filters"); // Debug log
    const upcomingItems = document.querySelectorAll("#upcomingExams .exam-item");
    const completedItems = document.querySelectorAll("#completedExams .exam-item");
    const activeFilters = JSON.parse(localStorage.getItem("examFilter") || '{"FE":true,"PE":true,"2NDFE":true,"2NDPE":true}');
    console.log("Active filters:", activeFilters); // Debug log
    
    // Apply filters to both upcoming and completed tabs
    [...upcomingItems, ...completedItems].forEach(item => {
      const examCard = item.querySelector(".exam-card");
      const tags = examCard.querySelectorAll(".tag");
      let examType = null;
      
      // Check for exam type tags
      tags.forEach(tag => {
        if (tag.classList.contains("fe")) examType = "FE";
        else if (tag.classList.contains("pe")) examType = "PE";
        else if (tag.classList.contains("secondfe")) examType = "2NDFE";
        else if (tag.classList.contains("secondpe")) examType = "2NDPE";
      });
      
      // If no specific exam type found, try to determine from tag text
      if (!examType) {
        tags.forEach(tag => {
          const tagText = tag.textContent.trim();
          if (tagText === "FE") examType = "FE";
          else if (tagText === "PE") examType = "PE";
          else if (tagText === "2NDFE") examType = "2NDFE";
          else if (tagText === "2NDPE") examType = "2NDPE";
        });
      }
      
      console.log("Exam type found:", examType, "Should show:", !examType || activeFilters[examType]); // Debug log
      
      // Show if no exam type found or if exam type is enabled
      if (!examType || activeFilters[examType]) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  // Make applyFilters available globally
  window.applyFilters = applyFilters;

  if (syncButton) {
    syncButton.addEventListener("click", () => {
      chrome.tabs.create({ url: "https://fap.fpt.edu.vn/Exam/ScheduleExams.aspx" });
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      // Get stored exam data instead of requiring FAP page
      const storedData = localStorage.getItem("examSchedule");
      
      if (!storedData) {
        alert("Chưa có dữ liệu lịch thi. Vui lòng truy cập trang FAP và nhấn Sync để tải dữ liệu.");
        return;
      }

      let events;
      try {
        events = JSON.parse(storedData);
      } catch (e) {
        console.error("Parse stored data failed:", e);
        alert("Dữ liệu lịch thi bị lỗi. Vui lòng sync lại từ trang FAP.");
        return;
      }

      if (!events || !events.length) {
        alert("Không có lịch thi nào để xuất.");
        return;
      }

      const ICS = function (uid = "fptu", prod = "examination") {
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
              'TRIGGER:-P1D',
              'ACTION:DISPLAY',
              'DESCRIPTION:Nhắc nhở: Thi vào ngày mai',
              'END:VALARM',
              'BEGIN:VALARM',
              'TRIGGER:-PT1H',
              'ACTION:DISPLAY',
              'DESCRIPTION:Nhắc nhở: Thi trong 1 giờ nữa',
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
      let validEventsCount = 0;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      events.forEach(e => {
        // Check if exam is upcoming (not completed)
        const start = new Date(e.start);
        const examDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const diffTime = examDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Skip completed exams
        if (diffDays < 0) {
          return; // Skip past exams
        }

        // Skip exams without room number (not scheduled for retake)
        if (!e.location || 
            e.location.trim() === "" || 
            e.location.toLowerCase().includes("chưa có") ||
            e.location.toLowerCase().includes("chưa rõ") ||
            e.location.toLowerCase() === "tba" ||
            e.location.toLowerCase() === "to be announced") {
          return; // Skip this exam
        }

        let title = e.title;
     
        if (e.tag) {
          title += ' - ' + e.tag;
        } else {
          if (/2nd_fe/i.test(e.description)) title += ' - 2NDFE';
          else if (/practical_exam/i.test(e.description)) title += ' - PE';
          else if (/multiple_choices|final|fe/i.test(e.description)) title += ' - FE';
        }

        cal.addEvent(title, e.description, e.location, new Date(e.start), new Date(e.end));
        validEventsCount++;
      });

      if (validEventsCount === 0) {
        alert("Không có kỳ thi nào sắp tới và có phòng để xuất ra file .ics");
        return;
      }

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
  }


  setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs[0] && tabs[0].url && tabs[0].url.includes("https://fap.fpt.edu.vn/Exam/ScheduleExams.aspx")) {
        autoSyncSchedule();
      }
    });
  }, 100);

  const data = localStorage.getItem("examSchedule");
  if (data) {
    try {
      renderExamList(JSON.parse(data));
    } catch (e) {
      console.error("Parse failed:", e);
    }
  }

  // Load class schedule for the new tab
  const storedSchedule = localStorage.getItem("classSchedule");
  if (storedSchedule) {
    try {
      renderClassSchedule(JSON.parse(storedSchedule));
    } catch (e) {
      console.error("Parse stored class schedule failed:", e);
    }
  } else {
    // Ensure empty state appears if container exists
    const sc = document.getElementById("scheduleTab");
    if (sc && !sc.firstChild) {
      const empty = document.createElement("div");
      empty.className = "schedule-empty";
      empty.textContent = "Chưa có lịch học. Nhấn \"Sync lịch học\" để tải.";
      sc.appendChild(empty);
    }
  }
function renderClassSchedule(schedule) {
  const container = document.getElementById("scheduleTab");
  if (!container) return;

  // Clear existing
  while (container.firstChild) container.removeChild(container.firstChild);

  // Update tab label with count
  const btn = document.getElementById("scheduleTabBtn");
  if (btn) btn.textContent = `📚 Lịch học (${Array.isArray(schedule) ? schedule.length : 0})`;

  // Normalize and sort schedule by date/time ascending
  const toMillis = (ev) => {
    if (ev && ev.rawDate) {
      const rd = ev.rawDate;
      // month in JS Date is 0-based
      return new Date(rd.year, (rd.month || 1) - 1, rd.day || 1, rd.startHour || 0, rd.startMinute || 0, 0).getTime();
    }
    if (ev && ev.start) {
      try { return new Date(ev.start).getTime(); } catch (_) {}
    }
    return Number.MAX_SAFE_INTEGER; // push unknown dates to the end
  };
  const sorted = Array.isArray(schedule) ? [...schedule].sort((a,b) => toMillis(a) - toMillis(b)) : [];

  if (!Array.isArray(schedule) || schedule.length === 0) {
    const empty = document.createElement("div");
    empty.className = "schedule-empty";
    empty.textContent = "Chưa có lịch học. Nhấn \"Sync lịch học\" để tải.";
    container.appendChild(empty);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "schedule-grid";

  // Helper formatters using rawDate if present
  const two = n => String(n).padStart(2, '0');
  const fmtDate = rd => `${two(rd.day)}/${two(rd.month)}/${rd.year}`;
  const fmtTime = (h,m) => `${two(h)}:${two(m)}`;

  sorted.forEach(ev => {
    const card = document.createElement("div");
    card.className = "class-card";

    const header = document.createElement("div");
    header.className = "class-header";

    const title = document.createElement("div");
    title.className = "class-title";
    title.textContent = ev.title || "Môn học";

    const tags = document.createElement("div");
    tags.className = "class-tags";

    // Slot/Type chip (first)
    const chipType = document.createElement("span");
    chipType.className = "chip type";
    const dotType = document.createElement("span"); dotType.className = "dot";
    chipType.appendChild(dotType);
    chipType.appendChild(document.createTextNode(` ${(ev.slot || ev.type || "Slot ?").toString()}`));
    tags.appendChild(chipType);

    // Room chip (second)
    if (ev.location) {
      const chipRoom = document.createElement("span");
      chipRoom.className = "chip room";
      const dot = document.createElement("span"); dot.className = "dot";
      chipRoom.appendChild(dot);
      const roomText = (ev.location || "").replace(/\s*-\s*$/, "").trim();
      chipRoom.appendChild(document.createTextNode(` ${roomText}`));
      tags.appendChild(chipRoom);
    }

    header.appendChild(title);
    card.appendChild(header);
    card.appendChild(tags);

    const meta = document.createElement("div");
    meta.className = "class-meta";

    const addMeta = (label, value) => {
      const l = document.createElement("div");
      l.className = "label";
      const strong = document.createElement("strong");
      strong.textContent = label + ":";
      l.appendChild(strong);
      const v = document.createElement("div");
      v.textContent = value || "—";
      meta.appendChild(l);
      meta.appendChild(v);
    };

    if (ev.rawDate) {
      addMeta("Ngày", fmtDate(ev.rawDate));
      addMeta("Giờ", `${fmtTime(ev.rawDate.startHour, ev.rawDate.startMinute)} - ${fmtTime(ev.rawDate.endHour, ev.rawDate.endMinute)}`);
    }

    card.appendChild(meta);
    const divLine = document.createElement("div"); divLine.className = "meta-divider"; card.appendChild(divLine);

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

  // Documentation link event
  if (docsLink) {
    docsLink.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: "https://yunkhngn.github.io/fptu-examination/" });
    });
  }

  // Get new button elements
  const syncScheduleBtn = document.getElementById("syncScheduleBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const clearBtn = document.getElementById("clearBtn");

  // Add event handlers for new buttons
  if (syncScheduleBtn) {
    syncScheduleBtn.addEventListener("click", handleSyncClassSchedule);
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", handleDownloadClassSchedule);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", handleClearClassSchedule);
  }
});

function handleSyncClassSchedule() {
  console.log("🔄 Starting class schedule sync...");
  showToast("Đang sync lịch học...", 1500);
  
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs || !tabs[0]) {
      console.error("❌ No active tab found");
      alert("Vui lòng mở trang lịch học FAP trước khi sync.");
      return;
    }
    
    console.log("📍 Current URL:", tabs[0].url);
    
    // Simplified URL check - just check for FAP domain
    if (!tabs[0].url.includes("fap.fpt.edu.vn")) {
      console.error("❌ Not on FAP domain");
      alert("Vui lòng truy cập trang FAP để sync lịch học.");
      return;
    }
    
    console.log("✅ URL check passed, injecting script...");
    
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"]
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error('❌ Script injection failed:', chrome.runtime.lastError);
        alert("Không thể truy cập trang để sync lịch học. Vui lòng refresh trang và thử lại.");
        return;
      }
      
      console.log("✅ Script injected, sending message...");
      
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractWeeklySchedule" }, function (response) {
        if (chrome.runtime.lastError) {
          console.error('❌ Message sending failed:', chrome.runtime.lastError);
          alert("Có lỗi xảy ra khi sync lịch học. Vui lòng thử lại.");
          return;
        }
        
        console.log("📨 Response received:", response);
        
        if (!response || !response.success) {
          console.error("❌ Extraction failed");
          alert("Không thể trích xuất lịch học. Vui lòng:\n1. Đảm bảo bạn đang ở trang có bảng lịch học\n2. Trang đã load hoàn toàn\n3. Bạn đã đăng nhập");
          return;
        }
        
        const newEvents = response.schedule || [];
        console.log(`📊 Found ${newEvents.length} events`);
        
        if (newEvents.length === 0) {
          alert("Không tìm thấy lịch học nào. Vui lòng kiểm tra:\n1. Tuần hiện tại có lịch học không\n2. Trang đã load đầy đủ chưa");
          return;
        }
        
        // Process and save events
        const existingData = localStorage.getItem("classSchedule");
        let allSchedule = [];
        
        if (existingData) {
          try {
            allSchedule = JSON.parse(existingData);
          } catch (e) {
            console.error("Error parsing existing schedule:", e);
            allSchedule = [];
          }
        }
        
        // Cải thiện phần kiểm tra trùng lặp
        const existingKeys = new Set();
        
        // Tạo các key duy nhất từ lịch đã có
        allSchedule.forEach(event => {
          // Sử dụng rawDate nếu có, nếu không thì thử dùng start cũ
          if (event.rawDate) {
            const key = `${event.title}-${event.rawDate.day}/${event.rawDate.month}-${event.rawDate.startHour}:${event.rawDate.startMinute}`;
            existingKeys.add(key);
          } else if (event.start) {
            // Xử lý với dữ liệu cũ (chuyển đổi sang string nếu cần)
            const start = typeof event.start === 'string' ? new Date(event.start) : event.start;
            const key = `${event.title}-${start.getDate()}/${start.getMonth()+1}-${start.getHours()}:${start.getMinutes()}`;
            existingKeys.add(key);
          }
        });
        
        console.log("Existing keys:", existingKeys);
        
        // Lọc ra những event mới
        const uniqueNewEvents = newEvents.filter(event => {
          if (event.rawDate) {
            const key = `${event.title}-${event.rawDate.day}/${event.rawDate.month}-${event.rawDate.startHour}:${event.rawDate.startMinute}`;
            return !existingKeys.has(key);
          }
          return true; // Nếu không có rawDate, coi như là mới
        });
        
        console.log(`Found ${uniqueNewEvents.length} new events from ${newEvents.length} total extracted events`);
        
                // Kết hợp dữ liệu cũ và mới
        allSchedule = [...allSchedule, ...uniqueNewEvents];
        localStorage.setItem("classSchedule", JSON.stringify(allSchedule));
        // Re-render UI for the schedule tab
        renderClassSchedule(allSchedule);
        console.log(`✅ Sync complete: ${uniqueNewEvents.length} new, ${allSchedule.length} total`);
        // Chuyển sang tab Lịch học và hiện toast thay vì alert
        try {
          document.getElementById('scheduleTabBtn')?.click();
        } catch (e) { /* no-op */ }
        showToast(`Đã sync lịch học! Mới: ${uniqueNewEvents.length} • Tổng: ${allSchedule.length}`, 2600);
      });
    });
  });
}

function handleDownloadClassSchedule() {
  const storedData = localStorage.getItem("classSchedule");
  
  if (!storedData) {
    alert("Chưa có dữ liệu lịch học. Vui lòng sync lịch học trước.");
    return;
  }

  let schedule;
  try {
    schedule = JSON.parse(storedData);
    console.log("Loaded schedule:", schedule.length, "events");
  } catch (e) {
    console.error("Parse stored schedule failed:", e);
    alert("Dữ liệu lịch học bị lỗi. Vui lòng sync lại.");
    return;
  }

  if (!schedule || !schedule.length) {
    alert("Không có lịch học nào để tải.");
    return;
  }

  // Create ICS content for class schedule
  const ICS = function (uid = "fptu", prod = "class-schedule") {
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
      addEvent: function (title, desc, loc, event, isFirstSlot = false) {
        const now = new Date();
        
        // Format date for ICS file - without timezone adjustment
        const formatDate = (year, month, day, hour, minute) => {
          // Format as YYYYMMDDTHHMMSS (local time, not UTC)
          return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}00`;
        };
        
        const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '') + 'Z';
        const uidStr = `${timestamp}-${Math.random().toString(36).substring(2, 8)}@${prod}`;
        
        // Generate start and end times directly from raw values
        let startDate, endDate;
        
        if (event.rawDate) {
          const rd = event.rawDate;
          // Use rawDate values directly without timezone adjustments
          startDate = formatDate(rd.year, rd.month, rd.day, rd.startHour, rd.startMinute);
          endDate = formatDate(rd.year, rd.month, rd.day, rd.endHour, rd.endMinute);
          
          console.log(`Event: ${title} on ${rd.day}/${rd.month}/${rd.year} ${rd.startHour}:${rd.startMinute}-${rd.endHour}:${rd.endMinute}`);
        } else {
          // Fallback (should not happen with new data)
          const start = new Date();
          const end = new Date();
          end.setHours(end.getHours() + 1);
          
          startDate = start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
          endDate = end.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
          
          if (!startDate.endsWith('Z')) startDate += 'Z';
          if (!endDate.endsWith('Z')) endDate += 'Z';
        }
        
        // Build the event with potential alarms
        let eventArray = [
          'BEGIN:VEVENT',
          'UID:' + uidStr,
          'DTSTAMP:' + timestamp,
          'DTSTART;VALUE=DATE-TIME:' + startDate,  // Specify as DATE-TIME with no Z for local time
          'DTEND;VALUE=DATE-TIME:' + endDate,      // Specify as DATE-TIME with no Z for local time
          'SUMMARY:' + title,
          'DESCRIPTION:' + desc,
          'LOCATION:' + loc
        ];
        
        // Add 30-minute alarm for first slots of the day
        if (isFirstSlot || event.slot === "Slot 1") {
          console.log(`Adding 30-minute alarm for: ${title} (${event.slot})`);
          eventArray = eventArray.concat([
            'BEGIN:VALARM',
            'ACTION:DISPLAY',
            'DESCRIPTION:Sắp đến giờ học! (Nhắc nhở 30 phút)',
            'TRIGGER:-PT30M',
            'END:VALARM'
          ]);
        }
        
        // End the event
        eventArray.push('END:VEVENT');
        
        // Join all lines with separator and add to events data
        eventsData.push(eventArray.join(SEPARATOR));
      },
      build: function () {
        return calendarStart + SEPARATOR + eventsData.join(SEPARATOR) + SEPARATOR + calendarEnd;
      }
    };
  };

  const cal = new ICS();
  
  // Group events by date to identify first slots
  const eventsByDate = {};
  
  // First pass: group events by date
  schedule.forEach(event => {
    if (event.rawDate) {
      const dateKey = `${event.rawDate.day}-${event.rawDate.month}-${event.rawDate.year}`;
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    }
  });
  
  // Second pass: sort events by time and mark first slots
  Object.keys(eventsByDate).forEach(dateKey => {
    // Sort events by start time
    eventsByDate[dateKey].sort((a, b) => {
      if (a.rawDate.startHour !== b.rawDate.startHour) {
        return a.rawDate.startHour - b.rawDate.startHour;
      }
      return a.rawDate.startMinute - b.rawDate.startMinute;
    });
    
    // Mark the first event of the day
    if (eventsByDate[dateKey].length > 0) {
      eventsByDate[dateKey][0].isFirstSlot = true;
    }
  });
  
  // Add events to calendar
  schedule.forEach(event => {
    cal.addEvent(
      event.title,
      event.description || '',
      event.location || '',
      event,
      event.isFirstSlot // Pass the flag that identifies if it's the first slot of the day
    );
  });

  const blob = new Blob([cal.build()], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'lich-hoc.ics');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  alert(`Đã tải xuống ${schedule.length} lịch học. Chúc bạn học tập vui vẻ.`);
}

function handleClearClassSchedule() {
  if (!confirm('Bạn có chắc chắn muốn xoá toàn bộ lịch học đã lưu?')) {
    return;
  }
  
  try {
    localStorage.removeItem("classSchedule");
    alert('Đã xoá toàn bộ lịch học.');
  } catch (e) {
    console.error("Error clearing class schedule:", e);
    alert('Có lỗi xảy ra khi xoá lịch học.');
  }
}

function autoSyncSchedule() {
  const loadingEl = document.querySelector(".loading");
  const errorEl = document.querySelector(".error");

  if (loadingEl) loadingEl.style.display = "block";
  if (errorEl) errorEl.style.display = "none";

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs || !tabs[0]) return;
    
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"]
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error('Script injection failed:', chrome.runtime.lastError);
        if (loadingEl) loadingEl.style.display = "none";
        if (errorEl) errorEl.style.display = "block";
        return;
      }
      
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractSchedule" }, function (response) {
        if (loadingEl) loadingEl.style.display = "none";
        if (chrome.runtime.lastError) {
          console.error('Message sending failed:', chrome.runtime.lastError);
          if (errorEl) errorEl.style.display = "block";
          return;
        }
        if (!response || !response.events) {
          if (errorEl) errorEl.style.display = "block";
          return;
        }
        localStorage.setItem("examSchedule", JSON.stringify(response.events));

        renderExamList(response.events);
      });
    });
  });
}

function renderExamList(events) {
  const upcomingContainer = document.getElementById("upcomingExams");
  const completedContainer = document.getElementById("completedExams");
  const loadingEl = document.querySelector(".loading");
  const errorEl = document.querySelector(".error");
  
  // Hide loading/error elements
  if (loadingEl) loadingEl.style.display = "none";
  if (errorEl) errorEl.style.display = "none";
  
  if (!upcomingContainer || !completedContainer) return;

  // Clear both containers safely
  while (upcomingContainer.firstChild) {
    upcomingContainer.removeChild(upcomingContainer.firstChild);
  }
  while (completedContainer.firstChild) {
    completedContainer.removeChild(completedContainer.firstChild);
  }
  
  if (!events.length) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = "Không có lịch thi nào.";
    upcomingContainer.appendChild(errorDiv);
    return;
  }

  // Separate upcoming and completed exams
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const upcomingExams = [];
  const completedExams = [];

  events.forEach(e => {
    const start = new Date(e.start);
    const examDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      completedExams.push(e);
    } else {
      upcomingExams.push(e);
    }
  });

  // Render upcoming exams
  if (upcomingExams.length === 0) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = "Không có kỳ thi nào sắp tới.";
    upcomingContainer.appendChild(errorDiv);
  } else {
    upcomingExams.forEach(e => {
      const examItem = createExamItem(e);
      upcomingContainer.appendChild(examItem);
    });
  }

  // Render completed exams
  if (completedExams.length === 0) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = "Không có kỳ thi nào đã hoàn thành.";
    completedContainer.appendChild(errorDiv);
  } else {
    completedExams.forEach(e => {
      const examItem = createExamItem(e);
      completedContainer.appendChild(examItem);
    });
  }

  // Update tab labels with counts
  const upcomingTab = document.getElementById("upcomingTab");
  const completedTab = document.getElementById("completedTab");
  
  if (upcomingTab) upcomingTab.textContent = `📅 Chưa thi (${upcomingExams.length})`;
  if (completedTab) completedTab.textContent = `✅ Đã thi (${completedExams.length})`;
  
  // Apply filters after rendering
  setTimeout(() => {
    if (window.applyFilters) {
      window.applyFilters();
    }
  }, 100);
}

function createExamItem(e) {
  const desc = (e.description + ' ' + e.title).toLowerCase();
  const examType = (e.examType || "").toLowerCase();
  const tagType = (() => {
    if (e.tag) {
      return e.tag; 
    }
    
    const tag = (examType || "").toLowerCase();
    if (tag.includes("2ndfe") || desc.includes("2ndfe") || desc.includes("2nd fe")) return "2NDFE";
    if (tag.includes("2ndpe") || desc.includes("2ndpe") || desc.includes("2nd pe")) return "2NDPE";
    if (tag === "pe" || desc.includes("practical_exam") || desc.includes("project presentation")) return "PE";
    if (tag === "fe" || desc.includes("fe") || desc.includes("final") || desc.includes("multiple_choices") || desc.includes("speaking")) return "FE";
    return null;
  })();

  const row = document.createElement("div");
  row.className = "exam-item";

  const start = new Date(e.start);
  const end = new Date(e.end);
  const formatTime = d => d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const formatDate = d => d.toLocaleDateString("vi-VN");

  // Calculate days remaining
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const examDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Create exam card structure safely
  const examCard = document.createElement("div");
  examCard.className = "exam-card";

  const examHeader = document.createElement("div");
  examHeader.className = "exam-header";

  const examTitle = document.createElement("div");
  examTitle.className = "exam-title";
  examTitle.textContent = e.title + " ";

  // Add tags safely
  if (tagType) {
    const tagSpan = document.createElement("span");
    tagSpan.className = "tag";
    if (tagType === "2NDFE") {
      tagSpan.classList.add("secondfe");
      tagSpan.textContent = "2NDFE";
    } else if (tagType === "2NDPE") {
      tagSpan.classList.add("secondpe");
      tagSpan.textContent = "2NDPE";
    } else if (tagType === "PE") {
      tagSpan.classList.add("pe");
      tagSpan.textContent = "PE";
    } else if (tagType === "FE") {
      tagSpan.classList.add("fe");
      tagSpan.textContent = "FE";
    }
    examTitle.appendChild(tagSpan);
    examTitle.appendChild(document.createTextNode(" "));
  }

  // Add countdown tag safely
  const countdownSpan = document.createElement("span");
  countdownSpan.className = "tag countdown";
  if (diffDays < 0) {
    countdownSpan.classList.add("past");
    countdownSpan.textContent = "Đã thi";
  } else if (diffDays === 0) {
    countdownSpan.classList.add("today");
    countdownSpan.textContent = "Hôm nay";
  } else if (diffDays === 1) {
    countdownSpan.classList.add("tomorrow");
    countdownSpan.textContent = "Ngày mai";
  } else if (diffDays <= 3) {
    countdownSpan.classList.add("urgent");
    countdownSpan.textContent = "Còn " + diffDays + " ngày";
  } else {
    countdownSpan.classList.add("future");
    countdownSpan.textContent = "Còn " + diffDays + " ngày";
  }
  examTitle.appendChild(countdownSpan);

  examHeader.appendChild(examTitle);
  examCard.appendChild(examHeader);

  // Create exam details safely
  const examDetail = document.createElement("div");
  examDetail.className = "exam-detail";

  const createDetailLine = (label, value) => {
    const line = document.createElement("div");
    line.className = "line";
    
    const labelSpan = document.createElement("span");
    labelSpan.className = "label";
    const strong = document.createElement("strong");
    strong.textContent = label + ":";
    labelSpan.appendChild(strong);
    
    line.appendChild(labelSpan);
    line.appendChild(document.createTextNode(" " + value));
    return line;
  };

  examDetail.appendChild(createDetailLine("Phương thức", e.description || "Chưa rõ"));
  examDetail.appendChild(createDetailLine("Phòng", e.location || "Chưa rõ"));
  examDetail.appendChild(createDetailLine("Ngày thi", formatDate(start)));
  examDetail.appendChild(createDetailLine("Thời gian", formatTime(start) + " - " + formatTime(end)));

  examCard.appendChild(examDetail);
  row.appendChild(examCard);
  
  return row;
}

function showToast(message, duration = 1800) {
  let toast = document.getElementById('popupToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'popupToast';
    toast.style.position = 'fixed';
    toast.style.top = '12px';
    toast.style.right = '12px';
    toast.style.background = '#111827';
    toast.style.color = '#fff';
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    toast.style.fontSize = '13px';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .2s ease';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
  }, duration);
}