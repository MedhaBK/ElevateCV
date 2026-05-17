from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal

class Settings(BaseSettings):
    app_name: str = 'Elevate CV API'
    app_env: str = 'development'

    #LLM config
    groq_api_key: str
    llm_provider: Literal['groq'] = 'groq'
    llm_model : str = 'llama-3.1-8b-instant'

    #Embedding config
    embedding_model : str = 'all-MiniLM-L6-v2'

    model_config = SettingsConfigDict(
        env_file='.env'
    )


settings = Settings()