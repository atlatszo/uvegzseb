Features of this application: 
- receiving scraped documents from a list of publishers in a unified format (sse the API docs for this)
- creating a ranking of the registered publishers (you can specify your own algorithm for this) 
- displaying all registered publishers on a public page with their recent updates
- sending newsletter e-mails to registered subscribers about new publications
- sending reminder e-mails to publishers if they fail to produce documents 

Requirements for running:
- SMTP server
- External Keycloak instance

How to run: 

Check docker-compose.yml and specify your own environment variables. Explanation of some of the variables:
- `DB_URL, DB_USER, DB_PASS`: these should match the configuration of the MySQL container (active-publisher-tracker-db)
- `EMAIL_SERVICE_URL`: this should be the address of the email-delivery-service container
- `NEWSLETTER_FREQUENCY_HOURS`: subscribers will receive e-mails about the new publications with this frequency
- `REMINDER_FREQUENCY_HOURS`: this is the frequency of reminder e-mails sent to publishers if they fail to produce updates
- `REMINDER_THRESHOLD_DAYS`: we allow this amount of time without updates before sending a reminder e-mail
- `MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD`: these are the parameters of the SMTP server 

Create Docker images with:  
`gradle dockerBuildImage`

Then run these commands:  
    `docker-compose up -d active-publisher-tracker-db`  
    `docker-compose up -d`

The container of the database should be started first. The second command starts everything else.

You can check the logs with:  
    `docker-compose logs -f <container-name>`

Adding categories: Currently, you have to manually add your categories to the database.  

This version includes a basic ranking plugin (`com.precognox.publishertracker.ranking.ExampleRankingPlugin`). You should probably write your own ranking implementation. 

Adding an initial user:  
Manually create a Keycloak account in the same realm that you specified in the KEYCLOAK_AUTH_REALM Docker environment variable. Then start the application and send a POST request to `<backend-container-IP>:9081/tasks/init_users`. (The port will be different if you override it in docker-compose.) You can check the backend container's address with the command `docker inspect active-publisher-tracker-backend`). This will create the existing Keycloak user in the application's DB. You can log in with this account and add the other users on the admin interface.

Customizing the e-mails:  
You can find the e-mail templates in `src/main/resources/templates`
