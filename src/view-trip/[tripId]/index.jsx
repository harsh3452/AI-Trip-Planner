import { Toaster } from '@/components/ui/sonner';
import { db } from '@/lib/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from './components/InfoSection';
import Hotels from './components/hotels';
import Placestovisit from './components/placestovisit';
import Footer from './components/footer';

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    const docRef = doc(db, 'AITrips', tripId);  
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document', docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log('NoData!!');
      toast('No Trip Found');
    }
    console.log(trip);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-10 md:px-20 lg:px-44 xl:px-56 transition-all duration-300">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 transition-all duration-300 ease-in-out hover:shadow-2xl">
        {/* Information Section */}
        <InfoSection trip={trip} />
      </div>

      <div className="mt-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 transition-all duration-300 ease-in-out hover:shadow-2xl">
        {/* Recommended Hotels */}
        <Hotels trip={trip} />
      </div>

      <div className="mt-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 transition-all duration-300 ease-in-out hover:shadow-2xl">
        {/* Daily Plan */}
        <Placestovisit trip={trip} />
      </div>

      <div className="mt-12">
        {/* Footer */}
        <Footer />
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
}

export default ViewTrip;
