import React from "react";
import Navbar from "../Navbar";

export default function LandingPage(props){
    const {user,setUser} = props;
    
    return <>
        <Navbar page="homes"/>
        HELLO !
    </>
}