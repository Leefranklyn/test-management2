import { z } from "zod";

const OptionValidator = z.object({
  text: z.string().min(1).max(255),
  isCorrect: z.boolean(),
});

const QuestionValidator = z.object({
  questionText: z.string().min(1).max(255),
  questionImage: z.string().min(1).max(255),
  options: z.array(OptionValidator),
});

export const CreateValidator = z.object({
  institution: z.string().min(1).max(255).optional(),
  testName: z.string().min(1).max(255),
  questions: z.array(QuestionValidator),
});

export const UpdateValidator = z.object({
    institution: z.string().min(1).max(255).optional(),
    testName: z.string().min(1).max(255).optional(),
    questions: z.array(QuestionValidator).optional(),
  });
  