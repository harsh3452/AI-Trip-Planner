import { GetPlaceDetails, PHOTO_REFER_URL } from '@/service/Globalapi';
import React from 'react';
import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ hotel }) {

    useEffect(() => {
        hotel && GetPlacePhotos()
      }, [hotel])
      const [PhotoURl,setPhotoURL]=useState();
    
      const GetPlacePhotos = async () => {
    
        const data = {
          textQuery: hotel?.name
        }
    
        const result = await GetPlaceDetails(data).then(resp => {
          console.log(resp.data.places[0].photos[3])
          const Photo_url=PHOTO_REFER_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
          setPhotoURL(Photo_url);
        })
      }
    return (
        <div>
            <Link to={'https://www.google.com/maps/search/?api=1&query=' + hotel?.name + "," + hotel?.address} target='_blank'>
                <div className="hover:scale-105 transition-all">
                    <img src={PhotoURl} alt={hotel?.name} className='rounded-xl h-[400px] object-cover' />
                    <div className='my-3 flex flex-col gap-2'>
                        <h2 className='font-medium'>{hotel?.name}</h2>
                        <p className='text-xs text-gray-500'>{hotel?.address}</p>
                        <p className='text-sm'>💰{hotel?.price}</p>
                        <p className='text-sm'>Rating: ⭐{hotel?.rating}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default HotelCardItem;
