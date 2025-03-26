import pdfplumber
import pandas as pd
from your_app.models import TestTemplate, SampleTypeTemplate

def extract_pdf_data(pdf_path):
    tests = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table[1:]:  # Skip header row
                    if len(row) >= 6:  # Ensure row has all columns
                        tests.append({
                            "test_id": row[0],
                            "department": row[1],
                            "test_code": row[2],
                            "name": row[3],
                            "cash_price": row[4],
                            "lab_price": row[5],
                        })
    return pd.DataFrame(tests)

def determine_sample_type(test_name):
    """Map test names to appropriate sample types with realistic defaults"""
    test_name = test_name.upper()
    
    if "BLOOD" in test_name:
        return {
            "sample_name": "Whole Blood",
            "sample_tube": "EDTA" if "C/S" not in test_name else "Blood Culture Bottle",
            "collection_procedure": "Venipuncture using aseptic technique",
            "collection_volume": 5.00,
            "storage_requirements": "2-8°C",
            "biosafety_level": "BSL-2" if "HIV" in test_name else "BSL-1"
        }
    elif "URINE" in test_name:
        return {
            "sample_name": "Urine",
            "sample_tube": "Sterile Container",
            "collection_procedure": "Mid-stream clean catch",
            "collection_volume": 10.00,
            "storage_requirements": "2-8°C",
            "biosafety_level": "BSL-1"
        }
    elif "SPUTUM" in test_name or "AFB" in test_name:
        return {
            "sample_name": "Sputum",
            "sample_tube": "Sterile Container",
            "collection_procedure": "Deep cough specimen collected in morning",
            "collection_volume": 5.00,
            "storage_requirements": "2-8°C",
            "biosafety_level": "BSL-2"
        }
    elif "SWAB" in test_name:
        return {
            "sample_name": "Swab",
            "sample_tube": "Transport Medium",
            "collection_procedure": "Collect using sterile swab",
            "collection_volume": 1.00,
            "storage_requirements": "Room Temperature",
            "biosafety_level": "BSL-2" if "MRSA" in test_name else "BSL-1"
        }
    else:
        # Default fallback
        return {
            "sample_name": "Various",
            "sample_tube": "Appropriate container",
            "collection_procedure": "As per test requirements",
            "collection_volume": 5.00,
            "storage_requirements": "2-8°C",
            "biosafety_level": "BSL-1"
        }

def determine_test_preparation(test_name):
    """Set appropriate patient preparation based on test type"""
    test_name = test_name.upper()
    if "FASTING" in test_name or "FBS" in test_name:
        return "8-12 hours fasting required"
    elif "URINE" in test_name:
        return "Mid-stream clean catch"
    elif "STOOL" in test_name:
        return "Collect in clean, dry container"
    else:
        return "No special preparation required"

def determine_turnaround_time(test_name, department):
    """Set realistic turnaround times based on test type"""
    if department == "BACTERIOLOGY":
        return "3-5 days" if "C/S" in test_name else "48 hours"
    elif department == "HAEMATOLOGY":
        return "24 hours"
    elif department == "IMMUNOLOGY":
        return "48 hours"
    else:
        return "24-48 hours"

def save_to_database(df):
    for _, row in df.iterrows():
        try:
            # Clean price data
            cash_price = float(row["cash_price"].replace("GH", "").replace("$", "").replace("(", "").replace(")", "").strip())
            lab_price = float(row["lab_price"].replace("GH", "").replace("$", "").replace("(", "").replace(")", "").strip()) if pd.notna(row["lab_price"]) else None
            
            # Calculate discount percentage if lab price exists
            discount_percent = None
            if lab_price and cash_price > 0:
                discount_percent = f"{round((cash_price - lab_price) / cash_price * 100)}%"

            # Determine sample type based on test name
            sample_defaults = determine_sample_type(row["name"])
            
            # Create SampleType
            sample_type = SampleTypeTemplate.objects.create(
                sample_name=sample_defaults["sample_name"],
                collection_procedure=sample_defaults["collection_procedure"],
                sample_tube=sample_defaults["sample_tube"],
                collection_time="Morning" if "FASTING" in row["name"].upper() else "Anytime",
                storage_requirements=sample_defaults["storage_requirements"],
                transport_requirements="Transport to lab within 1 hour",
                collection_volume=sample_defaults["collection_volume"],
                collection_instructions="Label clearly with patient ID",
                required_fasting="FASTING" in row["name"].upper(),
                storage_temperature=sample_defaults["storage_requirements"].split(" ")[0],
                maximum_storage_duration="24 hours",
                transport_medium="None" if sample_defaults["sample_tube"] == "EDTA" else "Appropriate container",
                packaging_requirements="Sealed biohazard bag",
                biosafety_level=sample_defaults["biosafety_level"],
                infectious_risk=sample_defaults["biosafety_level"] == "BSL-2"
            )

            # Create TestTemplate
            TestTemplate.objects.create(
                test_code=row["test_code"],
                name=row["name"],
                price=cash_price,
                turn_around_time=determine_turnaround_time(row["name"], row["department"]),
                patient_preparation=determine_test_preparation(row["name"]),
                test_status="active",
                discount_price=lab_price,
                discount_percent=discount_percent
            ).sample_type.add(sample_type)

        except Exception as e:
            print(f"Error processing row {row}: {str(e)}")
            continue

if __name__ == "__main__":
    df = extract_pdf_data("ADVANZ_DIAGNOSTICS_2024_TEST_PRICE_LIST.pdf")
    save_to_database(df)
    print(f"Successfully imported {len(df)} tests with realistic sample types and defaults.")