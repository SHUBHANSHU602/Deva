import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ErrorState } from "./components/LoadingState";
import { DashboardPage } from "./pages/DashboardPage";
import { MockPage } from "./pages/MockPage";
import { ReviewPage } from "./pages/ReviewPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/mock/:mockId" element={<MockPage />} />
      <Route path="/review/:attemptId" element={<ReviewPage />} />
      <Route path="*" element={<AppShell><ErrorState message="That page does not exist." /></AppShell>} />
    </Routes>
  );
}
