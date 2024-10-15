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
      console.log(AI_PROMPT);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 transition-all duration-300 ease-in-out hover:shadow-2xl">
        <h2 className="font-bold text-4xl text-gray-800 mb-2">Plan Your Dream Journey 🏕️🌴</h2>
        <p className="text-xl text-gray-600 mb-10">
          Let our AI craft a personalized itinerary based on your preferences.
        </p>
        
        <div className="space-y-12">
          <div className="transition-all duration-300 ease-in-out hover:transform  ">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Destination</h2>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                place,
                onChange: (v) => { setPlace(v); handleInputChange('location', v) },
                styles: {
                  control: (provided) => ({
                    ...provided,
                    borderRadius: '0.5rem',
                    border: '2px solid #e2e8f0',
                    boxShadow: 'none',
                    '&:hover': {
                      border: '2px solid #805ad5',
                    },
                  }),
                },
              }}
            />
          </div>

          <div className="transition-all duration-300 ease-in-out hover:transform ">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Duration</h2>
            <Input 
              placeholder="Ex. 3 days"
              value={formData.noOfDays || ''}
              onChange={(e) => handleInputChange('noOfDays', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
            />
          </div>

          <div className="transition-all duration-300 ease-in-out hover:transform  ">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Budget</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SelectBudgetOptions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange('budget', item.title)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 ${
                    formData?.budget === item.title
                      ? 'border-purple-500 shadow-lg bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="transition-all duration-300 ease-in-out hover:transform  ">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Travel Companions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SelectTravelsList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange('traveler', item.people)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 ${
                    formData?.traveler === item.people
                      ? 'border-purple-500 shadow-lg bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <Button
            disabled={loading}
            onClick={onGenerateTrip}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
            ) : (
              'Generate Your Trip'
            )}
          </Button>
        </div>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className="bg-white rounded-2xl p-8 max-w-md mx-auto">
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="Logo" className="w-24 h-24 mx-auto mb-6" />
              <h2 className="font-bold text-2xl text-gray-800 mb-4 text-center">Sign in with Google</h2>
              <p className="text-gray-600 text-center mb-6">Securely access your account with Google Authentication</p>
              <Button
                onClick={login}
                className="w-full py-3 flex items-center justify-center gap-4 bg-white text-gray-700 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 ease-in-out transform   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <FcGoogle className="h-6 w-6" />
                <span className="font-semibold">Sign in with Google</span>
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Customloading cusloading={cusloading} />
      <Toaster position="bottom-center" />
    </div>
  );
}

export default CreateTrip;