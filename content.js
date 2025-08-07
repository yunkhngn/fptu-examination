chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "extractSchedule") {
    try {
      const fmtTime = t => {
        if (!t || typeof t !== "string") return { hour: 0, minute: 0 };
        
        // Clean up the string - remove extra spaces and normalize
        const cleaned = t.trim().replace(/\s+/g, "");
        
        // Handle Vietnamese format (10h00, 10h, 10H00)
        if (cleaned.match(/\d+h\d*/i)) {
          const [h, m = "0"] = cleaned.replace(/h/i, ":").split(":").map(Number);
          return { hour: h, minute: m };
        }
        
        // Handle colon format (10:00, 10:30)
        if (cleaned.includes(":")) {
          const [h, m = "0"] = cleaned.split(":").map(Number);
          return { hour: h, minute: m };
        }
        
        // Handle hour only format (10, 14) - assume no minutes
        if (/^\d{1,2}$/.test(cleaned)) {
          const h = Number(cleaned);
          return { hour: h, minute: 0 };
        }
        
        // Handle dot format (10.00, 10.30)
        if (cleaned.includes(".")) {
          const [h, m = "0"] = cleaned.split(".").map(Number);
          return { hour: h, minute: m };
        }
        
        return { hour: 0, minute: 0 };
      };

      const rows = Array.from(document.querySelectorAll("#ctl00_mainContent_divContent table tr"))
        .slice(1)
        .map(tr => Array.from(tr.cells).map(td => td.textContent.trim()));

      const events = rows
        .filter(row => row.length >= 8 && row[3] && row[5] !== undefined)
        .map(row => {
          const [no, code, name, date, room, time, form, exam, ...rest] = row;
          
          const [day, month, year] = date.split("/").map(Number);
          const [startStr, endStr] = time.split("-");
          const start = new Date(year, month - 1, day, fmtTime(startStr).hour, fmtTime(startStr).minute);
          const end = new Date(year, month - 1, day, fmtTime(endStr).hour, fmtTime(endStr).minute);
          
          let rawTag = "";
          if (exam && exam.trim()) {
            rawTag = exam.trim().toUpperCase();
          } else if (rest.length > 0 && rest[0] && rest[0].trim()) {
            rawTag = rest[0].trim().toUpperCase();
          }
          
          const formLower = (form || "").toLowerCase();
          
          let tag = null;
          if (rawTag === "2NDFE") tag = "2NDFE";
          else if (rawTag === "2NDPE") tag = "2NDPE";
          else if (rawTag === "PE") tag = "PE";
          else if (rawTag === "FE") tag = "FE";
          else if (!rawTag || rawTag === "") {
            if (formLower.includes("2nd") && formLower.includes("fe")) tag = "2NDFE";
            else if (formLower.includes("2nd") && formLower.includes("pe")) tag = "2NDPE";
            else if (formLower.includes("practical_exam") || formLower.includes("project presentation")) tag = "PE";
            else if (formLower.includes("multiple_choices") || formLower.includes("speaking")) tag = "FE";
          }

          return {
            title: code || "Unknown",
            location: room || "",
            description: form || "",
            start,
            end,
            tag
          };
        });

      sendResponse({ events });
    } catch (e) {
      sendResponse({ events: [] });
    }
    return true;
  } else if (msg.action === "clearAndSync") {
    try {
      // First clear existing exam events
      clearExistingExamEvents();
      
      // Then extract and return new schedule
      const fmtTime = t => {
        if (!t || typeof t !== "string") return { hour: 0, minute: 0 };
        
        // Clean up the string - remove extra spaces and normalize
        const cleaned = t.trim().replace(/\s+/g, "");
        
        // Handle Vietnamese format (10h00, 10h, 10H00)
        if (cleaned.match(/\d+h\d*/i)) {
          const [h, m = "0"] = cleaned.replace(/h/i, ":").split(":").map(Number);
          return { hour: h, minute: m };
        }
        
        // Handle colon format (10:00, 10:30)
        if (cleaned.includes(":")) {
          const [h, m = "0"] = cleaned.split(":").map(Number);
          return { hour: h, minute: m };
        }
        
        // Handle hour only format (10, 14) - assume no minutes
        if (/^\d{1,2}$/.test(cleaned)) {
          const h = Number(cleaned);
          return { hour: h, minute: 0 };
        }
        
        // Handle dot format (10.00, 10.30)
        if (cleaned.includes(".")) {
          const [h, m = "0"] = cleaned.split(".").map(Number);
          return { hour: h, minute: m };
        }
        
        return { hour: 0, minute: 0 };
      };

      const rows = Array.from(document.querySelectorAll("#ctl00_mainContent_divContent table tr"))
        .slice(1)
        .map(tr => Array.from(tr.cells).map(td => td.textContent.trim()));

      const events = rows
        .filter(row => row.length >= 8 && row[3] && row[5] !== undefined)
        .map(row => {
          const [no, code, name, date, room, time, form, exam, ...rest] = row;
          
          const [day, month, year] = date.split("/").map(Number);
          const [startStr, endStr] = time.split("-");
          const start = new Date(year, month - 1, day, fmtTime(startStr).hour, fmtTime(startStr).minute);
          const end = new Date(year, month - 1, day, fmtTime(endStr).hour, fmtTime(endStr).minute);
          
          let rawTag = "";
          if (exam && exam.trim()) {
            rawTag = exam.trim().toUpperCase();
          } else if (rest.length > 0 && rest[0] && rest[0].trim()) {
            rawTag = rest[0].trim().toUpperCase();
          }
          
          const formLower = (form || "").toLowerCase();
          
          let tag = null;
          if (rawTag === "2NDFE") tag = "2NDFE";
          else if (rawTag === "2NDPE") tag = "2NDPE";
          else if (rawTag === "PE") tag = "PE";
          else if (rawTag === "FE") tag = "FE";
          else if (!rawTag || rawTag === "") {
            if (formLower.includes("2nd") && formLower.includes("fe")) tag = "2NDFE";
            else if (formLower.includes("2nd") && formLower.includes("pe")) tag = "2NDPE";
            else if (formLower.includes("practical_exam") || formLower.includes("project presentation")) tag = "PE";
            else if (formLower.includes("multiple_choices") || formLower.includes("speaking")) tag = "FE";
          }

          return {
            title: code || "Unknown",
            location: room || "",
            description: form || "",
            start,
            end,
            tag
          };
        });

      sendResponse({ events, cleared: true });
    } catch (e) {
      sendResponse({ events: [], cleared: false });
    }
    return true;
  }
});

// Function to clear existing exam events from calendar
function clearExistingExamEvents() {
  try {
    // Look for calendar events that match exam patterns
    const calendarEvents = document.querySelectorAll('[data-exam-event="true"], [title*="FE"], [title*="PE"], [title*="2NDFE"], [title*="2NDPE"]');
    
    calendarEvents.forEach(event => {
      // Remove the event element
      event.remove();
    });
    
    // Also try to find events by common exam subject codes
    const examCodePattern = /^[A-Z]{3}\d{3}$/;
    const allEvents = document.querySelectorAll('[data-event], .event, .calendar-event');
    
    allEvents.forEach(event => {
      const title = event.textContent || event.title || '';
      if (examCodePattern.test(title.trim())) {
        event.remove();
      }
    });
    
    return true;
  } catch (e) {
    console.error('Error clearing existing exam events:', e);
    return false;
  }
}

// Function to mark events as exam events when creating them
function markAsExamEvent(element) {
  if (element && element.setAttribute) {
    element.setAttribute('data-exam-event', 'true');
  }
}