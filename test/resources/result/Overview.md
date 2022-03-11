# Overview
```mermaid
flowchart LR

App-.->RabbitMQ

App==>MongoDB

Client==>App
RabbitMQ-.->Worker
