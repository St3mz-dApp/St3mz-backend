export interface BaseUser {
  address: string;
  name?: string;
  surname?: string;
  email?: string;
  nonce?: string;
}

export interface User extends BaseUser {
  id: number;
}
