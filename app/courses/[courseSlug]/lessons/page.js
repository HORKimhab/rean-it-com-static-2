import { notFound, redirect } from "next/navigation";

import { getCourseBySlug, getCourseCatalog } from "@/lib/course-data";
import { getLessonHref } from "@/lib/course-routes";

export function generateStaticParams() {
  return getCourseCatalog().map((course) => ({
    courseSlug: course.slug,
  }));
}

export function generateMetadata({ params }) {
  const course = getCourseBySlug(params.courseSlug);

  if (!course) {
    return {
      title: "Course not found",
    };
  }

  return {
    title: `${course.title} | rean-it`,
    description: course.desc,
  };
}

export default function CourseLessonsIndexPage({ params }) {
  const course = getCourseBySlug(params.courseSlug);

  if (!course) notFound();

  const firstLesson = course.lessons[0];

  if (!firstLesson) notFound();

  redirect(getLessonHref(course.slug, firstLesson.slug));
}
