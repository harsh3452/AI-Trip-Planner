import { Button } from '@/components/ui/button'
import { GetPlaceDetails, PHOTO_REFER_URL } from '@/service/Globalapi';
import React, { useEffect, useState } from 'react'
import { FaShare } from "react-icons/fa";

function InfoSection({ trip }) {
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
      console.log(resp.data)
      const Photo_url=PHOTO_REFER_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
      setPhotoURL(Photo_url);
    })
  }
  return (
    <div>
      <img src={PhotoURl} alt="" className='h-[400px] object-cover rounded-xl w-full' />
      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.label}</h2>
          <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500'> 📅 {trip?.userSelection?.noOfDays} Day</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500'>   {trip?.userSelection?.budget} Budget</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500'> 🧑‍🤝‍🧑 No of Travelers : {trip?.userSelection?.traveler} People</h2>


          </div>
        </div>
        <Button><FaShare /></Button>
      </div>
    </div>


  )
}

export default InfoSection
