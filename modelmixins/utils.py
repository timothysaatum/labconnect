import uuid

def ensure_uuid(value):
    if isinstance(value, uuid.UUID):
        return str(value)
    
    try:
        return str(uuid.UUID(value))
    except ValueError:
        return None