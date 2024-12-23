// activity-data.ts
export const activities = [
  'Calisthenics',
  'Stretching',
  'Bike Riding',
  'Jogging',
  'Reading',
  'Making Music',
  'Coding',
  'Posting on Social Media',
  'Playing Video Games',
  'Eating',
  'Spending Time With Friends',
  'Spending Time With Family',
  'Spending Time With Niquess',
  'Watching TV',
  'Walking The Dogs',
  'Running Errands',
  'House Chores (Laundry, Cleaning, etc)',
  'Hygiene (Shower, Haircut, etc)',
  'Sleeping',
] as const;

export const categories = [
  'Health & Fitness',
  'Productivity',
  'Leisure',
  'Education & Study',
  'Social Media',
  'Travel',
  'Entertainment',
  'Creativity',
  'Shopping',
  'Cooking & Eating',
  'Niquess',
  'Friends & Family',
  'Household Tasks',
  'Sleep',
  'Waste of Time',
] as const;

export const activityToCategory: Record<string, string> = {
  'Calisthenics': 'Health & Fitness',
  'Stretching': 'Health & Fitness',
  'Bike Riding': 'Health & Fitness',
  'Jogging': 'Health & Fitness',
  'Walking The Dogs': 'Health & Fitness',
  'Hygiene (Shower, Haircut, etc)': 'Health & Fitness',
  'Reading': 'Education & Study',
  'Making Music': 'Creativity',
  'Coding': 'Productivity',
  'Posting on Social Media': 'Social Media',
  'Playing Video Games': 'Entertainment',
  'Eating': 'Cooking & Eating',
  'Spending Time With Friends': 'Friends & Family',
  'Spending Time With Family': 'Friends & Family',
  'Spending Time With Niquess': 'Niquess',
  'Watching TV': 'Leisure',
  'Running Errands': 'Shopping',
  'House Chores (Laundry, Cleaning, etc)': 'Household Tasks',
  'Sleeping': 'Sleep',
  // add more mappings as needed
};

export const categoryColors: Record<string, string> = {
  'Health & Fitness': '#1e90ff',
  'Productivity': '#ffa500',
  'Leisure': '#ff6347',
  'Education & Study': '#32cd32',
  'Social Media': '#9370db',
  'Travel': '#20b2aa',
  'Entertainment': '#ff69b4',
  'Creativity': '#ff4500',
  'Shopping': '#d2691e',
  'Cooking & Eating': '#ff8c00',
  'Sleep': '#708090',
  'Household Tasks': '#8b4513',
  'Friends & Family': '#00ccff',
  'Niquess': '#ff1493',
  'Waste of Time': '#4c00ff',
  // Add more colors if needed
};

// Helper function to get activity data
export function getActivityData(activity: string) {
  const category = activityToCategory[activity] || 'Uncategorized';
  const color = categoryColors[category] || '#000000';
  return { category, color };
}
