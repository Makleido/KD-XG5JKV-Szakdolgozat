import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/service/user.service';
import { comparePassword } from 'src/modules/utils/bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,    
    ) {}

    async validateUser(email:string, password: string) {
        const userDB = await this.userService.findUserByEmail(email);
        if(userDB){
            const matched = comparePassword(password, userDB.password);
            if (matched){
                return userDB;
            }
            return null;
        }
        return null;
    }

    async login(user: User) {
        const load = {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            status: user.status
            // password: user.password,
        };
        return {
            access_token: this.jwtService.sign(load),
        };
    }
}
