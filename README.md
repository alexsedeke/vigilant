# Vigilant

API Bootstrap on Fastify, Apollo Server and Neo4J
    
[Documentation](documentation/INDEX.md)

## Cron

You can run schedule tasks. The task must be independent from the API, to be able to deploy the tasks to an other microservice.
Here for we use [bree](https://www.npmjs.com/package/bree). Bree is the best job scheduler for Node.js and JavaScript with cron, dates, ms, later, and human-friendly support.
The task must be located in the **jobs** folder, directly in the main application directory.
By default the schedule is enabled. It can be disabled by setting `VL_CRON` environment variable to false.

## Email

[forwardemail.net](https://forwardemail.net/en/faq)

## Environment Variables

Here is alist of all environment variables.

|Name     | Description  | Default |
|---------|--------------|---------|
|**PORT**                   | Fastify port number to listen on.        | 3000                  |
|**VL_NEO4J_DB**            | Neo4J Database adress                    | bolt://localhost:7687 |
|**VL_NEO4J_AUTH_USER**     | Neo4J Database Authentication user name  | neo4j                 |
|**VL_NEO4J_AUTH_PASSWORD** | Neo4J Database Authentication password   | s3cr3t                |
