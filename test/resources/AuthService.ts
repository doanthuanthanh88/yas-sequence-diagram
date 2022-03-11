import axios from 'axios';

export class AuthService {
  /// [AuthService.checkAuth]
  async checkAuth(req, res) {
    /// GROUP Check authentication
    try {
      /// "$" => "AuthService": Check request permission
      /// "$" <= "AuthService": Response
      await axios.get('/check-auth');
    } catch (err) {
      /// IF Not permission
      throw err;
      ///   "Client" <= "$": Response 401
    }
  }
}
