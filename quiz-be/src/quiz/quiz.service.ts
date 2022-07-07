import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import QuizEntity, { Question, Quiz } from './quiz.entity';
import UserEntity from '../user/user.entity';
import { quizQuestionsValidator } from './quiz.validator';
import { PageSize } from '../lib/constants';
import * as lodash from 'lodash';

@Injectable()
export class QuizService {
  async getAll(page: number, authUser: UserEntity = null) {
    page = Math.max(Number(page) || 1, 1);
    const where = {};
    if (authUser) {
      where['userId'] = authUser.id;
    } else {
      where['published'] = true;
    }
    const quizes = await QuizEntity.find({
      where,
      skip: (page - 1) * PageSize,
      select: [
        'id',
        'permalink',
        'userId',
        'title',
        'published',
        'questionCount',
      ],
    });
    const totalQuiz = await QuizEntity.count({
      where,
    });
    const pageCount = Math.ceil(totalQuiz / PageSize);
    return {
      quizes,
      page,
      pageCount,
      totalQuiz,
    };
  }

  async getQuiz(permalink: string, authUser: UserEntity = null) {
    const quiz = await QuizEntity.findOne({ where: { permalink } });
    if (!quiz) throw new NotFoundException();
    if (!authUser)
      quiz.questions = quiz.questions.map((question) => ({
        ...question,
        correctOptions: undefined,
      }));
    return quiz;
  }

  async createQuiz(quizForm: Quiz, authUser: UserEntity): Promise<QuizEntity> {
    quizQuestionsValidator(quizForm.questions);
    let link = QuizService.getRandomPermaLink();
    const allQuizParamLinks = await QuizEntity.find({}).then((data) => {
      return data.map((q) => q.permalink);
    });

    while (true) {
      if (allQuizParamLinks.includes(link))
        link = QuizService.getRandomPermaLink();
      else break;
    }
    const newQuiz = new QuizEntity();
    newQuiz.userId = authUser.id;
    newQuiz.permalink = link;
    newQuiz.title = quizForm.title;
    newQuiz.published = quizForm?.published || false;
    newQuiz.questions = quizForm.questions;
    newQuiz.questionCount = quizForm.questions.length;
    await QuizEntity.save(newQuiz);
    return newQuiz;
  }

  async updateQuiz(
    peramlink: string,
    quizForm: Quiz,
    authUser: UserEntity,
  ): Promise<Quiz> {
    const quiz = await this.getQuiz(peramlink);
    if (quiz) {
      if (!quiz.published) {
        if (quiz.userId === authUser.id) {
          if (quizForm?.questions) {
            quizQuestionsValidator(quizForm?.questions);
            quiz.questions = quizForm.questions;
            quiz.questionCount = quizForm.questions.length;
          }
          quiz.published = quizForm?.published || false;
          quiz.title = quizForm?.title || quiz.title;
          return await QuizEntity.save(quiz);
        }
        throw new UnauthorizedException(
          'you are not authorized to updated this quiz',
        );
      }
      throw new MethodNotAllowedException("can't update the published quiz");
    }
    throw new NotFoundException('quiz doesnt exist');
  }

  async deleteQuiz(id: number, authUser: UserEntity) {
    const quiz = await QuizEntity.findOne({ where: { id } });
    if (quiz) {
      if (quiz.userId === authUser.id) {
        return await QuizEntity.delete(id);
      } else
        throw new UnauthorizedException(
          'you are not allowed to delete this quiz',
        );
    } else throw new NotFoundException();
  }

  async evaluateQuiz(permalink, answeredData: Question[]) {
    const quiz = await QuizEntity.findOne({
      where: { permalink },
    });
    let score = 0;
    let unanswered = 0;
    const total = quiz.questions.length;
    if (quiz) {
      for (const i in answeredData) {
        if (
          answeredData[i]?.chosenOptions &&
          answeredData[i].chosenOptions.length > 0
        ) {
          const chosenOptions = answeredData[i]?.chosenOptions || [];
          const correctOptions = quiz.questions[i].correctOptions;
          if (lodash.isEqual(chosenOptions.sort(), correctOptions.sort())) {
            score++;
          }
        } else {
          unanswered++;
        }
      }
      return {
        scored: score,
        wrong: total - score - unanswered,
        unanswered,
        total: total,
        msg: 'You answered ' + score + '/' + total + ' questions correctly',
      };
    }
    throw new NotFoundException();
  }

  private static getRandomPermaLink(): string {
    return (
      Math.random().toString(36).substr(2, 5) + Math.floor(Math.random() * 10)
    );
  }
}
