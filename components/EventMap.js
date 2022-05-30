import React, { useState, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import styles from '@/styles/EventMap.module.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;

export default function EventMap({ evt }) {
    const mapContainerRef = useRef(null);

    const [lat, setLat] = useState(40.712772);
    const [lng, setLng] = useState(-73.935242);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        const geopifyAddress = async (evt) => {
            var requestOptions = {
                method: 'GET',
            };
            await fetch(
                `https://api.geoapify.com/v1/geocode/search?text=${evt.attributes.address}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`,
                requestOptions
            )
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    let i = 0;
                    const arrayLength = result.features;
                    // count the MapBox max nr of results with actual Map coordinates
                    const count = arrayLength.filter((item) => item.bbox !== undefined);
                    console.log(count);
                    if (count.length > 0) {
                        // choose first result with actual Map coordinates
                        console.log('found address');
                        setLng(count[0].bbox[0]);
                        setLat(count[0].bbox[1]);
                    }
                })
                .catch((error) => console.log('error', error));
        };
        geopifyAddress(evt);

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
        });

        // Create a new marker.
        const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.on('move', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });
        // Clean up on unmount
        return () => map.remove();
    }, [lat, lng]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {/* <div className={styles.sidebarStyle}>
                <div>
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
            </div> */}
            <div className={styles.mapContainer} ref={mapContainerRef} style={{ border: '1px solid #000000', height: '500px', width: '100%' }} />
        </div>
    );
}
