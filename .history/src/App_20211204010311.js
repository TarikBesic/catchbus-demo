
import './App.css';
import db from './firebase';
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import Map from './Map';
import { findNearest } from 'geolib'

function App() {
  const [busevi, setBusevi] = useState([])
  const [stanice, setStanice] = useState([])

  const [firstLocation, setFirstLocation] = useState()
  const [secondLocation, setSecondLocation] = useState()

  const [nearestA, setNearestA] = useState()
  const [nearestB, setNearestB] = useState()

  const [foundedBus, setFoundedBus] = useState()

  const [ready, setReady] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      const dataBusevi = await getDocs(collection(db, 'busevi'))
      setBusevi(dataBusevi.docs.map(doc => ({...doc.data(), id: doc.id})))

      const dataStanice = await getDocs(collection(db, 'stanice'))
      setStanice(dataStanice.docs.map(doc => ({...doc.data()})))
    }
    fetchData();
    setFirstLocation({
      latitude: 43.51616,
      longitude: 16.4419
      })
    setSecondLocation({
      latitude: 43.50275710001593,
      longitude: 16.442581358355
    })
  }, [])

  useEffect(() => {
    findNearestStations()
    setReady(true)
  }, [firstLocation, secondLocation, stanice])

  const findNearestStations = () => {
    const x = findNearest({...firstLocation}, //Users nearest station
      stanice.map(stanica => ({
        latitude: stanica.location.latitude,
        longitude: stanica.location.longitude
      }))
    )
    const y = findNearest({...secondLocation}, //Selected place nearest station
      stanice.map(stanica => ({
        latitude: stanica.location.latitude,
        longitude: stanica.location.longitude
      }))
    )

    //After we got a location of the nearest one, lets get its name ↓

    stanice.map(stanica => {  //setNearestA(stanica) setNearestB(stanica)
      if((stanica.location.longitude, stanica.location.latitude) === (x.longitude,x.latitude)) {
        setNearestA(stanica)
      }
      else if ((stanica.location.longitude, stanica.location.latitude) === (y.longitude,y.latitude)) {
        setNearestB(stanica)
      }
    })
  }

  useEffect(() => {
    if(nearestA && nearestB) {
      getBus()
      console.log('Did run1')
      console.log(nearestA.name)
      setReady(true)
    }
  }, [nearestA, nearestB])

  const getBus = () => { //setFoundedBus(bus)
    busevi.map(bus => {
      if(bus.stanice.includes(nearestA.name && nearestB.name)) {
        setFoundedBus(bus)
        console.log(bus.name)
        console.log(foundedBus)
      }
    })
  }
  return (
    <div className="app">
      <div className="map">
        <Map ready = {ready} stanice = {stanice} foundedBus = {foundedBus} firstLocation = {firstLocation} setFirstLocation = {setFirstLocation} secondLocation = {secondLocation} nearestA = {nearestA} nearestB = {nearestB} ready = {ready} setReady = {setReady} />
      </div>
    </div>
  );
}

export default App;
