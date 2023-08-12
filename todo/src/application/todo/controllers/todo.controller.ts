import { Controller, Post, Get, Delete, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../domain/common/guards/jwtAuth.guard';
import { CreateTodoDto, DeleteTodoDto } from '../dtos/todo.dto';
import { TodoService } from '../../../domain/todo/services/todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createTodo(@Request() req, @Body() createTodoDto: CreateTodoDto): Promise<{ id: string }> {
    const ownerId = req.user.id;
    const { id } = await this.todoService.createTodo(ownerId, createTodoDto);
    return { id };
  }

  @Get('/get')
  @UseGuards(JwtAuthGuard)
  async getTodos(@Request() req): Promise<{ id: string, title: string, description: string }[]> {
    const ownerId = req.user.id;
    const todos = await this.todoService.getTodosByOwner(ownerId);
    return todos.map(({ _id, title, description }) => ({
      id: _id,
      title,
      description,
    }));
  }

  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  async deleteTodo(@Request() req, @Body() deleteTodoDto: DeleteTodoDto): Promise<{ id: string }> {
    const ownerId = req.user.id;
    const { id } = await this.todoService.deleteTodoById(ownerId, deleteTodoDto);
    return { id };
  }
}
