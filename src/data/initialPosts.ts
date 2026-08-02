import { BlogPost, AuthorProfile } from '../types';

export const INITIAL_AUTHOR: AuthorProfile = {
  name: "Sahan",
  tagline: "Builder · Learner · Creator",
  bio: "A curious mind passionate about technology, design, and solving real-world problems. I believe in continuous learning and building elegant, functional systems.",
  email: "cntct.sahansandaruwan@gmail.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  location: "Colombo, Sri Lanka",
  avatarUrl: "https://avatars.githubusercontent.com/u/84913793?v=4"
};

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "The Art of the Quiet Interface",
    slug: "art-of-quiet-interface",
    excerpt: "Why modern software needs fewer notifications, lower visual density, and more breathing room for human thought.",
    date: "2026-07-28",
    readTimeMinutes: 5,
    tags: ["Design", "Minimalism", "UX"],
    featured: true,
    content: `When we look at early digital tools from the late 20th century, we are struck by their restraint. Modern software, by contrast, feels relentless: red badge counters, popups begging for subscriptions, shimmering gradients, and endless streams of algorithmically ranked noise.

We have traded clarity for engagement. But what if software was designed to be quiet?

---

### The Anatomy of Noise

Visual noise in software comes in three primary forms:

1. **Unnecessary Motion:** UI elements that bounce, pulse, or spin without user initiation.
2. **Artificial Urgency:** Notifications designed to trigger cortisol rather than convey vital information.
3. **Dense Layering:** Cards inside cards, floating badges, and high-contrast accents competing for eye focus.

> "Simplicity is not the lack of clutter, that’s a consequence of simplicity. Simplicity is somehow essentially the description of the purpose and always has a meaning." — Dieter Rams

---

### Principles for Quiet Design

Building a quiet interface does not mean stripping away functionality. It means respecting the user's focus as a finite, precious resource.

#### 1. Text as First-Class Material
Typography is the most honest building block of computing. A well-set paragraph with deliberate line heights and readable line lengths conveys information faster than any complex visual dashboard.

\`\`\`
Line Length:  60 - 75 characters per line (ch)
Line Height:  1.6 to 1.85 for continuous reading
Contrast:     WCAG AA compliant (minimum 4.5:1)
\`\`\`

#### 2. Functional Whitespace
Whitespace is not wasted space; it is spatial structure. Giving text room to breathe reduces cognitive fatigue and invites reflection.

#### 3. Passive State Indicators
Instead of intrusive modal alerts, communicate state changes through subtle subtle opacity changes, gentle status lines, or quiet text updates.

---

### Conclusion

As software creators, our goal should not be to capture attention, but to empower thought. When an interface is quiet, the user's mind becomes free to create.
`
  },
  {
    id: "post-2",
    title: "In Praise of Plain Text",
    slug: "in-praise-of-plain-text",
    excerpt: "Exploring the durability, accessibility, and mental clarity that comes from keeping notes and thoughts in simple Markdown.",
    date: "2026-07-14",
    readTimeMinutes: 4,
    tags: ["Productivity", "Writing", "Markdown"],
    featured: true,
    content: `Proprietary file formats come and go. Cloud services pivot, get acquired, or shut down. But plain text files written thirty years ago can still be read today on any device, anywhere on earth.

Plain text is the ultimate open medium.

---

### The Plain Text Advantage

- **Future-Proof:** \`.txt\` and \`.md\` files will outlive every note-taking app on the market today.
- **Universal Portability:** Edit them on iOS, Android, Linux, macOS, or in a terminal over SSH.
- **Grep-Friendly:** Searching through thousands of text files takes milliseconds with standard unix utilities.
- **Zero Lock-In:** You are never trapped inside a vendor's ecosystem.

---

### Organizing Thoughts with Markdown

Markdown strikes the ideal balance between human readability and machine structure. You don't need a heavy rich text editor to format a heading or create a task list.

Here is how I structure my daily log:

\`\`\`markdown
# 2026-07-14 — Daily Log

## Focus Areas
- [x] Refactor core typography engine
- [ ] Draft article on digital minimalism
- [ ] Review open pull requests

## Notes & Reflections
Spent the morning reading about early web typography.
The key insight: constraint breeds longevity.
\`\`\`

### Final Thought

Tools should serve human cognition, not demand maintenance. When you write in plain text, you reduce the barrier between having an idea and capturing it.
`
  },
  {
    id: "post-3",
    title: "Building Fast, Zero-Dependency Systems",
    slug: "building-fast-zero-dependency-systems",
    excerpt: "A practical guide to minimizing npm bloat, relying on web standards, and crafting nimble web applications.",
    date: "2026-06-30",
    readTimeMinutes: 6,
    tags: ["Engineering", "Web", "Performance"],
    content: `The modern web stack has grown astonishingly heavy. A modern "Hello World" starter template often ships with hundreds of megabytes in \`node_modules\` and dozens of transitive dependencies.

While libraries are valuable, blind dependency addition comes with real costs: security vulnerabilities, breaking changes, and sluggish build times.

---

### Relearning Web Standards

Modern browser APIs are remarkably capable. Many things that previously required standard npm packages are now native:

1. **Native Fetch API:** No need for heavy HTTP client wrappers.
2. **CSS Grid & Flexbox:** Replaces heavy layout frameworks.
3. **StructuredClone:** Deep copy objects natively without lodash.
4. **URL / URLSearchParams:** Safe URL building without custom utilities.

\`\`\`typescript
// Native deep copy in modern JavaScript
const original = { title: "Minimalist Notes", tags: ["Web", "Design"] };
const cloned = structuredClone(original);
\`\`\`

---

### The Audit Mindset

Before running \`npm install\`, ask three questions:

- *Can I write this in 20 lines of vanilla TypeScript?*
- *Is this library actively maintained, or is it 90% feature surface I will never touch?*
- *What is the bundle footprint cost for my end readers?*

By keeping our software lean, we ensure that our readers experience fast load times, smooth scrolling, and reliable performance even on modest mobile devices.
`
  },
  {
    id: "post-4",
    title: "Digital Decluttering for Deep Work",
    slug: "digital-decluttering-for-deep-work",
    excerpt: "Practical habits for reducing digital distraction, structuring focus blocks, and cultivating mental clarity.",
    date: "2026-06-12",
    readTimeMinutes: 4,
    tags: ["Minimalism", "Focus", "Lifestyle"],
    content: `Attention is the currency of consciousness. Every app on our phone and desktop is constantly competing for a fraction of that currency.

Over the past two years, I implemented a strict digital diet that transformed my productivity and peace of mind. Here are the core habits that yielded the greatest results.

---

### 1. The Single-Tab Rule
When conducting research or writing, limit yourself to one active browser tab. If you need reference material, save it to a reader list and close the tab immediately.

### 2. Grayscale Display Toggle
Color triggers dopamine responses. Turning your smartphone or desktop display to grayscale reduces the subconscious draw of social feeds and notification badges.

### 3. Asynchronous Communication
Replace instant messaging with long-form written updates whenever possible. Writing forces clarity of thought and reduces context switching.

> "Deep work is the ability to focus without distraction on a cognitively demanding task." — Cal Newport
`
  }
];
