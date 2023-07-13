import React from 'react';
import './PricingComponents.css';

function PricingComponents() {
    const text = [
        { title: "Free", heading: "$0.00", subheading: "billed per month", content: "Up to 50 Clients, 1 Staff Member and 10 Different Products", link: "#link1" },
        { title: "Small", heading: "$20.00", subheading: "billed per month", content: "Up to 500 Clients and 10 Staff and 100 Different Products", link: "#link2" },
        { title: "Medium", heading: "$35.00", subheading: "billed per month", content: "Up to 2500 Clients, 50 Staff and 500 Different Products", link: "#link3" },
        { title: "Large", heading: "$60.00", subheading: "billed per month", content: "Up to 1000 Clients, 200 Staff and 2000 Different Products", link: "#link4" },
        { title: "Ultimate", heading: "$80.00", subheading: "billed per month", content: "Allows for an infinite amount of Clients, Staff and Products", link: "#link5" },
    ];

    return (
        <div className="price-container">
            {text.map((price, index) => (
                <a key={index} href={price.link} className="price">
                    <h2>{price.title}</h2>
                    <h1>{price.heading}</h1>
                    <p>{price.subheading}</p>
                    <h3>{price.content}</h3>
                </a>
            ))}
        </div>
    );
}

export default PricingComponents;