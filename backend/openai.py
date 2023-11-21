import requests
import json

# Replace 'your-api-key-here' with your actual OpenAI API key
headers = {
    'Authorization': 'Bearer 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',
    'Content-Type': 'application/json',
}

# Define the conversation input
data = {
    'model': 'gpt-4.0-turbo',  # Assuming the model identifier for GPT-4 is 'gpt-4.0-turbo'
    'messages': [
        {'role': 'system', 'content': 'You are a helpful assistant.'},
        {'role': 'user', 'content': 'Who won the world series in 2020?'},
        {'role': 'assistant', 'content': 'The Los Angeles Dodgers won the World Series in 2020.'},
        {'role': 'user', 'content': 'Where can I find more information about the Debian distribution?'}
    ]
}

# Send the request to the OpenAI API
response = requests.post('https://api.openai.com/v1/engines/gpt-4.0-turbo/completions', headers=headers, json=data)

# Parse the response
response_data = response.json()
print(json.dumps(response_data, indent=4))
