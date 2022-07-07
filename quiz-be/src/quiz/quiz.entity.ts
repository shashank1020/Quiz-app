import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'quiz' })
export default class QuizEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permalink: string;

  @Column()
  title: string;

  @Column()
  userId: number;

  @Column({ default: false })
  published: boolean;

  @Column()
  questionCount: number;

  @Column({ type: 'simple-json', default: '{}' })
  questions: Array<Question>;
}

export interface Question {
  type: 'single' | 'multiple';
  title: string;
  options: string[];
  correctOptions?: string[];
  chosenOptions?: string[];
}

export interface Quiz {
  id: number;
  permalink: string;
  userId: number;
  title: string;
  published: boolean;
  questionCount: number;
  questions: Array<Question>;
}
