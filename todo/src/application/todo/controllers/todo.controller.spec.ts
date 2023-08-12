import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TodoController } from './todo.controller';
import { TodoService } from '../../../domain/todo/services/todo.service';
import { Task } from '../../../domain/todo/entities/task.entity';

describe('TodoController', () => {
  const testId = 'test-id';
  const testTitle = 'Test Title';
  const testDescription = 'Test Description';
  const ownerId = 'user-id';

  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        {
          provide: getModelToken(Task.name),
          useValue: {
            find: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  describe('createTodo', () => {
    it('should create a new todo and return its id', async () => {
      const result = { id: testId };
      const createTodoDto = { title: testTitle, description: testDescription };

      const req = { user: { id: ownerId } };
      jest.spyOn(todoService, 'createTodo').mockResolvedValue(result);

      expect(await todoController.createTodo(req, createTodoDto))
        .toStrictEqual(result);
    });
  });

  describe('getTodos', () => {
    it('should return an array of todos', async () => {
      const req = { user: { id: ownerId } }

      const todo = 
        { _id: '1', title: testTitle, description: testDescription}
      const todoResult = 
        { id: '1', title: testTitle, description: testDescription}

      const todos = [todo] as Task[];
      const result = [todoResult];

      jest.spyOn(todoService, 'getTodosByOwner').mockResolvedValue(todos);

      expect(await todoController.getTodos(req))
        .toEqual(result);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo and return its id', async () => {
      const req = { user: { id: ownerId } }
      jest.spyOn(todoService, 'deleteTodoById')
        .mockResolvedValue({ id: testId });

      expect(await todoController.deleteTodo(req, { id: testId }))
        .toEqual({ id: testId });
    });
  });
});
