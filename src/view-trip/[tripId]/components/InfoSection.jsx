import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REFER_URL } from '@/service/Globalapi';
import React, { useEffect, useState } from 'react';
import { FaShare } from "react-icons/fa";

function InfoSection({ trip }) {
  const [photoURL, setPhotoURL] = useState();

  useEffect(() => {
    trip && GetPlacePhotos();
  }, [trip]);

  const GetPlacePhotos = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    };

    const result = await GetPlaceDetails(data).then(resp => {
      const photo = resp.data.places[0]?.photos[3];
      if (photo) {
        const photoUrl = PHOTO_REFER_URL.replace('{NAME}', photo.name);
        setPhotoURL(photoUrl);
      }
    });
  };

  return (
    <div className='mt-6'>
      {/* Location Image */}
      {photoURL ? (
        <img src={photoURL} alt={trip?.userSelection?.location?.label} className='h-[400px] object-cover rounded-xl w-full shadow-lg' />
      ) : (
        <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center rounded-xl">
          <p className="text-gray-400">Image not available</p>
        </div>
      )}

      {/* Trip Details */}
      <div className='flex justify-between items-center mt-6'>
        <div className='flex flex-col gap-2'>
          {/* Location Name */}
          <h2 className='font-bold text-3xl text-gray-800'>
            {trip?.userSelection?.location?.label}
          </h2>

          {/* Trip Information */}
          <div className='flex flex-wrap gap-4 text-gray-600 mt-3'>
            <span className='p-2 bg-gray-200 rounded-full text-sm'>
              📅 {trip?.userSelection?.noOfDays} Days
            </span>
            <span className='p-2 bg-gray-200 rounded-full text-sm'>
              💸 {trip?.userSelection?.budget} Budget
            </span>
            <span className='p-2 bg-gray-200 rounded-full text-sm'>
              🧑‍🤝‍🧑 {trip?.userSelection?.traveler} Travelers
            </span>
          </div>
        </div>

        {/* Share Button */}
        <Button variant="outline" className="h-10 w-10 flex justify-center items-center shadow-lg">
          <FaShare className="text-gray-600" />
        </Button>
      </div>
    </div>
  );
}

export default InfoSection;
