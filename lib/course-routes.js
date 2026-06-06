export function getCourseHref(courseSlug) {
  return `/courses/${courseSlug}`;
}

export function getLessonHref(courseSlug, lessonSlug) {
  return `/courses/${courseSlug}/lessons/${lessonSlug}`;
}
