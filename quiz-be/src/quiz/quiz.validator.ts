import { Question } from './quiz.entity';
import { BadRequestException } from '@nestjs/common';

export const quizQuestionsValidator = (questions: Question[]) => {
  if (questions.length > 10 || questions.length === 0)
    throw new BadRequestException('Questions should be between 1 to 10');

  hasDuplicatesQuestions(questions);
  for (const ques of questions) {
    validateQuestion(ques);
  }
  return true;
};

export const hasDuplicatesQuestions = (quesArr) => {
  const onlyQues = new Set(quesArr.map((q) => q.title));
  if (onlyQues.size !== quesArr.length) {
    throw new BadRequestException('Duplicate questions found');
  }
  return true;
};

export const hasDuplicateOptions = (options) => {
  const filtered = new Set(options);
  if (filtered.size !== options.length) {
    throw new BadRequestException('Duplicate options found');
  }
  return true;
};

export const validateQuestion = (question) => {
  if (
    question.options.length > 5 ||
    question.options.length < 2 ||
    question.correctOptions.length > question.options.length
  ) {
    console.log(question);
    throw new BadRequestException('options should be between 2 to 5');
  }
  if (question.correctOptions.length >= 1) {
    if (question.type === 'single' && question.correctOptions.length !== 1) {
      throw new BadRequestException(
        'multiple correct option is given for single type question',
      );
    }
  } else {
    throw new BadRequestException('correct options were not given');
  }

  for (const option in question.correctOptions) {
    if (!question.options.includes(question.correctOptions[option])) {
      throw new BadRequestException('Correct option not in options');
    }
  }

  for (const optionIndex in question.options) {
    const optionValue = question.options[optionIndex];
    if (optionValue === '') {
      throw new BadRequestException('Option cannot be empty');
    }
  }
  return hasDuplicateOptions(question.options);
};
