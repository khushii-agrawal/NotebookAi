import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Notebook from "./pages/Notebook";
import PublicLayout from "./Layouts/PublicLayout";
import AppLayout from "./Layouts/AppLayout";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";    
import MindMapPage from "./pages/MindMapPage";
import QuizPage from "./pages/QuizPage";
import FlashcardPage from "./pages/FlashcardPage";
import ReportPage from "./pages/ReportPage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* 🌐 Public pages (NO navbar) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* 🔐 App pages (WITH navbar) */}
          <Route element={<AppLayout />}>
            <Route path="/notebooks" element={<Notebook />} />
            <Route path="/notebooks/:notebookId" element={<Notebook />} />
            <Route path="/mindmap/:notebookId" element={<MindMapPage />} />
            <Route path="/quiz/:notebookId" element={<QuizPage />} />
            <Route path="/flashcards/:notebookId" element={<FlashcardPage />} />
            <Route path="/report/:notebookId" element={<ReportPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
