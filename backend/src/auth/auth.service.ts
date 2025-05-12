import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      // 🕵️‍♂️ Verifica si ya existe un usuario con ese email
      const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
  
      if (existingUser) {
        // ⚠️ Si ya existe, solo devuelve un token para no crear duplicados
        return {
          message: 'Usuario ya existe',
          token: this.getJwtToken({
            id: existingUser.id,
            name: existingUser.fullName,
          }),
        };
      }
  
      // 🔐 Si no existe, separamos la contraseña y los demás datos
      const { password, ...userData } = createUserDto;
  
      // 🧂 Hasheamos la contraseña antes de guardarla
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
  
      // 💾 Guardamos el nuevo usuario en la base de datos
      await this.userRepository.save(user);
  
      // 🎫 Devolvemos al usuario junto con su JWT
      return {
        ...user,
        token: this.getJwtToken({
          id: user.id,
          name: user.fullName,
        }),
      };
    } catch (error) {
      // 🔥 En caso de error, lanzamos una excepción amigable
      throw new BadRequestException(error);
    }
  }
  

  async login(loginUserDto: LoginUserDto){
    const {password, email} = loginUserDto
    const user = await this.userRepository.findOne({
      where: {email},
      select: {id:true, fullName:true, email: true, password: true}
    })
    if(!user)
      throw new UnauthorizedException('Correo no valido')
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Contraseña no valida')
    return {uid: user.id, name: user.fullName, token: this.getJwtToken({id: user.id, name: user.fullName})}
  }

  async checkAuthStatus(user){
    return {uid: user.id, name: user.fullName, token: this.getJwtToken({id: user.id, name: user.fullName})}
  }

  private getJwtToken( payload: JwtPayload ){
    const token = this.jwtService.sign( payload )
    return token
  }
}
