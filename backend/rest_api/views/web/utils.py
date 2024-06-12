from django.db.models import Count
from dashboard.models import *

def get_demographic_data(adolescent_type):
    # Query to get counts of adolescents grouped by age and gender
    adolescents = Adolescent.objects.filter(type=adolescent_type).values('age', 'gender').annotate(count=Count('id'))

    # Initialize dictionaries to store counts
    age_gender_counts = {}
    total_counts = {'male': 0, 'female': 0, 'total': 0}

    for record in adolescents:
        age = record['age']
        gender = record['gender']
        count = record['count']
        
        # Update age_gender_counts
        if age not in age_gender_counts:
            age_gender_counts[age] = {'male': 0, 'female': 0, 'total': 0}
        
        age_gender_counts[age][gender] = count
        age_gender_counts[age]['total'] += count
        
        # Update total counts
        total_counts[gender] += count
        total_counts['total'] += count

    # Calculate percentages
    total_adolescents = total_counts['total']
    for age in age_gender_counts:
        for gender in ['male', 'female', 'total']:
            count = age_gender_counts[age][gender]
            percentage = (count / total_adolescents) * 100
            age_gender_counts[age][f'{gender}_percentage'] = percentage

    # Prepare the response data
    response_data = []
    for age, counts in sorted(age_gender_counts.items()):
        response_data.append({
            'Age': age,
            'female': counts['female'],
            'male': counts['male'],
            'Total': counts['total'],
            'Percentage': f"{counts['total_percentage']:.0f}%"
        })

    response_data.append({
        'Age': 'Total',
        'female': f"{total_counts['female']} ({(total_counts['female'] / max(1, total_adolescents)) * 100:.0f}%)",
        'male': f"{total_counts['male']} ({(total_counts['male'] / max(1, total_adolescents)) * 100:.0f}%)",
        'Total': total_adolescents
    })

    return response_data
