    import React from 'react';
    import { useState, useEffect } from 'react';
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

      console.log(parsedTripData);  

      return (
        <div>
          <h2 className='font-bold text-lg'>Places to Visit</h2>
          <div>
            {parsedTripData?.itinerary.map((dayItem, dayIndex) => (
              <div key={dayIndex}>
                <h2 className='font-bold text-lg'>{dayItem?.day}</h2>
                <div className='grid md:grid-cols-2 gap-5'>
                  {dayItem.plan.map((planItem, planIndex) => (
                    <div key={planIndex}>
                      <h2 className='font-medium text-sm text-orange-600'>{planItem.time}</h2>
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
