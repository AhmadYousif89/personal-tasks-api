import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class EditTaskDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  details: string;

  @IsString()
  @IsOptional()
  status: 'Todo' | 'InProgress' | 'Completed';

  @IsString()
  @IsOptional()
  priority: 'Normal' | 'High';

  @IsBoolean()
  @IsOptional()
  isExpired: boolean;
}
