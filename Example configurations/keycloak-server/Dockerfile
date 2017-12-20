
FROM jboss/keycloak-postgres:3.2.1.Final

ADD docker-entrypoint.sh /opt/jboss/

ADD changeProxy.xsl /opt/jboss/keycloak/
ADD standalone.sh /opt/jboss/keycloak/bin/
RUN java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone.xml -xsl:/opt/jboss/keycloak/changeProxy.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone.xml; java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml -xsl:/opt/jboss/keycloak/changeProxy.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml; rm /opt/jboss/keycloak/changeProxy.xsl

