FROM node:20-alpine
WORKDIR /app
COPY package.json package.json
COPY apps/api/package.json apps/api/package.json
RUN npm install --workspaces
COPY . .
WORKDIR /app/apps/api
RUN npx prisma generate && npm run build
CMD ["npm", "run", "start"]
