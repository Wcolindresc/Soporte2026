FROM node:20-alpine
WORKDIR /app
COPY package.json package.json
COPY apps/web/package.json apps/web/package.json
RUN npm install --workspaces
COPY . .
WORKDIR /app/apps/web
CMD ["npm", "run", "start"]
