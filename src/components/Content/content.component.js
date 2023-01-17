import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../HomePage/homePage.component";
import { SearchPage } from "../SearchPage/searchPage.component";

export const Content = () =>{
    return (
        <Routes>
            <Route path="/" exact element = {
                <HomePage/>
            }/>
            <Route path='search/:searchStr'
            action={({ params }) => {}}
            element = {<SearchPage/>}/>
        </Routes>
    )
}