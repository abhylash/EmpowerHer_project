from openai import OpenAI
from django.conf import settings

try:
    client = OpenAI(
        api_key=settings.OPENROUTER_API_KEY,
        base_url=settings.OPENROUTER_BASE_URL
    )
except Exception as e:
    # Fallback for any OpenAI client initialization issues
    client = None

LANG_MAP = {'hi':'Hindi','kn':'Kannada','ta':'Tamil','te':'Telugu','en':'English'}

def get_health_chat_response(user_message, language='en', history=None):
    if client is None:
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
        messages = [{'role':'system','content':system_prompt}]
        if history: 
            messages.extend(history)
        messages.append({'role':'user','content':user_message})
        
        response = client.chat.completions.create(
            model=settings.AI_MODELS['chat'],
            messages=messages, 
            max_tokens=600, 
            stream=True
        )
        
        for chunk in response:
            content = chunk.choices[0].delta.content
            if content: 
                yield content
    except Exception as e:
        yield "I'm having trouble connecting right now. Please try again later."

def analyse_food_image(base64_image_data):
    if client is None:
        return '[{"dish":"Unknown","calories_kcal":200,"protein_g":10,"carb_g":30,"fat_g":5}]'
    
    try:
        prompt = (
            'You are a dietitian AI specialising in Indian food. '
            'Identify all dishes. Return ONLY valid JSON array: '
            '[{"dish":"name","calories_kcal":0,"protein_g":0,"carb_g":0,"fat_g":0}]'
        )
        response = client.chat.completions.create(
            model=settings.AI_MODELS['food_vision'],
            messages=[{'role':'user','content':[
                {'type':'image_url','image_url':{'url':f'data:image/jpeg;base64,{base64_image_data}'}},
                {'type':'text','text':prompt}
            ]}], 
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        return '[{"dish":"Unknown","calories_kcal":200,"protein_g":10,"carb_g":30,"fat_g":5}]'

def analyse_mood_patterns(mood_logs_json, language='en'):
    if client is None:
        return "Keep tracking your mood daily to discover patterns that can help you better understand your emotional wellbeing."
    
    try:
        lang_name = LANG_MAP.get(language, 'English')
        prompt = (
            f'Analyse these mood logs and find patterns in {lang_name}. '
            f'Look for: weekly patterns, pre-menstrual dips, triggers. '
            f'Return a warm 3-sentence insight. Data: {mood_logs_json}'
        )
        response = client.chat.completions.create(
            model=settings.AI_MODELS['analysis'],
            messages=[{'role':'user','content':prompt}], 
            max_tokens=300
        )
        return response.choices[0].message.content
    except Exception as e:
        return "Keep tracking your mood daily to discover patterns that can help you better understand your emotional wellbeing."
