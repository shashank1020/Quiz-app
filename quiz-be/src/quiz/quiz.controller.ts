import {
  Body,
  Controller,
  Request,
  Delete,
  Get,
  Post,
  UseGuards,
  Param,
  Query,
  HttpCode,
  SetMetadata,
  Req,
  Put,
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

  @Get('/')
  @SetMetadata('optionalAuth', true)
  @UseGuards(AuthGuard)
  getAll(@Query('page') page: number, @Req() req) {
    return this.quizService.getAll(page, req.user);
  }

  @Get('/:permalink')
  @SetMetadata('optionalAuth', true)
  @UseGuards(AuthGuard)
  getByPermalink(@Param('permalink') permalink: string, @Req() req) {
    return this.quizService.getQuiz(permalink, req.user);
  }

  @Post('/')
  @UseGuards(AuthGuard)
  async createQuiz(@Body() body, @Request() req) {
    joiValidate(createQuizSchema, body);
    return this.quizService.createQuiz(body, req.user);
  }

  @Put('/:permalink')
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
  @Post('/evaluate/:permalink')
  async evaluate(@Param('permalink') permalink, @Body() body: any) {
    joiValidate(evaluateSchema, body);
    return this.quizService.evaluateQuiz(permalink, body.questions);
  }
}
