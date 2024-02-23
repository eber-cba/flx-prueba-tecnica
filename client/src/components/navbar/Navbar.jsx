import React from "react";
import "./style.css";
import logo from "../../assets/OIP.png";
export default function Navbar() {
  return (
    <>
      <header>
        <img className='logo' src={logo} alt='' />
      </header>
    </>
  );
}
