import { AuthService } from "./AuthService"
import { UserService } from "./UserService"

export class UserController {
  userService = new UserService()
  authService = new AuthService()

  /// [UserController.validateRequest]
  private async validateRequest(req, res) {
    req
    res
    /// [AuthService.checkAuth]
    await this.authService.checkAuth(req, res)
  }

  /// [](App) Create a new user
  async createNewUser(req, res) {
    /// "Client" => "$": Request to create new user

    /// GROUP Validate request data
    ///   [UserController.validateRequest]
    await this.validateRequest(req, res)

    /// NOTE RIGHT OF "$": Handle business
    /// [UserService.createNewUser]
    await this.userService.createNewUser()
  }

}