# nouns.zone

All things Nouns on Farcaster

## Getting started

With Node.js, pnpm, and postgres installed:

```sh
gh repo clone alex-grover/nouns.zone
pnpm install
pnpm vercel env pull .env
createdb nounszone
pnpm migrate
pnpm generate
pnpm dev
```
