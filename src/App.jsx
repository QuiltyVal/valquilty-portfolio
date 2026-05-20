import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { IChingPage } from "./pages/IChingPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<Navigate to="/#projects" replace />} />
        <Route path="the-myth" element={<Navigate to="/#about" replace />} />
        <Route path="archives" element={<Navigate to="/#projects" replace />} />
        <Route path="book/killing-the-water" element={<Navigate to="/#projects" replace />} />
        <Route path="i-ching" element={<IChingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
