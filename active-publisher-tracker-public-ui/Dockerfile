FROM nginx:1.11.4
MAINTAINER Andras Gazdag "agazdag@precognox.com"
RUN apt-get update; apt-get install -y openssl wget \
  && wget --no-check-certificate https://github.com/jwilder/dockerize/releases/download/v0.4.0/dockerize-linux-amd64-v0.4.0.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.4.0.tar.gz
COPY dist /usr/html/
COPY nginx.conf /etc/nginx/nginx.conf
CMD dockerize -template /usr/html/app/assets/config/config.json.template:/usr/html/app/assets/config/config.json; dockerize nginx -g "daemon off;"
