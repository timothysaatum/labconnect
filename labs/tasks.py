import dramatiq # type: ignore
from django.apps import apps # type: ignore
import uuid

@dramatiq.actor
def copy_test_to_branch(test_ids, target_branch_id):
    Test = apps.get_model('labs', 'Test')

    if not test_ids:
        print('Test ids must be provided')
        return

    if not target_branch_id:
        print('Target branch not provided')
        return

    copied_tests = 0
    
    for test_id in test_ids:

        try:
            test = Test.objects.get(id=uuid.UUID(test_id))
            test.branch.add(uuid.UUID(target_branch_id))
            test.save()
            copied_tests += 1

        except Test.DoesNotExist:
            print(f"Test with id {test_id} does not exist")

        except ValueError:
            print(f"Invalid UUID: {test_id}")
    
    print(f"Copied {copied_tests} tests to branch {target_branch_id}")