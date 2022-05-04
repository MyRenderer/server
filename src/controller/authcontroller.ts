import { Authorized, BadRequestError, Body, HttpCode, JsonController, NotFoundError, Post, UnauthorizedError } from 'routing-controllers';
import { StatusCodes } from 'http-status-codes';
import { User } from '../entity/user';
import { getRepository } from '../component/db';
import { CreateUserRequest, LoginRequest, RoleResponse, TokenResponse, UserResponse } from '../component/types';
import { Role } from '../entity/role';
import { generateToken, hash, verify } from '../component/util';

function getRoleResponse(role: Role): RoleResponse {
  return {
    id: role.id,
    name: role.name,
  };
}

function getUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    username: user.username,
    roles: user.roles.map(getRoleResponse),
  };
}

@JsonController()
export class AuthController {
  private readonly userRepository = getRepository(User);
  private readonly roleRepository = getRepository(Role);

  @Post(`/v1/token`)
  @HttpCode(StatusCodes.OK)
  public async login (@Body() request: LoginRequest): Promise<TokenResponse> {
    const username = request.username;
    const password = request.password;

    const user = await this.userRepository.findOne({ username: username });
    if (!user) {
      throw new NotFoundError(`User not found: ${username}`);
    }
    if (!user.password) {
      throw new UnauthorizedError('Password cannot be empty');
    }
    if (!await verify(password, user.password)) {
      throw new UnauthorizedError('Password is incorrect');
    }
    return {
      token: generateToken(user)
    };
  }

  @Post(`/v1/users`)
  @Authorized(['root_user'])
  @HttpCode(StatusCodes.CREATED)
  public async create(@Body() request: CreateUserRequest): Promise<UserResponse> {
    const username = request.username;
    const password = await hash(request.password);

    // Ensure username is not repeated
    if (await this.userRepository.findOne({ username: username })) {
      throw new BadRequestError('username_existed');
    }

    // insert into database
    const user = await this.userRepository.save(this.userRepository.create({
      username: username,
      password: password,
      roles: request.roles.map(role => this.roleRepository.create({
        name: role
      }))
    }));

    return getUserResponse(user);
  }
}
