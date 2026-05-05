import { useState } from "react";
import type { QuizQuestion } from "../types/quiz.types";

export const useQuiz = (notebookId: string) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const generateQuiz = async () => {
    setLoading(true);

    // 🔥 MOCK DATA (replace with LLM later)
    await new Promise((r) => setTimeout(r, 1200));

    setQuestions([
      {
        id: "q1",
        question: "What is Machine Learning?",
        options: [
          { id: "a", text: "A subset of AI" },
          { id: "b", text: "A database system" },
          { id: "c", text: "A programming language" },
          { id: "d", text: "A hardware device" },
        ],
        correctOptionId: "a",
      },
      {
        id: "q2",
        question: "Which type of learning uses labeled data?",
        options: [
          { id: "a", text: "Unsupervised" },
          { id: "b", text: "Reinforcement" },
          { id: "c", text: "Supervised" },
          { id: "d", text: "Random" },
        ],
        correctOptionId: "c",
      },
    ]);

    setLoading(false);
  };

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  return {
    questions,
    answers,
    loading,
    generateQuiz,
    selectAnswer,
  };
};
