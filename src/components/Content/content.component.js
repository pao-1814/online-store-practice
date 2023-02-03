import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../HomePage/homePage.component";
import { SearchPage } from "../SearchPage/searchPage.component";
import { ItemPage } from "../ItemPage/itemPage.component";
import { LoginModal } from "../LoginModal/loginModal.component";
import { useSelector } from "react-redux";
import { selectLoginModal } from "../../features/loginModal/loginModalSlice";
import { selectLoginPage } from "../../features/loginPage/loginPageSlice";
import { selectRegisterPage } from "../../features/registerPage/registerPageSlice";
import { LoginPage } from "../LoginPage/loginPage.component";
import { RegisterPage } from "../RegisterPage/registerPage.component";
import { Account } from "../Account/account.component";
import { Cart } from "../Cart/cart.component";
import { OrderPage } from "../orderPage/orderPage.component";

export const Content = () =>{
    const showLoginModal = useSelector(selectLoginModal).shown;
    const showLoginPage = useSelector(selectLoginPage).shown;
    const showRegisterPage = useSelector(selectRegisterPage).shown;
    return (
        <>
            <Routes>
                <Route path="/" exact element = {
                    <HomePage/>
                }/>
                <Route path='search/:searchStr'
                action={({ params }) => {}}
                element = {<SearchPage/>}/>
                <Route path='products/:productId'
                action={({ params }) => {}}
                element = {<ItemPage/>}/>
                <Route path='account/' element= {<Account/>}/>
                <Route path='cart' element={<Cart/>}/>
                <Route path='order/:orderId'
                action={({ params }) => {}}
                element={<OrderPage/>}></Route>
            </Routes>
            {showLoginModal && <LoginModal/>}
            {showLoginPage && <LoginPage/>}
            {showRegisterPage && <RegisterPage/>}
        </>
    )
}