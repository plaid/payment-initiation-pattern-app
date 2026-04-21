FROM node:20-alpine

COPY ["package.json", "/opt/client/"]
COPY ["package-lock.json", "/opt/client/"]

WORKDIR /opt/client

RUN npm ci

COPY ["index.html", "/opt/client/"]
COPY ["vite.config.ts", "/opt/client/"]
COPY ["tsconfig.json", "/opt/client/"]
COPY ["tailwind.config.cjs", "/opt/client/"]
COPY ["postcss.config.cjs", "/opt/client/"]
COPY ["src/", "/opt/client/src/"]
COPY ["public/", "/opt/client/public/"]

CMD ["npm", "start"]
