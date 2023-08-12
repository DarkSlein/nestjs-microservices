import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TodoSchema } from './entities/task.entity';
import { TodoService } from './services/todo.service';
import { TodoController } from '../../application/todo/controllers/todo.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TodoSchema }])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
