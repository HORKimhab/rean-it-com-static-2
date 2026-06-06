import { notFound, redirect } from "next/navigation";

import { getCourseBySlug, getCourseCatalog } from "@/lib/course-data";
import { getCourseHref } from "@/lib/course-routes";

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

export default function CoursePage({ params }) {
  const course = getCourseBySlug(params.courseSlug);

  if (!course) notFound();

  redirect(`${getCourseHref(course.slug)}/lessons`);
}
