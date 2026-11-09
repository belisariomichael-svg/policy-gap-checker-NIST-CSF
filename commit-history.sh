#!/usr/bin/env bash
# Creates 8 meaningful commits from this folder. Run once inside a fresh clone/copy.
set -e
git init -b main 2>/dev/null || true
git add docs/01-idea-validation-report.md docs/02-PRD.md && git commit -m "docs: add idea validation report and PRD"
git add spec.md docs/03-architecture-notes.md CLAUDE.md .cursorrules && git commit -m "docs: add spec, architecture notes, and AI coding rules"
git add package.json package-lock.json tsconfig.json next.config.mjs postcss.config.js tailwind.config.ts vitest.config.ts .eslintrc.json .gitignore .env.example && git commit -m "chore: scaffold Next.js 14 + Tailwind + vitest project"
git add lib/controls.ts lib/prompt.ts lib/result.ts lib/validate.ts lib/gemini.ts app/api && git commit -m "feat: implement Gemini analysis API with evidence guard and validation"
git add supabase lib/supabase.ts lib/reports.ts && git commit -m "feat: add Supabase schema with row level security and report helpers"
git add __tests__ && git commit -m "test: add unit tests for validation, scoring, evidence guard, and reports"
git add app/layout.tsx app/page.tsx app/globals.css lib/sample.ts lib/report.ts components && git commit -m "feat: build UI with coverage map, sign-in, and saved reports"
git add .github README.md samples scripts docs commit-history.sh && git commit -m "ci: add GitHub Actions workflow; docs: README, setup guide, demo script, reflection"
git log --oneline
