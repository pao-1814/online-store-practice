import React from "react";
import './account.style.css';
import { EditAccount } from "./editAccount.component";
import { Favourites } from "./favorites.component";
import { Orders } from "./ordersHistory.component";
import { useDispatch, useSelector } from "react-redux";
import { selectAccount, showEditAccount, showFavourites, showOrders } from "../../features/account/accountSlice";
import { selectUser } from "../../features/user/userSlice";
import { toggleLoginModal } from "../../features/loginModal/loginModalSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Account = () => {
    const state = useSelector(selectAccount);
    const user = useSelector(selectUser).user;
    const loggedIn = useSelector(selectUser).loggedIn;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if(!loggedIn) {
            navigate('/');
            dispatch(toggleLoginModal());
        }
    }, [loggedIn])
    return( 
        <div className="account-page">
            <div className="account-page__wrapper">
            <div className="account-page__user-icon">{user.fullName ? user.fullName[0].toUpperCase() : 'US'}</div>
                <h2 className="account-page__user-name">{user.fullName}</h2>
                <div className="account-page__navigation">
                    <div onClick={() => dispatch(showEditAccount())} className={state.tabs.editAccountShown ? 'account-page__active-tab sb' : 'account-page__navigation-item'}>Edit Account</div>
                    <div onClick={() => dispatch(showOrders())} className={state.tabs.ordersShown ? 'account-page__active-tab sb' : 'account-page__navigation-item'}>Orders History</div>
                    <div onClick={() => dispatch(showFavourites())} className={state.tabs.favouritesShown ? 'account-page__active-tab sb' : 'account-page__navigation-item'}>Favourites</div>
                </div>
                <div className="account-page__content">
                    {state.tabs.editAccountShown && <EditAccount/>}
                    {state.tabs.ordersShown && <Orders/>}
                    {state.tabs.favouritesShown && <Favourites/>}
                </div>
            </div>
        </div>
    )
}