import React, { useCallback, useState } from "react";
import { weatherService } from "../service";

export const WeatherMap = () => {
  const [weatherData, setweatherData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddSearch = useCallback(
    async (e) => {
      e.preventDefault();
      if (e.code === "Enter") {
        await weatherService
          .getWeather(searchValue)
          .then((res) => {
            setErrorMessage("");
            let { data } = res;
            if (
              weatherData.every((city) => Number(city.id) !== Number(data.id))
            ) {
              setweatherData([...weatherData, data]);
            } else if (weatherData.length === 0) {
              setweatherData([...weatherData, data]);
            }
          })
          .catch((err) => {
            setErrorMessage(err.response.data.message);
          });
        setSearchValue("");
      }
    },
    [searchValue, weatherData]
  );

  const handleInputChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search city"
            id="search"
            value={searchValue}
            onKeyUp={handleAddSearch}
            onChange={handleInputChange}
          />
          <span className="text-danger">{errorMessage}</span>
          <ul
            className="city mt-4"
            style={{ listStyleType: "none", paddingLeft: 0 }}
          >
            {weatherData.map((cityWeather) => {
              return (
                <li
                  key={
                    cityWeather.coord.lon +
                    cityWeather.name +
                    cityWeather.coord.lat
                  }
                  className="d-flex align-items-center mb-3"
                >
                  <button
                    className="btn btn-outline-secondary me-3"
                    type="button"
                  >
                    -
                  </button>
                  <p className="mb-0 fs-5">
                    {cityWeather.name} +{cityWeather.main.temp}C
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-lg-4">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              <strong>Kelvin</strong>
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              <strong>Celsius</strong>
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault3"
            />
            <label className="form-check-label" htmlFor="flexRadioDefault3">
              <strong>Fahrenheit</strong>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
