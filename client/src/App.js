import Navbar from "./components/navbar/Navbar";
import UsersList from "./components/users/usersList/UsersList";
import UserCreate from "./components/users/usersCreate/UsersCreate";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<UsersList />} />
        <Route path='/UserCreate' element={<UserCreate />} />
      </Routes>
    </div>
  );
}

export default App;
