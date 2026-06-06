import { notFound } from "next/navigation";

import { LessonPage } from "@/components/course-page";
import { getCourseBySlug, getCourseCatalog, getLessonBySlug } from "@/lib/course-data";

export function generateStaticParams() {
  return getCourseCatalog().flatMap((course) =>
    course.lessons.map((lesson) => ({
      courseSlug: course.slug,
      lessonSlug: lesson.slug,
    })),
  );
}

export function generateMetadata({ params }) {
  const course = getCourseBySlug(params.courseSlug);
  const lesson = course ? getLessonBySlug(course, params.lessonSlug) : null;

  if (!course || !lesson) {
    return {
      title: "Lesson not found",
    };
  }

  return {
    title: `${lesson.title} | ${course.title} | rean-it`,
    description: lesson.description || course.desc,
  };
}

export default function CourseLessonPage({ params }) {
  const course = getCourseBySlug(params.courseSlug);
  const lesson = course ? getLessonBySlug(course, params.lessonSlug) : null;

  if (!course || !lesson) notFound();

  return <LessonPage course={course} lesson={lesson} />;
}
