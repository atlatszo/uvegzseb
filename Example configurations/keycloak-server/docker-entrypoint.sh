#!/bin/bash

if [ $KEYCLOAK_USER ] && [ $KEYCLOAK_PASSWORD ]; then
    keycloak/bin/add-user-keycloak.sh --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD
fi

if [ $WEBROOT ]; then
   sed -i "s#<web-context>auth</web-context>#<web-context>$WEBROOT</web-context>#g" /opt/jboss/keycloak/standalone/configuration/standalone.xml
fi

exec /opt/jboss/keycloak/bin/standalone.sh $@
exit $?
