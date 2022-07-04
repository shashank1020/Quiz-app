import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'quiz' })
export default class QuizEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  permalink: string;

  @Column({ nullable: true })
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
  question: string;
  options: string[];
  correctOptions: string[];
}
