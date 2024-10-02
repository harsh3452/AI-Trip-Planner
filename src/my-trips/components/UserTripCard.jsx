import { GetPlaceDetails, PHOTO_REFER_URL } from '@/service/Globalapi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function UserTripCard({trip}) {
    useEffect(() => {
        trip && GetPlacePhotos()
      }, [trip])
      const [PhotoURl,setPhotoURL]=useState();
    
      const GetPlacePhotos = async () => {
    
        const data = {
          textQuery: trip?.userSelection?.location?.label
        }
    
        const result = await GetPlaceDetails(data).then(resp => {
          console.log(resp.data.places[0].photos[3])
          const Photo_url=PHOTO_REFER_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
          setPhotoURL(Photo_url);
        })
      }
  return (
    <Link to={'/view-trip/'+trip.id} target='_blank'>
    <div className='hover:scale-105 transition-all'>
      <img src={PhotoURl} alt="" className='object-cover rounded-xl h-[250px] w-[300px]'/>
      <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
      <h2>{trip?.userSelection?.noOfDays} Days with {trip?.userSelection?.budget} budget</h2>
    </div>
    </Link>
  )
}

export default UserTripCard
