import { Person, User } from "./User";

export interface Space {
  creatorInfo?: Person;
  memberCount?: number;
  contact: string;
  status: number;
  name: string;
  email?: string;
  role: number;
  logo?: string;
  _key: string;
}
export interface SpaceInfo {
  role: number;
  name: string;
  logo: string;
  contact: string;
  email: string;
}

export interface SpaceMember {
  mobile: string;
  role: number;
  userAvatar: null | string;
  userKey: string;
  userName: null | string;
}
