import React, { useEffect, useState } from 'react';
import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
    const [parsedTripData, setParsedTripData] = useState(null);

    useEffect(() => {
        // Check if TripData is a string and parse it
        if (typeof trip?.TripData === 'string') {
            try {
                const parsedData = JSON.parse(trip.TripData);
                setParsedTripData(parsedData);
            } catch (error) {
                console.error("Failed to parse TripData:", error);
            }
        } else {
            setParsedTripData(trip.TripData); // If it's already an object, set it directly
        }
    }, [trip]);

    console.log(parsedTripData); // Debugging

    return (
        <div>
            <h2 className='font-bold text-xl mt-5 mb-3'>Hotel Recommendations</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {parsedTripData?.hotels?.map((hotel, index) => (
                    <HotelCardItem key={index} hotel={hotel} />
                ))}
            </div>
        </div>
    );
}

export default Hotels;

