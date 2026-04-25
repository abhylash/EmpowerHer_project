from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import PregnancyProfile
from .serializers import PregnancyProfileSerializer, PregnancyWeeklySerializer, PregnancySymptomSerializer

# Pregnancy week data (simplified version for weeks 1-40)
PREGNANCY_WEEK_DATA = {
    1: {"baby_size": "poppy seed", "baby_comparison": "tiny seed", "development": "Neural tube forming", "maternal_tip": "Take folic acid daily", "nutrition_tip": "Leafy greens rich in folate"},
    2: {"baby_size": "sesame seed", "baby_comparison": "small seed", "development": "Heart beginning to form", "maternal_tip": "Stay hydrated", "nutrition_tip": "Iron-rich foods"},
    3: {"baby_size": "lentil", "baby_comparison": "bean size", "development": "Brain development starts", "maternal_tip": "Rest when tired", "nutrition_tip": "Protein for cell growth"},
    4: {"baby_size": "blueberry", "baby_comparison": "berry size", "development": "Arms and legs buds appear", "maternal_tip": "Avoid alcohol completely", "nutrition_tip": "Calcium for bones"},
    5: {"baby_size": "apple seed", "baby_comparison": "seed size", "development": "Heart now beating", "maternal_tip": "Regular prenatal checkups", "nutrition_tip": "Omega-3 fatty acids"},
    6: {"baby_size": "lentil", "baby_comparison": "bean size", "development": "Facial features forming", "maternal_tip": "Morning sickness common", "nutrition_tip": "Small frequent meals"},
    7: {"baby_size": "blueberry", "baby_comparison": "berry size", "development": "Brain growing rapidly", "maternal_tip": "Gentle exercise", "nutrition_tip": "Vitamin D sources"},
    8: {"baby_size": "kidney bean", "baby_comparison": "bean size", "development": "All organs formed", "maternal_tip": "Listen to your body", "nutrition_tip": "Fiber for digestion"},
    9: {"baby_size": "grape", "baby_comparison": "small fruit", "development": "Fingers and toes separate", "maternal_tip": "Start maternity clothes", "nutrition_tip": "Healthy snacks"},
    10: {"baby_size": "strawberry", "baby_comparison": "berry size", "development": "Bones and cartilage forming", "maternal_tip": "Share news if ready", "nutrition_tip": "Vitamin C absorption"},
    11: {"baby_size": "fig", "baby_comparison": "small fruit", "development": "Fingernails growing", "maternal_tip": "Plan maternity leave", "nutrition_tip": "Complex carbohydrates"},
    12: {"baby_size": "lime", "baby_comparison": "citrus size", "development": "Reflexes develop", "maternal_tip": "Risk of miscarriage drops", "nutrition_tip": "Avoid raw fish"},
    13: {"baby_size": "pea pod", "baby_comparison": "vegetable", "development": "Unique fingerprints", "maternal_tip": "Energy levels rising", "nutrition_tip": "Lean proteins"},
    14: {"baby_size": "lemon", "baby_comparison": "citrus fruit", "development": "Sucking thumb practice", "maternal_tip": "Second trimester begins", "nutrition_tip": "Dairy for calcium"},
    15: {"baby_size": "apple", "baby_comparison": "medium fruit", "development": "Skeleton hardening", "maternal_tip": "Baby movement soon", "nutrition_tip": "Whole grains"},
    16: {"baby_size": "avocado", "baby_comparison": "medium fruit", "development": "Eyes moving forward", "maternal_tip": "Maternity clothes shopping", "nutrition_tip": "Healthy fats"},
    17: {"baby_size": "turnip", "baby_comparison": "root vegetable", "development": "Umbilical cord thickens", "maternal_tip": "Sleep on left side", "nutrition_tip": "Iron supplements"},
    18: {"baby_size": "bell pepper", "baby_comparison": "vegetable", "development": "Myelination begins", "maternal_tip": "Feel baby movements", "nutrition_tip": "Magnesium sources"},
    19: {"baby_size": "tomato", "baby_comparison": "fruit", "development": "Vernix coating forms", "maternal_tip": "Skin stretching", "nutrition_tip": "Antioxidant foods"},
    20: {"baby_size": "banana", "baby_comparison": "medium fruit", "development": "Hair growing", "maternal_tip": "Halfway point!", "nutrition_tip": "Balanced meals"},
    21: {"baby_size": "carrot", "baby_comparison": "vegetable", "development": "Digestive system developing", "maternal_tip": "Swelling normal", "nutrition_tip": "Potassium rich foods"},
    22: {"baby_size": "spaghetti squash", "baby_comparison": "vegetable", "development": "Taste buds developing", "maternal_tip": "Back exercises", "nutrition_tip": "Vitamin B complex"},
    23: {"baby_size": "large mango", "baby_comparison": "tropical fruit", "development": "Hearing developing", "maternal_tip": "Talk to baby", "nutrition_tip": "Zinc for immunity"},
    24: {"baby_size": "ear of corn", "baby_comparison": "vegetable", "development": "Lungs developing rapidly", "maternal_tip": "Braxton hicks possible", "nutrition_tip": "Vitamin A sources"},
    25: {"baby_size": "rutabaga", "baby_comparison": "root vegetable", "development": "Exploring hands", "maternal_tip": "Gentle stretching", "nutrition_tip": "Folic acid continues"},
    26: {"baby_size": "scallion", "baby_comparison": "vegetable", "development": "Eyes opening", "maternal_tip": "Count kicks", "nutrition_tip": "Protein needs increase"},
    27: {"baby_size": "head of cauliflower", "baby_comparison": "vegetable", "development": "Brain tissue increasing", "maternal_tip": "Third trimester begins", "nutrition_tip": "DHA for brain"},
    28: {"baby_size": "large eggplant", "baby_comparison": "vegetable", "development": "Blinking practice", "maternal_tip": "Prepare nursery", "nutrition_tip": "Iron needs peak"},
    29: {"baby_size": "butternut squash", "baby_comparison": "vegetable", "development": "Muscles and lungs maturing", "maternal_tip": "Pack hospital bag", "nutrition_tip": "Vitamin K sources"},
    30: {"baby_size": "cabbage", "baby_comparison": "vegetable", "development": "Bone marrow producing", "maternal_tip": "Frequent urination", "nutrition_tip": "Calcium absorption"},
    31: {"baby_size": "coconut", "baby_comparison": "tropical fruit", "development": "Rapid weight gain", "maternal_tip": "Pelvic pressure", "nutrition_tip": "Healthy weight gain"},
    32: {"baby_size": "jicama", "baby_comparison": "root vegetable", "development": "Practicing breathing", "maternal_tip": "Breathing classes", "nutrition_tip": "Complex carbs"},
    33: {"baby_size": "pineapple", "baby_comparison": "tropical fruit", "development": "Immune system developing", "maternal_tip": "Braxton hicks increase", "nutrition_tip": "Vitamin C boost"},
    34: {"baby_size": "cantaloupe", "baby_comparison": "melon", "development": "Fingernails reaching fingertips", "maternal_tip": "Lightning crotch", "nutrition_tip": "Magnesium relaxes"},
    35: {"baby_size": "honeydew melon", "baby_comparison": "melon", "development": "Kidneys fully developed", "maternal_tip": "Prepare for birth", "nutrition_tip": "Hydration critical"},
    36: {"baby_size": "head of romaine lettuce", "baby_comparison": "vegetable", "development": "Gaining weight rapidly", "maternal_tip": "Check position", "nutrition_tip": "Final stretch"},
    37: {"baby_size": "winter melon", "baby_comparison": "large fruit", "development": "Practicing breathing", "maternal_tip": "Full term soon", "nutrition_tip": "Energy stores"},
    38: {"baby_size": "leek", "baby_comparison": "vegetable", "development": "Lungs nearly mature", "maternal_tip": "Nesting instinct", "nutrition_tip": "Iron stores"},
    39: {"baby_size": "watermelon", "baby_comparison": "large fruit", "development": "Fully developed", "maternal_tip": "Any day now!", "nutrition_tip": "Rest and prepare"},
    40: {"baby_size": "pumpkin", "baby_comparison": "large fruit", "development": "Ready for birth!", "maternal_tip": "Delivery day!", "nutrition_tip": "Postpartum recovery"},
}

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def pregnancy_profile(request):
    if request.method == 'GET':
        try:
            profile = request.user.profile.pregnancy
            serializer = PregnancyProfileSerializer(profile)
            return Response(serializer.data)
        except PregnancyProfile.DoesNotExist:
            return Response({'error': 'No pregnancy profile found'}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'POST':
        # Update user profile to mark as pregnant
        profile = request.user.profile
        profile.is_pregnant = True
        profile.save()
        
        # Create pregnancy profile
        serializer = PregnancyProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def pregnancy_weekly(request):
    try:
        profile = request.user.profile.pregnancy
        week = profile.current_week
        
        if week not in PREGNANCY_WEEK_DATA:
            return Response({'error': 'Invalid week'}, status=status.HTTP_400_BAD_REQUEST)
        
        week_data = PREGNANCY_WEEK_DATA[week]
        week_data['week'] = week
        
        serializer = PregnancyWeeklySerializer(week_data)
        return Response(serializer.data)
    except PregnancyProfile.DoesNotExist:
        return Response({'error': 'No pregnancy profile found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def pregnancy_symptoms(request):
    symptoms = request.data.get('symptoms', [])
    
    # Check for danger signs
    danger_signs = []
    has_danger_signs = False
    
    danger_symptoms = ['bleeding', 'severe headache', 'reduced movement', 'blurred vision', 'severe swelling', 'fever']
    
    for symptom in symptoms:
        if any(danger in symptom.lower() for danger in danger_symptoms):
            danger_signs.append(symptom)
            has_danger_signs = True
    
    data = {
        'symptoms': symptoms,
        'has_danger_signs': has_danger_signs,
        'danger_signs': danger_signs
    }
    
    serializer = PregnancySymptomSerializer(data)
    return Response(serializer.data)
