import MindMapNodeComponent from "./MindMapNode";
import type { MindMapNode } from "../../types/mindmap.types";

type Props = {
  nodes: MindMapNode[];
};

const MindMapCanvas = ({ nodes }: Props) => {
  return (
    <div className="relative w-full h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {nodes.map((node) => (
        <MindMapNodeComponent key={node.id} node={node} />
      ))}
    </div>
  );
};

export default MindMapCanvas;
