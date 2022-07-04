import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import QuizEntity, { Question } from './quiz/entity/quiz.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const q = new QuizEntity();
  // const qs: Question[] = [
  //   {
  //     type: 'single',
  //     question: 'Will it be a sunny day today',
  //     options: ['YES', 'NO'],
  //     correctOptions: ['NO'],
  //   },
  //   {
  //     type: 'multiple',
  //     question: 'Temperature can be calcualted in',
  //     options: ['Degree', 'Fahrentite', 'Celsius'],
  //     correctOptions: ['Degree', 'Fahrentite', 'Celsius'],
  //   },
  // ];
  // q.questions = qs;
  // await q.save();
  // const qs = await QuizEntity.findOne({ where: { id: 3 } });
  // console.log(qs)
  await app.listen(3001);
}
bootstrap();
