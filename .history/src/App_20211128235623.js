
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
  }, [stanice, firstLocation, secondLocation])

  const findNearestStations = () => {
    const x = findNearest({...firstLocation}, //Users nearest station
      stanice.map(stanica => ({
        latitude: stanica.location.latitude,
        longitude: stanica.location.longitude
      }))
    )
    console.log(x)
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
        console.log(stanica)
      }
      else if ((stanica.location.longitude, stanica.location.latitude) === (y.longitude,y.latitude)) {
        setNearestB(stanica)
      }
    })
  }
  console.log(nearestA)
  useEffect(() => {
    if(nearestA && nearestB) {
      getBus()
    }
  }, [nearestA, nearestB])

  const getBus = () => { //setFoundedBus(bus)
    busevi.map(bus => {
      if(bus.stanice.includes(nearestA.name && nearestB.name)) {
        setFoundedBus(bus)
      }
    })
  }

  return (
    <div className="app">
      <div className="map">
        <Map stanice = {stanice} foundedBus = {foundedBus} firstLocation = {firstLocation} setFirstLocation = {setFirstLocation} secondLocation = {secondLocation} nearestA = {nearestA} nearestB = {nearestB} />
      </div>
    </div>
  );
}

export default App;
