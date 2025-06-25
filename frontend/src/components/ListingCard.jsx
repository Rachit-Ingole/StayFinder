import { useState } from "react";
import { Heart, Star, MapPin, Users, Bed, Bath } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ListingCard({ listing}){
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate()
  const handleCardClick = () => {
    navigate(`/listing/${listing._id}`);
    console.log(`Navigate to listing ${listing._id}`);
  };
  console.log(listing.images)
  return (
    <div className="group cursor-pointer" onClick={handleCardClick}>
      <div className="relative overflow-hidden rounded-xl mb-3">
        <img 
          src={listing.images[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"}
          alt={listing.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${isLiked ? 'fill-blue-500 text-blue-500' : 'text-gray-600'}`}
          />
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-current text-yellow-400" />
            <span className="text-sm text-gray-600">{listing.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{listing.location.city}, {listing.location.state}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-gray-600 text-sm">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{listing.home.guests} guests</span>
          </div>
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{listing.home.bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{listing.home.bathrooms} bath</span>
          </div>
        </div>
        
        <div className="pt-1">
          <span className="font-semibold text-gray-900">
            ₹{listing.pricing.basePrice.toLocaleString()}
          </span>
          <span className="text-gray-600"> night</span>
        </div>
      </div>
    </div>
  );
};