import type { QuizQuestion } from "../../types/quiz.types";

type Props = {
  question: QuizQuestion;
  selectedOption?: string;
  onSelect: (optionId: string) => void;
};

const QuizQuestionCard = ({
  question,
  selectedOption,
  onSelect,
}: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
      <h3 className="font-medium mb-4">
        {question.question}
      </h3>

      <div className="space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`w-full text-left px-3 py-2 rounded-lg border transition ${
              selectedOption === opt.id
                ? "bg-purple-600 text-white border-purple-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestionCard;
