import React from 'react';
import '../../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      <video src='/videos/video-1.mp4' autoPlay loop muted />
      <h1>THE FUTURE IS HERE</h1>
      <p>IMPROVE YOUR BUSINESS</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          SIGN IN
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          CONTACT US<i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
