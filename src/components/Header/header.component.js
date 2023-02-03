import React, { useEffect } from "react";
import logo from '../../assets/images/logo.svg';
import heartIcon from '../../assets/icons/Shape.svg';
import cartIcon from '../../assets/icons/icon_ basket.svg';
import { Link } from "react-router-dom";
import './header.style.css';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, toggleSettings, logout } from "../../features/user/userSlice";
import { toggleLoginPage } from "../../features/loginPage/loginPageSlice";
import { toggleRegisterPage } from "../../features/registerPage/registerPageSlice";
import { toggleLoginModal } from "../../features/loginModal/loginModalSlice";
import {auth} from '../../firebase';
import { selectCart, setTotalItems, initCart, resetTotalCount } from "../../features/cart/cartSlice";
import { showFavourites } from "../../features/account/accountSlice";

export const Header = () => {
    const dispatch = useDispatch();
    const userLogined = useSelector(selectUser).loggedIn;
    const user = useSelector(selectUser).user;
    const cart = useSelector(selectCart);
    const showSettings = useSelector(selectUser).showSettings;
    const navigate = useNavigate();
    const logoutOfApp = () => {
        dispatch(logout());
        dispatch(resetTotalCount());
        auth.signOut();
    };
    useEffect(() => {
        dispatch(initCart(user.uid));
    }, [cart.totalItems])
    return (
        <div className="header">
            <Link to='/'>
                <img className="header__logo" src={logo} alt='logo'></img>
            </Link>
            <div className="header__buttons-container">
                <img onClick={() => {
                    if(userLogined){
                        navigate('/account');
                        dispatch(showFavourites());
                    }
                    else{
                        dispatch(toggleLoginModal());
                    }
                }} className="header__heart-icon" src={heartIcon} alt='heart_icon'></img>
                <div onClick={() => userLogined ? navigate('/cart') : dispatch(toggleLoginModal())} className="header__cart-wrapper">
                    <img className="header__cart-icon" src={cartIcon} alt='cart-icon'></img>
                    {cart.totalItems ? <div className="header__cart-count">{cart.totalItems}</div> : <></>}
                </div>
                {userLogined 
                ? 
                <div className="header__user-wrapper">
                    <p className="header__text">Welcome, {user.fullName ? user.fullName.split(' ')[0] : 'User'}</p>
                    <Link to="/account"><div className="header__user-icon">{user.fullName ? user.fullName[0].toUpperCase() : 'US'}</div></Link>
                    <div onClick={() => dispatch(toggleSettings())} className="header__arrow-wrapper">
                        <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1.09091L1.04 0L6.5 5.80364L11.96 0L13 1.09091L6.5 8L0 1.09091Z" fill="white"/>
                        </svg>
                        {showSettings && 
                        <div onMouseLeave={() => dispatch(toggleSettings())} className="header__user-info-wrapper">
                            <div className="header__email-wrapper">
                                <p className="header__user-info-name">{user.fullName}</p>
                                <p className="header__user-info-email">{user.email}</p>
                            </div>
                            <div className="header__user-info-line"></div>
                            <Link to='/account'>
                                <div className="header__user-info-btn">Settings</div>
                            </Link>
                            <div onClick={() => logoutOfApp()} className="header__user-info-btn logout">Log Out</div>
                        </div>
                        }
                    </div>
                </div>
                :
                <div className="header__login-wrapper">
                    <p onClick={() => dispatch(toggleRegisterPage())} className="header__link">REGISTER</p>
                    <div className="header__vertical-line"></div>
                    <p onClick={() => dispatch(toggleLoginPage())} className="header__link">LOG IN</p>
                </div>
                }
            </div>
        </div>
    );
}