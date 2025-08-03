document.addEventListener("DOMContentLoaded", () => {
  const syncButton = document.getElementById("syncButton");
  const exportBtn = document.getElementById("exportBtn");
  const settingsButton = document.getElementById("settingsButton");
  const filterModal = document.getElementById("filterModal");
  const closeFilter = document.getElementById("closeFilter");
  
  // Tab switching functionality - add this right after the other element declarations
  const upcomingTab = document.getElementById("upcomingTab");
  const completedTab = document.getElementById("completedTab");
  const upcomingContent = document.getElementById("upcomingExams");
  const completedContent = document.getElementById("completedExams");

  if (upcomingTab && completedTab && upcomingContent && completedContent) {
    upcomingTab.addEventListener("click", () => {
      upcomingTab.classList.add("active");
      completedTab.classList.remove("active");
      upcomingContent.classList.add("active");
      completedContent.classList.remove("active");
    });

    completedTab.addEventListener("click", () => {
      completedTab.classList.add("active");
      upcomingTab.classList.remove("active");
      completedContent.classList.add("active");
      upcomingContent.classList.remove("active");
    });
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
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs || !tabs[0]) return;
        
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["content.js"]
        }, (results) => {
          if (chrome.runtime.lastError) {
            console.error('Script injection failed:', chrome.runtime.lastError);
            alert("Không thể chạy script trên trang này.");
            return;
          }
          
          chrome.tabs.sendMessage(tabs[0].id, { action: "extractSchedule" }, function (response) {
            if (chrome.runtime.lastError) {
              console.error('Message sending failed:', chrome.runtime.lastError);
              alert("Không thể kết nối với trang web.");
              return;
            }
            
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
              // Only skip if location is explicitly empty, null, or contains "chưa có"
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
        });
      });
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
});

// ...existing code...

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

  // Clear both containers
  upcomingContainer.innerHTML = "";
  completedContainer.innerHTML = "";
  
  if (!events.length) {
    upcomingContainer.innerHTML = "<div class='error'>Không có lịch thi nào.</div>";
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
    upcomingContainer.innerHTML = "<div class='error'>Không có kỳ thi nào sắp tới.</div>";
  } else {
    upcomingExams.forEach(e => {
      const examItem = createExamItem(e);
      upcomingContainer.appendChild(examItem);
    });
  }

  // Render completed exams
  if (completedExams.length === 0) {
    completedContainer.innerHTML = "<div class='error'>Không có kỳ thi nào đã hoàn thành.</div>";
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
  
  const countdownTag = (() => {
    if (diffDays < 0) {
      return '<span class="tag countdown past">Đã thi</span>';
    } else if (diffDays === 0) {
      return '<span class="tag countdown today">Hôm nay</span>';
    } else if (diffDays === 1) {
      return '<span class="tag countdown tomorrow">Ngày mai</span>';
    } else if (diffDays <= 3) {
      return `<span class="tag countdown urgent">Còn ${diffDays} ngày</span>`;
    } else {
      return `<span class="tag countdown future">Còn ${diffDays} ngày</span>`;
    }
  })();
  const tag = (() => {
    if (tagType === "2NDFE") return '<span class="tag secondfe">2NDFE</span>';
    if (tagType === "2NDPE") return '<span class="tag secondpe">2NDPE</span>';
    if (tagType === "PE") return '<span class="tag fe">PE</span>';
    if (tagType === "FE") return '<span class="tag fe">FE</span>';
    return '';
  })();
  row.innerHTML = `
    <div class="exam-card">
      <div class="exam-header">
        <div class="exam-title">${e.title} ${tag} ${countdownTag}</div>
      </div>
      <div class="exam-detail">
        <div class="line"><span class="label method"><strong>Phương thức:</strong></span> ${e.description || "Chưa rõ"}</div>
        <div class="line"><span class="label room"><strong>Phòng:</strong></span> ${e.location || "Chưa rõ"}</div>
        <div class="line"><span class="label date"><strong>Ngày thi:</strong></span> ${formatDate(start)}</div>
        <div class="line"><span class="label time"><strong>Thời gian:</strong></span> ${formatTime(start)} - ${formatTime(end)}</div>
      </div>
    </div>
  `;
  return row;
}