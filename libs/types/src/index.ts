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
