---
title: Welcome to My Minimalist Blog
date: 2026-08-01
excerpt: An introductory essay on minimal web publishing, plain text formatting, and hosting directly via GitHub repository files.
tags: [Writing, Minimalism]
---

# Welcome to My Minimalist Blog

This blog is built to automatically detect and load Markdown files directly from the `/post/` folder in this GitHub repository.

When you add or edit a `.md` file inside `/post/`, the intelligent markdown parser automatically extracts:
- **Title:** From frontmatter `title:` or the top `# Heading`
- **Date:** From frontmatter `date:` or filename
- **Excerpt:** From frontmatter `excerpt:` or the opening paragraph
- **Read Time:** Dynamically calculated from word density (~200 wpm)

---

### Why Plain Text Matters

Proprietary databases come and go, but plain `.md` files remain accessible forever on any platform. 

> "Simplicity is about subtracting the obvious and adding the meaningful." — John Maeda

You can create `post/secondpost.md`, `post/my-new-thoughts.md`, or any `.md` file in the repository, push to GitHub, and it will be indexed instantly.
