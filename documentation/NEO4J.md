# Neo4j

## Installation

### Running Neo4j with Docker

There are several ways to leverage Docker for your Neo4j development and deployment. You can create throw-away Neo4j instances of many different versions for testing and running your applications. You can also pre-seed containers with datasets, extensions, and configurations for interaction and processing.

``` shell
docker run -p7474:7474 -p7687:7687 -e NEO4J_AUTH=neo4j/s3cr3t neo4j
# then open http://localhost:7474 to connect with Neo4j Browser
```

When visiting the running Neo4J docker instance at [http://localhost:7474](http://localhost:7474), you are prompted for username and password, which was set throw the `NEO4J_AUTH` parameter.    
In our case the **username** is `neo4j` with the **password** `s3cr3t`.

The step-by-step instructions on starting Docker containers for Neo4j are given in our how-to guide. There is also documentation in our operations [manual](https://neo4j.com/docs/operations-manual/current/docker/) on running Neo4j with Docker and how to configure it, run clusters, and handle security

### Running Neo4j with Docker and APOC plugin

APOC Full can be used with the [Neo4j Docker image](https://hub.docker.com/_/neo4j/) via the NEO4JLABS_PLUGINS environment variable. If we use this environment variable, the APOC plugin will be downloaded and configured at runtime.

``` shell
docker run \
    -p 7474:7474 -p 7687:7687 \
    -v $PWD/data:/data -v $PWD/plugins:/plugins \
    --name neo4j-apoc-enabled \
    -e NEO4J_apoc_export_file_enabled=true \
    -e NEO4J_apoc_import_file_enabled=true \
    -e NEO4J_apoc_import_file_use__neo4j__config=true \
    -e NEO4JLABS_PLUGINS=\[\"apoc\"\] \
    -e NEO4J_dbms_security_procedures_unrestricted=apoc.\\\* \
    -e NEO4J_dbms_security_procedures_whitelist=apoc.coll.\\\*,apoc.load.\\\* \
    -e NEO4J_AUTH=neo4j/s3cr3t \
    neo4j:4.1
```

More information you can obtail [here](https://neo4j.com/labs/apoc/4.1/installation/)
