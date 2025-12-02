import { Controller, Get, Post, Body } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getTodos() {
    return await this.todosService.getTodos();
  }

  @Post()
  async addTodo(@Body() body: { task: string; user_id: string }) {
    return await this.todosService.addTodo(body.task, body.user_id);
  }
}
