import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
// import SmartToyIcon from '@mui/icons-material/SmartToy';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
// import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './Chatbot.css';
import { BACKEND_API } from '../../api';

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const theme = useTheme();

    const toggleChat = () => setIsOpen(!isOpen);

    const handleInputChange = (e) => setInput(e.target.value);

    const handleSend = async () => {
        // Add the user's message to the chat
        setMessages([...messages, { author: 'User', text: input }]);

        // Send the user's message to the chatbot backend
        const response = await fetch(`${BACKEND_API}/chatbot/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: input }),
            credentials: 'include'
        });

        // Handle the response from the chatbot
        if (response.ok) {
            const data = await response.json();
            setMessages([...messages, { author: 'User', text: input }, { author: 'Bot', text: data.answer }]);
        } else {
            // Handle error
            console.error('Failed to send message to chatbot');
        }

        // Clear the input field
        setInput('');
    };

    return (
        <div className="chatbot" style={{ zIndex: 888888 }}>
            <button className="chatbot-button" onClick={toggleChat}>
                {isOpen ? <AiOutlineClose /> : <SmartToyTwoToneIcon fontSize='large' />}
            </button>
            {isOpen && (
                <div className="chatbot-chat" style={{ backgroundColor: theme.palette.text.main, zIndex: 99999}}>
                    <div className="chatbot-messages" style={{ backgroundColor: theme.palette.text.main }}>
                        <div class="chatbox__header">
                            <div class="chatbox__image--header">
                                <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" alt="image"></img>
                            </div>
                            <div class="chatbox__content--header" style={{
                                color: theme.palette.text.chatbot,
                            }}>
                                <h4 class="chatbox__heading--header" style={{color:theme.palette.neutral.main}}>Chat support</h4>
                                <p class="chatbox__description--header" style={{backgroundColor:"#ccc", padding:"0 0.5rem", margin:"1rem 0", borderRadius: "0.2rem", color:'black'}}>Hi. My name is Sam. How can I help you?</p>
                            </div>
                        </div>
                        {messages.map((message, index) => (
                            <div key={index} className={`chatbot-message chatbot-message-${message.author.toLowerCase()}`} style={{
                                text: theme.palette.neutral.main,
                            }}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="chatbot-input" style={{ backgroundColor: theme.palette.neutral.main, zIndex: "888888" }}>
                        <input type="text" value={input} onChange={handleInputChange} />
                        <button onClick={handleSend} style={{
                            margin: "0 0.5rem",
                            padding: "0.2rem",
                            alignItems: "center",
                            borderRadius: "0.2rem",
                            cursor: "pointer"
                        }}>
                                <SendTwoToneIcon style={{
                                    alignItems: "center",
                                }}/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chatbot;

