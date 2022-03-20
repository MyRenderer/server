import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export enum OverlayStatus {
  up = 'up',
  down = 'down',
}

export interface OverlayResponse {
  id: string;
  name: string;
  templateId: string;
  properties: object;
  status: OverlayStatus;
  createTime: Date;
}

export interface ProjectResponse {
  id: string;
  name: string;
  inputStreamUrl?: string;
  outputStreamUrl?: string;
  createTime: Date;
}

export enum MessageType {
  overlayUpdate = 'overlayUpdate',
  overlayUp = 'overlayUp',
  overlayDown = 'overlayDown',
}

export interface OverlayMessageData {
  overlay: OverlayResponse;
}

export type MessageData = OverlayMessageData;

export class CreateProjectRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  inputStreamUrl?: string;

  @IsString()
  @IsOptional()
  outputStreamUrl?: string;
}

export class CreateOverlayRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  templateId: string;
}

export class UpdateOverlayRequest {
  @IsString()
  @IsOptional()
  name: string;

  @IsObject()
  properties: object;
}
