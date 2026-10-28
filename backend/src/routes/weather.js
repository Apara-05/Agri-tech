
import { Router } from 'express';
import WeatherData from '../models/WeatherData.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router(); router.use(protect);
router.get('/',asyncHandler(async(req,res)=>{
 const location=String(req.query.location||req.user.region||'').trim();
 if(!location) return res.status(400).json({message:'Provide a location query or set your region in your profile'});
 if(process.env.OPENWEATHER_API_KEY){
  const url=new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('q',location); url.searchParams.set('appid',process.env.OPENWEATHER_API_KEY); url.searchParams.set('units','metric');
  const response=await fetch(url,{signal:AbortSignal.timeout(8000)});
  const data=await response.json();
  if(!response.ok) return res.status(response.status===404?404:502).json({message:data.message||'Weather provider request failed'});
  const result={location:data.name,temperature:data.main?.temp,humidity:data.main?.humidity,rainfall:data.rain?.['1h']||0,forecastDate:new Date(),pestRiskLevel:'Unknown',source:'OpenWeather'};
  await WeatherData.create(result);
  return res.json({...result,description:data.weather?.[0]?.description||''});
 }
 const latest=await WeatherData.findOne({location:new RegExp(`^${location.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`,'i')}).sort({forecastDate:-1}).lean();
 res.status(200).json({configured:false,message:'Live weather is not configured. Set OPENWEATHER_API_KEY to enable it.',latest:latest||null,location});
}));
export default router;
