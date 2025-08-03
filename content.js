chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "extractSchedule") {
    try {
      const fmtTime = t => {
        if (!t || typeof t !== "string" || !t.includes("h")) return { hour: 0, minute: 0 };
        const [h, m] = t.replace("h", ":").split(":").map(Number);
        return { hour: h, minute: m };
      };

      const rows = Array.from(document.querySelectorAll("#ctl00_mainContent_divContent table tr"))
        .slice(1)
        .map(tr => Array.from(tr.cells).map(td => td.textContent.trim()));

      const events = rows
        .filter(row => row.length >= 8 && row[3] && row[5])
        .map(row => {
          const [no, code, name, date, room, time, form, exam] = row;
          const [day, month, year] = date.split("/").map(Number);
          const [startStr, endStr] = time.split("-");
          const start = new Date(year, month - 1, day, fmtTime(startStr).hour, fmtTime(startStr).minute);
          const end = new Date(year, month - 1, day, fmtTime(endStr).hour, fmtTime(endStr).minute);
          let rawTag = (exam || "").trim().toUpperCase();
          let tag = null;
          if (rawTag === "2NDFE") tag = "2NDFE";
          else if (rawTag === "2NDPE") tag = "2NDPE";
          else if (rawTag === "PE") tag = "PE";
          else if (rawTag === "FE") tag = "FE";

          return {
            title: `${code} - ${name}`,
            location: room,
            description: form,
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
  }
});