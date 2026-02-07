import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url="https://api.01.ai/v1",
    api_key=os.getenv("YI_API_KEY")
)

class StrategyRequest(BaseModel):
    competitor_price: float
    my_price: float
    market_trend: str

@app.post("/api/strategy")
async def get_strategy(request: StrategyRequest):
    prompt = f"""You are a Retail Strategist. Analyze the following market data and provide strategic advice:

Competitor Price: ${request.competitor_price}
My Price: ${request.my_price}
Market Trend: {request.market_trend}

Provide actionable strategic advice for pricing and positioning."""

    response = client.chat.completions.create(
        model="yi-34b-chat-0205",
        messages=[
            {"role": "system", "content": "You are an expert Retail Strategist specializing in competitive pricing and market positioning."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return {"advice": response.choices[0].message.content}

@app.get("/")
async def root():
    return {"message": "NexusRetail API"}
