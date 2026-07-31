"""Application configuration helpers."""
import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parent
DOTENV_PATH = ROOT_DIR / ".env"
_LOAD_ATTEMPTED = False
_LOADED_DOTENV_PATH: Optional[Path] = None


class WeatherConfigError(RuntimeError):
    """Raised when weather API configuration is missing or invalid."""


def load_environment() -> Optional[Path]:
    """Load project environment variables from .env once."""
    global _LOAD_ATTEMPTED, _LOADED_DOTENV_PATH

    if _LOAD_ATTEMPTED:
        return _LOADED_DOTENV_PATH

    _LOAD_ATTEMPTED = True
    if DOTENV_PATH.exists():
        load_dotenv(DOTENV_PATH, override=False)
        _LOADED_DOTENV_PATH = DOTENV_PATH

    return _LOADED_DOTENV_PATH


def get_openweather_api_key() -> str:
    """Return a configured OpenWeather API key or raise a clear error."""
    load_environment()
    api_key = os.getenv("OPENWEATHER_API_KEY", "").strip()

    if not api_key:
        raise WeatherConfigError("OPENWEATHER_API_KEY is not configured. Set it in .env or your environment.")

    normalized = api_key.lower()
    placeholder_values = {
        "your_api_key_here",
        "your_openweather_api_key_here",
        "your-openweather-api-key-here",
        "openweather_api_key",
        "replace_me",
        "changeme",
        "placeholder",
    }
    if (
        normalized in placeholder_values
        or normalized.startswith("your_")
        or normalized.startswith("your-")
        or "placeholder" in normalized
        or "replace_me" in normalized
    ):
        raise WeatherConfigError("OPENWEATHER_API_KEY is still set to a placeholder value. Put your real OpenWeather key in .env.")

    return api_key
