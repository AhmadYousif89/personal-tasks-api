import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { PrismaService } from './../src/prisma/prisma.service';
import { AppModule } from './../src/app.module';
import { AuthRegisterDto } from './../src/auth/dto';
import { EditUserDto } from './../src/user/dto';
import { EditTaskDto, TaskDto } from 'src/task/dto';

describe('\nTesting App e2e\n---------------------------', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const appModuleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModuleRef
      .createNestApplication()
      .useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(4000);

    prisma = app.get(PrismaService);
    await prisma.cleanDbByOrder();
    pactum.request.setBaseUrl('http://localhost:4000');
  });

  afterAll(() => {
    app.close();
  });

  const getAuth = (key: string) => ({
    Authorization: `Bearer $S{${key}}`,
  });

  describe('\nAUTH Route\n---------------------------', () => {
    const dto: AuthRegisterDto = {
      name: 'user',
      email: 'user@test.com',
      password: 'test123',
    };

    describe('Register', () => {
      it('should throw error with status 400 if no body was attached on the request', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw error with status 400 if no name was provided in the body', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withBody({ email: dto.email, password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw error with status 400 if no email was provided in the body', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withBody({ name: dto.name, password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw error with status 400 if password was less than 3 characters', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withBody({ name: dto.name, password: '1' })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw error if password was empty', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withBody({ name: dto.name, email: dto.email })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should create new user', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains({ message: 'user created' });
      });

      it('should throw error if credentials already exist', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withBody({
            name: dto.name,
            email: dto.email,
            password: dto.password,
          })
          .expectStatus(HttpStatus.CONFLICT)
          .expectBodyContains({
            statusCode: 409,
            message: 'Email already exist',
          });
      });
    });

    describe('Login', () => {
      it('should throw error if email is empty', async () => {
        await pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw error if password is empty', async () => {
        await pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: dto.email })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw error if email is not valid email', async () => {
        await pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: 'any@.', password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectBodyContains({
            statusCode: 400,
            message: ['email must be an email'],
            error: 'Bad Request',
          });
      });

      it('should throw error if credentials are not valid', async () => {
        await pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: dto.email, password: '123' })
          .expectStatus(HttpStatus.UNAUTHORIZED)
          .expectBodyContains({
            statusCode: 401,
            message: 'Invalid credentials',
          });
      });

      it('should login with cookie', async () => {
        await pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains({ message: 'user logged in' });
      });
    });

    describe('Refresh', () => {
      it('should refresh and get new access token', async () => {
        await pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .stores('JWT', 'req.headers["set-cookie"]');

        return pactum
          .spec()
          .get('/auth/refresh')
          .withCookies('jwt', '$S{JWT}')
          .expectStatus(200);
      });

      xit('should throw error if cookie not found', async () => {
        await pactum
          .spec()
          .get('/auth/refresh')
          .expectStatus(HttpStatus.FORBIDDEN);
      });

      xit('should throw error if refresh token not of type Bearer', async () => {
        await pactum
          .spec()
          .get('/auth/refresh')
          .withCookies('jwt', 'S{jwt}')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
    });

    xdescribe('Logout', () => {
      it('should throw error if access token not provided', async () => {
        await pactum
          .spec()
          .post('/auth/logout')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should throw error if access token not of type Bearer', async () => {
        await pactum
          .spec()
          .post('/auth/logout')
          .withHeaders({ Authorization: '$S{user_AT}' })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should log user out', async () => {
        await pactum
          .spec()
          .post('/auth/logout')
          .withHeaders(getAuth('user_AT'))
          .expectStatus(HttpStatus.OK)
          .expectBodyContains({ message: 'Cookie cleared' });
      });

      it('it should throw error if user logged out and then tries to access protected route', async () => {
        await pactum
          .spec()
          .get('/users/me')
          .withHeaders(getAuth('user_AT'))
          .expectStatus(HttpStatus.FORBIDDEN)
          .expectBodyContains('Access denied');
      });

      it('should log user back in', async () => {
        await pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(HttpStatus.OK);
      });
    });
  });

  xdescribe('\nUSER Route\n---------------------------', () => {
    const user: EditUserDto = {
      name: 'testUser',
      email: 'testUser@test.com',
      password: 'test-pass-123',
    };

    it('should get users route with status code 200', async () => {
      await pactum.spec().get('/users').expectStatus(HttpStatus.OK);
    });

    describe('Get all users', () => {
      it('sholud get all registered users', async () => {
        await pactum.spec().get('/users').expectStatus(HttpStatus.OK);
      });
    });

    describe('Get me', () => {
      it('should get current logged user', async () => {
        await pactum
          .spec()
          .get('/users/me')
          .withHeaders(getAuth('user_AT'))
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Update user', () => {
      it('should not update user if no body content was provided', async () => {
        await pactum
          .spec()
          .patch('/users/me')
          .withHeaders(getAuth('user_AT'))
          .expectStatus(HttpStatus.OK);
      });

      it('should throw error if password length is less than 3 characters', async () => {
        await pactum
          .spec()
          .patch('/users/me')
          .withBody({ password: '1' })
          .withHeaders(getAuth('user_AT'))
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should update just user name', async () => {
        await pactum
          .spec()
          .patch('/users/me')
          .withHeaders(getAuth('user_AT'))
          .withBody({ name: user.name })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(user.name)
          .expectBodyContains('user@test.com');
      });

      it('should update just user email', async () => {
        await pactum
          .spec()
          .patch('/users/me')
          .withHeaders(getAuth('user_AT'))
          .withBody({ email: user.email })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(user.name)
          .expectBodyContains(user.email);
      });

      it('should update just user password', async () => {
        await pactum
          .spec()
          .patch('/users/me')
          .withHeaders(getAuth('user_AT'))
          .withBody({ password: user.password })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(user.name)
          .expectBodyContains(user.email);
      });

      it('should log user in with the updated email', async () => {
        await pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: user.email, password: user.password })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Delete user', () => {
      it('should throw error if no access token provided', async () => {
        await pactum
          .spec()
          .delete('/users/me')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should throw error if access token was not of type Bearer', async () => {
        await pactum
          .spec()
          .delete('/users/me')
          .withHeaders({
            Authorization: `$S{user_AT}`,
          })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should delete current logged user', async () => {
        await pactum
          .spec()
          .delete('/users/me')
          .withHeaders(getAuth('user_AT'))
          .expectStatus(HttpStatus.OK)
          .expectBody({
            success: true,
            message: 'User deleted',
          });
      });
    });

    describe('Create new user', () => {
      const user: AuthRegisterDto = {
        name: 'user',
        email: 'user@test.com',
        password: 'test123',
      };

      it('should create new user', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withBody(user)
          .expectStatus(HttpStatus.CREATED)
          .stores('user_AT', 'accessToken')
          .stores('user_Rt', 'refreshToken');
      });
    });
  });

  xdescribe('\\TASK Route\n---------------------------', () => {
    const task: TaskDto = {
      title: 'Nest.js Rest API',
      details:
        'A progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
      status: 'Todo',
      priority: 'Normal',
    };

    describe('Create task', () => {
      it('should create new task', async () => {
        await pactum
          .spec()
          .post('/tasks')
          .withBody(task)
          .withHeaders(getAuth('user_AT'))
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(task.title)
          .expectBodyContains(task.details)
          .expectBodyContains(task.status)
          .expectBodyContains(task.priority)
          .stores('task_id', 'id')
          .stores('user_task_id', 'userId');
      });
    });

    it('should get all user tasks', async () => {
      await pactum
        .spec()
        .get('/tasks')
        .expectStatus(HttpStatus.OK)
        .withHeaders(getAuth('user_AT'))
        .expectJsonLength(1)
        .expectJsonLike([{ ...task }]);
    });

    describe('Get task by id', () => {
      it('should get one task by given id', async () => {
        await pactum
          .spec()
          .get('/tasks/{id}')
          .withHeaders(getAuth('user_AT'))
          .withPathParams({ id: `$S{task_id}` })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(task.title)
          .expectBodyContains(task.details);
      });
    });

    describe('Update task by id', () => {
      const task: EditTaskDto = {
        title: 'Testing in Nest.js',
        details: 'N/A',
        status: 'InProgress',
        priority: 'High',
      };

      it("should throw error if a user tries to update a task that doesn't exist", async () => {
        await pactum
          .spec()
          .patch('/tasks/tsk_36d6deae-490e-45c9-adba-8cc2e875f86d')
          .withHeaders(getAuth('user_AT'))
          .withPathParams({ id: 'tsk_36d6deae-490e-45c9-adba-8cc2e875f86d' })
          .expectStatus(HttpStatus.NOT_FOUND)
          .expectBodyContains({
            statusCode: 404,
            message: 'Task not found',
          });
      });

      it('should not update if no body content provided', async () => {
        await pactum
          .spec()
          .patch('/tasks/{id}')
          .withHeaders(getAuth('user_AT'))
          .withPathParams({ id: '$S{task_id}' })
          .expectStatus(HttpStatus.OK);
      });

      it('should update just the task title', async () => {
        await pactum
          .spec()
          .patch('/tasks/{id}')
          .withHeaders(getAuth('user_AT'))
          .withBody({ title: task.title })
          .withPathParams({ id: '$S{task_id}' })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(task.title);
      });

      it('should update just the task details', async () => {
        await pactum
          .spec()
          .patch('/tasks/{id}')
          .withHeaders(getAuth('user_AT'))
          .withPathParams({ id: '$S{task_id}' })
          .withBody({ details: task.details })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(task.details);
      });
    });

    describe('Delete task by id', () => {
      it("should throw error if a user tries to delete a task that doesn't exist", async () => {
        await pactum
          .spec()
          .delete('/tasks/tsk_36d6deae-490e-45c9-adba-8cc2e875f86d')
          .withHeaders(getAuth('user_AT'))
          .withPathParams({ id: 'tsk_36d6deae-490e-45c9-adba-8cc2e875f86d' })
          .expectStatus(HttpStatus.NOT_FOUND)
          .expectBodyContains({
            statusCode: 404,
            message: 'Task not found',
          });
      });

      it('should delete task by given id', async () => {
        await pactum
          .spec()
          .delete('/tasks/{id}')
          .withHeaders(getAuth('user_AT'))
          .withPathParams({ id: '$S{task_id}' })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains({
            success: true,
            message: 'Task deleted',
          });
      });
    });
  });
});
