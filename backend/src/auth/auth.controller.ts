import { Controller, Get, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @Auth()
  testingPrivateRoute( @GetUser() user: User, @GetUser('email') userEmail: string){
    return {
      ok: true,
      message: 'Hola mundo',
      user, 
      userEmail
    }
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus( @GetUser() user: User){
    console.log("Entraronm")
    return this.authService.checkAuthStatus( user )
  }

}
