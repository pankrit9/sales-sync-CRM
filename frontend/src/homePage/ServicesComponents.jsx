import React from 'react';
import './ServicesComponents.css';

const text = [
  { title: 'Customer Resource Management does not have to be expensive', text: 'Get great value Customer Resource Management with Sale Sync' },
  { title: 'Secure and Easy Sign Up', text: 'Sign Up and get managing your encrypted data within 5 minutes' },
  { title: 'Simple to understand Dashboard', text: 'Have all the Information you need right at your fingertips' },
  { title: 'Clear Task Management', text: 'Know what tasks you need to complete and when, with our clear task management system' },
  { title: 'Manage your Clients and Staff', text: 'Know whos who with our clear tables highlighting important client and staff data' },
  { title: 'Manage your Products', text: 'Understand what is in your inventory with our product management system' },
  { title: 'Gamify your Customer Resource Management', text: "Don't get bored with pure data, enjoy our gamification to keep you and your staff motivated" },
  { title: 'Dark Mode', text: 'Dark Mode helps you work at any hour you need' },
];

function Components() {
  return (
    <div>
      {text.map((item, index) => {
        const isReversed = index % 2 !== 0;
        const isFirst = index === 0;
        return (
          <div className={`service-container ${isReversed ? 'reversed' : ''}`} key={index}>
            <div className={`text ${isFirst ? 'first-text' : ''}`}>
              <h1>{item.title}</h1>
              <p>{item.text}</p>
            </div>
            <div className={`image image${index + 1}`}></div>
          </div>
        );
      })}
    </div>
  );
}

export default Components;