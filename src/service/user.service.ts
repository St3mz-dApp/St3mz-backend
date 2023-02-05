import { ErrorCode } from "../error/error-code";
import { ErrorException } from "../error/error-exception";
import { MOCK_USERS } from "../mocks/user.mock";
import { BaseUser, User } from "../model/user.model";

export const findAll = async (): Promise<User[]> => {
  return [...MOCK_USERS];
};

export const find = async (address: string): Promise<User> => {
  const user = MOCK_USERS.find((user) => user.address === address);
  if (!user)
    throw new ErrorException(ErrorCode.NotFound, {
      message: "The user with the given address was not found",
    }); // Second parameter is optional
  return user;
};

export const create = async (newUser: BaseUser): Promise<User> => {
  // ... create logic here
  return { id: Math.random(), ...newUser };
};

export const update = async (user: User): Promise<User | null> => {
  const currentUser = await find(user.address);
  if (!currentUser)
    throw new ErrorException(ErrorCode.NotFound, {
      message: "The user with the given address was not found",
    });

  currentUser.name = user.name;
  // ... update logic here
  return currentUser;
};

export const remove = async (id: number): Promise<void> => {
  // ... delete logic here
};
