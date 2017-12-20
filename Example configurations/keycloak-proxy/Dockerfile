FROM docker.precognox.com/alpine-oracle8jdk:3.5-8u121-slim 

MAINTAINER  Andras Kalman

ENV KEYCLOAK_PROXY_VERSION=3.2.1.Final

RUN cd / && \
  wget -q http://downloads.jboss.org/keycloak/$KEYCLOAK_PROXY_VERSION/keycloak-proxy-$KEYCLOAK_PROXY_VERSION.zip -O temp.zip && \
  unzip temp.zip && \
  rm temp.zip && \
  mv keycloak-proxy-$KEYCLOAK_PROXY_VERSION keycloak-proxy && \
  mkdir -p /keycloak-proxy/conf

ADD entrypoint.sh /entrypoint.sh

VOLUME /keycloak-proxy/conf

ADD proxy.json /keycloak-proxy/conf

CMD ["/entrypoint.sh"]
