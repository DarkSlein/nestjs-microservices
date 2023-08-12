import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TodoService } from './todo.service';
import { Task } from '../entities/task.entity';

describe('TodoService', () => {
  const testId = 'test-id';
  const testTitle = 'Test Title';
  const testDescription = 'Test Description';
  const ownerId = 'user-id';

  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getModelToken(Task.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
  });

  describe('createTodo', () => {
    it('should create a new todo and return its id', async () => {
      const result = { id: testId };
      const createTodoDto = { title: testTitle, description: testDescription };

      const createMock = { save: jest.fn().mockResolvedValue({ _id: testId }) }
      jest.spyOn(todoService['taskModel'], 'create')
        .mockResolvedValue(createMock as any);

      expect(await todoService.createTodo(ownerId, createTodoDto))
        .toStrictEqual(result);
    });
  });

  describe('getTodosByOwner', () => {
    it('should return an array of todos', async () => {
      const todos = 
        [{ _id: '1', title: testTitle, description: testDescription }];

      jest.spyOn(todoService['taskModel'], 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(todos),
      } as any);

      expect(await todoService.getTodosByOwner(ownerId)).toEqual(todos);
    });
  });

  describe('deleteTodoById', () => {
    it('should delete a todo by id', async () => {
      jest.spyOn(todoService['taskModel'], 'deleteOne')
        .mockResolvedValue({ _id: testId } as any);

      expect(await todoService.deleteTodoById(ownerId, { id: testId }))
        .toEqual({ id: testId });
    });
  });
});
