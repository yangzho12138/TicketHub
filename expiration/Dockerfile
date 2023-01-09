FROM node:alpine

# ENV CI=true
# ENV WDS_SOCKET_PORT=0

# create a work directory -> any following command will be executed relative to this path in container
WORKDIR /app
# COPY package.json from local machine to build context . (inside the container -> /app/.)
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]