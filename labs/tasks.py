from celery import shared_task
from .models import Test
from .serializers import TestSerializer
print('Hello there')
@shared_task
def copy_test_to_branch(test_ids, target_branch_id):
    if not test_ids:
        raise('Test ids must be provided')
    if not target_branch_id:
        raise('Target branch not provided')
    tests = []
    for test_id in test_ids:
        test = Test.objects.get(id=test_id)
        print(test)
        test.branch.add(target_branch_id)
        test.save()
        test.append(test)
        
    return TestSerializer(tests, many=True).data
