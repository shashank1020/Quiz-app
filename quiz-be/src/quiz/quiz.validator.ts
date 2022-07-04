import { Question } from './quiz.entity';

export const quizQuestionsValidator = (questions: Question[]) => {
  /**
   * Questions to be max 10 questions
   * Correct options to be exactly one for single type
   * Correct options to be one or more than one for multiple types
   * Value in options should be same as in correctOptions
   * options length should not be more than 5
   */
  for (const question of questions) {
  }
};
