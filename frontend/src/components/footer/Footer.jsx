import React from 'react'
import './footer.css'
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
        <div className="footer-content">
            <p>
                &copy; 2024 Your E-learning Platform. All right reserverd. 
                <br/> developed by Amruta Bakade.
            </p>
            <div className="social-links">
                <a href=""> <FaInstagram/> </a>
                <a href=""></a>
                <a href=""></a>
            </div>
        </div>
    </footer>
  )
}

export default Footer
