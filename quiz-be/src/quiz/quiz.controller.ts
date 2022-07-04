import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuizService } from './quiz.service';
import QuizEntity from './entity/quiz.entity';
import UserEntity from '../user/entity/user.entity';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get()
  async getAll(): Promise<QuizEntity[]> {
    return this.quizService.getAll();
  }

  @Post()
  async createQuiz(@Body() body: QuizEntity): Promise<QuizEntity> {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user: UserEntity = {
      id: 1,
      email: 'user1@email.com',
      password: 'sjdnf',
    };
    return await this.quizService.createQuiz(body, user);
  }
}
