import requests

API_KEY = "f04e66a443e3e6d40a8951a6644e627d"


def get_data(lat, lon):

    url = (
        f"https://api.openweathermap.org/data/2.5/forecast"
        f"?lat={lat}&lon={lon}&appid={API_KEY}&units=imperial"
    )

    data = requests.get(url).json()

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
