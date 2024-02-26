import Navbar from "./components/navbar/Navbar";
import UsersList from "./components/users/usersList/UsersList";
import Error404 from "./components/404/Error404";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<UsersList />} />
        <Route path='*' element={<Error404 />} />
      </Routes>
    </div>
  );
}

export default App;
