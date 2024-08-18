from django.db.models.query import QuerySet
from django.db.models import Count
from dashboard.models import *


def get_demographic_data(adolescent_type):
    # Query to get counts of adolescents grouped by age and gender
    adolescents = Adolescent.objects.filter(type=adolescent_type).values(
        'age', 'gender').annotate(count=Count('id'))

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
            percentage = (count / max(1, total_adolescents)) * 100
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
        'female':
        f"{total_counts['female']} ({(total_counts['female'] / max(1, total_adolescents)) * 100:.0f}%)",
        'male':
        f"{total_counts['male']} ({(total_counts['male'] / max(1, total_adolescents)) * 100:.0f}%)",
        'Total': total_adolescents
    })

    return response_data


def get_age_distribution_data():
    # Query to get counts of adolescents grouped by age and type
    adolescents = Adolescent.objects.values('age',
                                            'type').annotate(count=Count('id'))

    # Initialize dictionaries to store counts
    age_type_counts = {}
    total_counts = {'basic': 0, 'community': 0, 'secondary': 0, 'total': 0}

    for record in adolescents:
        age = record['age']
        adolescent_type = (record['type'] or "").lower()
        count = record['count']

        # Update age_type_counts
        if age not in age_type_counts:
            age_type_counts[age] = {
                'basic': 0,
                'community': 0,
                'secondary': 0,
                'total': 0
            }

        age_type_counts[age][adolescent_type] = count
        age_type_counts[age]['total'] += count

        # Update total counts
        total_counts[adolescent_type] += count
        total_counts['total'] += count

    # Calculate percentages
    total_adolescents = total_counts['total']
    for age in age_type_counts:
        count = age_type_counts[age]['total']
        percentage = (count / max(1, total_adolescents)) * 100
        age_type_counts[age]['percentage'] = percentage

    # Prepare the response data
    response_data = []
    for age, counts in sorted(age_type_counts.items()):
        response_data.append({
            'Age': age,
            'Basic': counts['basic'],
            'Community': counts['community'],
            'Secondary': counts['secondary'],
            'Total': counts['total'],
            'Percentage': f"{counts['percentage']:.2f}%"
        })

    response_data.append({
        'Age': 'Total',
        'Basic': total_counts['basic'],
        'Community': total_counts['community'],
        'Secondary': total_counts['secondary'],
        'Total': total_counts['total'],
        'Percentage': "100.00%"
    })

    return response_data


def get_completed_treatment(is_onsite, status):
    categories = ["basic", "secondary", "community"]

    referrals = Referral.objects.filter(
        is_onsite=is_onsite, status=status).select_related(
            'adolescent').prefetch_related('services__related_flag_labels')

    treated = []
    flag_label_distribution = {
        label.name: {
            category.lower(): 0
            for category in categories
        }
        for label in FlagLabel.objects.all()
    }
    for referral in referrals:
        for service in referral.services.all():
            for flag_label in service.related_flag_labels.all():
                flag_label_distribution[flag_label.name][(
                    referral.adolescent.type or "").lower()] += 1

    for flag_label, counts in flag_label_distribution.items():
        total = sum(counts.values())
        if total > 0:
            treated.append({"name": flag_label, "total": total, **counts})

    # Sort treated by name
    treated = sorted(treated, key=lambda x: x["name"])
    return treated


def remove_non_flagged_questions(
    questions: QuerySet,
    adolescent: Adolescent,
):
    non_problematic_flags = SummaryFlag.objects.filter(
        adolescent=adolescent,
        label__exclude_study_phase=None,
        label__exclude_if_not_flagged=True,

        # Original study phase
        study_phase=adolescent.study_phase,
    ).exclude(final_color_code=Colors.RED.value)

    for flag in non_problematic_flags:
        non_problematic_questions = flag.get_questions()

        questions = questions.exclude(non_problematic_questions)
    return questions.exclude(exclude_if_not_flagged=True)
