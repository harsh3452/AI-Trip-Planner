import axios from "axios"

const BASE_URL ='https://places.googleapis.com/v1/places:searchText'

const config={
    headers:{
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY1,
        'X-Goog-FieldMask': [
            'places.photos',
            'places.displayName',
            'places.id'
        ]
    }
}
export const PHOTO_REFER_URL='https://places.googleapis.com/v1/{NAME}/media?max_height_px=1000&max_width_px=1000&key='+import.meta.env.VITE_GOOGLE_PLACE_API_KEY1
export const GetPlaceDetails=(data)=>axios.post(BASE_URL,data,config)