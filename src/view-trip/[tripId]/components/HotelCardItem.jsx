import { GetPlaceDetails, PHOTO_REFER_URL } from '@/service/Globalapi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ hotel }) {
  const [PhotoURL, setPhotoURL] = useState();

  useEffect(() => {
    hotel && GetPlacePhotos();
  }, [hotel]);

  const GetPlacePhotos = async () => {
    const data = {
      textQuery: hotel?.name,
    };

    const result = await GetPlaceDetails(data).then((resp) => {
      const photo = resp.data.places[0].photos[3];
      if (photo) {
        const photo_url = PHOTO_REFER_URL.replace('{NAME}', photo.name);
        setPhotoURL(photo_url);
      }
    });
  };

  return (
    <div className="hover:scale-105 transition-transform duration-300 ease-in-out">
      <Link to={'https://www.google.com/maps/search/?api=1&query=' + hotel?.name + "," + hotel?.address} target="_blank">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl">
          {/* Image Section */}
          <img
            src={PhotoURL || '/background.jpg'}
            alt={hotel?.name}
            className="w-full h-[250px] object-cover rounded-t-2xl"
          />

          {/* Hotel Info Section */}
          <div className="p-5 space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              {hotel?.name}
            </h2>
            <p className="text-sm text-gray-500">{hotel?.address}</p>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">💰 {hotel?.price}</p>
              <p className="text-sm font-medium text-gray-700">⭐ {hotel?.rating}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HotelCardItem;
