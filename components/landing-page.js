"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getCourseHref } from "@/lib/course-routes";

const heroSlides = [
  {
    id: "slide-1",
    theme: "brand",
    badge: "Best Online Courses",
    title: ["The Best Online", "Learning Platform"],
    body:
      "Learn from world-class instructors at your own pace. Earn certificates that matter to employers worldwide.",
    primaryCta: "Get Started",
    secondaryCta: "Browse Courses",
    stats: [
      { value: "12K+", label: "Students" },
      { value: "280+", label: "Courses" },
      { value: "48", label: "Instructors" },
    ],
  },
  {
    id: "slide-2",
    theme: "emerald",
    badge: "Learn From Home",
    title: ["Get Educated Online", "From Your Home"],
    body:
      "Flexible schedules, expert mentors, and interactive projects - everything you need to level up your career.",
    primaryCta: "Start Learning",
    secondaryCta: "View Catalog",
    panels: [
      {
        label: "Certificate Programs",
        value: "120+",
        note: "Industry-recognized",
      },
      {
        label: "Avg. completion rate",
        value: "94%",
        note: "Among active learners",
      },
    ],
  },
  {
    id: "slide-3",
    theme: "violet",
    badge: "Expert Instructors",
    title: ["Learn From the", "World's Best Experts"],
    body:
      "Courses designed by industry professionals - from Silicon Valley engineers to award-winning designers.",
    primaryCta: "Meet Instructors",
    secondaryCta: "Browse Courses",
    panels: [
      { initials: "JD", name: "John Doe", role: "Web Developer - 12 courses" },
      { initials: "SR", name: "Sara Reed", role: "UX Designer - 8 courses" },
      { initials: "AL", name: "Amy Lee", role: "Marketing Lead - 9 courses" },
    ],
  },
];

const featureItems = [
  {
    icon: "Sk",
    title: "Skilled instructors",
    body: "Learn from industry experts with real-world experience",
  },
  {
    icon: "On",
    title: "Online classes",
    body: "Study anytime, anywhere, at your own pace",
  },
  {
    icon: "Pr",
    title: "Home projects",
    body: "Hands-on assignments to cement your knowledge",
  },
  {
    icon: "Li",
    title: "Book library",
    body: "Access hundreds of curated learning resources",
  },
];

const categories = [
  { icon: "WD", title: "Web design", count: "49 courses" },
  { icon: "GD", title: "Graphic design", count: "36 courses" },
  { icon: "VE", title: "Video editing", count: "28 courses" },
  { icon: "MK", title: "Online marketing", count: "41 courses" },
];

