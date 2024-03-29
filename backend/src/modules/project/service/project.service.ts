import { Statuses } from './../../constants/Statuses.enum';
import { CreateProjectDto, UpdateProjectDto } from './../dto/project.dto';
import { Project } from './../entity/project.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Injectable, HttpException, HttpStatus, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from 'src/modules/team/entity/team.entity';
import { ProjectTeams } from '../entity/project_teams.entity';
import { Row } from '../entity/row.entity';
import { CreateRowDto, UpdateRowDto } from '../dto/row.dto';
import { ChatService } from 'src/modules/chat/service/chat.service';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(User)
        private userModel: Repository<User>,
        @InjectRepository(Project)
        private projectModel: Repository<Project>,
        @InjectRepository(Team)
        private teamModel: Repository<Team>,
        @InjectRepository(ProjectTeams)
        private projectTeamsModel: Repository<ProjectTeams>,
        @InjectRepository(Row)
        private rowModel: Repository<Row>,
        private chatService: ChatService
    ) {}

    async getAll() {
        return await this.projectModel.find({
            relations: [
                'project_creator',
                'tasks',
                'badges',
                'teams',
                'teams.team'
            ]
        })
    }
    
    async getProjectById(id: number) {
        return await this.projectModel.findOne({
            where: { id: id },
            relations: [
                'project_creator',
                'tasks',
                'tasks.row',
                'tasks.badge',
                'badges',
                'teams',
                'teams.team',
                'rows',
                'rows.tasks'
            ],
        })
    }

    async createRow (row: CreateRowDto) {
        const newRow = await this.rowModel.create({
            row_name: row.row_name,
            project: row.project,
            row_count: row.count
        })
        let project = await this.projectModel.findOne({
            where: {
                id: newRow.project
            }
        })
        let response: Row = await newRow.save()
        await this.chatService.CreateNotification({
            user_id: project.project_creator,
            content: `${row.row_name} was created`,
            type: "project"
        })

        return await this.rowModel.findOne({
            where: {id: response.id},
            relations: [
                'project',
                'tasks'
            ]
        })
    }

    async updateRow(column: UpdateRowDto, id:number) {
        const editCol: Row = await this.rowModel.findOne({ 
            where: { id: id},
        })
        let project = await this.projectModel.findOne({
            where: {
                id: editCol.project
            }
        })
        if(!editCol || !project) 
            throw new HttpException({
                message: 'The given id is not valid',
                status: HttpStatus.BAD_REQUEST
            }, HttpStatus.BAD_REQUEST);
        editCol.row_name = column.row_name
        editCol.project = column.project
        editCol.row_count = column.count
        let response = await editCol.save()
        await this.chatService.CreateNotification({
            user_id: project.project_creator,
            content: `${column.row_name} was edited`,
            type: "project"
        })
        return response
    }

    async deleteRow(id: number) {
        let found = await this.rowModel.findOne({
            where: {id: id}
        })
        let project = await this.projectModel.findOne({
            where: {
                id: found.project
            }
        })
        if(!found || !project) return HttpStatus.BAD_REQUEST
        await this.rowModel.remove(found)
        // await this.rowModel
        //     .createQueryBuilder()
        //     .delete()
        //     .from(Project)
        //     .where('id = :id', { id: id })
        //     .execute()
        await this.chatService.CreateNotification({
            user_id: project.project_creator,
            content: `${found.row_name} was removed`,
            type: "project"
        })
    }

    async createProject (project: CreateProjectDto) {
        const newProject = await this.projectModel.create({
            project_name: project.project_name,
            project_description: project.project_description,
            project_creator: project.project_creator,
            project_only_creator: project.project_only_creator,
            project_img_url: "",
            project_status: Statuses.OPEN
        })
        let response: Project = await newProject.save()

        return await this.projectModel.find({
            where: {id: response.id},
            relations: [
                'project_creator',
                'teams',
                'teams.team'
            ]
        })
    }

    async addProjectTeam (req: any) {
        const teamSearch = await this.teamModel.findOne({ where: {id: req.team}})
        if(!teamSearch) 
            throw new HttpException({
                message: 'The given team id is not valid',
                status: HttpStatus.BAD_REQUEST
            }, HttpStatus.BAD_REQUEST)
        
        const projectSearch = await this.projectModel.findOne({ where: {id: req.project}})
        if(!projectSearch) 
            throw new HttpException({
                message: 'The given project id is not valid',
                status: HttpStatus.BAD_REQUEST
            }, HttpStatus.BAD_REQUEST)

        let response: any = await this.projectTeamsModel.create({
            project: req.project,
            team: req.team
        }).save()

        await this.chatService.CreateNotification({
            user_id: projectSearch.project_creator,
            content: `${teamSearch.team_name} was added to ${projectSearch.project_name}`,
            type: "project"
        })

        return response
    }

    async deleteProjectTeam (id) {
        if(!id) return HttpStatus.BAD_REQUEST
        const connectionSearch = await this.projectTeamsModel.findOne({
            where: {
                id: id
            }
        })

        if(!connectionSearch) return HttpStatus.CONFLICT
        
        await this.projectTeamsModel.remove(connectionSearch)
    }

    async updateProject(project: UpdateProjectDto, id:number) {
        const editProject: Project = await this.projectModel.findOne({ where: { id: id}})
        editProject.project_name = project.project_name
        editProject.project_description = project.project_description
        editProject.project_only_creator = project.project_only_creator
        if(project.project_creator) editProject.project_creator = project.project_creator
        if(project.status) editProject.project_status = project.status === "open" ? Statuses.OPEN : Statuses.CLOSED
        let response = await editProject.save()
        await this.chatService.CreateNotification({
            user_id: editProject.project_creator,
            content: `${editProject.project_name} was edited`,
            type: "project"
        })
        return response
    }

    async deleteProject(id: number) {
        let project = await this.projectModel.findOne({
            where: {id: id}
        })
        if(!project) return HttpStatus.BAD_REQUEST

        await this.projectModel
            .createQueryBuilder()
            .delete()
            .from(Project)
            .where('id = :id', { id: id })
            .execute()
        await this.chatService.CreateNotification({
            user_id: project.project_creator,
            content: `${project.project_name} was removed`,
            type: "project"
        })
    }

    async getAllUserInfoById(id: number) {
        if(isNaN(id)) throw new HttpException({
            message: 'The given ID is not correct',
            status: HttpStatus.BAD_REQUEST,
        }, HttpStatus.BAD_REQUEST)

        return await this.userModel
            .findOne({
                where: {id: id},
                relations: [
                    'created_projects',
                    'created_projects.tasks',
                    'created_projects.badges',
                    'created_projects.badges.task',
                    'created_projects.badges.task.task',
                    'created_projects.teams',
                    'created_projects.teams.team',
                    'created_teams',
                    'created_teams.membership',
                    'created_teams.projects',
                    'created_teams.projects.project',
                    'created_tasks',
                    'created_tasks.project',
                    'created_tasks.joined_user',
                    'created_tasks.joined_user.user',
                    'created_badges',
                    'created_badges.project',
                    'created_badges.task',
                    'created_badges.task.task',
                    'team_member',
                    'team_member.team',
                    'team_member.team.projects',
                    'team_member.team.projects.project',
                    'tasks',
                ]
            })
    }
}
