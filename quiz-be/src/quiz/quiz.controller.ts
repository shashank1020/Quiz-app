import {
  Body,
  Controller,
  Request,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  Param,
  Query,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import AuthGuard from '../guard/auth.guard';
import {
  createQuizSchema,
  evaluateSchema,
  joiValidate,
  updateQuizSchema,
} from '../lib/validator';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @HttpCode(200)
  @Get('/')
  getAll(@Query('page') page: number) {
    return this.quizService.getAll(page);
  }

  @HttpCode(200)
  @Get('/user-quiz')
  @UseGuards(AuthGuard)
  getAllUserQuiz(@Query('page') page: number, @Request() req) {
    return this.quizService.getAll(page, req);
  }

  @Get('/:permalink')
  getByPeramlink(@Param('permalink') permalink: string) {
    return this.quizService.getQuiz(permalink);
  }
  @Get('/edit/:permalink')
  @UseGuards(AuthGuard)
  getByUserPermalink(@Param('permalink') permalink: string, @Request() req) {
    return this.quizService.getQuiz(permalink, req.user);
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  async createQuiz(@Body() body, @Request() req) {
    joiValidate(createQuizSchema, body);
    return this.quizService.createQuiz(body, req.user);
  }

  @Patch('/:permalink')
  @UseGuards(AuthGuard)
  async updateQuiz(
    @Param('permalink') permalink,
    @Body() body: any,
    @Request() req,
  ) {
    joiValidate(updateQuizSchema, body);
    return this.quizService.updateQuiz(permalink, body, req.user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteQuiz(@Param('id') id: string, @Request() req) {
    return this.quizService.deleteQuiz(Number(id), req.user);
  }

  @HttpCode(200)
  @Post('evaluate/:permalink')
  async evaluate(@Param('permalink') permalink, @Body() body: any) {
    joiValidate(evaluateSchema, body);
    return this.quizService.evaluateQuiz(permalink, body.questions);
  }
}
