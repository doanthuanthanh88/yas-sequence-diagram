# Worker listen event user.created
```mermaid
sequenceDiagram

%% []
OPT Worker listen event user.created
RabbitMQ --) Worker: Consume queue user.create
Worker ->> Worker: Print new user
END
```
