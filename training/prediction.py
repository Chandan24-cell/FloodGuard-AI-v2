import os

import requests
from dotenv import load_dotenv

load_dotenv()


def get_data(lat, lon):
    api_key = os.getenv("OPENWEATHER_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("OPENWEATHER_API_KEY is not configured")

    url = (
        f"https://api.openweathermap.org/data/2.5/forecast"
        f"?lat={lat}&lon={lon}&appid={api_key}&units=imperial"
    )

    response = requests.get(url, timeout=10)
    response.raise_for_status()
    data = response.json()

    final = [0, 0, 0, 0, 0, 0]

    forecasts = data["list"][:15]

    max_temp = -100

    for f in forecasts:

        final[0] += f["main"]["temp"]

        max_temp = max(max_temp, f["main"]["temp_max"])

        final[2] += f["wind"]["speed"]

        clouds = f["clouds"]["all"]
        final[3] += clouds

        humidity = f["main"]["humidity"]
        final[5] += humidity

        rain = 0
        if "rain" in f:
            rain = f["rain"].get("3h", 0)

        final[4] += rain

    final[0] /= len(forecasts)
    final[2] /= len(forecasts)
    final[3] /= len(forecasts)
    final[5] /= len(forecasts)

    final[1] = max_temp

    return final
