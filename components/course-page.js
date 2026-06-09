import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/landing-page";
import { getLessonHref } from "@/lib/course-routes";

function lessonTypeLabel(type) {
  if (type === "project") return "Project";
  if (type === "intro") return "Intro";
  return "Lesson";
}

function getLessonEmbedUrl(lesson) {
  console.log('---lesson', lesson);
  // if (!lesson.videoId || lesson.status === "private") return null;
  return `https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1`;
}

function getLessonSummary(lesson) {
  if (!lesson.description) return `Estimated watch time: ${lesson.dur}`;
  if (lesson.description.startsWith("Watch on YouTube:")) return "Stream this lesson directly in the embedded YouTube player below.";
  return lesson.description;
}

export function CourseOverviewPage({ course }) {
  const firstLesson = course.lessons[0];

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="course-page">
        <section className="course-hero">
          <div className="container course-hero-grid">
            <div className="course-hero-copy">
              <div className="section-label">Course</div>
              <h1 className="course-page-title">{course.title}</h1>
              <p className="course-page-subtitle">{course.instructor}</p>
              <p className="course-page-description">{course.desc}</p>
              <div className="course-page-actions">
                {firstLesson ? (
                  <Link className="button button--primary" href={getLessonHref(course.slug, firstLesson.slug)}>
                    Start first lesson
                  </Link>
                ) : null}
                <Link className="button course-secondary-button" href="/#courses">
                  Back to catalog
                </Link>
              </div>
            </div>

            <div className="course-hero-card" style={{ background: course.previewBackground }}>
              <div className="course-hero-badge">{course.previewLabel || "Featured course"}</div>
              <div className="course-hero-mark">{course.previewIcon}</div>
              <div className="course-hero-meta">
                <span>{course.lessons.length} lessons</span>
                <span>{course.icon}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-divider">
          <div className="container">
            <div className="section-label">Content</div>
            {/* <div className="section-heading">
              <h2 className="section-title">Course lessons</h2>
              <div className="course-list-count">{course.lessons.length} total</div>
            </div> */}

            <div className="course-lesson-list">
              {course.lessons.map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={getLessonHref(course.slug, lesson.slug)}
                  className="course-lesson-link"
                >
                  <div className="course-lesson-order">{String(lesson.order).padStart(2, "0")}</div>
                  <div className="course-lesson-content">
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description}</p>
                  </div>
                  <div className="course-lesson-side">
                    <span>{lessonTypeLabel(lesson.type)}</span>
                    <strong>{lesson.dur}</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LessonPage({ course, lesson }) {
  const embedUrl = getLessonEmbedUrl(lesson);
  const lessonSummary = getLessonSummary(lesson);

  return (
    <div className="site-shell course-shell-dark">
      <SiteHeader />
      <main className="lesson-route-shell">
        <div className="player-shell player-shell--page">
          <div className="player-topbar">
            <div className="player-topbar-group">
              <Link className="player-link" href={`/courses/${course.slug}`}>
                Back
              </Link>
              <span className="player-divider">|</span>
              <span className="player-course-name">{course.title}</span>
            </div>
            <div className="player-topbar-group">
              <span className="player-progress-copy">
                Lesson {lesson.order} of {course.lessons.length}
              </span>
            </div>
          </div>

          <div className="player-content">
            <aside className="player-sidebar">
              <div className="player-sidebar-head">Course content</div>
              <div className="lesson-list">
                {course.lessons.map((item) => {
                  const isActive = item.slug === lesson.slug;

                  return (
                    <Link
                      key={item.slug}
                      href={getLessonHref(course.slug, item.slug)}
                      className={`lesson-item ${isActive ? "is-active" : ""}`}
                    >
                      <span className="lesson-item-mark">{item.order}</span>
                      <span className="lesson-item-copy">
                        <span className="lesson-item-title">{item.title}</span>
                        <span className="lesson-item-meta">
                          {lessonTypeLabel(item.type)} · {item.dur}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </aside>

            <div className="player-main">
              <div className="player-stage">
                {embedUrl ? (
                  <iframe
                    className="player-embed"
                    src={embedUrl}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    width="auto"
                    allowFullScreen
                  />
                ) : (
                  <div className="player-stage-copy">
                    <div className="player-stage-icon">{course.previewIcon || course.icon}</div>
                    <div className="player-stage-title">{lesson.title}</div>
                    <div className="player-stage-subtitle">{lessonSummary}</div>
                    {lesson.url ? (
                      <a
                        className="button button--primary player-stage-cta"
                        href={lesson.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open on YouTube
                      </a>
                    ) : null}
                  </div>
                )}
                {/* <div className="player-scrubber player-scrubber--static">
                  <span>{lessonTypeLabel(lesson.type)}</span>
                  <div className="player-static-bar">
                    <div />
                  </div>
                  <span>{lesson.dur}</span>
                </div> */}
              </div>

              <div className="player-detail">
                <div className="player-detail-head">
                  <div>
                    <h2>{lesson.title}</h2>
                    <p>{lessonSummary}</p>
                  </div>
                  <Link className="mark-done mark-done--link" href={`/courses/${course.slug}`}>
                    Course overview
                  </Link>
                </div>

                <div className="player-tabs">
                  <button className="is-active" type="button">
                    about
                  </button>
                  <button type="button">resources</button>
                </div>

                <div className="lesson-detail-grid">
                  <div className="lesson-detail-card">
                    <h3>Lesson notes</h3>
                    <p>
                      This route-based lesson page replaces the modal flow and gives every lesson a
                      shareable URL.
                    </p>
                  </div>
                  <div className="lesson-detail-card">
                    <h3>Resources</h3>
                    {lesson.resources?.length || lesson.url ? (
                      <ul className="player-resource-list">
                        {lesson.url ? (
                          <li>
                            <a href={lesson.url} target="_blank" rel="noreferrer">
                              Watch on YouTube
                            </a>
                          </li>
                        ) : null}
                        {lesson.resources?.map((resource) => (
                          <li key={resource.label}>
                            <a href={resource.href} target="_blank" rel="noreferrer">
                              {resource.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No external resource attached to this lesson.</p>
                    )}
                  </div>
                </div>

                <div className="course-next-row">
                  <div>
                    <div className="section-label">Course</div>
                    <p className="course-page-description course-page-description--compact">{course.desc}</p>
                  </div>
                  <div className="course-page-actions course-page-actions--compact">
                    <Link className="button course-secondary-button" href={`/courses/${course.slug}`}>
                      Back to course
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
