export enum UserAuthType {
  EMAIL = "email",
  GOOGLE = "google",
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  authType: UserAuthType;
  email: string;
}
