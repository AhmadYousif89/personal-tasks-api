import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsOptional()
  status: 'Todo' | 'InProgress' | 'Completed';

  @IsString()
  @IsOptional()
  priority: 'Normal' | 'High';

  @IsString()
  @IsOptional()
  expireDate: string;
}
