import { useState } from 'react'
import './App.css'

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [inputs, setInputs] = useState({
    img_src: "http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01004/opgs/edr/fcam/FLB_486615455EDR_F0481570FHAZ00323M_.JPG",
    sol: "1004",
    earth_date: "2015-06-03",
    camera_name: "FHAZ",
  });
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const [bannedSols, setBannedSols] = useState([]);
  const [bannedCameras, setBannedCameras] = useState([]);
  const [bannedDates, setBannedDates] = useState([]);

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    if (json.photos.length == 0) {
      alert("Oops! Something went wrong with that query, let's try again!")
    }
    else {
      const filteredJson = json.photos.filter(item => !bannedSols.includes(item.sol));
      const filteredJson2 = filteredJson.filter(item => !bannedCameras.includes(item.camera_name));
      const filteredJson3 = filteredJson2.filter(item => !bannedDates.includes(item.earth_date));
      const randomQuery = Math.floor(Math.random() * filteredJson3.length);
      setInputs({
        img_src: filteredJson3[randomQuery].img_src,
        sol: filteredJson3[randomQuery].sol,
        earth_date: filteredJson3[randomQuery].earth_date,
        camera_name: filteredJson3[randomQuery].camera.name,
      });
    }
  }

  const makeQuery = () => {
    /*
    let randomSol;
    do {
        randomSol = Math.floor(Math.random() * (4100));
    } while (!bannedSols.includes(randomSol));
    */
    const randomSol = Math.floor(Math.random() * (4100));
    let query = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${randomSol}&api_key=${ACCESS_KEY}`;
    callAPI(query).catch(console.error);
  }

  const banSol = (attribute) => {
    setBannedAttributes([...bannedAttributes, attribute]);
    setBannedSols([...bannedSols, attribute]);
  }

  const banDate = (attribute) => {
    setBannedAttributes([...bannedAttributes, attribute]);
    setBannedDates([...bannedDates, attribute]);
  }

  const banCamera = (attribute) => {
    setBannedAttributes([...bannedAttributes, attribute]);
    setBannedCameras([...bannedCameras, attribute]);
  }

  return (
    <div>
      <h1>Mars Curiosity Rover</h1>
      <br/>
      <div class="flex-container">
        <button type="button" name="sol" onClick={() => banSol(inputs.sol)}>{inputs.sol}</button>
        <button type="button" name="earth_date" onClick={() => banDate(inputs.earth_date)}>{inputs.earth_date}</button>
        <button type="button" name="camera_name" onClick={() => banCamera(inputs.camera_name)}>{inputs.camera_name}</button>
      </div>
      <br/>
      <img src={inputs.img_src} width="500" height="500"></img>
      <br/>
      <button type="button" onClick={makeQuery}>Get Image!</button>
      <div>
      <hr/>
      <div>
        <h2>Ban List</h2>
        <h4>Select an attribute in your listing to ban it</h4>
        <div>
        {bannedAttributes.map((attribute, index) => (
            <div key={index} className="ban-item">
                <button>{attribute}</button>
            </div>
        ))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default App