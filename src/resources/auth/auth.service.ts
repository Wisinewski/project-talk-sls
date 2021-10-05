import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { username, email } = signUpDto
    const existsUser = await this.userRepository.findOne({ email })
    if (existsUser) {
      throw new Error()
    }
    const user = this.userRepository.create(signUpDto)
    const token = this.jwtService.sign({ username, email })
    await this.userRepository.save(user)
    return {
      id: user.id,
      username,
      email,
      token
    }
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto
    const user = await this.userRepository.findOne({ email })
    if (!user) {
      throw new NotFoundException()
    }
    if (!(await compare(password, user.password))) {
      throw new Error()
    }
    const token = this.jwtService.sign({
      username: user.username,
      email
    })
    return { token }
  }
}