const instructors = [
  { initials: "JD", name: "John Doe", role: "Web developer", count: "12 courses", tone: "blue" },
  { initials: "SR", name: "Sara Reed", role: "UX designer", count: "8 courses", tone: "green" },
  { initials: "MK", name: "Mike Kim", role: "Video editor", count: "6 courses", tone: "amber" },
  { initials: "AL", name: "Amy Lee", role: "Marketing lead", count: "9 courses", tone: "pink" },
];

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="section hero-shell">
      <div className="container">
        <div className="hero-frame">
          {heroSlides.map((slide, index) => (
            <article
              key={slide.id}
              className={`hero-slide hero-slide--${slide.theme} ${
                index === activeIndex ? "is-active" : index < activeIndex ? "is-left" : "is-right"
              }`}
            >
              <div className="hero-copy">
                <span className={`hero-badge hero-badge--${slide.theme}`}>{slide.badge}</span>
                <h1 className="hero-title">
                  {slide.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h1>
                <p className="hero-body">{slide.body}</p>
                <div className="hero-actions">
                  <button className="button button--light">{slide.primaryCta}</button>
                  <button className="button button--ghost">{slide.secondaryCta}</button>
                </div>
              </div>

              {slide.stats ? (
                <div className="hero-stats">
                  {slide.stats.map((stat) => (
                    <div key={stat.label} className="glass-card hero-stat-card">
                      <div className="hero-stat-value">{stat.value}</div>
                      <div className="hero-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}

              {slide.panels && slide.theme === "emerald" ? (
                <div className="hero-panels">
                  {slide.panels.map((panel) => (
                    <div key={panel.label} className="glass-card hero-panel-card">
                      <div className="hero-panel-label">{panel.label}</div>
                      <div className="hero-panel-value">{panel.value}</div>
                      <div className="hero-panel-note">{panel.note}</div>
                    </div>
                  ))}
                </div>
              ) : null}

              {slide.panels && slide.theme === "violet" ? (
                <div className="hero-people">
                  {slide.panels.map((panel) => (
                    <div key={panel.name} className="glass-card hero-person-card">
                      <div className="hero-person-mark">{panel.initials}</div>
                      <div>
                        <div className="hero-person-name">{panel.name}</div>
                        <div className="hero-person-role">{panel.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}

          <div className="hero-controls">
            <button
              aria-label="Previous slide"
              className="hero-arrow"
              onClick={() =>
                setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length)
              }
            >
              {"<"}
            </button>
            <button
              aria-label="Next slide"
              className="hero-arrow"
              onClick={() => setActiveIndex((current) => (current + 1) % heroSlides.length)}
            >
              {">"}
            </button>
          </div>

          <div className="hero-dots">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                aria-label={`Go to slide ${index + 1}`}
                className={`hero-dot ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="site-logo">
          rean-<span>it</span>
        </Link>

        <nav className="header-nav">
          <Link href="/">Home</Link>
          {/* <a href="#">About</a>
          <a href="/#courses">Courses</a>
          <a href="/#instructors">Instructors</a> */}
          <a href="https://t.me/HKimhab" title="Contact us on Telegram">
            Contact
          </a>
        </nav>

        <div className="header-actions">
          {/* <button className="button button--primary desktop-only">Join Now</button> */}
          <button
            className="mobile-toggle"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            Menu
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? "is-open" : ""}`}>
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
          Home
        </Link>
        <a href="#" onClick={() => setMobileMenuOpen(false)}>
          About
        </a>
        <a href="/#courses" onClick={() => setMobileMenuOpen(false)}>
          Courses
        </a>
        <a href="/#instructors" onClick={() => setMobileMenuOpen(false)}>
          Instructors
        </a>
        <a href="#" onClick={() => setMobileMenuOpen(false)}>
          Contact
        </a>
        {/* <button className="button button--primary mobile-menu-cta">Join Now</button> */}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      {/* <div className="container footer-grid">
        <div>
          <div className="footer-brand">rean-it</div>
          <p>Inspired by ThemeWagon · Elearning template</p>
          <p>© 2026 rean-it. All rights reserved.</p>
        </div>
        <div>
          <h4>Quick links</h4>
          <a href="#">About us</a>
          <a href="/#courses">Courses</a>
          <a href="/#instructors">Instructors</a>
          <a href="#">Contact</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="https://t.me/HKimhab" title="Contact us on Telegram">
            Contact
          </a>
        </div>
      </div> */}
      <div className="container footer-meta">
        <span>© {new Date().getFullYear()} rean-it. All rights reserved.</span>
        <span>Inspired by ThemeWagon · Elearning template</span>
      </div>
    </footer>
  );
}

function CourseCard({ course }) {
  return (
    <Link href={getCourseHref(course.slug)} className="course-card">
      <div className="course-card-media" style={{ background: course.previewBackground }}>
        {course.previewLayout === "split" ? (
          <>
            <div className="course-preview-block">
              {course.previewLabel ? (
                <div className="course-preview-label">{course.previewLabel}</div>
              ) : null}
              <div className="course-preview-icon">{course.previewIcon}</div>
            </div>
            <div className="course-preview-icon secondary">{course.previewAccent}</div>
          </>
        ) : (
          <div className="course-preview-center">
            {course.previewLabel ? <div className="course-preview-label">{course.previewLabel}</div> : null}
            <div className="course-preview-icon">{course.previewIcon}</div>
          </div>
        )}
      </div>
      <div className="course-card-copy">
        <h3>{course.title}</h3>
        <p>{course.instructor}</p>
      </div>
    </Link>
  );
}

export default function LandingPage({ courses }) {
  const catalogLabel = useMemo(() => {
    if (courses.length <= 9) return "Popular courses";
    return `Popular courses + ${courses.length - 9} synced playlist${courses.length - 9 > 1 ? "s" : ""}`;
  }, [courses.length]);

  return (
    <div className="site-shell">
      <SiteHeader />

      <main>
        {/*
        <HeroCarousel />
        */}

        {/* <section className="feature-strip">
          <div className="container feature-grid">
            {featureItems.map((item) => (
              <article key={item.title} className="feature-card">
                <div className="feature-icon feature-icon--capsule">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section> */}

        {/*
        <section className="section section-divider">
          <div className="container">
            <div className="section-label">Categories</div>
            <h2 className="section-title">Course categories</h2>
            <div className="category-grid">
              {categories.map((category) => (
                <article key={category.title} className="category-card">
                  <div className="category-icon category-icon--capsule">{category.icon}</div>
                  <h3>{category.title}</h3>
                  <p>{category.count}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        */}

        <section id="courses" className="section section-divider">
          <div className="container">
            <div className="section-label">Courses</div>
            <div className="section-heading">
              <h2 className="section-title">{catalogLabel}</h2>
              <button className="round-button" aria-hidden="true">
                {">"}
              </button>
            </div>

            <div className="course-grid">
              {courses.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          </div>
        </section>

        {/*
        <section id="instructors" className="section section-divider">
          <div className="container">
            <div className="section-label">Instructors</div>
            <h2 className="section-title">Expert instructors</h2>
            <div className="instructor-grid">
              {instructors.map((instructor) => (
                <article key={instructor.name} className="instructor-card">
                  <div className={`instructor-mark instructor-mark--${instructor.tone}`}>
                    {instructor.initials}
                  </div>
                  <h3>{instructor.name}</h3>
                  <p>{instructor.role}</p>
                  <span>{instructor.count}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
        */}

        {/*
        <section className="cta-strip">
          <div className="container cta-row">
            <div>
              <h2>Start learning today</h2>
              <p>Join 12,000+ students already growing their careers</p>
            </div>
            <button className="button button--light">Join for free</button>
          </div>
        </section>
        */}
      </main>

      <SiteFooter />
    </div>
  );
}
