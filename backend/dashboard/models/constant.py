from dashboard.models.types import StudyPhase

QUESTION_TYPE = [
    ('pre_screening', 'pre_screening'),
    ('practice', 'practice'),
    ('survey', 'survey'),
    ('survey_feedback', 'survey_feedback'),
    ('physical_assessment', 'physical_assessment'),
    ('lab_assessment', 'lab_assessment'),
    ('clinical_assessment', 'clinical_assessment'),
    ('counsellor_assessment', 'counsellor_assessment'),
    ('evaluation', 'evaluation'),
    ('exit_interview', 'exit_interview'),
]

STUDY_PHASE_CHOICES = [
    (str(StudyPhase.PILOT), str(StudyPhase.PILOT)),
    (str(StudyPhase.IMPLEMENTATION), str(StudyPhase.IMPLEMENTATION)),
    (str(StudyPhase.FOLLOWUP), str(StudyPhase.FOLLOWUP)),
]
