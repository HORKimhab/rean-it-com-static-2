import fs from "node:fs";
import path from "node:path";

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// const staticCourses = [
//   {
//     slug: "java-spring-ecommerce",
//     title: "Java Spring Boot Full Stack: eCommerce Project Masterclass",
//     instructor: "Faisal Memon (EmbarkX), EmbarkX Official",
//     desc: "Build a practical Java commerce application with backend architecture, APIs, and responsive storefront workflows.",
//     icon: "JS",
//     previewBackground: "#7a5d43",
//     previewLayout: "split",
//     previewLabel: "Java",
//     previewIcon: "JB",
//     previewAccent: "EC",
//     lessons: [
//       { title: "Course orientation and project scope", dur: "8:10", type: "intro", description: "Understand the stack, project goals, and development environment." },
//       { title: "Spring Boot foundations for eCommerce", dur: "18:42", type: "lesson", description: "Set up the project structure, modules, and dependency flow." },
//       { title: "Product catalog architecture", dur: "22:15", type: "lesson", description: "Model products, categories, and search-ready catalog data." },
//       { title: "Cart, checkout, and order state", dur: "26:30", type: "lesson", description: "Implement the main shopper journey and transactional flow." },
//       { title: "Responsive frontend integration", dur: "15:50", type: "lesson", description: "Connect the backend to a presentable storefront UI." },
//       { title: "Capstone eCommerce delivery", dur: "35:00", type: "project", description: "Ship the full commerce experience as a guided final project." },
//     ],
//   },
//   {
//     slug: "mastering-linux",
//     title: "Mastering Linux: The Comprehensive Guide",
//     instructor: "Jannis Seemann, Denis Panjuta",
//     desc: "A broad Linux workflow course covering shell navigation, permissions, tooling, and server fundamentals.",
//     icon: "LX",
//     previewBackground: "linear-gradient(90deg, #f4c63c 0%, #f0b32f 100%)",
//     previewLayout: "split",
//     previewIcon: "LN",
//     previewAccent: "SH",
//     lessons: [
//       { title: "Linux principles and mental model", dur: "9:45", type: "intro", description: "Learn how Linux differs from desktop-first operating systems." },
//       { title: "Filesystem, permissions, and users", dur: "14:20", type: "lesson", description: "Use core shell tools to navigate and manage access." },
//       { title: "Processes, services, and logs", dur: "17:10", type: "lesson", description: "Monitor runtime behavior and troubleshoot common issues." },
//       { title: "Package managers and updates", dur: "12:40", type: "lesson", description: "Install software safely across major distributions." },
//       { title: "SSH and remote administration", dur: "16:05", type: "lesson", description: "Operate and secure remote Linux servers." },
//       { title: "Provision a production-ready VM", dur: "28:00", type: "project", description: "Apply the full workflow to a realistic server setup." },
//     ],
//   },
//   {
//     slug: "java-masterclass-2025",
//     title: "Java Masterclass 2025: 130+ Hours of Expert Lessons",
//     instructor: "Tim Buchalka, Tim Buchalka's Learn Programming Academy",
//     desc: "An extensive Java curriculum from syntax and OOP to advanced application building patterns.",
//     icon: "JM",
//     previewBackground: "linear-gradient(135deg, #7f6249 0%, #dcc2a0 40%, #e9ecf1 100%)",
//     previewLayout: "center",
//     previewIcon: "JV",
//     lessons: [
//       { title: "Java refresher and environment setup", dur: "7:35", type: "intro", description: "Get the toolchain ready for a modern Java workflow." },
//       { title: "Variables, data types, and control flow", dur: "19:20", type: "lesson", description: "Build a strong foundation with practical coding examples." },
//       { title: "Objects, classes, and inheritance", dur: "24:15", type: "lesson", description: "Move into object-oriented design using Java conventions." },
//       { title: "Collections and functional patterns", dur: "27:45", type: "lesson", description: "Work with lists, maps, streams, and reusable abstractions." },
//       { title: "Testing and debugging strategies", dur: "16:30", type: "lesson", description: "Tighten code quality with reliable testing habits." },
//       { title: "Final Java application build", dur: "42:00", type: "project", description: "Combine the key concepts into a substantial project." },
//     ],
//   },
//   {
//     slug: "java-for-beginners",
//     title: "Java Programming for Complete Beginners",
//     instructor: "in28Minutes Official",
//     desc: "A beginner-friendly path into Java with practical exercises and instructor-led explanations.",
//     icon: "JB",
//     previewBackground: "linear-gradient(90deg, #4a9d59 0%, #6ca542 60%, #e48b2f 100%)",
//     previewLayout: "split",
//     previewLabel: "Java",
//     previewIcon: "JV",
//     previewAccent: "BG",
//     lessons: [
//       { title: "What Java is and how it runs", dur: "6:50", type: "intro", description: "Understand the JVM, compilation, and runtime model." },
//       { title: "Writing your first Java programs", dur: "14:05", type: "lesson", description: "Use variables, methods, and loops in small programs." },
//       { title: "Core object-oriented thinking", dur: "18:25", type: "lesson", description: "See how classes and objects structure real software." },
//       { title: "Handling input and program flow", dur: "13:30", type: "lesson", description: "Move from static examples into interactive console programs." },
//       { title: "Debugging fundamentals", dur: "10:55", type: "lesson", description: "Read errors and step through issues productively." },
//       { title: "Beginner Java mini-project", dur: "24:40", type: "project", description: "Wrap the basics into a complete guided exercise." },
//     ],
//   },
//   {
//     slug: "modern-java-programming",
//     title: "Mastering Modern Java Programming: Beginner to Pro",
//     instructor: "Eazy Bytes, Madan Reddy",
//     desc: "A modern Java course focused on practical coding, production patterns, and clean application structure.",
//     icon: "MJ",
//     previewBackground: "linear-gradient(90deg, #f6d96a 0%, #f7a263 100%)",
//     previewLayout: "split",
//     previewIcon: "JV",
//     previewAccent: "PR",
//     lessons: [
//       { title: "Modern Java overview", dur: "8:05", type: "intro", description: "Survey the ecosystem and the course progression." },
//       { title: "Readable code and Java idioms", dur: "17:10", type: "lesson", description: "Improve maintainability using practical patterns." },
//       { title: "Dependency management and modularity", dur: "21:25", type: "lesson", description: "Structure apps for scale and long-term change." },
//       { title: "REST services and persistence", dur: "25:35", type: "lesson", description: "Build data-backed APIs with common Java tooling." },
//       { title: "Security and validation basics", dur: "15:10", type: "lesson", description: "Harden inputs and app boundaries." },
//       { title: "Production-oriented final build", dur: "33:20", type: "project", description: "Deliver a more realistic Java application end to end." },
//     ],
//   },
//   {
//     slug: "react-native-apps",
//     title: "React Native: Build iOS & Android Apps",
//     instructor: "Cross-Platform Mobile Academy",
//     desc: "Develop native-feeling mobile apps with a shared React Native codebase and reusable components.",
//     icon: "RN",
//     previewBackground: "linear-gradient(90deg, #123c68 0%, #36a4d7 100%)",
//     previewLayout: "center",
//     previewLabel: "Mobile Dev",
//     previewIcon: "RN",
//     lessons: [
//       { title: "React Native foundations", dur: "7:20", type: "intro", description: "Learn the architecture and tooling behind the framework." },
//       { title: "Components, layout, and styling", dur: "16:45", type: "lesson", description: "Create responsive screens for mobile devices." },
//       { title: "Navigation and state flow", dur: "19:40", type: "lesson", description: "Handle screen stacks, tabs, and shared app state." },
//       { title: "Fetching APIs and local persistence", dur: "23:15", type: "lesson", description: "Build realistic data flows for production apps." },
//       { title: "Device capabilities and polish", dur: "18:10", type: "lesson", description: "Use platform APIs and app-quality refinements." },
//       { title: "Cross-platform shipping project", dur: "31:50", type: "project", description: "Assemble a complete mobile app with release-minded structure." },
//     ],
//   },
//   {
//     slug: "aws-cloud-practitioner",
//     title: "AWS Cloud Practitioner Certification Prep",
//     instructor: "Cloud Skills Lab",
//     desc: "A concise cloud foundations course focused on AWS core services, architecture concepts, and certification readiness.",
//     icon: "AW",
//     previewBackground: "linear-gradient(90deg, #f39c46 0%, #f6ce69 100%)",
//     previewLayout: "center",
//     previewLabel: "Cloud",
//     previewIcon: "CL",
//     lessons: [
//       { title: "Cloud fundamentals and AWS regions", dur: "8:00", type: "intro", description: "Start with the vocabulary and service model." },
//       { title: "Compute, storage, and networking", dur: "20:20", type: "lesson", description: "Understand the core pillars of AWS infrastructure." },
//       { title: "Security, IAM, and billing", dur: "18:30", type: "lesson", description: "Cover the governance essentials behind the exam." },
//       { title: "Reliability and architecture patterns", dur: "16:15", type: "lesson", description: "Review resilience and scaling concepts." },
//       { title: "Practice questions and exam strategy", dur: "13:40", type: "lesson", description: "Sharpen recognition of common question types." },
//       { title: "Architecture review sprint", dur: "26:00", type: "project", description: "Apply the concepts in a scenario-based capstone." },
//     ],
//   },
//   {
//     slug: "public-speaking-mastery",
//     title: "Public Speaking & Presentation Mastery",
//     instructor: "Communication Academy",
//     desc: "Improve speaking confidence, structure, delivery, and audience connection across professional settings.",
//     icon: "PS",
//     previewBackground: "linear-gradient(90deg, #de5f73 0%, #f39aa7 100%)",
//     previewLayout: "center",
//     previewLabel: "Soft Skills",
//     previewIcon: "SP",
//     lessons: [
//       { title: "Presentation mindset reset", dur: "6:35", type: "intro", description: "Reduce stage anxiety with a practical preparation model." },
//       { title: "Structuring a memorable message", dur: "14:25", type: "lesson", description: "Build talks that land clearly and confidently." },
//       { title: "Voice, pacing, and body language", dur: "17:15", type: "lesson", description: "Strengthen delivery with visible and audible control." },
//       { title: "Storytelling for business audiences", dur: "15:05", type: "lesson", description: "Make dry information feel persuasive and human." },
//       { title: "Handling Q&A and live pressure", dur: "12:20", type: "lesson", description: "Stay composed under interruptions or challenge." },
//       { title: "Recorded presentation workshop", dur: "29:30", type: "project", description: "Deliver a refined talk with actionable feedback criteria." },
//     ],
//   },
//   {
//     slug: "cybersecurity-essentials",
//     title: "Cybersecurity Essentials & Ethical Hacking",
//     instructor: "SecureStack Academy",
//     desc: "A practical security primer covering common threats, defensive controls, and responsible testing workflows.",
//     icon: "CY",
//     previewBackground: "linear-gradient(90deg, #0f5c8a 0%, #91d4ef 100%)",
//     previewLayout: "center",
//     previewLabel: "Security",
//     previewIcon: "SC",
//     lessons: [
//       { title: "Security foundations and threat models", dur: "7:55", type: "intro", description: "Frame the basics of offensive and defensive security." },
//       { title: "Authentication, access, and hardening", dur: "18:10", type: "lesson", description: "Cover practical controls that matter in real systems." },
//       { title: "Web application vulnerabilities", dur: "22:30", type: "lesson", description: "Recognize and mitigate common attack paths." },
//       { title: "Ethical testing workflow", dur: "16:45", type: "lesson", description: "Approach assessments responsibly and repeatably." },
//       { title: "Monitoring and incident response", dur: "14:50", type: "lesson", description: "Respond to suspicious activity with a clear process." },
//       { title: "Security review capstone", dur: "27:40", type: "project", description: "Run a guided review against a sample environment." },
//     ],
//   },
// ];

