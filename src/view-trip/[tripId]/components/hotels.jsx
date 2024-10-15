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
        <div className="mt-10">
            {/* Title */}
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
                Hotel Recommendations
            </h2>

            {/* Hotels Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                {parsedTripData?.hotels?.map((hotel, index) => (
                    <HotelCardItem key={index} hotel={hotel} />
                ))}
            </div>

            {/* If no hotels are available */}
            {parsedTripData?.hotels?.length === 0 && (
                <p className="text-gray-500 mt-5 text-center">
                    No hotel recommendations available for this trip.
                </p>
            )}
        </div>
    );
}

export default Hotels;
