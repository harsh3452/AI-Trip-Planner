import { Toaster } from '@/components/ui/sonner';
import { db } from '@/lib/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import InfoSection from './components/InfoSection';
import Hotels from './components/hotels';
import Placestovisit from './components/placestovisit';
import Footer from './components/Footer';

function ViewTrip() {

    const {tripId}=useParams();
    const [trip,setTrip]=useState([]);
    useEffect(()=> {
        tripId&&GetTripData();
    },[tripId])

    const GetTripData = async() => {
        const docRef=doc(db,'AITrips',tripId);
        const docSnap =await  getDoc(docRef);
        if(docSnap.exists()){
            console.log("Document",docSnap.data());
            setTrip(docSnap.data());
        } else {
            console.log("NoData!!");     
            toast("No Trip Found");
        }
        console.log(trip);
    }
  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
       {/* Information Section  */}
        <InfoSection trip={trip}/>    
      
       {/* Recommeded Hotels */}
        <Hotels trip={trip}/>
       {/* Daily Plan */}
        <Placestovisit trip={trip}/>
       {/* Footer */}
        <Footer/>
    </div>
  )     
}

export default ViewTrip
