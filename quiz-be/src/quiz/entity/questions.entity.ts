// import {
//   BaseEntity,
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import QuizEntity from './quiz.entity';
//
// export interface AddQuizQues {
//   quizId: string;
//   quesArr: Questions[];
// }
//
//
//
// @Entity({ name: 'questions' })
// export default class QuestionsEntity extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @Column()
//   quizId: string;
//
//   @Column()
//   ques: string;
//
//   @Column('simple-array')
//   options: string[];
//
//   @Column('simple-array')
//   correctOptions: string[];
//
//   @ManyToOne(() => QuizEntity, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'quizId', referencedColumnName: 'id' })
//   quiz: QuizEntity;
// }
