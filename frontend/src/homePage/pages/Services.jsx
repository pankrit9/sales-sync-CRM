import React from 'react';
import '../../App.css';
import Cards from '../Cards';
import HeroSection from '../HeroSection';
import Footer from '../Footer';
import Navbar2 from '../Navbar2';
import CardItem from '../CardItem';
import ServicesSegment from '../ServicesSegment';
import Typography from '@mui/material/Typography';
import salesPhoto from '../../images/clients.jpg'

function Services() {
  return (
    <>
      <Navbar2/>
      <div className ="fullcontainer">
        <div className="container-home">
          <div className="text-container">
            <h1>Customer Resource Management does not have to be expensive</h1>
            <h2>Get great value Customer Resource Management with Sale Sync</h2>
          </div>
          <div className="image-container1"/>
        </div>

        <div className="container-home">
          <div className="image-container2">
          </div>
          <div className="text-container">
            <h3 >Secure and Easy Sign Up</h3>
            <Typography>Sign Up and get managing your encrypted data within 5 minutes</Typography>
          </div>
        </div>

        <div className="container-home" >
          <div className="text-container">
            <h3>Simple to understand Dashboard</h3>
            <h4>Have all the Information you need right at your fingertips</h4>
          </div>
          <div className="image-container3">
          </div>
        </div>

        <div className="container-home">
        <div className="image-container4">
          </div>
          <div className="text-container">
            <h3>Clear Task Management</h3>
            <h4>Know what tasks you need to complete and when, with our clear task management system</h4>
          </div>
        </div>

        <div className="container-home">
          <div className="text-container">
            <h3>Manage your Clients and Staff</h3>
            <h4>Know whos who with our clear tables highlighting important client and staff data</h4>
          </div>
          <div className="image-container5">
          </div>
        </div>

        <div className="container-home">
        <div className="image-container6">
          </div>
          <div className="text-container">
            <h3>Gamify your Customer Resource Management</h3>
            <h4>Don't get bored with pure data, enjoy our gamification to keep you and your staff motivated</h4>
          </div>
        </div>

        <div className="container-home">
          <div className="text-container">
            <h3>Dark Mode</h3>
            <h4>Dark Mode helps you work at any hour you need</h4>
          </div>
          <div className="image-container7">
          </div>
        </div>
    </div>
  </>
  );
}

export default Services;