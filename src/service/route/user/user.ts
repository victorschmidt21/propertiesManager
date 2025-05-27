export class UserAttributes {
  id: string;
  username: string;
  email?: string;

  constructor({ id, username, email }: UserAttributes) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}
