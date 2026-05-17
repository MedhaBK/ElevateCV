from pydantic_settings import BaseSettings
from typing import Literal

class Settings(BaseSettings):
    app_name: str = 'Elevate CV API'
    app_env: str = 'development'

    #LLM config
    groq_api_key: str
    llm_provider: Literal['groq'] = 'groq'
    llm_model : str = 'llama-3.1-8b-instant'

    class Config:
        env_file = ".env"

settings = Settings()