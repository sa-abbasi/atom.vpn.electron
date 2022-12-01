import React, { useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { CommsFacade } from '../CommsFacade';

const CountryListComponent = ({ loginInfo, setloginInfo }) => {
  const commsFacade = CommsFacade;

  const [countries, setCountries] = useState([]);

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
      })
      .catch((error) => {
        console.log(`getcountries error ${error}`);
      });
  };

  return (
    <>
      <h2 className="text-center w-100" style={{ color: 'black' }}>
        Countries List
      </h2>

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
        <div className="form-group mt-4 mb-4 text-center ">
          <Link to="login">Back To Home</Link>
        </div>
      </div>

      <div
        style={{
          overflowY: 'scroll',
          backgroundColor: 'black',
          height: '400px',
        }}
      >
        <table rules="all">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>S.No.</th>
              <th>Name</th>
              <th style={{ width: '90px' }}>ISO Code</th>
              <th style={{ width: '120px' }}>Latitue</th>
              <th style={{ width: '120px' }}>Longitude</th>
              <th>Recom. Protocol</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{country.name}</td>
                <td>{country.iso_code}</td>
                <td>{country.latitude}</td>
                <td>{country.longitude}</td>
                <td>{country.recommended_protocol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CountryListComponent;
