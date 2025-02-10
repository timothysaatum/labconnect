class PrimaryReplicaRouter:
    """
    A router to control database operations on models.
    Routes writes to the primary database and reads to the replica.
    """

    def db_for_read(self, model, **hints):
        """Direct read operations to the replica."""
        return "replica"

    def db_for_write(self, model, **hints):
        """Direct write operations to the primary database."""
        return "default"

    def allow_relation(self, obj1, obj2, **hints):
        """Allow relations if both objects are in the same database."""
        db_list = ("default", "replica")
        if obj1._state.db in db_list and obj2._state.db in db_list:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Ensure migrations only apply to the primary database."""
        return db == "default"
