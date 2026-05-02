// YouTube video IDs for each exercise
// Search query used: "[exercise name] tutorial form"
export const exerciseVideos: Record<string, string> = {
  // Legs
  'Smith Machine Squat': 'dNSSMfJU2SE',
  'Barbell Squat': 'ultWZbUMPL8',
  'Bulgarian Split Squat': 'O-lSAsSaFKE',
  'Hack Squat': 'EdtpSQMbMLs',
  'Leg Press': 'IZxyjW7MPJQ',
  'Leg Extension': 'YyvSfVjQeL0',
  'Romanian Deadlift': 'JCXUYuzwNrM',
  'Lying Leg Curl': 'ELOCsoDSmrg',
  'Seated Leg Curl': 'N5tYaGUZ-xg',
  'Hip Thruster': 'xDmFkJxPzeM',
  'Seated Calf Raise': 'JbyjNymZOt0',
  'Standing Calf Raise': 'c5Kv6-fnTj8',
  'Leg Raise': 'JB2oyawG9KI',
  'Barbell Deadlift': 'op9kVnSso6Q',
  'Sumo Deadlift': 'op9kVnSso6Q',
  'Deficit Deadlift': 'op9kVnSso6Q',
  'Good Morning': 'YA-h3n9L4YU',

  // Chest
  'Incline Dumbell Press': 'IP4oeKh1Sd4',
  'Flat Barbell Bench Press': 'rT7DgCr-3pg',
  'Incline Barbell Bench Press': 'SrqOu55lrYU',
  'Incline Machine Press': 'SrqOu55lrYU',
  'Flat Machine Press': 'xUm0BiZCWlQ',
  'Cable Fly': 'QENKPHhQVi4',
  'Dips': 'yew6QzC-KKI',
  'Pec Dec': 'Z57CtFmRMxA',

  // Back
  'Bent Over Barbell Row': 'G8l_8chR5BE',
  'Pull-Up': 'eGo4IYlbE5g',
  'Lat Pulldown': 'CAwf7n6Luuc',
  'Low Row': 'GZbfZ033f74',
  'T-Bar Row': 'j3dTnZIKETM',
  'Seated Cable Row': 'GZbfZ033f74',
  'Chest Supported Row': 'YXmJDOlFnO0',
  'Single Arm Dumbell Row': 'pYcpY20QaE8',
  'Dumbell Shrug': 'g6qbq4Lf1FI',
  'Barbell Shrug': 'g6qbq4Lf1FI',
  'Upright Row': 'VG9JnEQFyGQ',

  // Shoulders
  'OHP': 'F3QY5vMz_6I',
  'Machine OHP': 'qEwKCR5JCog',
  'Machine Side Lateral Raise': 'HRX4kw7HKeI',
  'Rear Delt Fly': 'xmuDVXP7_0g',
  'Face Pull': 'rep-qVOkqgk',
  'Shoulder ER': 'fI-71RdYFqY',
  'Shoulder IR': 'fI-71RdYFqY',

  // Arms
  'Barbell Curl': 'kwG2ipFRgfo',
  'Incline Bench Curl': 'soxrZlIl35U',
  'Machine Curl': '5NEmuF6a-CE',
  'Hammer Curl': 'zC3nLlEvin4',
  'Lying Triceps Extension': 'ir5PsbniVSc',
  'Overhead Triceps Extension': 'YbX7Wd8jQ-Q',
  'Triceps Pushdown': 'wUfEaFVufR0',

  // Core
  'Sit Up': 'jDwoBqPH0jk',
  'Back Extension': 'ph3pBHLHBzg',
  'Machine Abs': 'pvkNAbKqFnk',
  'Cable Crunch': '_M4ou7V3NP4',
};

export function getVideoId(exerciseName: string): string | null {
  // Direct match
  if (exerciseVideos[exerciseName]) return exerciseVideos[exerciseName];

  // Partial match
  const lower = exerciseName.toLowerCase();
  for (const [key, videoId] of Object.entries(exerciseVideos)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return videoId;
    }
  }

  return null;
}

export function getYouTubeSearchUrl(exerciseName: string): string {
  const query = encodeURIComponent(`${exerciseName} exercise tutorial form`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
