import { UserResponse } from '../../user/types/user-response.type';

export type LoginResponse = {
  user: UserResponse;
  accessToken: string;
};
