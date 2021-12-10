import { IUser } from './user';

export enum EDiscussionAccessType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum EDiscussionState {
  STARTED = 'started',
  FINISHED = 'finished',
}

export enum EDiscussionLocalStorageKeys {
  DATA = 'discussion-data',
}

export enum EDiscussionVideoContainers {
  ALL = 'videos_class',
  ONE = 'remote-player-wrapper',
  LOCAL = 'localVideo',
  REMOTE = 'remoteVideos',
  SHARING = 'sharingVideo',
  SHARING_CONTAINER = 'sharingVideoContainer',
}

export interface IDiscussionInitParams {
  // avatar: string;
  // guest: boolean;
  // id: string;
  nameRoom: string;
  userName: string;
}

export interface IDiscussionCreationData {
  access_type: EDiscussionAccessType;
  event_id: number;
  max_users: number;
  name: string;
  session_id: number;
}

export interface IDiscussionCreationResponseData {
  name: string;
  access_type: EDiscussionAccessType;
  max_users: number;

  link: string;
  conf_id: string;
}

export interface IDiscussionUpdateData {
  access_type: EDiscussionAccessType;
  event_id: number;
  max_users: number;
  name: string;
  session_id: number;
}

export interface IDiscussionJoinData {
  channel: string;
  isPublisher: boolean;
}

export interface IDiscussionJoinResponseData {
  uid: number;
  token: string;
}

export interface IDiscussionLeaveData {
  view_name: string;
}

export interface IDiscussionGetInfoOptions {
  id?: string; // Discussion id
  guest?: boolean;
}

export interface IDiscussionInfoResponse {
  access_type: EDiscussionAccessType;
  state: EDiscussionState;
  conf_id: string;
  name: string;
  link: string;
  max_users: number;
  created_at: Date;

  user: {
    id: number;
    name: string;
    email: string;
    rating: number;
    user_pic: string;
  };
}

export interface IDiscussionCreator {
  id?: number;
  name?: string;
  email?: string;
  rating?: number;
  avatar?: string;
}

export interface IDiscussionInfo {
  id?: string;
  channel?: string;
  name?: string;
  accessType?: EDiscussionAccessType;
  state?: EDiscussionState;
  link?: string;
  maxUsers?: number;
  createdDate?: Date;

  creator?: IDiscussionCreator;
}

export interface IDiscussionLocalStorageData {
  user?: IUser;
}
