# Contributing to the Project

> This document is addressed to **every person who touches this codebase** — human
> or AI agent. Read it fully before making any change. There are no exceptions.

---

## The golden rules

These rules are non-negotiable. Violating any of them will require the
work to be redone from scratch.

### 1. You never work on `main`

`main` is the stable, deployable trunk. It is not a scratch pad.

- **Never commit directly to `main`.**
- **Never push to `main` directly.**
- **Every single change**, no matter how small — a typo fix, a one-line tweak,
  a dependency bump — goes on a dedicated branch first.

If you find yourself on `main` with uncommitted changes, stop. Stash them,
create a branch, and apply them there:

```bash
git stash
git checkout -b fix/my-accidental-change
git stash pop
```

### 2. You never merge without explicit consent

Merging into `main` is a deliberate, human-approved action. No branch is ever
merged automatically, speculatively, or "just to keep things tidy".

- **Wait for an explicit "merge this" instruction** before running any merge.
- When in doubt, ask. Do not assume.
- The only person who authorises a merge is the project lead.

When a merge is authorised, always use `--no-ff` and follow the `merge([dest]): merge from [src]` format:

```bash
git checkout main
git merge --no-ff feat/my-feature -m "merge(main): merge from feat/my-feature"
```

### 3. Every commit and every branch must follow the naming convention

Consistency in naming makes the history readable at a glance. Deviating from
the convention makes the history noisy and harder to audit.

See the [Branch naming](#branch-naming) and [Commit messages](#commit-messages)
sections below for the full rules.

### 4. All checks must pass before any merge — no exceptions

Before even asking for a merge, **every available check must be green**.
This is not optional. A branch that does not pass all checks is not ready to
merge, period.

Run all checks locally and fix everything before requesting the merge:

```bash
# 1. Project build must succeed
npm run build

# 2. Commit messages must not contain ANSI escape codes
! git log main..HEAD --format="%B" | grep -E $'\x1b\\[[0-9;]*[a-zA-Z]'
```

If any check exits with a non-zero code, the branch is not
mergeable. Fix the issues, commit the fixes on the same branch, and re-run
until everything is clean. Do not ask for a merge with known failures, do not
ask for exceptions, and do not skip a check because it "is not related to my
change". All checks, always.

### 5. Commit messages must never contain ANSI escape codes

Commit messages must be pure plain text. Never include ANSI escape sequences or
terminal color codes (such as `\x1b[...m` or `\033[...]`).

Before requesting a merge, check that the commits on your branch contain no ANSI codes:

```bash
! git log main..HEAD --format="%B" | grep -E $'\x1b\\[[0-9;]*[a-zA-Z]'
```

---

## Branch naming

Branches follow the `type/short-description` pattern in **kebab-case**:

```
feat/hero-motion
fix/team-member-quote
chore/update-dependencies
docs/contributing
refactor/supporting-carousel
```

| Prefix | When to use |
|--------|-------------|
| `feat/` | New feature or capability |
| `fix/` | Bug fix |
| `chore/` | Maintenance — deps, config, tooling, cleanup |
| `docs/` | Documentation only |
| `refactor/` | Code restructure without behaviour change |
| `style/` | Formatting, whitespace |
| `test/` | Tests only |
| `perf/` | Performance improvement |

**Rules:**
- Use only lowercase letters, numbers and hyphens. No slashes beyond the prefix.
- Keep descriptions short and specific (`fix/quote-typo` not `fix/stuff`).
- One concern per branch. If you need to do two unrelated things, open two branches.

---

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) **strictly**.
Every commit must have the format:

```
type(scope): short imperative description

Optional body explaining *why*, not *what*.
```

**The scope is mandatory. Never omit it.**

The description must be in the **imperative mood** ("add", "fix", "remove" — not
"added", "fixes", "removing").

**AI Agent Rule: Never use `Co-Authored-By`**
If you are an AI or LLM, you must NEVER append `Co-Authored-By:` trailers to commit messages (e.g. `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`). Just write the standard commit message body.

**Never use ANSI escape codes**
Commit messages must be pure plain text. Never include terminal color codes or ANSI escape sequences (e.g., `\x1b[...m` or `\033[...]`).

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `chore` | Maintenance (deps, config, tooling) |
| `docs` | Documentation only |
| `refactor` | Code restructure without behaviour change |
| `style` | Formatting, whitespace |
| `test` | Tests only |
| `perf` | Performance improvement |

### Valid examples

```
feat(hero): add video scroll synchronization
fix(team): update David and Santi editorial quotes
chore(deps): add workspace dependencies to flake.nix
docs(readme): document local preview and media structure
refactor(carousel): streamline supporting cast animation
```

### Invalid examples — do not do this

```
fix stuff                          ← missing type and scope
feat(ui): Added new logo           ← past tense, should be "add"
update                             ← meaningless, no type, no scope
WIP                                ← never commit WIP to a shared branch
feat(web): \x1b[32mupdate hero\x1b[0m   ← contains ANSI color codes
feat(web): update team copy and upgrade deps and refactor hero   ← one commit, three concerns
```

### Merge commits

Merge commits must strictly follow the format:

```
merge([dest]): merge from [src]
```

Where `[dest]` is the target branch and `[src]` is the source branch. Always use `--no-ff` with `-m`:

```bash
git checkout main
git merge --no-ff feat/hero-motion -m "merge(main): merge from feat/hero-motion"
```

---

## Workflow summary

```
1.  Start from an up-to-date main
    git checkout main && git pull

2.  Create a branch
    git checkout -b feat/my-feature

3.  Work, commit often with meaningful messages
    git commit -m "feat(scope): do something specific"

4.  Run all checks — fix until green
    npm run build
    ! git log main..HEAD --format="%B" | grep -E $'\x1b\\[[0-9;]*[a-zA-Z]'

5.  Push the branch (never main) and ask for a merge
    git push origin feat/my-feature
```

That's it. No shortcuts.
