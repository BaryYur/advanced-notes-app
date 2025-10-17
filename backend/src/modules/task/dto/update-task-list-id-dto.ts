import { IsString } from "class-validator";

export class UpdateTaskListIdDto {
  @IsString()
  taskListId: string;
}
