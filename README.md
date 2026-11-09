# Policy Gap Checker

![CI](https://github.com/YOUR-USERNAME/policy-gap-checker/actions/workflows/ci.yml/badge.svg)

Paste a security policy and get a control-by-control check against **NIST CSF 2.0** (22 categories): status (covered / partial / gap), the exact policy wording that supports it, a rationale, and one recommended fix. Sign in to save reports. Built for second-line risk and compliance analysts who need a fast, traceable first pass.

**Live app:** https://YOUR-APP.vercel.app  
**Demo (2 min):** YOUR-DEMO-LINK

## Why it is different from a chatbot
- Fixed control catalog, so results are consistent.
- **Evidence guard:** every "covered" or "partial" claim must quote the policy; quotes not found in the text are downgraded to "gap".
- Structured report, coverage map, Markdown export. Human review is stated in the UI.

## Features
Paste or upload .txt/.md · 0 to 100 coverage score · coverage map · filter by status · copy as Markdown · optional sign-in (Supabase Auth) · save, reopen and delete reports (Supabase Postgres with Row Level Security) · input validation · rate limiting.

## Tech stack (all free tiers)
| Area | Tool |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS (run locally) |
| AI engine | Google Gemini via Google AI Studio free API key (`@google/genai`) |
| Database and auth | Supabase free tier (Postgres + Auth) |
| CI/CD | GitHub + GitHub Actions |
| Hosting | Vercel Hobby (+ Vercel Analytics) |
Also: zod (output validation), vitest (tests).

## Run locally
```bash
git clone https://github.com/YOUR-USERNAME/policy-gap-checker.git
cd policy-gap-checker
npm install
cp .env.example .env.local   # then fill in the 4 values below
npm run dev                   # http://localhost:3000
```
| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | yes | Google AI Studio key (server-side only) |
| `GEMINI_MODEL` | no | Defaults to `gemini-2.5-flash-lite`; use a model your free tier allows |
| `NEXT_PUBLIC_SUPABASE_URL` | for sign-in/saving | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for sign-in/saving | Supabase anon (publishable) key; safe to expose because of Row Level Security |

Without the two Supabase variables the app still works; sign-in and saved reports are hidden.

### Supabase setup (5 minutes)
1. Create a free project at supabase.com.
2. SQL Editor: paste and run `supabase/schema.sql` (creates the `reports` table with Row Level Security).
3. Project Settings > API: copy the project URL and anon/publishable key into `.env.local`.
4. Authentication: for demos, turn off "Confirm email" (the built-in email sender is limited to a couple of emails per hour). Details in `docs/08-gemini-supabase-setup.md`.

## Test
```bash
npm test && npm run lint && npm run typecheck
```

## Deploy (Vercel Hobby)
1. Push to a public GitHub repo.
2. Import the repo in Vercel and add the 4 environment variables above.
3. In Supabase Authentication > URL Configuration, add your Vercel URL as the Site URL.
4. Enable Web Analytics in the Vercel project. Every push to `main` deploys after CI passes.

## How it works
See [`spec.md`](spec.md) and [`docs/03-architecture-notes.md`](docs/03-architecture-notes.md). Sample data for every step is in [`samples/`](samples/).

## Security and privacy
No secrets in the repo; policy text is never stored or logged (only character count and timing); saved reports contain results only and are private to each user through Row Level Security; policy is treated as untrusted data in the prompt; input caps and per-IP rate limiting. **Free-tier Gemini inputs may be used by Google to improve its products, so use only public or sanitized policies.**

## Limitations
Category-level mapping only; judges written text, not actual practice; in-memory rate limiter; free-tier AI limits can cause temporary "busy" errors; Supabase free projects pause after a week of inactivity; AI-generated drafts need human review. Not legal or compliance advice.

## Project documents
[Validation report](docs/01-idea-validation-report.md) · [PRD](docs/02-PRD.md) · [Architecture](docs/03-architecture-notes.md) · [Spec](spec.md) · [Demo script](docs/04-demo-script.md) · [Reflection](docs/05-reflection.md) · [v2 issue](docs/06-v2-github-issue.md) · [Testing log](docs/07-user-testing-log.md) · [Setup guide](docs/08-gemini-supabase-setup.md)

Built as Week 4 Graded Assignment 4.2, AIM Postgraduate Certificate in Generative AI and Agentic AI.
