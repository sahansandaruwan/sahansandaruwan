export interface ContactItem {
  label: string;
  value: string;
  url?: string;
}

export interface AboutContentData {
  name?: string;
  tagline?: string;
  location?: string;
  about: string;
  skills: string[];
  selectedWork: Array<{ title: string; description: string; link?: string }>;
  education: Array<{ title: string; institution: string; status: string }>;
  contacts: ContactItem[];
  rawContent: {
    aboutMd: string;
    skillsMd: string;
    workMd: string;
    educationMd: string;
    contactMd: string;
  };
}

export function loadAboutContent(): AboutContentData {
  try {
    const modules = (import.meta as any).glob('/content/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

    const aboutMdRaw = modules['/content/about.md'] || `A curious mind passionate about technology, design, and solving real-world problems. I believe in continuous learning and building elegant, functional systems.`;
    
    // Parse frontmatter for about.md
    let aboutMd = aboutMdRaw;
    let name = undefined;
    let tagline = undefined;
    let location = undefined;

    const frontmatterMatch = aboutMdRaw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (frontmatterMatch) {
      const yamlBlock = frontmatterMatch[1];
      aboutMd = frontmatterMatch[2].trim();
      
      yamlBlock.split('\n').forEach(line => {
        const [key, ...valParts] = line.split(':');
        if (key && valParts.length > 0) {
          const k = key.trim().toLowerCase();
          const v = valParts.join(':').trim().replace(/^['"]|['"]$/g, '');
          if (k === 'name') name = v;
          if (k === 'tagline') tagline = v;
          if (k === 'location') location = v;
        }
      });
    }

    const skillsMd = modules['/content/skills.md'] || `- HTML\n- CSS / Tailwind\n- JavaScript\n- Python\n- Git\n- UI Design`;
    const workMd = modules['/content/selected-work.md'] || `- **Invoice Generator**: A functional web-app developed for creating, customizing, and exporting clean invoices effortlessly.\n- **AdFlow**: An automated tool engineered to parse, aggregate, and evaluate online tracking/advertisement metrics.\n- **More Open Source Repositories**: Explore additional small utilities, experimental scripts, and frontend configurations directly on GitHub.`;
    const educationMd = modules['/content/education.md'] || `- **Google Business Intelligence Certificate**\n  Coursera · Ongoing\n\n- **C++ Essentials 1**\n  Cisco · Ongoing\n\n- **Advanced Level Examination**\n  Sri Lanka · 2024`;
    const contactMd = modules['/content/contact.md'] || `- Email: cntct.sahansandaruwan@gmail.com\n- GitHub: https://github.com\n- LinkedIn: https://linkedin.com`;

    // Parse skills list
    const skills = skillsMd
      .split('\n')
      .map((line) => line.replace(/^[-*+]\s*/, '').trim())
      .filter(Boolean);

    // Parse selected work from workMd
    const selectedWork: Array<{ title: string; description: string; link?: string }> = [];
    const workLines = workMd.split('\n');
    for (const line of workLines) {
      const cleanLine = line.replace(/^[-*+]\s*/, '').trim();
      if (!cleanLine) continue;
      
      // Expected format: "**Title**: Description" or "**Title** (link): Description"
      const titleMatch = cleanLine.match(/\*\*(.*?)\*\*(?:\s*\((.*?)\))?:\s*(.*)/);
      if (titleMatch) {
        selectedWork.push({
          title: titleMatch[1].trim(),
          link: titleMatch[2]?.trim(),
          description: titleMatch[3].trim()
        });
      } else {
        // Fallback for simple "- **Title**: Description"
        const parts = cleanLine.split(':');
        if (parts.length >= 2) {
          selectedWork.push({
            title: parts[0].replace(/\*\*/g, '').trim(),
            description: parts.slice(1).join(':').trim()
          });
        }
      }
    }

    // Parse education from educationMd
    const education: Array<{ title: string; institution: string; status: string }> = [];
    const eduBlocks = educationMd.split(/\n\s*\n/);
    for (const block of eduBlocks) {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length >= 2) {
        const title = lines[0].replace(/^[-*+]\s*/, '').replace(/\*\*/g, '').trim();
        const details = lines[1].split('·').map(s => s.trim());
        education.push({
          title,
          institution: details[0] || '',
          status: details[1] || ''
        });
      }
    }

    // Parse contacts from contactMd
    const contacts: ContactItem[] = [];
    const contactLines = contactMd.split('\n');
    for (const line of contactLines) {
      const cleanLine = line.replace(/^[-*+]\s*/, '').trim();
      if (!cleanLine) continue;
      // Expecting format like "Email: cntct.sahansandaruwan@gmail.com" or "GitHub: https://github.com" or markdown link "[GitHub](https://github.com)"
      const parts = cleanLine.split(':');
      if (parts.length >= 2) {
        const label = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        let url = value;
        if (label.toLowerCase() === 'email') {
          url = `mailto:${value}`;
        }
        contacts.push({ label, value, url });
      } else {
        contacts.push({ label: 'Contact', value: cleanLine });
      }
    }

    return {
      name,
      tagline,
      location,
      about: aboutMd.trim(),
      skills,
      selectedWork,
      education,
      contacts,
      rawContent: {
        aboutMd: aboutMdRaw,
        skillsMd,
        workMd,
        educationMd,
        contactMd,
      },
    };
  } catch {
    return {
      about: "A curious mind passionate about technology, design, and solving real-world problems. I believe in continuous learning and building elegant, functional systems.",
      skills: ["HTML", "CSS / Tailwind", "JavaScript", "Python", "Git", "UI Design"],
      selectedWork: [
        {
          title: "Invoice Generator",
          description: "A functional web-app developed for creating, customizing, and exporting clean invoices effortlessly.",
          link: "https://github.com"
        },
        {
          title: "AdFlow",
          description: "An automated tool engineered to parse, aggregate, and evaluate online tracking/advertisement metrics.",
          link: "https://github.com"
        },
        {
          title: "More Open Source Repositories",
          description: "Explore additional small utilities, experimental scripts, and frontend configurations directly on GitHub.",
          link: "https://github.com"
        }
      ],
      education: [
        {
          title: "Google Business Intelligence Certificate",
          institution: "Coursera",
          status: "Ongoing"
        },
        {
          title: "C++ Essentials 1",
          institution: "Cisco",
          status: "Ongoing"
        },
        {
          title: "Advanced Level Examination",
          institution: "Sri Lanka",
          status: "2024"
        }
      ],
      contacts: [
        { label: "Email", value: "cntct.sahansandaruwan@gmail.com", url: "mailto:cntct.sahansandaruwan@gmail.com" },
        { label: "GitHub", value: "https://github.com", url: "https://github.com" },
        { label: "LinkedIn", value: "https://linkedin.com", url: "https://linkedin.com" }
      ],
      rawContent: {
        aboutMd: "A curious mind passionate about technology, design, and solving real-world problems. I believe in continuous learning and building elegant, functional systems.",
        skillsMd: "- HTML\n- CSS / Tailwind\n- JavaScript\n- Python\n- Git\n- UI Design",
        workMd: "",
        educationMd: "",
        contactMd: "- Email: cntct.sahansandaruwan@gmail.com\n- GitHub: https://github.com\n- LinkedIn: https://linkedin.com"
      }
    };
  }
}
