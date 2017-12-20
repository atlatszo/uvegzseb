# Üvegzseb - Glasspocket tracker

## About Glasspocket Tracker
The Act CXII of 2011 on the Right of Informational Self-Determination and on Freedom of
Information ("Glasspocket Law") oblige every state organisation to publish their public
interest data (including financial, budget, and management data, and contracts) on their
websites. But in practice most of them do not meet the law’s requirements, or partly
execute the regulatory orders. The law does not castigate failures of state organizations,
that is why we want to urge them to observe the rules of transparency using our tracker tool which automatically scrapes their public interest data to one website, warns if they do
not publish new data and put a red flag on them if they fail to fulfill their obligations.
On our website we would like to make searchable all of the public interest information
scraped and/or collected, in that way anyone can browse within the documents on one
website without visiting the state organization’s own site.

The project is sponsored by the Google Digital News Initiative Innovation Fund.

## Active Publisher Tracker - The Open Source components
The Glasspocket Tracker application has many services, some of them are publised here as Open Source components. To distinguish the open source components from the specific installed versions serving Glasspocket Tracker at https://uvegzseb.hu, they are named "active-publisher-tracker…".

The components are:
* active-publisher-tracker-backend: it can collect scraped data from crawlers and serve the front-end applications (see the component’s README for further details)
* active-publisher-tracker-admin-ui: Angular4 front-end application to configure the application
* active-publisher-tracker-public-ui: Angular4 front-end application to present the collected data

## What you can do with Active Publisher Tracker
* The tracker can collect scraped documents, store them for displaying on the front-end, create ranking of the registered publishers and sends newsletters about recent updates
* The application can’t do data scraping! You have to use other solutions for that, and deliver scraped data to the backend via REST API.
* You can manage data owners, newsletter subscriptions and check updates and rankings on the admin ui.
* You can present the scraped data, updates and rankings of data owners on the public ui. You can (and should) customize the public ui pages, there are only placeholders on some pages.

## Requirements and installation
To install and operation the application, you’ll need further services:
* Docker (> 17.03.x ) and Docker compose (1.18)

Use “Example configurations” folder for resources.

### Step 1 Keycloak preparements
1. docker-compose up -d postgres
2. docker-compose up -d nginx
3. docker-compose up -d keycloak
4. go to http://localhost:8080/auth/admin/master/console/#/create/client/master
5. login with (default user and pass is admin/admin)
![login](https://github.com/AtlatszoHU/uvegzseb/readme-images/01.PNG "")

### Step 2 Keycloak config
1. create a client with name master
![create client master](https://github.com/AtlatszoHU/uvegzseb/readme-images/02.PNG "")
2. set the url paths to:
![set the url](https://github.com/AtlatszoHU/uvegzseb/readme-images/03.PNG "")
3. get the **client ID** and replace $KEYCLOAK_CLIENT_SECRET with it in **proxy.json**
![set client ID](https://github.com/AtlatszoHU/uvegzseb/readme-images/04.PNG "")
4. Change 192.168.88.251 to your local IP in proxy.json
5. restart keycloak-proxy with docker-compose restart keycloak-proxy
6. go to realm settings / login and set the followings:
![realm settings](https://github.com/AtlatszoHU/uvegzseb/readme-images/05.PNG "")
7. create role with name master
![create role master](https://github.com/AtlatszoHU/uvegzseb/readme-images/06.PNG "")
8. set master as default role
![set default role](https://github.com/AtlatszoHU/uvegzseb/readme-images/07.PNG "")
9. in realm admin go to your admin user and set "master" role for it
![add master role to master user](https://github.com/AtlatszoHU/uvegzseb/readme-images/08.PNG "")

### Step 3 Start services
1. docker-compose up -d active-publisher-tracker-public-db
2. docker-compose up -d

After your setup the following urls are active:
Keycloak admin: http://localhost:8080/auth
Public UI: http://localhost:8080/
Admin UI: http://localhost:8080/admin
