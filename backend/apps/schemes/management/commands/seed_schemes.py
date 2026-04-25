from django.core.management.base import BaseCommand
from apps.schemes.models import GovernmentScheme

class Command(BaseCommand):
    help = 'Seed government schemes data'

    def handle(self, *args, **options):
        schemes_data = [
            {
                'name': 'Pradhan Mantri Matru Vandana Yojana',
                'full_name': 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
                'level': 'central',
                'states': [],  # All India
                'benefit_amount': '₹5,000',
                'benefit_description': 'Cash incentive of ₹5,000 for first child for wage loss and nutrition',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'self'],
                    'pregnant': True
                },
                'applicable_to': ['pregnant', 'general'],
                'apply_link': 'https://pmmvy-wcd.nic.in/',
                'helpline': '1800-11-6263',
                'is_active': True
            },
            {
                'name': 'Janani Suraksha Yojana',
                'full_name': 'Janani Suraksha Yojana (JSY)',
                'level': 'central',
                'states': [],  # All India
                'benefit_amount': '₹1,400 - ₹1,500',
                'benefit_description': 'Cash assistance for institutional delivery',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': True
                },
                'applicable_to': ['pregnant'],
                'apply_link': 'https://jsy.nrhm.gov.in/',
                'helpline': '1800-11-6263',
                'is_active': True
            },
            {
                'name': 'Indira Gandhi Matritva Sahyog Yojana',
                'full_name': 'Indira Gandhi Matritva Sahyog Yojana (IGMSY)',
                'level': 'central',
                'states': ['Punjab', 'Delhi'],  # Pilot states
                'benefit_amount': '₹6,000',
                'benefit_description': 'Cash incentive for pregnant and lactating women',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': True
                },
                'applicable_to': ['pregnant', 'general'],
                'apply_link': 'https://wcd.nic.in/',
                'helpline': '1800-11-6263',
                'is_active': True
            },
            {
                'name': 'Karnataka Mathru Poorna',
                'full_name': 'Karnataka Mathru Poorna Scheme',
                'level': 'state',
                'states': ['Karnataka'],
                'benefit_amount': '₹6,000',
                'benefit_description': 'Financial assistance for pregnant women',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': True
                },
                'applicable_to': ['pregnant'],
                'apply_link': 'https://karnataka.gov.in/',
                'helpline': '080-22652555',
                'is_active': True
            },
            {
                'name': 'Tamil Nadu Pregnant Women Scheme',
                'full_name': 'Tamil Nadu Dr. Muthulakshmi Reddy Maternity Benefit Scheme',
                'level': 'state',
                'states': ['Tamil Nadu'],
                'benefit_amount': '₹18,000',
                'benefit_description': 'Financial assistance for pregnant women',
                'eligibility_rules': {
                    'income': [],
                    'occupation': [],
                    'pregnant': True
                },
                'applicable_to': ['pregnant'],
                'apply_link': 'https://www.tn.gov.in/',
                'helpline': '044-25306466',
                'is_active': True
            },
            {
                'name': 'Andhra Pradesh Amma Vodi',
                'full_name': 'Andhra Pradesh Amma Vodi Scheme',
                'level': 'state',
                'states': ['Andhra Pradesh'],
                'benefit_amount': '₹15,000',
                'benefit_description': 'Financial assistance for education and health',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://jaganannaammavodi.ap.gov.in/',
                'helpline': '1902',
                'is_active': True
            },
            {
                'name': 'Maharashtra Rajmata Jijau Mother-Child Health and Nutrition Mission',
                'full_name': 'Maharashtra Rajmata Jijau Mother-Child Health and Nutrition Mission',
                'level': 'state',
                'states': ['Maharashtra'],
                'benefit_amount': '₹5,000',
                'benefit_description': 'Financial assistance for pregnant women',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': True
                },
                'applicable_to': ['pregnant'],
                'apply_link': 'https://maharashtra.gov.in/',
                'helpline': '1800-233-1300',
                'is_active': True
            },
            {
                'name': 'West Bengal Kanyashree Prakalpa',
                'full_name': 'West Bengal Kanyashree Prakalpa',
                'level': 'state',
                'states': ['West Bengal'],
                'benefit_amount': '₹25,000',
                'benefit_description': 'Financial assistance for girl child education and marriage',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://kanyashree.gov.in/',
                'helpline': '1800-102-5303',
                'is_active': True
            },
            {
                'name': 'Uttar Pradesh Mukhyamantri Mahila Samman Yojana',
                'full_name': 'Uttar Pradesh Mukhyamantri Mahila Samman Yojana',
                'level': 'state',
                'states': ['Uttar Pradesh'],
                'benefit_amount': '₹1,500',
                'benefit_description': 'Financial assistance for women',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://up.gov.in/',
                'helpline': '1800-180-5314',
                'is_active': True
            },
            {
                'name': 'Madhya Pradesh Ladli Lakshmi Yojana',
                'full_name': 'Madhya Pradesh Ladli Lakshmi Yojana',
                'level': 'state',
                'states': ['Madhya Pradesh'],
                'benefit_amount': '₹2,18,000',
                'benefit_description': 'Financial assistance for girl child',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://mp.gov.in/',
                'helpline': '1800-233-8800',
                'is_active': True
            },
            {
                'name': 'Gujarat Kishori Suraksha Yojana',
                'full_name': 'Gujarat Kishori Suraksha Yojana',
                'level': 'state',
                'states': ['Gujarat'],
                'benefit_amount': '₹5,000',
                'benefit_description': 'Financial assistance for adolescent girls',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://gujarat.gov.in/',
                'helpline': '1800-233-5500',
                'is_active': True
            },
            {
                'name': 'Kerala Sukanya Samriddhi Yojana',
                'full_name': 'Kerala Sukanya Samriddhi Yojana',
                'level': 'state',
                'states': ['Kerala'],
                'benefit_amount': '₹10,000',
                'benefit_description': 'Financial assistance for girl child',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://kerala.gov.in/',
                'helpline': '1800-425-4747',
                'is_active': True
            },
            {
                'name': 'Rajasthan Bhamashah Card',
                'full_name': 'Rajasthan Bhamashah Card Scheme',
                'level': 'state',
                'states': ['Rajasthan'],
                'benefit_amount': 'Various benefits',
                'benefit_description': 'Multiple benefits including health, education, and financial assistance',
                'eligibility_rules': {
                    'income': ['bpl', 'low', 'mid'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://bhamashah.rajasthan.gov.in/',
                'helpline': '1800-180-6127',
                'is_active': True
            },
            {
                'name': 'Haryana Ladli Scheme',
                'full_name': 'Haryana Ladli Scheme',
                'level': 'state',
                'states': ['Haryana'],
                'benefit_amount': '₹5,000',
                'benefit_description': 'Financial assistance for girl child',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://haryana.gov.in/',
                'helpline': '1800-180-2026',
                'is_active': True
            },
            {
                'name': 'Bihar Mukhyamantri Kanya Utthan Yojana',
                'full_name': 'Bihar Mukhyamantri Kanya Utthan Yojana',
                'level': 'state',
                'states': ['Bihar'],
                'benefit_amount': '₹10,000',
                'benefit_description': 'Financial assistance for girl child education',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://bihar.gov.in/',
                'helpline': '1800-345-6194',
                'is_active': True
            },
            {
                'name': 'Odisha Kalinga Tatya Yojana',
                'full_name': 'Odisha Kalinga Tatya Yojana',
                'level': 'state',
                'states': ['Odisha'],
                'benefit_amount': '₹20,000',
                'benefit_description': 'Financial assistance for girl child education',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://odisha.gov.in/',
                'helpline': '1800-345-3370',
                'is_active': True
            },
            {
                'name': 'Assam Orunodoi Scheme',
                'full_name': 'Assam Orunodoi Scheme',
                'level': 'state',
                'states': ['Assam'],
                'benefit_amount': '₹830',
                'benefit_description': 'Monthly financial assistance for poor families',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://assam.gov.in/',
                'helpline': '1800-345-3618',
                'is_active': True
            },
            {
                'name': 'Jharkhand Mukhyamantri Ladli Laxmi Yojana',
                'full_name': 'Jharkhand Mukhyamantri Ladli Laxmi Yojana',
                'level': 'state',
                'states': ['Jharkhand'],
                'benefit_amount': '₹5,000',
                'benefit_description': 'Financial assistance for girl child',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://jharhand.gov.in/',
                'helpline': '1800-345-6226',
                'is_active': True
            },
            {
                'name': 'Chhattisgarh Mukhyamantri Mahila Utkarsh Yojana',
                'full_name': 'Chhattisgarh Mukhyamantri Mahila Utkarsh Yojana',
                'level': 'state',
                'states': ['Chhattisgarh'],
                'benefit_amount': '₹10,000',
                'benefit_description': 'Financial assistance for women entrepreneurs',
                'eligibility_rules': {
                    'income': ['bpl', 'low', 'mid'],
                    'occupation': ['self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://chhattisgarh.gov.in/',
                'helpline': '1800-233-3637',
                'is_active': True
            },
            {
                'name': 'Himachal Pradesh Mukhya Mantri Shagun Yojana',
                'full_name': 'Himachal Pradesh Mukhya Mantri Shagun Yojana',
                'level': 'state',
                'states': ['Himachal Pradesh'],
                'benefit_amount': '₹31,000',
                'benefit_description': 'Financial assistance for girl marriage',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://himachal.nic.in/',
                'helpline': '1800-180-8025',
                'is_active': True
            },
            {
                'name': 'Punjab Mai Bhago Vidya Scheme',
                'full_name': 'Punjab Mai Bhago Vidya Scheme',
                'level': 'state',
                'states': ['Punjab'],
                'benefit_amount': '₹5,100',
                'benefit_description': 'Financial assistance for girl education',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://punjab.gov.in/',
                'helpline': '1800-180-2062',
                'is_active': True
            },
            {
                'name': 'Telangana Kalyana Lakshmi Pathakam',
                'full_name': 'Telangana Kalyana Lakshmi Pathakam',
                'level': 'state',
                'states': ['Telangana'],
                'benefit_amount': '₹51,000',
                'benefit_description': 'Financial assistance for girl marriage',
                'eligibility_rules': {
                    'income': ['bpl', 'low'],
                    'occupation': ['labour', 'farmer', 'private', 'self'],
                    'pregnant': False
                },
                'applicable_to': ['general'],
                'apply_link': 'https://telangana.gov.in/',
                'helpline': '1800-425-2222',
                'is_active': True
            }
        ]

        created_count = 0
        updated_count = 0

        for scheme_data in schemes_data:
            scheme, created = GovernmentScheme.objects.get_or_create(
                name=scheme_data['name'],
                defaults=scheme_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created scheme: {scheme.name}')
                )
            else:
                # Update existing scheme
                for key, value in scheme_data.items():
                    setattr(scheme, key, value)
                scheme.save()
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Updated scheme: {scheme.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded {created_count} new schemes and updated {updated_count} existing schemes'
            )
        )
