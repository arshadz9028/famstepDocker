FROM node:18-alpine AS base

WORKDIR /usr/src/app

# RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
#     apt-get install -y nodejs && \ 
#     mkdir -p /usr/src/app
# RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@7 && \ 
    npm install --force


COPY . .
ENV NODE_ENV=production
ENV NEXTAUTH_URL=https://famstep.com
ENV BASE_URL=https://famstep.com
ENV SOCKET_URL=https://famstep.com
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]















#Original Image
# FROM openjdk:11-jre-slim

# WORKDIR /usr/src/app

# RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
#     apt-get install -y nodejs

# RUN mkdir -p /usr/src/app

# WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm install -g npm@7  

# RUN npm install --force
# COPY . .

# RUN npm run build

# EXPOSE 3000

# CMD ["npm", "start"]









