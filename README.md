# Django Laboratory Management System

This is a Django-based Laboratory Management System. It provides a structured way to manage and organize laboratories, departments within laboratories, and tests that can be conducted within these departments.

## Models

### BaseModel
The `BaseModel` is an abstract base class that provides common fields like `date_added` and `date_modified` for other models.

### Laboratory
The `Laboratory` model represents a laboratory where tests are conducted. It includes fields like `name`, `digital_address`, `phone`, `email`, `region_of_location`, `town_of_location`, `logo`, `herfra_id`, `website`, and `description`.

### Department
The `Department` model represents a department within a laboratory. It includes fields like `laboratory`, `heard_of_department`, `phone`, `email`, and `department_name`.

### Test
The `Test` model represents a test that can be conducted in a department. It includes fields like `department`, `name`, `price`, and `discount_price`.

### TestResult
The `TestResult` model represents a test result that can be generated in a department within a lab.

## Setup

1. Clone the repository.
2. Install the requirements.
3. Run migrations.
4. Start the server.

## Usage

You can create, read, update, and delete records for each model using Django's admin interface or through the Django shell.

## Contributing

Contributions are welcome. Please open a pull request with your changes.

## License

This project is licensed under the MIT License.
