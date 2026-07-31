import requests

from config import WeatherConfigError, get_openweather_api_key, load_environment


load_environment()


class WeatherServiceError(RuntimeError):
    """Raised when the OpenWeather service is unavailable or misconfigured."""


def _get_api_key() -> str:
    try:
        return get_openweather_api_key()
    except WeatherConfigError as exc:
        raise WeatherServiceError(str(exc)) from exc


def _raise_weather_error(message: str) -> None:
    raise WeatherServiceError(message)


def get_weather(city: str) -> dict:
    api_key = _get_api_key()

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"q": city, "appid": api_key, "units": "metric"}

    try:
        response = requests.get(url, params=params, timeout=10)

        if response.status_code != 200:
            try:
                payload = response.json()
            except ValueError:
                payload = {}
            message = payload.get("message", "OpenWeather request failed")
            cod = payload.get("cod")
            if str(cod) == "401":
                _raise_weather_error(f"OpenWeather API key is invalid: {message}")
            if str(cod) == "429":
                _raise_weather_error(f"OpenWeather API rate limit exceeded: {message}")
            if str(cod) == "404":
                _raise_weather_error(f"City not found: {city}")
            _raise_weather_error(f"OpenWeather request failed ({response.status_code}): {message}")

        data = response.json()
    except WeatherServiceError:
        raise
    except Exception as exc:
        raise WeatherServiceError(f"OpenWeather request failed: {exc}") from exc

    if isinstance(data, dict) and str(data.get("cod")) in {"401", "429", "404"}:
        message = data.get("message", "OpenWeather request failed")
        _raise_weather_error(f"OpenWeather error: {message}")

    rain = data.get("rain", {}).get("1h", 0) if isinstance(data.get("rain"), dict) else 0
    clouds = data.get("clouds", {}).get("all", 0)
    wind = data.get("wind", {})

    return {
        "city": data.get("name", city),
        "temperature": data.get("main", {}).get("temp"),
        "temp_max": data.get("main", {}).get("temp_max"),
        "humidity": data.get("main", {}).get("humidity"),
        "pressure": data.get("main", {}).get("pressure"),
        "rainfall": rain,
        "wind_speed": wind.get("speed"),
        "clouds": clouds,
        "coord": data.get("coord", {}),
    }


def get_data(lat, lon):
    api_key = _get_api_key()

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"lat": lat, "lon": lon, "appid": api_key, "units": "metric"}

    try:
        response = requests.get(url, params=params, timeout=10)

        if response.status_code != 200:
            try:
                payload = response.json()
            except ValueError:
                payload = {}
            message = payload.get("message", "OpenWeather request failed")
            _raise_weather_error(f"OpenWeather request failed ({response.status_code}): {message}")

        data = response.json()
    except WeatherServiceError:
        raise
    except Exception as exc:
        raise WeatherServiceError(f"OpenWeather request failed: {exc}") from exc

    if isinstance(data, dict) and str(data.get("cod")) in {"401", "429", "404"}:
        _raise_weather_error(f"OpenWeather error: {data.get('message', 'OpenWeather request failed')}")

    main = data.get("main", {})
    wind = data.get("wind", {})
    clouds = data.get("clouds", {})
    rain = data.get("rain", {}).get("1h", 0) if isinstance(data.get("rain"), dict) else 0

    final = [
        main.get("temp", 0),
        main.get("temp_max", 0),
        wind.get("speed", 0),
        clouds.get("all", 0),
        rain,
        main.get("humidity", 0),
    ]
    return final
