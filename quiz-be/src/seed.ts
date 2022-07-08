import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import UserEntity from './user/user.entity';
import QuizEntity, { Question } from './quiz/quiz.entity';
import * as Bcryptjs from 'bcrypt';
import * as faker from 'faker';

function get_random(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function createQuestions() {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    const type = get_random(['single', 'multiple']);
    const options = [];
    let correctOption = [];
    for (let i = 0; i < get_random([2, 3, 4, 5]); i++) {
      options.push(faker.lorem.sentence());
    }
    for (let i = 0; i < get_random([2, 3, 4]); i++) {
      if (type === 'single') {
        correctOption = [get_random(options)];
      } else correctOption.push(options[i]);
    }
    const question: Question = {
      type: type,
      title: faker.lorem.sentence(),
      options: options,
      correctOptions: correctOption,
    };
    questions.push(question);
  }
  return questions;
}

const seed = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  await UserEntity.delete({});
  await QuizEntity.delete({});

  for (let i = 0; i < 2; i++) {
    const user = new UserEntity();
    user.name = faker.name.findName();
    user.email = faker.internet.email().toLowerCase();
    user.password = Bcryptjs.hashSync('Name@123', 10);
    await user.save();
  }
  const users = await UserEntity.find({});
  const ids = users.map((user) => user.id);

  for (let i = 1; i < 20; i++) {
    const quiz = new QuizEntity();
    const allQuestiion = createQuestions();
    quiz.permalink =
      Math.random().toString(36).substr(2, 5) + Math.floor(Math.random() * 10);
    quiz.userId = get_random([...ids]);
    quiz.title = faker.lorem.sentence();
    quiz.questions = allQuestiion;
    quiz.published = Math.random() < 0.5;
    quiz.questionCount = allQuestiion.length;
    await quiz.save();
  }
  await app.close();
};
seed();
