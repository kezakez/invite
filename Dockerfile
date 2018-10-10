FROM node:9-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN yarn --production --non-interactive --pure-lockfile

# Add runtime & execute it
COPY ./dist ./dist
CMD yarn start