// activity-data.ts

export const activities = ['Running', 'Cycling', 'Swimming', 'Yoga'] as const;

export const categories = [
  'Health & Fitness', 
  'Productivity', 
  'Leisure', 
  'Education & Study', 
  'Social', 
  'Travel', 
  'Entertainment', 
  'Creativity', 
  'Shopping', 
  'Cooking & Eating', 
  'Sleep'
] as const;

export const activityToCategory: Record<string, string> = {
  'Running': 'Health & Fitness',
  'Cycling': 'Health & Fitness',
  'Swimming': 'Health & Fitness',
  'Yoga': 'Health & Fitness',
  // Add more mappings as needed
};

export const categoryColors: Record<string, string> = {
  'Health & Fitness': '#1e90ff',
  'Productivity': '#ffa500',
  'Leisure': '#ff6347',
  'Education & Study': '#32cd32',
  'Social': '#9370db',
  'Travel': '#20b2aa',
  'Entertainment': '#ff69b4',
  'Creativity': '#ff4500',
  'Shopping': '#d2691e',
  'Cooking & Eating': '#ff8c00',
  'Sleep': '#708090',
  // Add more colors if needed
};

// Helper function to get activity data
export function getActivityData(activity: string) {
  const category = activityToCategory[activity] || 'Uncategorized';
  const color = categoryColors[category] || '#000000'; // Default to black if not found
  return { category, color };
}
