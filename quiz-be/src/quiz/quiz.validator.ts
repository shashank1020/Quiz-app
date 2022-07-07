import { Question } from './quiz.entity';
import { BadRequestException } from '@nestjs/common';

export const quizQuestionsValidator = (questions: Question[]) => {
  hasDuplicates(questions);

  if (questions.length > 10 || questions.length === 0)
    throw new BadRequestException('Questions should be between 1 to 10');

  for (const ques of questions) {
    return validateQuestion(ques);
  }
};

const hasDuplicates = (quesArr: Question[]) => {
  const onlyQues = quesArr.map((q) => q.title);
  for (let i = 0; i < onlyQues.length; i++) {
    const title = onlyQues[i];
    if (onlyQues.includes(title, i + 1)) {
      throw new BadRequestException('Duplicate question found');
    }
  }
};

const validateQuestion = (question: Question) => {
  console.log(question);
  if (
    question.options.length > 5 ||
    question.options.length < 2 ||
    question.correctOptions.length > question.options.length
  )
    throw new BadRequestException('options should be between 2 to 5');
  if (question.correctOptions.length >= 1) {
    if (question.type === 'single' && question.correctOptions.length !== 1)
      throw new BadRequestException(
        'multiple correct option is given for single type question',
      );
  } else throw new BadRequestException('correct options were not given');

  for (const option in question.options) {
    if (question.options[option] === '')
      throw new BadRequestException('Option cannot be empty');
  }
  for (const option in question.correctOptions) {
    if (!question.options.includes(question.correctOptions[option]))
      throw new BadRequestException('Correct option not in options');
  }
  return question;
};
