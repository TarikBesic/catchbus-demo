import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import PolylineOverlay from './PolylineOverlay'
import Geocoder from 'react-map-gl-geocoder' //Autocomplete searhbar
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import gpsIcon from './icons/gps.png'
import './Map.css';

function Map({ stanice, foundedBus, firstLocation, setFirstLocation, secondLocation, nearestA, nearestB }) {
    const map_key = 'pk.eyJ1IjoidGFyaWtiZXNpYyIsImEiOiJja3Znd2JzYjkxZ3E3MndxNWxpNHhncjFpIn0.doc_BQK1Yz9aVzRKbVNxEw'
    const map_style = 'mapbox://styles/tarikbesic/ckvgxnb320ene14oaqx6umnf8' //mapbox://styles/tarikbesic/ckvgxnb320ene14oaqx6umnf8
    const mapRef = useRef()

    const [apiCoords, setApiCoords] = useState()
    const [apiWalkingCoords, setApiWalkingCoords] = useState()

    const [viewport, setViewport] = useState({//default viewport - on map load - setViewport({})
        latitude: 43.51149720165839,
        longitude: 16.444448199834238,

        width: '100%',
        height: '100%',
        zoom: 13
    })

    useEffect(() => {
        console.log("Runned_3")
    }, [nearestA])

    useEffect(() => { //when the bus gets founded requesting the route of the bus and walking path
        if(foundedBus) {
            console.log("Did run2")
            const indexA = foundedBus.stanice.indexOf(nearestA.name)
            const indexB = foundedBus.stanice.indexOf(nearestB.name)

            const potrebneStanice = foundedBus.stanice.slice(indexA, indexB+1)
            
            const bus_stations = potrebneStanice.map(stanica => stanice.find(({name}) => stanica === name)?.location);
            const coords = bus_stations.map(station => (
                station.longitude + "," + station.latitude
            )).join(";")
            matchRoute(coords)

            const walkingCoords = firstLocation.longitude + "," + firstLocation.latitude + ";" + nearestA.location.longitude + "," + nearestA.location.latitude
            matchWalking(walkingCoords)

        }
    }, [foundedBus, nearestA, nearestB])

    const matchRoute = (e) => { //Bus route
        const url = "https://api.mapbox.com/directions/v5/mapbox/cycling/" + e + "?geometries=geojson&overview=full&access_token=" + map_key;
        fetch(url).then(response => {
            return response.json();
        }).then(json => {
            const coords = json.routes[0].geometry.coordinates;
            setApiCoords(coords)
        })
    }
    
    const matchWalking = (e) => { //User's walking path
        const url = "https://api.mapbox.com/directions/v5/mapbox/cycling/" + e + "?geometries=geojson&access_token=" + map_key;
        fetch(url).then(response => {
            return response.json();
        }).then(json => {
            const coords = json.routes[0].geometry.coordinates;
            setApiWalkingCoords(coords)
        })
    }
    const handleGeocoderChange = useCallback(
        (newViewport) => {
            setViewport(newViewport)
            console.log(newViewport)
            setFirstLocation({latitude: newViewport.latitude, longitude: newViewport.longitude})
        },
        []
    );
    return (
        <div className="map_wrap">
            <ReactMapGL
            {...viewport}
            ref={mapRef}
            mapboxApiAccessToken = {map_key}
            mapStyle = {map_style}
            attributionControl={false}
            onViewportChange={nextViewport => setViewport(nextViewport)}
            >
                {stanice.map(stanica => (
                    <Marker
                    key={stanica.name}
                    latitude={stanica.location.latitude}
                    longitude={stanica.location.longitude}
                    offsetTop={-20}      offsetLeft={-7}
                    >
                        <img className = "icon" src = {gpsIcon}></img>
                        {stanica.name}
                    </Marker>
                ))}
                <PolylineOverlay color={'red'} points={apiCoords} />
                <PolylineOverlay color={'purple'} points={apiWalkingCoords} />
                <Geocoder
                mapRef={mapRef}
                onViewportChange={handleGeocoderChange} 
                mapboxApiAccessToken={map_key}
                position="top-left"
                countries='hr'
                placeholder='Gdje idete?'
                //proximity = {{latitude: 43.50804, longitude: 16.44001}}
                />
            </ReactMapGL>
        </div>
        
        
    )
}

export default Map