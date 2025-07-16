import React from 'react';
import styled from 'styled-components';

const IncomingCallPopUp = ({name,accept,reject}) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="imgBox">
          <svg viewBox="0 0 16 16" className="bi bi-person-circle" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" fillRule="evenodd" />
          </svg>
        </div>
        <div className="name">
          <p className="p1">{name}</p>
          <p className="p2">Incoming Call</p>
        </div>
        <div className="caller">
          <span id="pick" className="callerBtn" onClick={accept}>
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
            </svg>
          </span>
          <span id="end" className="callerBtn" onClick={reject}>
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
            </svg>
          </span></div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 190px;
    height: 254px;
    border-radius: 1em;
    flex-direction: column;
    justify-content: space-evenly;
    background-color: #080808;
    box-shadow: 0 0 2rem rgba(0, 0, 0, 0.8);
    cursor: pointer;
    transition: 0.2s ease-in-out;
    padding: 5px;
    color: #fff;
  }

  .card:hover {
    rotate: 1deg;
    scale: 1.05;
  }

  .card, .imgBox, .caller {
    display: flex;
    align-items: center;
  }

  .imgBox {
    width: 6em;
    height: 6em;
    box-shadow: 0px 0.25em 1rem rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    justify-content: center;
  }

  .imgBox svg {
    width: 100%;
    height: 100%;
  }

  .name {
    width: 100%;
    text-align: center;
    font-weight: 900;
    transition: 1s ease-in-out;
  }

  .name .p1 {
    font-size: 1.2em;
  }

  .name .p2 {
    font-size: 0.8em;
    color: rgb(50, 146, 255);
  }

  .caller {
    width: 100%;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .callerBtn {
    width: 2em;
    height: 2em;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    transition: 0.1s ease-in-out;
    animation: animate linear infinite 2s;
  }

  .callerBtn:hover {
    scale: 1.1;
  }

  #pick {
    background-color: #28ff28;
    box-shadow: 0px 3px 10px #28ff28;
  }

  #end {
    background-color: #ff2828;
    box-shadow: 0px 3px 10px #ff2828;
  }

  #end svg {
    rotate: 135deg;
  }

  @keyframes animate {
    0% {
      transform: translateY(0px);
    }

    50% {
      transform: translateY(3px) rotate(-10deg);
    }

    100% {
      transform: translateY(0px);
    }
  }`;

export default IncomingCallPopUp;
