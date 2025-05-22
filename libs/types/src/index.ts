export type JwtPayload = {
  sub: string;
  id: string;
  email: string;
  role: string;
};

export enum ClientType {
  APP = 'App',
  WEB = 'Web',
  UNKNOWN = 'Unknown',
}

export enum ImageFor {
  BRIDE = 'bride',
  GROOM = 'groom',
}

export enum GuestRole {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
  PHOTOGRAPHER = 'PHOTOGRAPHER',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}
