# We are going to use Node.js 14. We choose the "slim" variant to keep the image size down.
FROM node:18-alpine
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3000
# Run the application
CMD ["yarn", "start"]
