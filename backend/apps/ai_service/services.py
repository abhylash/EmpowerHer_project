import requests
import json
from django.conf import settings
import os

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', settings.OPENROUTER_API_KEY)
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

LANG_MAP = {'hi':'Hindi','kn':'Kannada','ta':'Tamil','te':'Telugu','en':'English'}

def get_health_chat_response(user_message, language='en', history=None):
    if not OPENROUTER_API_KEY:
        yield "AI service is temporarily unavailable. Please try again later."
        return
    
    try:
        lang_name = LANG_MAP.get(language, 'English')
        lang_instruction = f'Always respond in {lang_name}.' if language != 'en' else ''
        system_prompt = (
            f'You are EmpowerHer, a compassionate AI womens health assistant. '
            f'{lang_instruction} '
            f'Give accurate, warm, evidence-based advice. Never diagnose. '
            f'Understand Indian health context: PCOD, ayurvedic remedies, Indian diet.'
        )
        messages = [{'role':'user','content':system_prompt}]
        if history: 
            messages.extend(history)
        messages.append({'role':'user','content':user_message})
        
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "models": ["poolside/laguna-xs.2:free", "inclusionai/ling-2.6-1t:free", "nvidia/nemotron-3-super-120b-a12b:free"],
            "messages": messages,
            "max_tokens": 2000
        }
        
        response = requests.post(OPENROUTER_BASE_URL, headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            yield content
        else:
            print(f"OpenRouter API Error: {response.status_code} - {response.text}")
            yield "I'm having trouble connecting right now. Please try again later."
            
    except Exception as e:
        yield "I'm having trouble connecting right now. Please try again later."

def analyse_food_image(base64_image_data):
    if not OPENROUTER_API_KEY:
        return '[{"name":"Unknown","calories":200,"protein":10,"carb":30,"fat":5}]'

    try:
        prompt = (
            'You are a professional dietitian specializing in Indian food. '
            'Look at this food image carefully and identify ALL visible food items. '
            'Return ONLY a valid JSON array — no explanation, no markdown, no code blocks. '
            'Format: [{"name":"Food Name","calories":100,"protein":5,"carb":15,"fat":2}] '
            'Each field: name (string), calories (number in kcal), protein (grams), carb (grams), fat (grams). '
            'Be as accurate as possible for Indian cuisine.'
        )

        image_url = f"data:image/jpeg;base64,{base64_image_data}"

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        # Use vision-capable free models with fallback
        for model in ["meta-llama/llama-4-scout:free", "google/gemma-3-27b-it:free"]:
            data = {
                "model": model,
                "messages": [{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": image_url}}
                    ]
                }],
                "max_tokens": 1000
            }

            response = requests.post(OPENROUTER_BASE_URL, headers=headers, json=data, timeout=30)

            if response.status_code == 200:
                result = response.json()
                raw = result['choices'][0]['message']['content']
                # Strip markdown code fences if present
                raw = raw.replace('```json', '').replace('```', '').strip()
                return raw
            else:
                print(f"Vision model {model} failed: {response.status_code} - {response.text}")
                continue

        return '[{"name":"Could not detect food","calories":0,"protein":0,"carb":0,"fat":0}]'

    except Exception as e:
        print(f"analyse_food_image error: {e}")
        return '[{"name":"Could not detect food","calories":0,"protein":0,"carb":0,"fat":0}]'

def analyse_mood_patterns(mood_logs_json, language='en'):
    if not OPENROUTER_API_KEY:
        return "Keep tracking your mood daily to discover patterns that can help you better understand your emotional wellbeing."
    
    try:
        lang_name = LANG_MAP.get(language, 'English')
        prompt = (
            f'Analyse these mood logs and find patterns in {lang_name}. '
            f'Look for: weekly patterns, pre-menstrual dips, triggers. '
            f'Return a warm 3-sentence insight. Data: {mood_logs_json}'
        )
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "models": ["poolside/laguna-xs.2:free", "inclusionai/ling-2.6-1t:free", "nvidia/nemotron-3-super-120b-a12b:free"],
            "messages": [{'role':'user','content':prompt}],
            "max_tokens": 2000
        }
        
        response = requests.post(OPENROUTER_BASE_URL, headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            return "Keep tracking your mood daily to discover patterns that can help you better understand your emotional wellbeing."
            
    except Exception as e:
        return "Keep tracking your mood daily to discover patterns that can help you better understand your emotional wellbeing."
