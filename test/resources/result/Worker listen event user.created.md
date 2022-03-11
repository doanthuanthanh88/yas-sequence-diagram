# Worker listen event user.created
```mermaid
sequenceDiagram

%% [] Worker listen event user.created
RabbitMQ --) Worker: Consume queue user.create
Worker ->> Worker: Print new user
```
