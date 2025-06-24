import 'react';
import { useEffect, useRef, useState } from 'react';

export default function MapComponent({ hotels }) {
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.7226, lng: 80.7686 });
  const [zoom, setZoom] = useState(10);
  const [tiles, setTiles] = useState([]);

  useEffect(() => {
    if (hotels.length > 0) {
      const lats = hotels.map(hotel => parseFloat(hotel.location.coordinates.lat));
      const lngs = hotels.map(hotel => parseFloat(hotel.location.coordinates.lng));

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      setMapCenter({ lat: centerLat, lng: centerLng });

      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const maxDiff = Math.max(latDiff, lngDiff);

      let newZoom = 10;
      if (maxDiff < 0.1) newZoom = 12;
      else if (maxDiff < 0.5) newZoom = 10;
      else if (maxDiff < 1) newZoom = 8;
      else if (maxDiff < 5) newZoom = 6;
      else newZoom = 4;

      setZoom(newZoom);
    }
  }, [hotels]);

  const generateTiles = () => {
    const tileSize = 256;
    const mapWidth = 600;
    const mapHeight = 400;
    const tilesX = Math.ceil(mapWidth / tileSize) + 1;
    const tilesY = Math.ceil(mapHeight / tileSize) + 1;

    const centerTileX = Math.floor(((mapCenter.lng + 180) / 360) * Math.pow(2, zoom));
    const centerTileY = Math.floor((1 - Math.log(Math.tan(mapCenter.lat * Math.PI / 180) + 1 / Math.cos(mapCenter.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

    const newTiles = [];

    for (let x = -Math.floor(tilesX/2); x <= Math.floor(tilesX/2); x++) {
      for (let y = -Math.floor(tilesY/2); y <= Math.floor(tilesY/2); y++) {
        const tileX = centerTileX + x;
        const tileY = centerTileY + y;

        if (tileX >= 0 && tileY >= 0 && tileX < Math.pow(2, zoom) && tileY < Math.pow(2, zoom)) {
          newTiles.push({
            url: `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`,
            x: x * tileSize + mapWidth/2 - tileSize/2,
            y: y * tileSize + mapHeight/2 - tileSize/2,
            key: `${tileX}-${tileY}`
          });
        }
      }
    }

    setTiles(newTiles);
  };

  useEffect(() => {
    generateTiles();
  }, [mapCenter, zoom]);

  const getHotelPositions = () => {
    return hotels.map((hotel, index) => {
      const lat = parseFloat(hotel.location.coordinates.lat);
      const lng = parseFloat(hotel.location.coordinates.lng);

      const lngDiff = lng - mapCenter.lng;
      const latDiff = lat - mapCenter.lat;

      const pixelsPerDegree = Math.pow(2, zoom) * 256 / 360;
      const x = 300 + (lngDiff * pixelsPerDegree);
      const y = 200 - (latDiff * pixelsPerDegree * Math.cos(mapCenter.lat * Math.PI / 180));

      return {
        ...hotel,
        x,
        y,
        index
      };
    });
  };

  const hotelPositions = getHotelPositions();

  const handleZoomIn = () => {
    if (zoom < 18) setZoom(zoom + 1);
  };

  const handleZoomOut = () => {
    if (zoom > 1) setZoom(zoom - 1);
  };

  const colors = ["bg-red-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold">Hotel Locations Map</h2>
          <p className="text-blue-100">Showing {hotels.length} hotels</p>
        </div>

        <div className="relative">
          <div 
            ref={mapRef}
            className="relative w-full h-96 bg-blue-100 overflow-hidden"
            style={{ width: '600px', height: '400px', margin: '0 auto' }}
          >
            {tiles.map(tile => (
              <img
                key={tile.key}
                src={tile.url}
                alt="Map tile"
                className="absolute"
                style={{
                  left: tile.x,
                  top: tile.y,
                  width: '256px',
                  height: '256px'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ))}

            {hotelPositions.map((hotel) => (
              <div
                key={hotel.index}
                className="absolute transform -translate-x-1/2 -translate-y-full group"
                style={{ left: hotel.x, top: hotel.y }}
              >
                <div className="relative">
                  <div className={`w-6 h-6 ${colors[hotel.index % colors.length]} rounded-full border-2 border-white shadow-lg flex items-center justify-center`}></div>
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {hotel.title || `Hotel ${hotel.index + 1}`}
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 text-xs px-2 py-1 rounded">
              © OpenStreetMap
            </div>
          </div>

          <div className="absolute top-4 right-4 flex flex-col space-y-1">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center text-lg font-bold"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center text-lg font-bold"
            >
              −
            </button>
          </div>
        </div>

        <div className="p-4 border-t">
          <h3 className="font-semibold mb-2">Hotels on Map:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {hotels.map((hotel, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-full flex-shrink-0`}></div>
                <span className="font-medium">{hotel.title || `Hotel ${index + 1}`}</span>
                <span className="text-gray-500">
                  ({parseFloat(hotel.location.coordinates.lat).toFixed(3)}, {parseFloat(hotel.location.coordinates.lng).toFixed(3)})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
