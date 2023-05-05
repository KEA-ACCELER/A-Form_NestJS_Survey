import { UserResponseDto } from '@/common/dto/user-response.dto';
import { UserEndpoint } from '@/common/enum';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const { data }: { data: UserResponseDto } = await firstValueFrom(
      this.httpService
        .get(`${process.env.USER_HOSTNAME}/${UserEndpoint.GET_USER_INFO_URI}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError((error: any) => {
            if (error?.response?.status === HttpStatus.FORBIDDEN) {
              throw new UnauthorizedException();
            }

            throw new InternalServerErrorException('User API Connection Err');
          }),
        ),
    );

    request['user'] = data;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
