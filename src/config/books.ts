// Books configuration
// Change this URL to point to your JSON storage location
export const BASE_JSON_URL = "https://your-storage-domain/books";

// Category mapping for display names
export const CATEGORY_NAMES: Record<string, string> = {
  "economics": "Economics and Political Economy",
  "political-theory": "Political Theory and Ideologies", 
  "philosophy": "Philosophy and Thinkers",
  "history": "History and Biographies",
  "social-issues": "Social Issues and Governance",
  "culture": "Culture and Religion",
  "education": "Development and Education",
  "collections": "Collections and Miscellaneous"
};

// Available tags for filtering
export const AVAILABLE_TAGS = [
  "economics", "policy", "theory", "history", "philosophy", 
  "politics", "culture", "religion", "education", "development",
  "governance", "social", "biography", "research", "analysis"
];