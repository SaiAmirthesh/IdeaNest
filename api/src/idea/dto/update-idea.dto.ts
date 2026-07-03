import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, ValidateNested, IsObject, IsEnum, IsDate, IsUUID, IsEmail, IsUrl, IsNotEmpty, Length, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IdeaStatus } from '../model/idea-status.model';

export class UpdateIdeaDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    @ApiProperty({ example: "Idea Storage", description: 'Title of the entity' })
    readonly title!: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    @ApiProperty({ example: "A Idea storing workspace with spontaneous notes", description: 'Detailed description' })
    readonly description!: string;

    @ApiProperty({ enum: IdeaStatus, example: IdeaStatus.THINKING, description: "Current status of the idea", })
    @IsEnum(IdeaStatus, {
        message: "Status must be one of SEED,THINKING, BUILDING, DORMANT, COMPLETED,ARCHIEVED",
    })
    readonly status!: IdeaStatus;
}