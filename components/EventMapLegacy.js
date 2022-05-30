import Image from 'next/image';
import { useState, useEffect } from 'react';
import ReactMapGl, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Geocode from 'react-geocode';

export default function EventMap({ evt }) {
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewport, setViewport] = useState({
        latitude: 40.712772,
        longitude: -73.935242,
        width: '100%',
        height: '500px',
        zoom: 12,
    });

    useEffect(() => {
        // Get latitude & longitude from address.
        const requestOptions = {
            method: 'GET',
        };
        fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${evt.attributes.address}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                const lng = result.features[0].bbox[0];
                const lat = result.features[0].bbox[1];
                setLat(lat);
                setLng(lng);
                setViewport({ ...viewport, latitude: lat, longitude: lng });
                setLoading(false);
            })
            .catch((error) => console.log('error', error));
        // Geocode.fromAddress(evt.attributes.address).then(
        //     (response) => {
        //         const { lat, lng } = response.results[0].geometry.location;
        //         setLat(lat);
        //         setLng(lng);
        //         setViewport({ ...viewport, latitude: lat, longitude: lng });
        //         setLoading(false);
        //     },
        //     (error) => {
        //         console.error(error);
        //     }
        // );
    }, []);

    console.log(lat, lng);

    // Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);

    if (loading) return false;

    return (
        <ReactMapGl {...viewport} mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN} onViewportChange={(vp) => setViewport(vp)}>
            <Marker key={evt.id} latitude={lat} longitude={lng}>
                <Image src='/images/pin.svg' width={30} height={30} alt={evt.attributes.name} />
            </Marker>
        </ReactMapGl>
    );
}
