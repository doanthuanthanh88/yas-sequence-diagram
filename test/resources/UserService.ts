export class UserService {

  /// [UserService.createNewUser]
  async createNewUser() {
    /// PAR
    const [user] = await Promise.all([
      /// [UserService.createUserInDB]
      this.createUserInDB(),
      /// [UserService.emitCreateUserEvent]
      this.emitCreateUserEvent()
    ]);

    /// IF Could not create a new user in DB
    if (!user) {
      /// "Client" <= "$": Response 500
      throw new Error("Could not create a new user");
    }

    /// LOOP User classes
    user.classes.forEach(clazz => {
      /// "$" > "$": Print class name
      console.log(clazz);
    });
  }

  /// [UserService.createUserInDB]
  private createUserInDB() {
    /// "$" => "MongoDB": Insert a new user
    /// "$" <= "MongoDB": Done
    return null;
  }

  /// [UserService.emitCreateUserEvent]
  private emitCreateUserEvent() {
    /// "$" -> "RabbitMQ": Fire event user.create to global
  }


}
