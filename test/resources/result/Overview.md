# Overview
```mermaid
flowchart LR

Client==>App
App==>MongoDB

App-.->RabbitMQ

RabbitMQ-.->Worker
