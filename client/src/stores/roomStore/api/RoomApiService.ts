import { observable } from 'mobx';

import axios from 'axios';
import {
  IDiscussionJoinData,
  IDiscussionUpdateData,
} from '../types';

class RoomApiService {

  @observable guestJwtToken: string = '';

  // create = (path: string, data: IDiscussionCreationData) =>
  //   new Promise((resolve, reject) => {
  //     axios
  //       .post(path, data, {
  //         headers: { 'Content-Type': 'application/json;charset=utf-8' },
  //       })
  //       .then((response) => resolve(response))
  //       .catch(reject);
  //   });

  update = (path: string, data: IDiscussionUpdateData) =>
    new Promise((resolve, reject) => {
      axios
        .post(path, data, {
          headers: { 'Content-Type': 'application/json;charset=utf-8' },
        })
        .then((response) => resolve(response))
        .catch(reject);
    });

  join = (path: string, data: IDiscussionJoinData) =>
    new Promise((resolve, reject) => {
      axios
        .post(path, data, {
          headers: { 'Content-Type': 'application/json;charset=utf-8' },
        })
        .then((response: any) => resolve(response.data))
        .catch(reject);
    });

  
}

export default RoomApiService;
