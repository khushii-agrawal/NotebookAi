import MindMapCanvas from "../components/mindmap/MindMapCanvas";
import MindMapToolbar from "../components/mindmap/MindMapToolbar";
import type { MindMapNode } from "../types/mindmap.types";

const mockMindMap: MindMapNode[] = [
  { id: "1", label: "Machine Learning", x: 400, y: 200 },
  { id: "2", label: "Supervised Learning", x: 200, y: 350 },
  { id: "3", label: "Unsupervised Learning", x: 600, y: 350 },
];

const MindMap = () => {
  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      <MindMapToolbar />
      <MindMapCanvas nodes={mockMindMap} />
    </div>
  );
};

export default MindMap;
