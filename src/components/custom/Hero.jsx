import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex flex-col items-center max-w-7xl mx-auto py-20 px-4 gap-8 text-center">
                <h1 className="font-extrabold text-[48px] leading-tight sm:text-[60px] md:text-[64px] lg:text-[72px] text-gray-800">
                    <span className="text-[#6b46c1]">Discover Your Next Adventure with AI: </span>
                    Personalized Itineraries at Your Fingertips
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl">
                    Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget. Explore effortlessly, plan smartly!
                </p>
                <Link to={'/create-trip'}>
                    <Button className="px-6 py-3 text-base md:text-lg lg:text-xl text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-300">
                        Get Started. It's Free
                    </Button>
                </Link>
                <img 
                    src='/landing1.png' 
                    className="w-full max-w-5xl mt-10 rounded-lg shadow-lg object-cover"
                    alt="Explore new adventures with AI-driven travel planning" 
                />
            </div>
        </div>
    );
}

export default Hero;
