import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(28, 36, 50,0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .loader {
    width: 44.8px;
    height: 44.8px;
    color: var(--primary-color);
    position: relative;
    background: radial-gradient(11.2px, currentColor 94%, #0000);
  }

  .loader:before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background:
      radial-gradient(10.08px at bottom right, #0000 94%, currentColor) top left,
      radial-gradient(10.08px at bottom left , #0000 94%, currentColor) top right,
      radial-gradient(10.08px at top right   , #0000 94%, currentColor) bottom left,
      radial-gradient(10.08px at top left    , #0000 94%, currentColor) bottom right;
    background-size: 22.4px 22.4px;
    background-repeat: no-repeat;
    animation: loader 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
  }

  @keyframes loader {
    33% {
      inset: -11.2px;
      transform: rotate(0deg);
    }
    66% {
      inset: -11.2px;
      transform: rotate(90deg);
    }
    100% {
      inset: 0;
      transform: rotate(90deg);
    }
  }
`;

export default Loader;
