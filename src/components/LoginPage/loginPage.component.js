import React from "react";
import './loginPage.style.css'
import '../RegisterPage/registerPage.style.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoginPage, setEmail, setPassword, validateEmail, selectLoginPage, showPassword, loginToApp } from "../../features/loginPage/loginPageSlice";
import { toggleRegisterPage } from "../../features/registerPage/registerPageSlice";
import { login } from "../../features/user/userSlice";
import { Loader } from "../Loader/loader.component";


export const LoginPage = () => {
    const dispatch = useDispatch();
    const state = useSelector(selectLoginPage);
    const loading = useSelector(selectLoginPage).loading;
    useEffect(() => {
        dispatch(login(state.logginedUser));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.logginedUser])
    return(
        <div onClick={(e) => {
            if(e.target.className === 'login-page'){
                dispatch(toggleLoginPage());
            }
        }} className="login-page">
            <div className="login-page__wrapper">
                <div className="close-btn-wrapper">
                    <svg onClick={() => dispatch(toggleLoginPage())} width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="close-btn" d="M25 2.51786L22.4821 0L12.5 9.98214L2.51786 0L0 2.51786L9.98214 12.5L0 22.4821L2.51786 25L12.5 15.0179L22.4821 25L25 22.4821L15.0179 12.5L25 2.51786Z"/>
                    </svg>
                </div>
                <h2 className="login-page__title">Login</h2>
                <div className="input-wrapper">
                    <input onChange={(e) => {
                    dispatch(setEmail(e.target.value));
                    dispatch(validateEmail());
                    }} id='email' value={state.data.email} className={"input" + (state.validators.email && !state.error.length ? '' : ' invalid')} type='email'></input>
                    <label className="input-label">Email</label>
                    {state.validators.email ? 
                    <></> :
                    <p className="err-msg">There is no user with this email</p>}
                </div>
                <div className="input-wrapper">
                    <input onChange={(e) => 
                        {
                            dispatch(setPassword(e.target.value));
                        }
                        } value={state.data.password} id="password" className={"input" + (state.validators.password ? '' : ' invalid')} type={state.passwordHidden ? 'password' : 'text'}></input>
                    <label className="input-label">Password</label>
                    {state.passwordHidden 
                    ?
                    <svg onClick={() => dispatch(showPassword())} className="password-eye" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="password-eye" d="M11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5ZM11 13C8.24 13 6 10.76 6 8C6 5.24 8.24 3 11 3C13.76 3 16 5.24 16 8C16 10.76 13.76 13 11 13ZM11 5C9.34 5 8 6.34 8 8C8 9.66 9.34 11 11 11C12.66 11 14 9.66 14 8C14 6.34 12.66 5 11 5Z" fill="#727272"/>
                    </svg>
                    :
                    <svg onClick={() => dispatch(showPassword())} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="crossed-eye">
                        <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c5.2-11.8 8-24.8 8-38.5c0-53-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zm223.1 298L373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5z"/>
                    </svg>
                     }
                    {!state.validators.password &&
                    <p className="err-msg">You entered incorrect password</p>
                    }
                </div>
                <button onClick={async () => {
                    await dispatch(loginToApp(state.data));
                }} className="orange-btn login-page__login-btn">Login</button>
            </div>
            <div className="login-page__second-wrapper">
                <p className="login-page__rext">I have no account, <span onClick={() => {
                    dispatch(toggleLoginPage());
                    dispatch(toggleRegisterPage());
                }} className="login-page__register-now">Register Now</span></p>
            </div>
            {loading ? <Loader/> : <></>}
        </div>
    )
}