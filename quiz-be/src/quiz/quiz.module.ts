import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import QuizEntity from './entity/quiz.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from "../user/entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([QuizEntity, UserEntity])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
