FROM nginx:alpine

COPY /public /usr/share/nginx/html

WORKDIR /public

EXPOSE 80
