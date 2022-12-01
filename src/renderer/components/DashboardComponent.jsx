import React, { useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { CommsFacade } from '../CommsFacade';
import CountryListComponent from './CountryListComponent';

const DashboardComponent = ({ loginInfo, setloginInfo }) => {
  const commsFacade = CommsFacade;

  const [countries, setCountries] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [cities, setCities] = useState([]);
  const [featureId, setFeatureId] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setloginInfo({
      ...loginInfo,
      [name]: value,
    });
  };

  const handleConnectClick = (e) => {
    return redirect('/');
  };

  const getCountries = (e) => {
    commsFacade
      .GetCountryList()
      .then((result) => {
        console.log('received countries');
        //console.log(result);
        setCountries(result.Result);
        setFeatureId(1);
      })
      .catch((error) => {
        console.log(`getcountries error ${error}`);
      });
  };

  const getProtocols = (e) => {
    commsFacade
      .GetProtocols()
      .then((result) => {
        console.log('received protocols');
        //console.log(result);
        setProtocols(result.Result);
      })
      .catch((error) => {
        console.log(`getprotocol error ${error}`);
      });
  };

  const getCities = (e) => {
    commsFacade
      .GetProtocols()
      .then((result) => {
        console.log('received cities');
        //console.log(result);
        setCities(result.Result);
      })
      .catch((error) => {
        console.log(`getcities error ${error}`);
      });
  };

  return (
    <>
      <div>
        <div className="form-group mt-4 text-center ">
          <button
            type="button"
            className="btn btn-sm btn-primary w-50"
            onClick={getCountries}
          >
            Get Countries
          </button>
        </div>

        <div className="form-group mt-4 text-center ">
          <button
            type="button"
            className="btn btn-sm btn-primary w-50"
            onClick={getCountries}
          >
            Get Protocols
          </button>
        </div>

        <div className="form-group mt-4 text-center ">
          <button
            type="button"
            className="btn btn-sm btn-primary w-50"
            onClick={getCountries}
          >
            Get Cities
          </button>
        </div>

        <div className="form-group mt-4 text-center ">
          <Link to="login">Back To Home</Link>
        </div>
      </div>

<div>
{
  if(featureId===1)
  {
    <CountryListComponent ></CountryListComponent>
  }
}

</div>

    </>
  );
};

export default DashboardComponent;
