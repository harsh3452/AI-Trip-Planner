import React, { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";
import { collection, query, where, getDocs, Query } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import UserTripCard from "./components/UserTripCard";

function MyTrips() {
    const navigation = useNavigation();
    const [userTrips, setUserTrips] = useState([]);
    useEffect(() => {
        GetUserTrips();
    }, []);
    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            navigation("/");
            return;
        }
        setUserTrips([]);
        const q = query(
            collection(db, "AITrips"),
            where("userEmail", "==", user?.email)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            setUserTrips((prevVal) => [...prevVal, doc.data()]);
        });
    };

    return (
        <div className="sm:px-10 md:px-32 lg:px-56 xl:px-80 px-5 mt-20">
            <h2 className="font-bold text-3xl">My Trips</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">
                {userTrips?.length>0?userTrips.map((trip, index) => (
                    <UserTripCard trip={trip} />
                
                ))
            :[1,2,3,4,5,6].map((item,index)=>(
                <div key={index} className="h-[300px] w-full bg-slate-200 animate-pulse round-xl">

                </div>
            ))
            }
            </div>
        </div>
    );
}

export default MyTrips;
