import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../HomePage/homePage.component";
import { SearchPage } from "../SearchPage/searchPage.component";
import { ItemPage } from "../ItemPage/itemPage.component";

export const Content = () =>{
    return (
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
        </Routes>
    )
}