// import React, { useState, useMemo, useRef } from "react";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// const containerStyle = {
//   width: "100%",
//   height: "400px",
// };

// // Sri Lanka boundaries
// const sriLankaBounds = {
//   north: 10.0,
//   south: 5.9,
//   west: 79.5,
//   east: 82.0,
// };

// // Center of Sri Lanka
// const sriLankaCenter = {
//   lat: 7.8731,
//   lng: 80.7718,
// };

// const MapWithClickSelection = ({ getSelectedLocationAddress,address }) => {
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   const [markerPosition, setMarkerPosition] = useState(null);


//   // Restrict map to Sri Lanka bounds
//   const options = useMemo(
//     () => ({
//       restriction: {
//         latLngBounds: sriLankaBounds,
//         strictBounds: true,
//       },
//       streetViewControl: false,
//       mapTypeControl: false,
//     }),
//     []
//   );

//   const handleMapClick = async (event) => {
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();

//     // Check if clicked point is within Sri Lanka bounds
//     if (
//       lat >= sriLankaBounds.south &&
//       lat <= sriLankaBounds.north &&
//       lng >= sriLankaBounds.west &&
//       lng <= sriLankaBounds.east
//     ) {
//       setMarkerPosition({ lat, lng });

//       try {
//         const geocoder = new window.google.maps.Geocoder();
//         geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//           if (status === "OK" && results[0]) {
//             setSelectedPlace({
//               address: results[0].formatted_address,
//               location: { lat, lng },
//             });
//             getSelectedLocationAddress({
//               address: results[0].formatted_address,
//               location: { lat, lng },
//             });
//             console.log("Selected place:", results[0].formatted_address);
//           }
//         });
//       } catch (error) {
//         console.error("Error getting address:", error);
//       }
//     }
//   };

//   return (
//     <div style={{ marginTop: "30px" }}>
//       <LoadScript
//         googleMapsApiKey="AIzaSyD7oIBVhD18sYcf2vm7BDv-ZH1n1H6lBi4"
//         libraries={["places"]}
//       >
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={sriLankaCenter}
//           zoom={1} // Good zoom level for Sri Lanka
//           onClick={handleMapClick}
//           options={options}
//         >
//           {markerPosition && <Marker position={markerPosition} />}
//         </GoogleMap>
//         {/* {selectedPlace && (
//           <div>
//             <h3>Selected Address:</h3>
//             <p>{selectedPlace.address}</p>
//             <p>Latitude: {selectedPlace.location.lat}</p>
//             <p>Longitude: {selectedPlace.location.lng}</p>
//           </div>
//         )} */}
//       </LoadScript>
//     </div>
//   );
// };

// export default MapWithClickSelection;


// ! Worked....
import React, { useState, useMemo, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Constants defined outside the component
const LIBRARIES = ["places"];
const containerStyle = {
  width: "100%",
  height: "400px",
};
const sriLankaBounds = {
  north: 10.0,
  south: 5.9,
  west: 79.5,
  east: 82.0,
};
const sriLankaCenter = {
  lat: 7.8731,
  lng: 80.7718,
};

const MapWithClickSelection = ({ address, getSelectedLocationAddress }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [geocoder, setGeocoder] = useState(null);

  // Using the recommended useJsApiLoader hook
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey:
      API_KEY || "YOUR_API_KEY",
    libraries: LIBRARIES,
  });

  // Memoize map options
  const options = useMemo(
    () => ({
      restriction: {
        latLngBounds: sriLankaBounds,
        strictBounds: true,
      },
      streetViewControl: false,
      mapTypeControl: false,
    }),
    []
  );

  // Initialize geocoder once map is loaded
  useEffect(() => {
    if (isLoaded && !geocoder) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [isLoaded, geocoder]);

  // Handle address changes
  useEffect(() => {
    if (isLoaded && geocoder && address) {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          const position = { lat: location.lat(), lng: location.lng() };
          setMarkerPosition(position);
          map?.panTo(position);
          getSelectedLocationAddress?.({
            address: results[0].formatted_address,
            location: position,
          });
        }
      });
    }
  }, [address, isLoaded, geocoder, map]);

  const handleMapClick = (event) => {
    if (!geocoder) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if (
      lat >= sriLankaBounds.south &&
      lat <= sriLankaBounds.north &&
      lng >= sriLankaBounds.west &&
      lng <= sriLankaBounds.east
    ) {
      const position = { lat, lng };
      setMarkerPosition(position);

      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK" && results[0]) {
          getSelectedLocationAddress?.({
            address: results[0].formatted_address,
            location: position,
          });
        }
      });
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <div style={{ marginTop: "30px", position: "relative", height: "400px" }}>
      {!isLoaded ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading map...
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition || sriLankaCenter}
          zoom={markerPosition ? 12 : 8}
          onClick={handleMapClick}
          options={options}
          onLoad={(map) => setMap(map)}
          onUnmount={() => setMap(null)}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              animation={window.google.maps.Animation.DROP}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default React.memo(MapWithClickSelection);


