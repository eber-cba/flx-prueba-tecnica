import Navbar from "./components/navbar/Navbar";
import UsersList from "./components/users/usersList/UsersList";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<UsersList />} />
      </Routes>
    </div>
  );
}

export default App;
