import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../entities/task.entity';
import { CreateTodoDto, DeleteTodoDto } from '../../../application/todo/dtos/todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<Task>) {}

  async createTodo(owner: string, createTodoDto: CreateTodoDto): Promise<{ id: string }> {
    const todo = await this.taskModel.create({ ...createTodoDto, owner });
    const createdTodo = await todo.save();

    return { id: createdTodo._id };
  }

  async getTodosByOwner(owner: string): Promise<Task[]> {
    return this.taskModel.find({ owner }).exec();
  }

  async deleteTodoById(owner: string, deleteTodoDto: DeleteTodoDto): Promise<{ id: string }> {
    const { id } = deleteTodoDto;

    const deletedTodo = await this.taskModel.deleteOne({ _id: id, owner });

    if (deletedTodo.deletedCount === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  
    return { id };
  }
}
