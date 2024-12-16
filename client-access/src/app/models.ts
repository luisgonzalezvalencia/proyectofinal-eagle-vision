export interface Client {
  id: string;
  clientId?: number;
  expirationDate?: string;
  token?: string;
  userId: string;
}

export interface UsersClient {
  userId: string;
  clientId: number;
}

export interface BackgroundTask {
  clientId: string;
  createdDate: string;
  finishedDate: string;
  type: BackgroundTaskType;
}

export enum BackgroundTaskType {
  TRAINING = 'TRAINING',
  UPLOAD_ZIP = 'UPLOAD_ZIP',
}
