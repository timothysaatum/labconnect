# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app/

# Install any dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8000 for the application
EXPOSE 8000

# Run the Django development server (or use gunicorn for production)
CMD ["gunicorn", "labconnect.wsgi:application", "--bind", "0.0.0.0:8000"]
