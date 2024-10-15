import { Button } from '../ui/button';
import React, { useEffect, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function Header() {
    const [user, setUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error)
    });

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'Application/json'
            }
        }).then((resp) => {
            localStorage.setItem('user', JSON.stringify(resp.data));
            setUser(resp.data);
            setOpenDialog(false);
        });
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogout = () => {
        googleLogout();
        localStorage.clear();
        setUser(null);
        setIsLoggedOut(true);
        window.location.href = "/"; // Redirect to home
        window.location.reload();   // Force page reload
    };
    
    if (isLoggedOut) {
        return <Navigate to="/" />;
    }

    return (
        <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 h-[180px]">
            <div className="px-8 py-8 h-full">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-md rounded-lg shadow-lg h-full p-6">
                    <div className="flex justify-between items-center w-full">
                        <a href="/" className="transition-transform hover:scale-105">
                            <img src='/logo2.svg' alt='Logo' className='h-16' />
                        </a>
                        <div className='flex gap-5 items-center'>
                            {user?.name ? (
                                <div className='flex gap-5 items-center'>
                                    <a href="/create-trip">
                                        <Button variant="outline" className="rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors duration-300">+ Create Trip</Button>
                                    </a>
                                    <a href="/my-trips">
                                        <Button variant="outline" className="rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors duration-300">My Trips</Button>
                                    </a>
                                    <Popover>
                                        <PopoverTrigger>
                                            <img src={user?.picture} className='h-10 w-10 rounded-full border-2 border-purple-300 transition-transform hover:scale-110' alt="User Avatar" />
                                        </PopoverTrigger>
                                        <PopoverContent className="bg-white rounded-lg shadow-lg p-4">
                                            <h2 className='cursor-pointer text-purple-700 hover:text-purple-900 transition-colors duration-300'
                                                onClick={handleLogout}>Logout</h2>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            ) : (
                                <Button onClick={() => setOpenDialog(true)} className="bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300">Sign In</Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-white/90 backdrop-blur-md rounded-lg shadow-xl p-8">
                    <DialogHeader>
                        <DialogDescription className="space-y-6">
                            <img src="/logo2.svg" alt="Logo" className="mx-auto h-20" />
                            <h2 className='font-bold text-2xl text-purple-800 mt-7'>Sign in with Google</h2>
                            <p className="text-gray-600">Sign in to the App with Google Authentication securely</p>
                            <Button
                                onClick={login}
                                className="w-full mt-5 flex gap-4 items-center justify-center bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300">
                                <FcGoogle className='h-7 w-7' />
                                Sign in with Google
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Header;
