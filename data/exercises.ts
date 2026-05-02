import exerciseImages from './exercise_images.json';

// Free exercise image URLs from free-exercise-db (github.com/yuhonas/free-exercise-db)
const imageMap: Record<string, string> = exerciseImages;

export function getExerciseImageUrl(exerciseName: string): string | null {
  // Direct match
  if (imageMap[exerciseName]) return imageMap[exerciseName];

  // Partial match
  const lower = exerciseName.toLowerCase();
  for (const [key, url] of Object.entries(imageMap)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return url;
    }
  }
  return null;
}

export function getYouTubeSearchUrl(exerciseName: string): string {
  const query = encodeURIComponent(`${exerciseName} 운동 방법 자세`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
