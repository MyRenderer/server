import { BadRequestError, Body, Get, HttpCode, JsonController, Param, Patch, Post } from 'routing-controllers';
import { Project } from '../entity/project';
import { CreateProjectRequest, ProjectResponse, ProjectStatus, UpdateProjectRequest } from '../component/types';
import { getRepository } from '../component/db';
import { StatusCodes } from 'http-status-codes';
import { runProject, stopProject } from '../component/renderer';

function getResponse(project: Project): ProjectResponse {
  return {
    id: project.id,
    name: project.name,
    inputStreamUrl: project.inputStreamUrl || undefined,
    outputStreamUrl: project.outputStreamUrl || undefined,
    renderUrl: project.renderUrl || undefined,
    status: project.status,
    createTime: project.createTime,
  };
}

@JsonController()
export class ProjectController {
  private readonly projectRepository = getRepository(Project);

  @Get('/v1/projects')
  public async index(): Promise<ProjectResponse[]> {
    return (await this.projectRepository.find({
      relations: ['overlays'],
      order: {
        createTime: 'DESC',
      },
    })).map(getResponse);
  }

  @Get('/v1/projects/:projectId')
  public async get(@Param('projectId') projectId: string): Promise<ProjectResponse> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new BadRequestError(`Project not found`);
    }
    return getResponse(project);
  }

  @Post('/v1/projects')
  @HttpCode(StatusCodes.CREATED)
  public async create(@Body() request: CreateProjectRequest): Promise<ProjectResponse> {
    const project = await this.projectRepository.save(this.projectRepository.create({
      name: request.name,
      inputStreamUrl: request.inputStreamUrl,
      outputStreamUrl: request.outputStreamUrl,
      renderUrl: request.renderUrl,
    }));
    return getResponse(project);
  }

  @Patch('/v1/projects/:projectId')
  public async update(@Param('projectId') projectId: string, @Body() request: UpdateProjectRequest): Promise<ProjectResponse> {
    let project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new BadRequestError(`Project not found`);
    }
    project = await this.projectRepository.save(this.projectRepository.merge(project, {
      name: request.name,
      inputStreamUrl: request.inputStreamUrl,
      outputStreamUrl: request.outputStreamUrl,
      renderUrl: request.renderUrl,
    }));
    return getResponse(project);
  }

  @Post('/v1/projects/:projectId/run')
  public async run(@Param('projectId') projectId: string): Promise<ProjectResponse> {
    let project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new BadRequestError(`Project not found`);
    }
    runProject(project);
    project.status = ProjectStatus.running;
    await this.projectRepository.save(project);
    return getResponse(project);
  }

  @Post('/v1/projects/:projectId/stop')
  public async stop(@Param('projectId') projectId: string): Promise<ProjectResponse> {
    let project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new BadRequestError(`Project not found`);
    }
    stopProject(project);
    project.status = ProjectStatus.stopped;
    await this.projectRepository.save(project);
    return getResponse(project);
  }
}
