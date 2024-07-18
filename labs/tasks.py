from celery import shared_task
from .models import Test
from .serializers import TestSerializer

@shared_task
def copy_test_to_branch(test_ids, target_branch_id):
    tests = []
    for test_id in test_ids:
        test = Test.objects.get(id=test_id)
        test.branch.add(target_branch_id)
        test.save()
        test.append(test)
    return TestSerializer(tests, many=True).data
