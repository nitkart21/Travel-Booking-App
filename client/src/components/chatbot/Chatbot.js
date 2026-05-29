import React, { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { chatbotAPI } from '../../services/api';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: "Hello! 👋 I'm your AI Travel Assistant. How can I help you plan your perfect trip today?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadSuggestions();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadSuggestions = async () => {
        try {
            const response = await chatbotAPI.getSuggestions();
            setSuggestions(response.data.data);
        } catch (error) {
            console.error('Failed to load suggestions');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (text = inputValue) => {
        if (!text.trim() || isLoading) return;

        const userMessage = {
            type: 'user',
            text: text.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chatbotAPI.sendMessage(text);
            const botMessage = {
                type: 'bot',
                text: response.data.data.message,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                type: 'bot',
                text: "Sorry, I'm having trouble connecting. Please try again in a moment!",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSend(suggestion);
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-avatar">🤖</div>
                        <div className="chatbot-header-info">
                            <h3>AI Travel Assistant</h3>
                            <p>Always here to help!</p>
                        </div>
                        <button
                            className="chatbot-close"
                            onClick={() => setIsOpen(false)}
                        >
                            <FiX />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.type}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-message bot typing">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {suggestions.length > 0 && messages.length <= 2 && (
                        <div className="chatbot-suggestions">
                            {suggestions.slice(0, 4).map((suggestion, index) => (
                                <button
                                    key={index}
                                    className="suggestion-chip"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="chatbot-input">
                        <input
                            type="text"
                            placeholder="Ask me anything about travel..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim() || isLoading}
                        >
                            <FiSend />
                        </button>
                    </div>
                </div>
            )}

            <button
                className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FiX /> : <FiMessageCircle />}
            </button>
        </div>
    );
};

export default Chatbot;
