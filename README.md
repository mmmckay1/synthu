# SynthU: an Interactive, Educational Software Synthesizer
[![CI](https://github.com/mmmckay1/synthu/actions/workflows/ci.yml/badge.svg)](https://github.com/mmmckay1/synthu/actions/workflows/ci.yml)

Live Demo: https://synthu.vercel.app
## Run Locally

Requires Node 24

```
npm ci
npm run build -w shared
npm run dev -w web
Then open http://localhost:5173
```

## Checks

```
npm run lint
npm test
npm run build
```