import "../node_modules/bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function SetWeather(props) {
  return (
    <div className="weather">
      <h2 id="location">{props.info.city}</h2>
      <div className="weather-boxes">
        <img src={props.info.icon} alt="Weather icon" />
        <p id="current-conditions">{props.info.condition}</p>
        <div className="thw">
          <p id="temperature" className="detail">
            Temperature: {props.info.temperature}
            {props.info.units === "imperial" ? " °F" : " °C"}
          </p>
          <p id="humidity" className="detail">
            Humidity: {props.info.humidity}%
          </p>
          <p id="wind" className="detail">
            Windspeed: {props.info.windspeed}
            {props.info.units === "imperial" ? " mph" : " km/h"}
          </p>
        </div>
      </div>
    </div>
  );
}

class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zipCode: 0,
      units: "",
      items: [],
      condition: "",
      description: "",
      icon: "",
      temperature: 0,
      humidity: 0,
      windspeed: 0,
      city: "",
      error: null,
      hidden: true,
    };
  }

  componentDidMount() {
    document.title = "My Weather";
  }

  handleSubmit(event) {
    event.preventDefault();
    const zipCode = event.target.elements.zipCode.value;
    const units = event.target.elements.units.value;
    const int_length = ("" + zipCode).length;
    if (int_length !== 5) {
      alert("Must enter 5 digit ZIP code!");
    } else {
      fetch(
        "http://api.openweathermap.org/data/2.5/weather?zip=" +
          zipCode +
          "&APPID=f95682bb50f6b15115fb153fe8ea5bce&units=" +
          units
      )
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              items: result,
              condition: result.weather[0].main,
              description: result.weather[0].description,
              icon:
                "http://openweathermap.org/img/w/" +
                result.weather[0].icon +
                ".png",
              temperature: result.main.temp,
              humidity: result.main.humidity,
              windspeed: result.wind.speed,
              city: result.name,
              units: units,
              hidden: false,
            });
            console.log(result.weather[0]);
          },
          (error) => {
            this.setState({
              error,
              hidden: false,
            });
          }
        );
    }
  }

  render() {
    return (
      <div className="container">
        <h1>Weather Page</h1>
        <hr />
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group form-inline">
            <label htmlFor="add-zipcode" id="zipId">
              ZIP Code:{" "}
            </label>
            <input
              name="zipCode"
              type="number"
              className="form-control"
              id="add-zipcode"
              placeholder=""
            />
          </div>

          <div className="form-group form-inline">
            <label htmlFor="select-units" id="unitsId">
              {" "}
              Units:{" "}
            </label>
            <select className="form-control" name="units" id="select-units">
              <option value="imperial">Imperial</option>
              <option value="metric">Metric</option>
            </select>
          </div>
          <button type="submit" id="confirm-button" className="btn btn-primary">
            Get Weather
          </button>
        </form>
        <div id="weather-report">
          <hr />
          {this.state.hidden ? (
            ""
          ) : this.state.error ? (
            <p>Error: {this.state.error}</p>
          ) : (
            <SetWeather info={this.state} />
          )}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Weather />, document.getElementById("root"));
