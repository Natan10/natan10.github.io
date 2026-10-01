# Landing Page

This is my personal landing page to show my experience as software developer and also
list all my skills, key points and takeways and what i achieve

# Project version
- nextjs 16x
- tailwindcss
- @playwright/test and @axe-core/playwright (browser and accessibility tests, `npm test`)

# Design
for design tokens information see `docs/design.md`

# Architecture
```
- app
    - api
    - components
        ui (shared ui component)
    - pages
        - <feature-a>
        - <feature-b>
    - hooks
    - lib
        - services
        - action
        - data
```


# Commits
- use convetional commits pattern https://www.conventionalcommits.org/en/v1.0.0/


# Important 
- every time a new dependencie was installed update this file (do it for important deps)
- create new worktree for each spec that is going to be implemented
- always ask user about merge worktree into main 
- after merge commit changes and close worktree
