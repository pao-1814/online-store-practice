import React from "react";
import './loginModal.style.css';
import { useDispatch } from "react-redux";
import { toggleLoginModal } from "../../features/loginModal/loginModalSlice";
import { toggleLoginPage } from "../../features/loginPage/loginPageSlice";
import { toggleRegisterPage } from "../../features/registerPage/registerPageSlice";

export const LoginModal = () => {
    const dispatch = useDispatch();
    return(
        <div onClick={(e) => {
            if(e.target.className === "login-modal"){
                dispatch(toggleLoginModal());
            }
        }} className="login-modal">
            <div className="login-modal-wrapper">
                <div className="close-btn-wrapper">
                    <svg onClick={() => dispatch(toggleLoginModal())} width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="close-btn" d="M25 2.51786L22.4821 0L12.5 9.98214L2.51786 0L0 2.51786L9.98214 12.5L0 22.4821L2.51786 25L12.5 15.0179L22.4821 25L25 22.4821L15.0179 12.5L25 2.51786Z"/>
                    </svg>
                </div>
                <h2 className="login-modal__title">To continue please register or log in</h2>
                <button onClick={() => {
                    dispatch(toggleLoginModal());
                    dispatch(toggleLoginPage());
                }} className="orange-btn">Continue to sign in</button>
                <button onClick={() => {
                    dispatch(toggleLoginModal());
                    dispatch(toggleRegisterPage());
                }} className="orange-btn">Continue to register</button>
                <button onClick={() => dispatch(toggleLoginModal())} className="white-btn">Continue as guest</button>
            </div>
        </div>
    )
}