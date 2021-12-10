import { IAgoraRTCRemoteUser, UID } from 'agora-rtc-sdk-ng';

export enum EUserState {
  GRANTED = 'granted',
  LEFT = 'left',
}

export interface IBaseUserResponse {
  id: number;
  joined_at: Date;
  room_id: number;
  state: EUserState;
  user_id: number;
  user_pic: string;
  view_name: string;
}
export interface IUserResponse extends IBaseUserResponse {
  rtc_token: string;
  share_id: number;
}

export interface IShareScreenResponse extends IBaseUserResponse {
  share_id: number;
  share_token: string;
}

export interface IUser {
  avatar?: string;
  joinedDate?: Date;
  name?: string;
  roomId?: number;
  token?: string;
  rtcToken?: string;
  shareId?: number;
  state?: EUserState;
  uid?: UID; // Agora user id
  userId?: number; // Everytale user id
}

export interface ILocalUser extends IUser {
  guest?: boolean;
  shareId?: number;
  shareToken?: string;
}

export interface IDiscussionUser extends IUser, Partial<IAgoraRTCRemoteUser> {}
