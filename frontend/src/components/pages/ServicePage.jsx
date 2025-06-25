import React from "react";
import Navbar from "../Navbar";

export default function ServicePage(props){
    const {user, setUser} = props;
    
    return (
        <>
            <Navbar page="services"/>
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 pt-20">
                <h1 className="text-6xl font-bold text-blue-600 mb-4">Coming Soon</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Services Page</h2>
                <p className="text-gray-600 mb-6 max-w-md">
                    Not implemented yet!
                </p>
                <div className="flex space-x-2 mb-6">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <p className="text-sm text-gray-500">
                    Coming Soon...
                </p>
            </div>
        </>
    );
}