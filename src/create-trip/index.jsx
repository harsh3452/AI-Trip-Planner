import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectBudgetOptions, SelectTravelsList } from '@/constants/options';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { AI_PROMPT, chatSession } from '@/service/aimodel';

function CreateTrip() {
  const [place, setPlace] = useState();

  const [formData, setFormData] = useState([]);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }
  useEffect(() => {
    console.log(formData)
  }, [formData]);

  const onGenerateTrip = async() => {
    if (formData?.noOfDays > 5  && !formData?.location||!formData?.budget||!formData?.traveler) {
      toast("Please fill all details!")
      return;
    }
    console.log(formData);
    const FINAL_PROMPT= AI_PROMPT
    .replace('{location}',formData?.location?.label)
    .replace('{totalDays}',formData?.noOfDays)
    .replace('{traveler}',formData?.traveler)
    .replace('{budget}',formData?.budget)
    .replace('{totalDays}',formData?.noOfDays);

    console.log(FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log(result.response.text());
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast("Error generating trip. Please try again.");
    }
  }

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-80 px-5 mt-20'>
      <h2 className='font-bold text-3xl'> Tell us your travel preferences 🏕️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>
      <div className='mt -20 flex flex-col gap-9'>
        <div className='mt-20'>
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
            onChange={(e) => handleInputChange('noOfDays', event.target.value)}
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
             ${formData?.budget == item.title && 'shadow-lg border-black'}
            `}>
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
            ${formData?.traveler == item.people && 'shadow-lg border-black'}
          `}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='text-lg font-bold'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className='my-10 justify-end flex'>
        <Button onClick={onGenerateTrip}>Generate Trip</Button>
      </div>

    </div>
  );
}

export default CreateTrip;
