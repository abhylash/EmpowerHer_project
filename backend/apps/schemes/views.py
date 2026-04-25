from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GovernmentScheme
from .serializers import GovernmentSchemeSerializer

class EligibleSchemesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        profile = request.user.profile
        schemes = GovernmentScheme.objects.filter(is_active=True)
        eligible = [s for s in schemes if self._is_eligible(s, profile)]
        serializer = GovernmentSchemeSerializer(eligible, many=True)
        return Response(serializer.data)
    
    def _is_eligible(self, scheme, profile):
        rules = scheme.eligibility_rules
        
        # Check state eligibility
        if scheme.states and profile.state not in scheme.states:
            return False
        
        # Check income eligibility
        if rules.get('income') and profile.income_category not in rules['income']:
            return False
        
        # Check occupation eligibility
        if rules.get('occupation') and profile.occupation not in rules['occupation']:
            return False
        
        # Check if applicable to user's situation
        if scheme.applicable_to:
            user_situation = 'pregnant' if profile.is_pregnant else 'general'
            if 'pregnant' in scheme.applicable_to and not profile.is_pregnant:
                if 'general' not in scheme.applicable_to:
                    return False
            elif 'general' in scheme.applicable_to and profile.is_pregnant:
                if 'pregnant' not in scheme.applicable_to:
                    return False
        
        return True

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def all_schemes(request):
    schemes = GovernmentScheme.objects.filter(is_active=True)
    serializer = GovernmentSchemeSerializer(schemes, many=True)
    return Response(serializer.data)
