import React, { useCallback, useState } from "react";
import { weatherService } from "../service";

export const WeatherMap = () => {
  const [weatherData, setweatherData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tempType, setTempType] = useState("Kelvin");

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

  const changeTempType = useCallback((e) => {
    setTempType(e.target.value);
  }, []);

  const tempValue = useCallback(
    (temp) => {
      if (tempType === "Celsius") {
        temp = temp - 273.15;
        return `${temp > 0 ? "+" : (temp = 0 ? " " : "-")}${temp.toFixed(0)}C`;
      }
      if (tempType === "Fahrenheit") {
        temp = (temp * 9) / 5 - 459.67;
        return `${temp > 0 ? "+" : (temp = 0 ? " " : "-")}${temp.toFixed(2)}F`;
      }
      return `${temp > 0 ? "+" : (temp = 0 ? " " : "-")}${temp.toFixed(2)}K`;
    },
    [tempType]
  );

  const deleteCity = useCallback(
    (id) => {
      setweatherData(weatherData.filter(city=>city.id !== id))
    },
    [weatherData],
  )

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
                    onClick={()=>deleteCity(cityWeather.id)}
                  >
                    -
                  </button>
                  <p className="mb-0 fs-5">
                    {cityWeather.name} {tempValue(cityWeather.main.temp)}
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
              value="Kelvin"
              defaultChecked
              onClick={changeTempType}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              <strong>Kelvin</strong>
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              value="Celsius"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              onClick={changeTempType}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              <strong>Celsius</strong>
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              value="Fahrenheit"
              name="flexRadioDefault"
              id="flexRadioDefault3"
              onClick={changeTempType}
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
