const MindMapToolbar = () => {
  return (
    <div className="flex gap-3 p-3 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        ➕ Add Node
      </button>
      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        🔄 Reset
      </button>
    </div>
  );
};

export default MindMapToolbar;
