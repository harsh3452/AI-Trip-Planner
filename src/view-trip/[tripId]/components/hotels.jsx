import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    console.log(parsedTripData);

    return (
        <div>
            <h2 className='font-bold text-xl mt-5 mb-3  '>Hotel Recommendations</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {parsedTripData?.hotels?.map((hotel, index) => (
                    <Link to={'https://www.google.com/maps/search/?api=1&query='+hotel?.name+","+hotel?.address} target='_blank'>
                    <div key={index} className=" hover:scale-105 transition-all">
                        <img src={"/landing1.png"} alt={hotel.name} className='rounded-xl'
                        />
                        <div className='my-3 flex flex-col gap-2'>
                            <h2 className='font-medium'>{hotel.name}</h2>
                            <p className='text-xs text-gray-500'>{hotel.address}</p>
                            <p className='text-sm   '>💰{hotel.price}</p>
                            <p className='text-sm'>Rating: {hotel.rating}</p>
                            <p className='text-sm'>Location: {hotel.geo_coordinates}</p>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Hotels;
