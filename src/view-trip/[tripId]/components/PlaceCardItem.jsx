import React, { useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REFER_URL } from '@/service/Globalapi';
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
  const [PhotoURL, setPhotoURL] = useState('');

  useEffect(() => {
    place && GetPlacePhotos();
  }, [place]);

  const GetPlacePhotos = async () => {
    const data = {
      textQuery: place?.place,
    };

    const result = await GetPlaceDetails(data).then(resp => {
      const Photo_url = PHOTO_REFER_URL.replace(
        '{NAME}',
        resp.data.places[0].photos[3]?.name
      );
      setPhotoURL(Photo_url);
    });
  };

  return (
    <Link 
      to={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place?.place)} 
      target='_blank'
      className="block w-full h-full hover:scale-105 transition-transform duration-200"
    >
      <div className='flex flex-col items-center justify-between rounded-lg shadow-lg bg-white overflow-hidden h-full'>
        {/* Image Section */}
        <div className='w-full h-48 bg-gray-200'>
          <img
            src={PhotoURL || '/background.jpg'}
            className='object-cover w-full h-full'
            alt={place?.place || 'Place Image'}
          />
        </div>
        {/* Text Section */}
        <div className='flex flex-col p-4 space-y-2 w-full'>
          <h2 className='font-bold text-lg text-gray-900'>
            {place?.place || 'Unknown Place'}
          </h2>
          <p className='text-sm text-gray-500 truncate'>
            {place?.details || 'No details available'}
          </p>
          <p className='mt-2 text-sm text-orange-600 font-semibold'>
            {place?.ticket_pricing || 'No Pricing Info'}
          </p>
          <p className='text-sm'>Rating: ⭐{place?.rating || 'N/A'}</p>
          {/* Time to visit */}
          <p className='text-sm text-blue-500 font-medium'>🕒 Best time to visit: {place?.time || 'Anytime'}</p>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
