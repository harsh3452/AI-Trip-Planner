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
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { Navigate } from 'react-router-dom'; // Import Navigate

function Header() {
    const [user, setUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(false); // State to track logout

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
            console.log(resp);
            localStorage.setItem('user', JSON.stringify(resp.data));
            setUser(resp.data);
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
        setIsLoggedOut(true); // Set the state to trigger navigation
    };

    if (isLoggedOut) {
        return <Navigate to="/" />; // Navigate to home page on logout
    }

    return (
        <div className='p-3 shadow-sm flex justify-between items-center px-5'>
            <img src='/logo.svg' alt='Logo' />
            <div className='flex gap-5'>
                {user?.name ? (
                    <div className='flex gap-5'>
                        <a href="/create-trip">
                        <Button variant="outline" className="rounded-4">+ Create Trip</Button>
                        </a>
                        <a href="/my-trips">
                        <Button variant="outline" className="rounded-4">My Trips</Button>
                        </a>
                        <Popover>
                            <PopoverTrigger>
                                <img src={user?.picture} className='h-[35px] w-[35px] rounded-full' alt="User Avatar" />
                            </PopoverTrigger>
                            <PopoverContent>
                                <h2 className='cursor-pointer'
                                    onClick={handleLogout}>Logout</h2>
                            </PopoverContent>
                        </Popover>
                    </div>
                ) : (
                    <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
                )}
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <img src="/logo.svg" alt="Logo" />
                            <h2 className='font-bold text-lg mt-7'>Sign in with Google</h2>
                            <p>Sign in to the App with Google Authentication securely</p>
                            <Button
                                onClick={login}
                                className="w-full mt-5 flex gap-4">
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
