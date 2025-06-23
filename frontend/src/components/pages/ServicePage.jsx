import React from "react";
import Navbar from "../Navbar";

export default function ServicePage(props){
    const {user,setUser} = props;
    
    return <>
        <Navbar page="services"/>
        Services
    </>
}