from ollama import chat
from models.out import ExampleOutput
from config.prompt import search_filter_prompt
import logging

logger = logging.getLogger(__name__)

def llm_parse_req(prev_context: str, user_input: str) -> ExampleOutput:
    try:
        prompt = f"""
    CONTEXT: {prev_context}
    USER PROMPT: {user_input}
    """

        schema = ExampleOutput.model_json_schema()
        
        logger.info(f"Calling Ollama with model: qwen2.5:1.5b-instruct")

        response = chat(
            model="qwen2.5:1.5b-instruct",
            options={"temperature": 0},
            messages=[
                {"role": "system", "content": search_filter_prompt},
                {"role": "user", "content": prompt},
            ],
            format=schema,
        )
        
        if response.message.content is None:
            logger.error("Ollama response returned None for message.content")
            raise ValueError("Ollama response returned None for message.content")
        logger.info(f"Ollama response received: {str(response.message.content)[:200]}...")
        return ExampleOutput.model_validate_json(str(response.message.content))
    
    except Exception as e:
        logger.error(f"Error in llm_parse_req: {type(e).__name__}: {str(e)}")
        raise
