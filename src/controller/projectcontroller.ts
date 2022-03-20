import { BadRequestError, Body, Get, HttpCode, JsonController, Param, Post } from 'routing-controllers';
import { Project } from '../entity/project';
import { CreateProjectRequest, ProjectResponse } from '../component/types';
import { getRepository } from '../component/db';
import { StatusCodes } from 'http-status-codes';

function getResponse(project: Project): ProjectResponse {
  return {
    id: project.id,
    name: project.name,
    inputStreamUrl: project.inputStreamUrl,
    outputStreamUrl: project.outputStreamUrl,
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
    }));
    return getResponse(project);
  }
}
