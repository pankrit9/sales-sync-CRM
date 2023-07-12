import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <div className='cards-h1'>Our CRM packages are tailor made to suit your needs at an ideal price point</div>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/img-3.jpg'
              text='Up to 50 Clients, 1 Staff Member and 10 Different Products'
              label='Free'
              path='/sign-up'
            />
            <CardItem
              src='images/img-3.jpg'
              text='Up to 500 Clients and 10 Staff and 100 Different Products'
              label='Small'
              path='/sign-up'
            />
            <CardItem
              src='images/img-3.jpg'
              text='Up to 2500 Clients, 50 Staff and 500 Different Products'
              label='Medium'
              path='/sign-up'
            />
            <CardItem
              src='images/img-3.jpg'
              text='Up to 1000 Clients, 200 Staff and 2000 Different Products'
              label='Large'
              path='/sign-up'
            />
            <CardItem
              src='images/img-3.jpg'
              text='Allows for an infinite amount of clients, staff and products'
              label='Ultimate'
              path='/sign-up'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
