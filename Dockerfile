FROM node:9-alpine
ARG NPM_TOKEN

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN yarn --non-interactive --pure-lockfile

# Add runtime & execute it
COPY ./server.js ./server.js
CMD yarn start