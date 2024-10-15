import React, { useState, useEffect } from 'react';
import PlaceCardItem from './PlaceCardItem';

function Placestovisit({ trip }) {
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

  return (
    <div className="mt-10">
      <h2 className='font-bold text-2xl text-gray-800 mb-5'>Places to Visit</h2>
      <div className='space-y-10'>
        {parsedTripData?.itinerary.map((dayItem, dayIndex) => (
          <div key={dayIndex} className="space-y-5">
            {/* Day Heading */}
            <h3 className='font-bold text-xl text-blue-700 bg-blue-50 p-3 rounded-lg'>
              {dayItem?.day || `Day ${dayIndex + 1}`}
            </h3>

            {/* Plans for the Day */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {dayItem.plan.map((planItem, planIndex) => (
                <div key={planIndex}>
                  {/* Pass the entire planItem to PlaceCardItem */}
                  <PlaceCardItem place={planItem} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Placestovisit;
