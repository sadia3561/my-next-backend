import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  permissions?: string[];
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  permissions?: string[];
}
/* 2049 9818
4659 3339
3034 2600
2178 1035
9930 9518
8004 7405
8084 4435
5017 1225
8336 9922
4877 0151 */