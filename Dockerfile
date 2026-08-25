FROM node:24-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn --production --non-interactive --frozen-lockfile

# Add runtime & execute it
COPY ./dist ./dist
CMD yarn start
