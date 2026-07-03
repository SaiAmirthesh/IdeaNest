import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, ValidateNested, IsObject, IsEnum, IsDate, IsUUID, IsEmail, IsUrl, IsNotEmpty, Length, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IdeaStatus } from '../model/idea-status.model';

export class IdeaResponseDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    @ApiProperty({ example: "clz8w4m0j0000abc123", description: 'Unique identifier' })
    readonly id!: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    @ApiProperty({ example: "BuildFlow AI", description: 'Title of the entity' })
    readonly title!: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    @ApiProperty({ example: "AI operating system for product development", description: 'Detailed description' })
    readonly description!: string;

    @ApiProperty({ enum: IdeaStatus, example: IdeaStatus.THINKING, description: "Current status of the idea", })
    @IsEnum(IdeaStatus, {
        message: "Status must be one of SEED,THINKING, BUILDING, DORMANT, COMPLETED,ARCHIEVED",
    })
    readonly status!: IdeaStatus;

    @IsNotEmpty()
    @IsString()
    @IsDate()
    @Length(1, 100)
    @ApiProperty({ example: "2026-07-02T13:25:11.215Z", description: 'Creation timestamp', format: 'date-time' })
    readonly createdAt!: Date;

    @IsNotEmpty()
    @IsString()
    @IsDate()
    @Length(1, 100)
    @ApiProperty({ example: "2026-07-02T13:25:11.215Z", description: 'Last update timestamp', format: 'date-time' })
    readonly updatedAt!: Date;
}