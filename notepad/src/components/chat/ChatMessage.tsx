type Props = {
  role: "user" | "assistant";
  content: string;
};

const ChatMessage = ({ role, content }: Props) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-start gap-2 max-w-[85%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
            isUser
              ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
              : "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
          }`}
        >
          {isUser ? "U" : "AI"}
        </div>

        {/* Message Bubble */}
        <div
          className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
            isUser
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm"
              : "bg-gray-100 dark:bg-gray-700/60 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-200 dark:border-gray-600/50"
          }`}
          style={{
            animation: "fadeSlideIn 0.25s ease-out",
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
