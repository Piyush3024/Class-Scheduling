import { Layout } from "./components/Layouts/Layout";
import { Calendar } from "./components/calendar/Calendar";
import { ClassInstanceList } from "./components/class/ClassInstanceList";
import { ClassFormDialog } from "./components/class/ClassFormDialog";
import { Toaster } from "./components/ui/toaster";
import { useCalendarStore } from "./store/useCalendarStore";

function App() {
  const { viewMode } = useCalendarStore();

  return (
    <div className="dark">
      <Layout>
        {viewMode === "calendar" ? <Calendar /> : <ClassInstanceList />}
        <ClassFormDialog />
      </Layout>
      <Toaster />
    </div>
  );
}

export default App;
