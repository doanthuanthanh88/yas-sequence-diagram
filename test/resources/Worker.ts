export class Worker {
  /// [](Worker) Worker listen event user.created
  consumeUserCreated(user: any) {
    /// "$" <- "RabbitMQ": Consume queue user.create
    console.log(user);
    /// "$" > "$": Print new user
  }
}
