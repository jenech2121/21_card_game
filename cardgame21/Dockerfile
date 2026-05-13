FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm isntall
RUN npm run dev

FROM golang:1.21-alpine
RUN apk add --no-cache nodejs npm
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
COPY server ./server
COPY package*.json ./
RUN npm inslall
RUN npm install -g tsx typescript

COPY main.go go.mod ./
RUN go build -o -main-server main.go

EXPOSE 8080

CMD [ "./main-server" ]