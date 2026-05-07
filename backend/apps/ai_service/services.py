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
        return '[{"dish":"Unknown","calories_kcal":200,"protein_g":10,"carb_g":30,"fat_g":5}]'
    
    try:
        prompt = (
            'You are a dietitian AI specialising in Indian food. '
            'Identify all dishes. Return ONLY valid JSON array: '
            '[{"dish":"name","calories_kcal":0,"protein_g":0,"carb_g":0,"fat_g":0}]'
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
            return '[{"dish":"Unknown","calories_kcal":200,"protein_g":10,"carb_g":30,"fat_g":5}]'
            
    except Exception as e:
        return '[{"dish":"Unknown","calories_kcal":200,"protein_g":10,"carb_g":30,"fat_g":5}]'

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
