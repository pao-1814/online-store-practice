import React from "react";
import logo from '../../assets/images/logo.svg';
import heartIcon from '../../assets/icons/Shape.svg';
import cartIcon from '../../assets/icons/icon_ basket.svg';
import arrow from '../../assets/icons/arrow.svg';
import { Link } from "react-router-dom";
import './header.style.css';
import { useSelector } from "react-redux";
import { selectUser } from "../../features/user/userSlice";

export const Header = () => {
    const userLogined = useSelector(selectUser).loggedIn;
    const user = useSelector(selectUser).user;
    return (
        <div className="header">
            <Link to='/'>
                <img className="header__logo" src={logo} alt='logo'></img>
            </Link>
            <div className="header__buttons-container">
                <img className="header__heart-icon" src={heartIcon} alt='heart_icon'></img>
                <img className="header__cart-icon" src={cartIcon} alt='cart-icon'></img>
                {userLogined 
                ? 
                <div className="header__user-wrapper">
                    <p className="header__text">Welcome, {user.name}</p>
                    <div className="header__user-icon">{user.name[0] + user.surname[0]}</div>
                    <img className="header__user-arrow" src={arrow} alt='arrow'></img>
                </div>
                :
                <div className="header__login-wrapper">
                    <p className="header__link">REGISTER</p>
                    <div className="header__vertical-line"></div>
                    <p className="header__link">LOG IN</p>
                </div>
                }
            </div>
        </div>
    );
}