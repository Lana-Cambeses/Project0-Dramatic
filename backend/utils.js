function cleanWikiDescription(raw) {
    if (!raw || typeof raw !== "string") return "";
  
    // Removes anything in parentheses 
    let cleaned = raw.replace(/\s*\([^)]*\)/g, "");
  
    // Removes extra whitespace caused by (1)
    cleaned = cleaned.replace(/\s+/g, " ").trim();
  
    // Removes "XYZ is a..." phrasing if you want only the good stuff
    const isAIndex = cleaned.toLowerCase().indexOf(" is a ");
    if (isAIndex > -1 && isAIndex < 50) {
      cleaned = cleaned.slice(isAIndex + 6); // skip "is a "
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1); // capitalize
    }
  
    // Chops off after first 1–2 sentences (optional)
    const sentences = cleaned.split(".");
    if (sentences.length > 2) {
      cleaned = sentences.slice(0, 2).join(".") + ".";
    }
  
    return cleaned;
  }
  