import React from 'react';
import { createGlobalStyle } from 'styled-components';

const Pattern = () => {
  return <GlobalStyle />;
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Arial', sans-serif;
    --color: rgba(114, 114, 114, 0.3);
    background-color: #191a1a;
    background-image: linear-gradient(
        0deg,
        transparent 24%,
        var(--color) 25%,
        var(--color) 26%,
        transparent 27%,
        transparent 74%,
        var(--color) 75%,
        var(--color) 76%,
        transparent 77%,
        transparent
      ),
      linear-gradient(
        90deg,
        transparent 24%,
        var(--color) 25%,
        var(--color) 26%,
        transparent 27%,
        transparent 74%,
        var(--color) 75%,
        var(--color) 76%,
        transparent 77%,
        transparent
      );
    background-size: 55px 55px;
    color: white;
    overflow: hidden;
  }

  #root {
    height: 100%;
    width: 100%;
  }
`;

export default Pattern;
