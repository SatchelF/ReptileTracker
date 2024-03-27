# Usage
Create your own `.env` from [.env.example](.env.example). If you set up your [/prisma/seeds.ts](prisma/seeds.ts) the way you want you can run `yarn seed`. 
```bash
docker compose up -d
```
```bash
yarn migrate-dev
```
## Client Setup and Run (Foreground Execution)
```bash
cd client && yarn && yarn dev
```
## Server Setup and Run (Foreground Execution):
```bash
yarn && yarn dev
```

# ReptileTracker