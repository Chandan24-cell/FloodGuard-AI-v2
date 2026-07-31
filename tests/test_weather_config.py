import os
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import app
from training import prediction


class WeatherConfigTests(unittest.TestCase):
    def test_missing_api_key_does_not_crash_prediction_page(self):
        original_key = os.environ.get("OPENWEATHER_API_KEY")
        os.environ.pop("OPENWEATHER_API_KEY", None)
        app.model = object()

        class DummyModel:
            def predict(self, values):
                return [0]

        app.model = DummyModel()
        try:
            client = app.app.test_client()
            response = client.post("/predicts.html", data={"city": "Delhi"})

            self.assertEqual(response.status_code, 200)
            self.assertNotIn(b"Weather service is temporarily unavailable.", response.data)
        finally:
            if original_key is None:
                os.environ.pop("OPENWEATHER_API_KEY", None)
            else:
                os.environ["OPENWEATHER_API_KEY"] = original_key

    def test_placeholder_api_key_is_rejected(self):
        original_key = os.environ.get("OPENWEATHER_API_KEY")
        os.environ["OPENWEATHER_API_KEY"] = "your_api_key_here"
        try:
            with self.assertRaises(prediction.WeatherServiceError) as exc_info:
                prediction.get_weather("Delhi")

            self.assertIn("placeholder", str(exc_info.exception).lower())
        finally:
            if original_key is None:
                os.environ.pop("OPENWEATHER_API_KEY", None)
            else:
                os.environ["OPENWEATHER_API_KEY"] = original_key

    def test_openweather_placeholder_api_key_is_rejected(self):
        original_key = os.environ.get("OPENWEATHER_API_KEY")
        os.environ["OPENWEATHER_API_KEY"] = "your_openweather_api_key_here"
        try:
            with self.assertRaises(prediction.WeatherServiceError) as exc_info:
                prediction.get_weather("Delhi")

            self.assertIn("placeholder", str(exc_info.exception).lower())
        finally:
            if original_key is None:
                os.environ.pop("OPENWEATHER_API_KEY", None)
            else:
                os.environ["OPENWEATHER_API_KEY"] = original_key


if __name__ == "__main__":
    unittest.main()
