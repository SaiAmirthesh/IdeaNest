import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, ValidateNested, IsObject, IsEnum, IsDate, IsUUID, IsEmail, IsUrl, IsNotEmpty, Length, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';


export class GetIdeasQueryDto {

    @Type(() => Number)
    @IsOptional()
    @Min(1)
    page: number = 1;

    @Type(() => Number)
    @IsOptional()
    @Min(1)
    @Max(100)
    limit: number = 10;
}