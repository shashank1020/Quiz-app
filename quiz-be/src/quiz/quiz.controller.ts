import {Body, Controller, Delete, Get, Patch, Post, UseGuards} from '@nestjs/common';
import { QuizService } from './quiz.service';
import QuizEntity from './quiz.entity';
import UserEntity from '../user/user.entity';
import AuthGuard from '../guard/auth.guard';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get('/')
  async getAll(): Promise<QuizEntity[]> {
    return this.quizService.getAll();
  }

  @Post('/')
  @UseGuards(AuthGuard)
  async createQuiz(@Body() body: any) {
    return this.quizService.createQuiz(body, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async updateQuiz(@Body() body: any){

  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteQuiz(){

  }

  @Post('evaluate')
  async evaluate(@Body() body: any){

  }
}
