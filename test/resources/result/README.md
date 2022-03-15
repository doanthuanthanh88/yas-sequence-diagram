# Application document details
## System overview
Describe all of components in application


```mermaid
flowchart LR
%% Declare shapes
subgraph Application
App((App))
Worker((Worker))
end
subgraph Other Services
AuthService[[AuthService]]
end
Client
MongoDB
RabbitMQ

%% Main flows
Client==>App
App==>AuthService


App-->MongoDB

App-.->|pub/emit|RabbitMQ
RabbitMQ-.->|sub/on|Worker
```


## Main flows
Visualize flows in application to sequence diagrams

1. [Create a new user](./Create%20a%20new%20user.md)
2. [Worker listen event user.created](./Worker%20listen%20event%20user.created.md)
