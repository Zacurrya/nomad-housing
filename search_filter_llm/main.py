from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ValidationError
from llm import llm_parse_req
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class IncomingRequest(BaseModel):
    context: str
    user_input: str

@app.post("/parse")
def parse_request(payload: IncomingRequest):
    try:
        logger.info(f"Received request - Context: {payload.context[:50]}..., User input: {payload.user_input}")
        res = llm_parse_req(payload.context, payload.user_input)
        logger.info(f"Successfully parsed request: {res.model_dump()}")
        return {"result": res}
    except ValidationError as e:
        error_msg = f"Pydantic validation error: {str(e)}"
        logger.error(error_msg)
        logger.error(f"Validation errors: {e.errors()}")
        raise HTTPException(status_code=400, detail={"error": "Invalid response format from LLM", "details": e.errors()})
    except ConnectionError as e:
        error_msg = f"Ollama connection error: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=503, detail={"error": "Cannot connect to Ollama service", "details": str(e)})
    except Exception as e:
        error_msg = f"Unexpected error: {type(e).__name__}: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail={"error": f"{type(e).__name__}: {str(e)}", "traceback": traceback.format_exc()})

