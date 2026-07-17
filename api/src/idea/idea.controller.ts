import { Body,
  Controller,
  Delete,
  Req,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,} from '@nestjs/common';
  import type { Request } from "express";

import { auth } from "../auth/auth";
import { IdeaService } from './idea.service';
import { IdeaResponseDto } from './dto/idea-response.dto';
import { IdeaMapper } from './mapper/idea.mapper';
import { PaginatedResponseDto } from './dto/page-response.dto';
import { GetIdeasQueryDto } from './dto/get-idea.dto';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
@Controller('ideas')
export class IdeaController {

    constructor(private readonly ideaService :IdeaService){}

    @Post()
    @HttpCode(201)
    async createIdea(@Req() req: Request, @Body() dto:CreateIdeaDto):Promise<IdeaResponseDto>{
        const session = await auth.api.getSession({
            headers:req.headers,
        });
        if(!session){
            throw new UnauthorizedException();
        } 

        const idea = IdeaMapper.fromCreateDto(dto,session.user.id);
        const created = await this.ideaService.createIdea(idea);
        return IdeaMapper.toResponseDto(created);
    }

    @Put(':id')
    @HttpCode(200)
    async updateIdea(@Req() req:Request,@Param('id') id:string,@Body() dto:UpdateIdeaDto):Promise<IdeaResponseDto>{
        const session = await auth.api.getSession({
            headers:req.headers,
        });
        if(!session){
            throw new UnauthorizedException();
        } 
        const existing = await this.ideaService.findById(session.user.id,id);
        const idea = IdeaMapper.fromUpdateDto(existing,dto);
        const updated = await this.ideaService.updateIdea(session.user.id,id,idea);
        return IdeaMapper.toResponseDto(updated);
    }

    @Get()
    async getIdeas(@Req() req:Request,@Query() query:GetIdeasQueryDto):Promise<PaginatedResponseDto<IdeaResponseDto>>{
        const session = await auth.api.getSession({
            headers:req.headers,
        });
        if(!session){
            throw new UnauthorizedException();
        } 
        
        const result = await this.ideaService.findAll(session.user.id,query);
        return {
            ...result,
            data: result.data.map(IdeaMapper.toResponseDto),
        };
    }

    @Get(':id')
    async getIdeaById (@Req() req:Request, @Param('id') id:string):Promise<IdeaResponseDto>{
        const session = await auth.api.getSession({
            headers:req.headers,
        });
        if(!session){
            throw new UnauthorizedException();
        } 
        const found = await this.ideaService.findById(session.user.id,id);
        return IdeaMapper.toResponseDto(found);
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteIdea(@Req() req:Request, @Param('id') id:string):Promise<void>{
        const session = await auth.api.getSession({
            headers:req.headers,
        });
        if(!session){
            throw new UnauthorizedException();
        }
        await this.ideaService.deleteIdea(session.user.id,id);
    }
}
