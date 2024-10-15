import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REFER_URL } from '@/service/Globalapi';

function UserTripCard({ trip }) {
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    if (trip) {
      getPlacePhotos();
    }
  }, [trip]);

  const getPlacePhotos = async () => {
    try {
      const data = {
        textQuery: trip?.userSelection?.location?.label
      };

      const resp = await GetPlaceDetails(data);
      if (resp.data.places[0]?.photos[3]) {
        const photoUrl = PHOTO_REFER_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
        setPhotoURL(photoUrl);
      }
    } catch (error) {
      console.error('Error fetching place photos:', error);
    }
  };

  return (
    <Link to={'/view-trip/' + trip.id} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
        <div className="relative h-48 w-full">
          <img 
            src={photoURL || '/placeholder-image.jpg'} 
            alt={trip?.userSelection?.location?.label || 'Trip destination'} 
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h2 className="font-bold text-xl text-white truncate">
              {trip?.userSelection?.location?.label}
            </h2>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              {trip?.userSelection?.noOfDays} Days
            </span>
            <span className="inline-block bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs font-bold">
              {trip?.userSelection?.budget}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            {trip?.userSelection?.traveler} Travelers
          </p>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCard;
