import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const YourComponent = () => {
  const [breweries, setBreweries] = useState([]);
  const [totalBreweries, setTotalBreweries] = useState(0);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []); // Fetch breweries when component mounts

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('https://api.openbrewerydb.org/v1/breweries');
      setBreweries(response.data);
      setTotalBreweries(response.data.length);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity(''); // Reset selected city when state changes
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterBreweriesByStateAndCity = () => {
    let filteredBreweries = [...breweries];

    if (selectedState) {
      filteredBreweries = filteredBreweries.filter(brewery => brewery.state === selectedState);
    }

    if (selectedCity) {
      filteredBreweries = filteredBreweries.filter(brewery => brewery.city === selectedCity);
    }

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filteredBreweries = filteredBreweries.filter(brewery =>
        brewery.name.toLowerCase().includes(searchTermLower)
      );
    }

    return filteredBreweries;
  };

  return (
    <div>
      <header>
        <h1>Brewery Finder</h1>
      </header>
      <div className="content">
        <div className="filters">
          <label htmlFor="state">Filter by State:</label>
          <select id="state" value={selectedState} onChange={handleStateChange}>
            <option value="">All States</option>
            {[...new Set(breweries.map(brewery => brewery.state))].map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <label htmlFor="city">Filter by City:</label>
          <select id="city" value={selectedCity} onChange={handleCityChange}>
            <option value="">All Cities</option>
            {selectedState && [...new Set(breweries.filter(brewery => brewery.state === selectedState).map(brewery => brewery.city))].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search for Breweries"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="card">
          <h2>Total Number of Breweries: {totalBreweries}</h2>
          {/* Loading and Error Messages */}
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {/* Brewery List */}
          <ul>
            {filterBreweriesByStateAndCity().map(brewery => (
              <li key={brewery.id}>
                <h3>{brewery.name}</h3>
                <p>City: {brewery.city}</p>
                <p>State: {brewery.state}</p>
                <p>Type: {brewery.brewery_type}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default YourComponent;
