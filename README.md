# Niyam Rathod — Portfolio

Personal portfolio site. Vanilla HTML/CSS/JS. No build step required.

## Previewing locally

Install the **Live Server** VS Code extension, right-click `index.html` → **Open with Live Server**.
Or just double-click `index.html` to open it in a browser.

---

## How to add a project

Open `index.html` and find the `<!-- HOW TO ADD A PROJECT -->` comment inside `#work`.
Copy **one** `<article class="project-card">` block and paste it immediately after the last card.
Then update these four things:

| What | Where |
|------|-------|
| Card number | `<span class="project-card__number">05</span>` |
| Repo URL | `href="#"` on the GitHub link |
| Demo URL | `href="#"` on the Demo link (delete the `<a>` entirely if there's no demo) |
| Title | `<h3 class="project-card__title">` |
| One-line insight | `<p class="project-card__insight">` |
| Tags | `<li class="tag">` items |

---

## How to update your info

All TODOs are marked with `<!-- TODO: ... -->` comments in `index.html`.
Key ones:

- **LinkedIn URL** — search for `[YOUR-LINKEDIN]` and replace with your handle
- **Tagline** — the `<p class="hero__tagline">` line in the Hero section
- **Bio** — the three `<p class="about__text">` paragraphs in the About section
- **Skills** — the `<ul class="skills-list">` lists in About

To change the **accent colour**, edit `--color-accent` in `css/style.css` line 9.

---

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `niyamrathod.github.io` for a root user site,
   or any name for a project site).
2. Push this folder's contents to the `main` branch:
   ```
   git init
   git add .
   git commit -m "initial portfolio"
   git remote add origin https://github.com/niyamrathod/<repo-name>.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Source → Deploy from branch → main → / (root)**.
4. Your site will be live at `https://niyamrathod.github.io/<repo-name>/` within ~60 seconds.

For a root user site (`niyamrathod.github.io`), name the repo exactly `niyamrathod.github.io`
and it will be served at `https://niyamrathod.github.io`.

---

## File structure

```
Niyam - Portfolio/
├── index.html        ← single page, all sections
├── css/
│   └── style.css     ← design system + all layout
├── js/
│   └── main.js       ← GSAP animations, Lenis scroll, cursor
└── README.md
```
