import { Outlet } from "react-router-dom";
import './RootLayout.css'
import Navbar from "../Navbar/Navbar";
 // Assuming you have a Footer component

const RootLayout = () => {
  return (
    <div>
      <Navbar/>
      
      <main className="outlet-container">
        <Outlet /> {/* This will render the child routes */}
      </main>
   
    </div>
  );
};

export default RootLayout;
