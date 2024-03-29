import { User } from 'src/modules/user/entity/user.entity';
import { TeamController } from './controller/team.controller';
import { Team } from './entity/team.entity';
import { Teams } from './entity/teams.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TeamService } from './service/team.service';
import { ChatModule } from '../chat/chat.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Teams, Team]),
        ChatModule
    ],
    controllers: [TeamController],
    providers: [TeamService],
    exports: [TeamService]
})
export class TeamModule {}
