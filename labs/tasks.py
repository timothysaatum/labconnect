from celery import shared_task
from .models import Test
from .serializers import TestSerializer
from sample.models import Sample


# print('Hello there')
@shared_task
def copy_test_to_branch(test_ids, target_branch_id):
    print('Hello')
    if not test_ids:
        print('Test ids must be provided')


    if not target_branch_id:
        print('Target branch not provided')

    
    tests = []
    for test_id in test_ids:

        test = Test.objects.get(id=test_id)
        print(test)
        test.branch.add(target_branch_id)
        test.save()
        tests.append(test)

    return TestSerializer(tests, many=True).data


@shared_task
def count_activity(branch_id):
    pass
    # from celery import shared_task


@shared_task
def get_sample_counts_for_facility(facility_id):
    counts = {
        'pending': Sample.objects.filter(referring_facility=facility_id, sample_status='pending').count(),
        'process': Sample.objects.filter(referring_facility=facility_id, sample_status='process').count(),
        'rejected': Sample.objects.filter(referring_facility=facility_id, sample_status='rejected').count(),
        'received': Sample.objects.filter(referring_facility=facility_id, sample_status='received').count(),
    }
    return counts
