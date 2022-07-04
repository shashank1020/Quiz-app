import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import QuizEntity, { Question } from './quiz.entity';
import UserEntity from '../user/user.entity';

@Injectable()
export class QuizService {
  async getAll({page}) {
    const quizes = await QuizEntity.find({
      where: { published: true },
      take: 10,
      skip: 0,
      select: ['id', 'permalink', 'userId', 'questionCount'],
    });
    const totalCount = await QuizEntity.count({
      where: { published: true },
    });

    return {
      quizes,
      totalCount,
    };
  }
  async getUserQuiz(userId: number) {
    return await QuizEntity.find({ where: { userId } });
  }

  async getQuiz(permalink: string) {
    return await QuizEntity.findOne({
      where: { permalink },
    });
  }

  async saveQuiz(quiz: QuizEntity): Promise<QuizEntity> {
    return await QuizEntity.save(quiz);
  }

  async createQuiz(
    quizForm: QuizEntity,
    authUser: UserEntity,
  ): Promise<QuizEntity> {
    let link = QuizService.randomPermaLink();
    const allQuizParamLinks = await this.getAll().then((data) => {
      return data.map((q) => q.permalink);
    });

    while (true) {
      if (allQuizParamLinks.includes(link))
        link = QuizService.randomPermaLink();
      else break;
    }
    console.log(link);

    const newQuiz = new QuizEntity();
    newQuiz.userId = authUser.id;
    newQuiz.permalink = link;
    newQuiz.published = quizForm.published;
    newQuiz.questions = this.removeDuplicates(quizForm.questions);
    await this.saveQuiz(newQuiz);
    return newQuiz;
  }

  async updateQuiz(
    quizForm: QuizEntity,
    authUser: UserEntity,
  ): Promise<QuizEntity> {
    const quiz = await this.getQuiz(quizForm.permalink);
    if (quiz) {
      if (!quiz.published) {
        if (quiz.userId === authUser.id) {
          quiz.questions = this.removeDuplicates(quizForm.questions);
          quiz.published = quizForm.published;
          return await this.saveQuiz(quiz);
        }
        throw new UnauthorizedException(
          'you are not authorized to updated this',
        );
      }
      throw new MethodNotAllowedException("can't update the published quiz");
    }
    throw new NotFoundException('quiz doesnt exist');
  }

  async deleteQuiz(id: number) {
    return await QuizEntity.delete(id);
  }

  private removeDuplicates(quesArr: Question[]) {
    const onlyQues = quesArr.map((q) => q.question);
    return quesArr.filter(
      ({ question }, index) => !onlyQues.includes(question, index + 1),
    );
  }

  private static randomPermaLink() {
    const result = [];

    let strLength = 6;
    const charSet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    while (strLength--) {
      result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
    }

    return result.join('');
  }
}
