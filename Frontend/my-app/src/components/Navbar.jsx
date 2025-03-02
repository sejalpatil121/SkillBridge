import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/login" style={styles.link}>Login</Link>
      <Link to="/register" style={styles.link}>Register</Link>
      <Link to="/dashboard" style={styles.link}>Dashboard</Link>
      <Link to="/search" style={styles.link}>Search</Link> 
      <Link to="/recommend">Find Collaborators</Link>
    </nav>
  );
};

const styles = {
  navbar: { padding: "10px", background: "#333", color: "white", display: "flex", justifyContent: "space-around" },
  link: { color: "white", textDecoration: "none" }
};

export default Navbar;