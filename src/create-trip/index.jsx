import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectBudgetOptions, SelectTravelsList } from '@/constants/options';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { AI_PROMPT, chatSession } from '@/service/AIModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase.config';
import { useNavigate } from 'react-router-dom';
import Customloading from '@/components/custom/Customloading';

function CreateTrip() {
  const [cusloading, setcusLoading] = useState(false);
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle form input changes and update state
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    // Save form data to localStorage
    localStorage.setItem('tripFormData', JSON.stringify({
      ...formData,
      [name]: value
    }));
  };

  useEffect(() => {
    // Check if form data is saved in localStorage, and if so, populate the form
    const savedFormData = localStorage.getItem('tripFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });

  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (formData?.noOfDays > 5 && !formData?.location || !formData?.budget || !formData?.traveler) {
      toast("Please fill all details!");
      return;
    }

    setLoading(true);
    setcusLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget);
      
    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      saveAITrip(result.response.text());
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast("Error generating trip. Please try again.");
    }
  };

  const saveAITrip = async (TripData) => {
    setLoading(true);
    setcusLoading(true);
    const docId = Date.now().toString();
    const user = JSON.parse(localStorage.getItem('user'));
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      TripData: TripData,
      userEmail: user?.email,
      id: docId
    });
    setcusLoading(false);
    setLoading(false);
    navigate('/view-trip/' + docId);
  };

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      // Retrieve form data after login
      const savedFormData = localStorage.getItem('tripFormData');
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
      window.location.reload(); // Reload the page after login
    });
  };


  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{backgroundImage: "url(/background.jpg)"}}>
      <div className="absolute inset-0 backdrop-filter backdrop-blur-md bg-white bg-opacity-80"></div>
      <div className='relative sm:px-10 md:px-32 lg:px-56 xl:px-80 px-5 pt-20'>
        <h2 className='font-bold text-3xl'> Tell us your travel preferences 🏕️🌴</h2>
        <p className='mt-3 text-gray-500 text-xl'>
          Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
        </p>
        <div className='mt-20 flex flex-col gap-9'>
          <div>
            <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                place,
                onChange: (v) => { setPlace(v); handleInputChange('location', v) }
              }}
            />
          </div>
          <div>
            <h2 className='text-xl my-3 font-medium'> How many days are you planning your trip?</h2>
            <Input placeholder={'Ex. 3'}
              value={formData.noOfDays || ''}
              onChange={(e) => handleInputChange('noOfDays', e.target.value)}
            />
          </div>
        </div>
        <div>
          <h2 className='text-xl my-3 font-medium'> What is your budget?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg
                ${formData?.budget === item.title && 'shadow-lg border-black'}`}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='text-lg font-bold'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className='text-xl my-4 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectTravelsList.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg
                ${formData?.traveler === item.people && 'shadow-lg border-black'}`}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='text-lg font-bold'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div className='my-10 justify-end flex'>
          <Button
            disabled={loading}
            onClick={onGenerateTrip}>
            {loading ? <AiOutlineLoading3Quarters className=' h-7 w-7 animate-spin' /> : 'Generate Trip'}
          </Button>
        </div>
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="Logo" />
              <h2 className='font-bold text-lg mt-7'>Sign in with Google</h2>
              <p>Sign in to the App with Google Authentication securely</p>
              <Button
                onClick={login}
                className="w-full mt-5 flex gap-4">
                <FcGoogle className='h-7 w-7' />
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Customloading cusloading={cusloading}/>
    </div>
  );
}

export default CreateTrip;