const staticCourses = [];

function normalizeLessons(course) {
  const slugCounts = new Map();

  return course.lessons.map((lesson, index) => {
    const baseSlug = slugify(lesson.title) || `lesson-${index + 1}`;
    const seen = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, seen + 1);

    return {
      ...lesson,
      slug: seen === 0 ? baseSlug : `${baseSlug}-${seen + 1}`,
      order: index + 1,
    };
  });
}

function normalizeCourse(course, index) {
  return {
    ...course,
    slug: course.slug || `course-${index + 1}`,
    previewIcon: course.previewIcon || course.icon,
    previewAccent: course.previewAccent || course.icon,
    lessons: normalizeLessons(course),
  };
}

// "title": "រៀន​ python - 01. What is python and why learn it - python khmer",
// "dur": "6:54",
// "type": "intro",
// "status": "public",
// "url": "https://www.youtube.com/watch?v=6Y5nCw6dz7o",
// "videoId": "6Y5nCw6dz7o",
// "description": "Watch on YouTube: https://www.youtube.com/watch?v=6Y5nCw6dz7o",
// "position": 0

function normalizeSyncedCourse(course, index) {
  return normalizeCourse(
    {
      slug: course.syncPlaylistId || `youtube-course-${index + 1}`,
      title: course.title,
      instructor: course.instructor,
      desc: course.desc || "Imported from the synced YouTube course catalog.",
      icon: course.icon || "YT",
      previewBackground: "linear-gradient(90deg, #8b1224 0%, #c62f42 55%, #f16b75 100%)",
      previewLayout: "center",
      previewLabel: course.badge || "YouTube Playlist",
      previewIcon: course.previewIcon || "YT",
      lessons: (course.lessons || []).map((lesson) => ({
        title: lesson.title,
        dur: lesson.dur || "0:00",
        type: lesson.type || "lesson",
        description: lesson.description || lesson.statusNote || "Watch on YouTube",
        videoId: lesson.videoId, 
        position: lesson.position,
        resources: lesson.url
          ? [
              {
                label: "Open lesson on YouTube",
                href: lesson.url,
              },
            ]
          : [],
      })),
    },
    index,
  );
}

function loadSyncedCourses() {
  try {
    const sourcePath = path.join(process.cwd(), "src", "youtube-sync-data.js");
    const source = fs.readFileSync(sourcePath, "utf8").trim();
    const prefix = "window.__YOUTUBE_SYNC_DATA__ =";

    if (!source.startsWith(prefix)) return [];

    const payload = JSON.parse(source.slice(prefix.length).trim().replace(/;$/, ""));
    return (payload.courses || []).map(normalizeSyncedCourse);
  } catch {
    return [];
  }
}

const catalog = [...staticCourses.map(normalizeCourse), ...loadSyncedCourses()];

export function getCourseCatalog() {
  return catalog;
}

export function getCourseBySlug(courseSlug) {
  return catalog.find((course) => course.slug === courseSlug) || null;
}

export function getLessonBySlug(course, lessonSlug) {
  return course.lessons.find((lesson) => lesson.slug === lessonSlug) || null;
}
