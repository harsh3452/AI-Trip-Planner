import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REFER_URL } from '@/service/Globalapi';
import React from 'react';
import { useState,useEffect } from 'react';
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
  useEffect(() => {
    place && GetPlacePhotos()
  }, [place])
  const [PhotoURL,setPhotoURL]=useState();

  const GetPlacePhotos = async () => {

    const data = {
      textQuery: place?.place
    }

    const result = await GetPlaceDetails(data).then(resp => {
      console.log(resp.data.places[0].photos[3])
      const Photo_url=PHOTO_REFER_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
      setPhotoURL(Photo_url);
    })
  }
  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+place?.place} target='_blank'>
    <div className='border rounded-xl p-3 mt-2 flex gap-3 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
      {/* Display place image */}
      <img
        src={PhotoURL}
        className='w-[150px] h-[130px] rounded-xl object-cover'
        alt={place?.place || 'Place image'}
      />
      <div>
        <h2 className='font-bold text-lg'>{place?.place || 'Unknown Place'}</h2>
        <p className='text-sm text-gray-500'>{place?.details || 'No details available'}</p>
        <p className='mt-2'>{place?.ticket_pricing}</p>
        <p className='text-sm'>Rating: ⭐{place.rating}</p>
        {/* <Button ><FaMapLocationDot /></Button> */}
       
      </div>
    </div>
    </Link>
  );
}

export default PlaceCardItem;
