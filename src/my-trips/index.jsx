import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import UserTripCard from "./components/UserTripCard";

function MyTrips() {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added state for error handling

    useEffect(() => {
        GetUserTrips();
    }, []);

    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            navigate("/");
            return;
        }

        setLoading(true);
        setError(null); // Reset error state
        setUserTrips([]);

        try {
            const q = query(
                collection(db, "AITrips"),
                where("userEmail", "==", user?.email)
            );
            const querySnapshot = await getDocs(q);
            const trips = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserTrips(trips);
        } catch (error) {
            console.error("Error fetching trips:", error);
            setError("Failed to load trips. Please try again later."); // Set error message
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 transition-all duration-300 ease-in-out hover:shadow-2xl">
                <h2 className="font-bold text-4xl text-gray-800 mb-8">My Adventures</h2>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((item, index) => (
                            <div key={index} className="h-[300px] w-full bg-slate-200 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-2xl text-red-500">{error}</p>
                    </div>
                ) : userTrips.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {userTrips.map((trip, index) => (
                            <UserTripCard key={trip.id} trip={trip} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-2xl text-gray-600">No trips found. Start planning your next adventure!</p>
                        <button 
                            onClick={() => navigate('/create-trip')} // Redirect to new trip creation page
                            className="mt-6 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-800">
                            Plan a New Trip
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyTrips;
