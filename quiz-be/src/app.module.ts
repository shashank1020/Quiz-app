import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from './quiz/quiz.module';
import QuizEntity from './quiz/quiz.entity';
import UserEntity from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.sqlite',
      entities: [QuizEntity, UserEntity],
      synchronize: true,
    }),
    QuizModule,
    UserModule,
  ],
})
export class AppModule {}
