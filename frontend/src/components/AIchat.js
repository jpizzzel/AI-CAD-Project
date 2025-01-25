import React from 'react';
import styled from 'styled-components';

const AIToggleButton = ({ isOpen, onClick }) => {
  return (
    <StyledWrapper onClick={onClick}>
      <div className="lava-lamp">
        <div className="bubble" />
        <div className="bubble1" />
        <div className="bubble2" />
        <div className="bubble3" />
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.button`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  @keyframes drop {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(80px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  .lava-lamp {
    position: relative;
    width: 75px;
    height: 75px;
    background: #222630;
    border-radius: 25px;
    overflow: hidden;
    border: 2px solid #596A95;
  }

  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    color: white;
    z-index: 2;
  }

  .bubble {
    position: absolute;
    top: 0;
    width: 20px;
    height: 20px;
    background: linear-gradient(to bottom, #e64980, #ff8787);
    border-radius: 50%;
    left: 15px;
    animation: drop 5s ease-in-out infinite;
  }
  .bubble1 {
    position: absolute;
    top: 0;
    width: 20px;
    height: 20px;
    background: linear-gradient(to bottom, #82c91e, #3bc9db);
    border-radius: 50%;
    left: 1px;
    animation: drop 3s ease-in-out infinite;
  }
  .bubble2 {
    position: absolute;
    top: 0;
    width: 20px;
    height: 20px;
    background: linear-gradient(to bottom, #7950f2, #f783ac);
    border-radius: 50%;
    left: 30px;
    animation: drop 4s ease-in-out infinite;
  }
  .bubble3 {
    position: absolute;
    top: 0;
    width: 20px;
    height: 20px;
    background: linear-gradient(to bottom, #4481eb, #04befe);
    border-radius: 50%;
    left: 20px;
    animation: drop 6s ease-in-out infinite;
  }
`;

export default AIToggleButton;
