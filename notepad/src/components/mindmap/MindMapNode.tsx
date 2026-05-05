import type { MindMapNode } from "../../types/mindmap.types";

type Props = {
  node: MindMapNode;
};

const MindMapNodeComponent = ({ node }: Props) => {
  return (
    <div
      className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700
                 rounded-lg px-4 py-2 text-sm shadow cursor-pointer"
      style={{ left: node.x, top: node.y }}
    >
      {node.label}
    </div>
  );
};

export default MindMapNodeComponent;
