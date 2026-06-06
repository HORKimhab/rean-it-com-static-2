import LandingPage from "@/components/landing-page";
import { getCourseCatalog } from "@/lib/course-data";

export default function Page() {
  const courses = getCourseCatalog();

  return <LandingPage courses={courses} />;
}
