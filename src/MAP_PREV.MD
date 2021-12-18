import React, { useEffect, useState } from 'react'
import ReactMapGL from 'react-map-gl'
import PolylineOverlay from './PolylineOverlay'

function Map({ stanice, busevi }) {
    const map_key = 'pk.eyJ1IjoidGFyaWtiZXNpYyIsImEiOiJja3Znd2JzYjkxZ3E3MndxNWxpNHhncjFpIn0.doc_BQK1Yz9aVzRKbVNxEw'
    const map_style = 'mapbox://styles/mapbox/streets-v11'

    const [stanice_formated, setStanice_formated] = useState([])
    const [route_formated, setRoute_formated] = useState("")

    useEffect(() => {                                                       //formating stanice for overlay - setStanice_formated(x)
        const x = stanice.map(stanica => ([
            stanica.location.longitude,
            stanica.location.latitude
        ]))
        setStanice_formated(x)

        const y = stanice.map(stanica => (
            stanica.location.longitude + "," + stanica.location.latitude
        ))
        setRoute_formated(y.join(";"))


    }, [stanice])



    const [viewport, setViewport] = useState({                              //default viewport - on map load - setViewport({})
        latitude: 43.50414741459408,
        longitude: 16.445472774556745,

        width: '100%',
        height: '100%',
        zoom: 15
    })

    useEffect(() => {                                                       //calling matchroute function whenever route_formated changes
        matchRoute(route_formated)
        console.log('mbrale')                                                               //matchRoute(route_formated)
    }, [route_formated])

    const matchRoute = (e) => {
        const url = "https://api.mapbox.com/directions/v5/mapbox/cycling/" + e + "?geometries=geojson&steps=true&access_token=" + map_key;

        fetch(url).then(response => {
            return response.json();
        }).then(console.log(route_formated)).then(json => {
            const coords = json.routes[0].geometry.coordinates;
            console.log("x",coords)
        })
    }

    return (
        <div className="map_wrap">
            <ReactMapGL
            {...viewport}
            mapboxApiAccessToken = {map_key}
            mapStyle = {map_style}
            attributionControl={false}
            onViewportChange={nextViewport => setViewport(nextViewport)}
            >
                <PolylineOverlay points={stanice_formated} />
            </ReactMapGL>
        </div>
        
        
    )
}

export default Map