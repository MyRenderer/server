import { Body, Delete, Get, HttpCode, JsonController, NotFoundError, OnUndefined, Param, Patch, Post } from 'routing-controllers';
import { CreateOverlayRequest, MessageType, OverlayResponse, OverlayStatus, UpdateOverlayRequest } from '../component/types';
import { Overlay } from '../entity/overlay';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from '../component/db';
import { Project } from '../entity/project';
import { notifyAll } from '../component/socket';

function getResponse(overlay: Overlay): OverlayResponse {
  return {
    id: overlay.id,
    name: overlay.name,
    templateId: overlay.templateId,
    properties: overlay.properties || {},
    status: overlay.status,
    createTime: overlay.createTime,
  };
}

@JsonController()
export class OverlayController {
  private readonly projectRepository = getRepository(Project);
  private readonly overlayRepository = getRepository(Overlay);

  @Get('/v1/projects/:projectId/overlays')
  public async index(@Param('projectId') projectId: string): Promise<OverlayResponse[]> {
    const project = await this.projectRepository.findOne({ where: { id: projectId }})
    if (!project) {
      throw new NotFoundError(`Project not found`);
    }
    return (await this.overlayRepository.find({
      where: {
        project: project
      },
    })).map(getResponse);
  }

  @Get('/v1/projects/:projectId/overlays/:overlayId')
  public async get(@Param('projectId') projectId: string, @Param('overlayId') overlayId: string): Promise<OverlayResponse> {
    return getResponse(await this.findOverlay(projectId, overlayId));
  }

  @Post('/v1/projects/:projectId/overlays')
  @HttpCode(StatusCodes.CREATED)
  public async create(@Param('projectId') projectId: string, @Body() request: CreateOverlayRequest): Promise<OverlayResponse> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundError(`Project not found`);
    }
    const overlay = await this.overlayRepository.save(this.overlayRepository.create({
      name: request.name,
      project: project,
      templateId: request.templateId,
      status: OverlayStatus.down,
    }));
    return getResponse(overlay);
  }

  @Patch('/v1/projects/:projectId/overlays/:overlayId')
  public async update(@Param('projectId') projectId: string, @Param('overlayId') overlayId: string, @Body() request: UpdateOverlayRequest): Promise<OverlayResponse> {
    const overlay = await this.findOverlay(projectId, overlayId);
    await this.overlayRepository.save(this.overlayRepository.merge(overlay, {
      name: request.name,
      properties: request.properties,
    }));
    const response = getResponse(overlay);
    notifyAll(projectId, MessageType.overlayUpdate, { overlay: response });
    return response;
  }

  @Delete('/v1/projects/:projectId/overlays/:overlayId')
  @OnUndefined(StatusCodes.NO_CONTENT)
  public async delete(@Param('projectId') projectId: string, @Param('overlayId') overlayId: string): Promise<void> {
    const overlay = await this.findOverlay(projectId, overlayId);
    await this.overlayRepository.remove(overlay);
  }

  @Post('/v1/projects/:projectId/overlays/:overlayId/up')
  public async up(@Param('projectId') projectId: string, @Param('overlayId') overlayId: string): Promise<OverlayResponse> {
    const overlay = await this.findOverlay(projectId, overlayId);
    overlay.status = OverlayStatus.up;
    await this.overlayRepository.save(overlay);
    const response = getResponse(overlay);
    notifyAll(projectId, MessageType.overlayUp, { overlay: response });
    return response;
  }

  @Post('/v1/projects/:projectId/overlays/:overlayId/down')
  public async down(@Param('projectId') projectId: string, @Param('overlayId') overlayId: string): Promise<OverlayResponse> {
    const overlay = await this.findOverlay(projectId, overlayId);
    overlay.status = OverlayStatus.down;
    await this.overlayRepository.save(overlay);
    const response = getResponse(overlay);
    notifyAll(projectId, MessageType.overlayDown, { overlay: response });
    return response;
  }

  private async findOverlay(projectId: string, overlayId: string): Promise<Overlay> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundError(`Project not found`);
    }
    const overlay = await this.overlayRepository.findOne({
      where: {
        id: overlayId,
        project: project,
      },
    });
    if (!overlay) {
      throw new NotFoundError(`Overlay not found`);
    }
    return overlay;
  }
}
