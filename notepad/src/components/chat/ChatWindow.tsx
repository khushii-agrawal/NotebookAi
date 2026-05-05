import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useNotebookChat } from "../../hooks/useNotebookChat";

type Props = {
  notebookId: string;
};

const ChatWindow = ({ notebookId }: Props) => {
  const { messages, askQuestion, loading, clearChat } =
    useNotebookChat(notebookId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 scrollbar-thin">
        {messages.length === 0 && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-6 opacity-60">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Ask anything about your document.
              <br />
              <span className="text-purple-400">
                Answers are based only on your uploaded content.
              </span>
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
          />
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span className="text-xs text-gray-400">AI is thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Clear Chat + Input */}
      <div className="flex flex-col gap-1.5">
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="self-end text-[10px] text-gray-400 hover:text-red-400 transition-colors px-1"
          >
            Clear chat
          </button>
        )}
        <ChatInput onSend={askQuestion} disabled={loading} />
      </div>
    </div>
  );
};

export default ChatWindow;
