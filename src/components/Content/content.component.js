import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../HomePage/homePage.component";

export const Content = () =>{
    return (
        <Routes>
            <Route path="/" exact element = {
                <HomePage/>
            }/>
        </Routes>
    )
}