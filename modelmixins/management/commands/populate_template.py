#import random
#from django.core.management.base import BaseCommand
#from modelmixins.models import TestTemplate, SampleTypeTemplate
#import json

#class Command(BaseCommand):
#    help = 'Generates test templates with real-world and random sample types.'

#    def handle(self, *args, **kwargs):
#        african_tests_json = """
#[
#    {
#        "test_code": "GLUCOSE_RANDOM",
#        "name": "Random Blood Glucose",
#        "price": 60.00,
#        "turn_around_time": "1 hour",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Plasma",
#            "collection_procedure": "Collect blood in a fluoride oxalate tube.",
#            "sample_tube": "Gray top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 2.00,
#            "collection_instructions": "Prompt processing.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "24 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 50.00,
#        "discount_percent": "16.7%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "CBC",
#        "name": "Complete Blood Count",
#        "price": 80.00,
#        "turn_around_time": "2 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Whole Blood",
#            "collection_procedure": "Collect blood in an EDTA tube.",
#            "sample_tube": "Lavender top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at room temperature.",
#            "transport_requirements": "Transport at room temperature.",
#            "collection_volume": 2.00,
#            "collection_instructions": "Mix gently by inverting 8-10 times.",
#            "required_fasting": false,
#            "storage_temperature": "15-25°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "None",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 70.00,
#        "discount_percent": "12.5%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "LIPID_PANEL",
#        "name": "Lipid Panel",
#        "price": 120.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "Fasting for 8-12 hours required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Morning preferred.",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 3.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": true,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 100.00,
#        "discount_percent": "16.7%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "HIV_RAPID",
#        "name": "HIV Rapid Test",
#        "price": 30.00,
#        "turn_around_time": "30 minutes",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Whole Blood",
#            "collection_procedure": "Collect blood via finger prick or venipuncture.",
#            "sample_tube": "None (rapid test kit)",
#            "collection_time": "Anytime",
#            "storage_requirements": "Use immediately after collection.",
#            "transport_requirements": "Not applicable.",
#            "collection_volume": 0.05,
#            "collection_instructions": "Follow kit instructions.",
#            "required_fasting": false,
#            "storage_temperature": "Room temperature",
#            "maximum_storage_duration": "Immediate use",
#            "transport_medium": "None",
#            "packaging_requirements": "None",
#            "biosafety_level": "BSL-2",
#            "infectious_risk": true
#        },
#        "discount_price": 25.00,
#        "discount_percent": "16.7%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "MALARIA_RDT",
#        "name": "Malaria Rapid Diagnostic Test",
#        "price": 25.00,
#        "turn_around_time": "20 minutes",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Whole Blood",
#            "collection_procedure": "Collect blood via finger prick or venipuncture.",
#            "sample_tube": "None (rapid test kit)",
#            "collection_time": "Anytime",
#            "storage_requirements": "Use immediately after collection.",
#            "transport_requirements": "Not applicable.",
#            "collection_volume": 0.05,
#            "collection_instructions": "Follow kit instructions.",
#            "required_fasting": false,
#            "storage_temperature": "Room temperature",
#            "maximum_storage_duration": "Immediate use",
#            "transport_medium": "None",
#            "packaging_requirements": "None",
#            "biosafety_level": "BSL-2",
#            "infectious_risk": true
#        },
#        "discount_price": 20.00,
#        "discount_percent": "20%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "TYPHOID_TEST",
#        "name": "Typhoid Test (Widal Test)",
#        "price": 50.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 2.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-2",
#            "infectious_risk": true
#        },
#        "discount_price": 40.00,
#        "discount_percent": "20%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "URINALYSIS",
#        "name": "Urinalysis",
#        "price": 40.00,
#        "turn_around_time": "2 hours",
#        "patient_preparation": "Clean-catch midstream urine collection.",
#        "sample_type": {
#            "sample_name": "Urine",
#            "collection_procedure": "Collect midstream urine in a sterile container.",
#            "sample_tube": "Sterile container",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport at room temperature.",
#            "collection_volume": 10.00,
#            "collection_instructions": "Avoid contamination during collection.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "24 hours",
#            "transport_medium": "None",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 35.00,
#        "discount_percent": "12.5%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "BMP",
#        "name": "Basic Metabolic Panel",
#        "price": 100.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "Fasting for 8-12 hours required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Morning preferred.",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 3.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": true,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 90.00,
#        "discount_percent": "10%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "CMP",
#        "name": "Comprehensive Metabolic Panel",
#        "price": 150.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "Fasting for 8-12 hours required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Morning preferred.",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 3.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": true,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 130.00,
#        "discount_percent": "13.3%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "THYROID_PANEL",
#        "name": "Thyroid Function Panel",
#        "price": 120.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 3.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 100.00,
#        "discount_percent": "16.7%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "LFT",
#        "name": "Liver Function Tests",
#        "price": 110.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 3.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 95.00,
#        "discount_percent": "13.6%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "RFT",
#        "name": "Renal Function Tests",
#        "price": 100.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 3.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 85.00,
#        "discount_percent": "15%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "FASTING_GLUCOSE",
#        "name": "Fasting Blood Glucose",
#        "price": 60.00,
#        "turn_around_time": "1 hour",
#        "patient_preparation": "Fasting for 8-12 hours required.",
#        "sample_type": {
#            "sample_name": "Plasma",
#            "collection_procedure": "Collect blood in a fluoride oxalate tube.",
#            "sample_tube": "Gray top",
#            "collection_time": "Morning preferred.",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 2.00,
#            "collection_instructions": "Prompt processing.",
#            "required_fasting": true,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "24 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 50.00,
#        "discount_percent": "16.7%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "HBA1C",
#        "name": "Hemoglobin A1c (HbA1c)",
#        "price": 70.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Whole Blood",
#            "collection_procedure": "Collect blood in an EDTA tube.",
#            "sample_tube": "Lavender top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at room temperature.",
#            "transport_requirements": "Transport at room temperature.",
#            "collection_volume": 2.00,
#            "collection_instructions": "Mix gently by inverting 8-10 times.",
#            "required_fasting": false,
#            "storage_temperature": "15-25°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "None",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 60.00,
#        "discount_percent": "14.3%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "STOOL_ROUTINE",
#        "name": "Stool Routine Examination",
#        "price": 40.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Stool",
#            "collection_procedure": "Collect stool in a sterile container.",
#            "sample_tube": "Sterile container",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport at room temperature.",
#            "collection_volume": 5.00,
#            "collection_instructions": "Avoid contamination during collection.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "24 hours",
#                       "transport_medium": "None",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-2",
#            "infectious_risk": true
#        },
#        "discount_price": 35.00,
#        "discount_percent": "12.5%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "STOOL_OCCULT_BLOOD",
#        "name": "Stool Occult Blood",
#        "price": 45.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "Avoid red meat and certain medications for 3 days before the test.",
#        "sample_type": {
#            "sample_name": "Stool",
#            "collection_procedure": "Collect stool in a sterile container.",
#            "sample_tube": "Sterile container",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport at room temperature.",
#            "collection_volume": 5.00,
#            "collection_instructions": "Avoid contamination during collection.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "24 hours",
#            "transport_medium": "None",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-2",
#            "infectious_risk": true
#        },
#        "discount_price": 38.00,
#        "discount_percent": "15.6%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "CRP",
#        "name": "C-Reactive Protein (CRP)",
#        "price": 50.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 2.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 42.00,
#        "discount_percent": "16%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "ESR",
#        "name": "Erythrocyte Sedimentation Rate (ESR)",
#        "price": 40.00,
#        "turn_around_time": "1 hour",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Whole Blood",
#            "collection_procedure": "Collect blood in an EDTA tube.",
#            "sample_tube": "Lavender top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at room temperature.",
#            "transport_requirements": "Transport at room temperature.",
#            "collection_volume": 2.00,
#            "collection_instructions": "Mix gently by inverting 8-10 times.",
#            "required_fasting": false,
#            "storage_temperature": "15-25°C",
#            "maximum_storage_duration": "24 hours",
#            "transport_medium": "None",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 35.00,
#        "discount_percent": "12.5%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "IRON_STUDIES",
#        "name": "Iron Studies",
#        "price": 90.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "Fasting for 8-12 hours required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Morning preferred.",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 3.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": true,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 80.00,
#        "discount_percent": "11.1%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "VITAMIN_D",
#        "name": "Vitamin D Test",
#        "price": 120.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 3.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 100.00,
#        "discount_percent": "16.7%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "VITAMIN_B12",
#        "name": "Vitamin B12 Test",
#        "price": 100.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 3.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 85.00,
#        "discount_percent": "15%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "FOLATE_TEST",
#        "name": "Folate Test",
#        "price": 90.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Serum",
#            "collection_procedure": "Collect blood in a serum separator tube.",
#            "sample_tube": "Gold top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 3.00,
#            "collection_instructions": "Allow blood to clot for 30 minutes before centrifugation.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "48 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 75.00,
#        "discount_percent": "16.7%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "PT",
#        "name": "Prothrombin Time (PT)",
#        "price": 60.00,
#        "turn_around_time": "2 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Plasma",
#            "collection_procedure": "Collect blood in a citrate tube.",
#            "sample_tube": "Blue top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 2.00,
#            "collection_instructions": "Mix gently by inverting 8-10 times.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "24 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 50.00,
#        "discount_percent": "16.7%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "PTT",
#        "name": "Partial Thromboplastin Time (PTT)",
#        "price": 60.00,
#        "turn_around_time": "2 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Plasma",
#            "collection_procedure": "Collect blood in a citrate tube.",
#            "sample_tube": "Blue top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 2.00,
#            "collection_instructions": "Mix gently by inverting 8-10 times.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "24 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 50.00,
#        "discount_percent": "16.7%",
#        "test_status": "active"
#    },
#    {
#        "test_code": "D_DIMER",
#        "name": "D-Dimer Test",
#        "price": 80.00,
#        "turn_around_time": "24 hours",
#        "patient_preparation": "No specific preparation required.",
#        "sample_type": {
#            "sample_name": "Plasma",
#            "collection_procedure": "Collect blood in a citrate tube.",
#            "sample_tube": "Blue top",
#            "collection_time": "Anytime",
#            "storage_requirements": "Store at 2-8°C.",
#            "transport_requirements": "Transport on ice.",
#            "collection_volume": 2.00,
#            "collection_instructions": "Mix gently by inverting 8-10 times.",
#            "required_fasting": false,
#            "storage_temperature": "2-8°C",
#            "maximum_storage_duration": "24 hours",
#            "transport_medium": "Ice pack",
#            "packaging_requirements": "Biohazard bag.",
#            "biosafety_level": "BSL-1",
#            "infectious_risk": false
#        },
#        "discount_price": 70.00,
#        "discount_percent": "12.5%",
#        "test_status": "active"
#    }
#]
#"""
#        try:
#            tests_data = json.loads(african_tests_json)
#            for test_data in tests_data:
#                sample_data = test_data.pop('sample_type')
#                sample_type, created = SampleTypeTemplate.objects.get_or_create(**sample_data)

#                test_template, created = TestTemplate.objects.get_or_create(
#                    test_code=test_data['test_code'],
#                    defaults={
#                        'name': test_data['name'],
#                        'price': test_data['price'],
#                        'turn_around_time': test_data['turn_around_time'],
#                        'patient_preparation': test_data['patient_preparation'],
#                        'discount_price': test_data.get('discount_price'),
#                        'discount_percent': test_data.get('discount_percent'),
#                        'test_status': test_data.get('test_status', 'active'),
#                    }
#                )

#                test_template.sample_type.set([sample_type]) # Corrected to use .set()

#                if created:
#                    self.stdout.write(self.style.SUCCESS(f"Created test template: {test_template.name}"))
#                else:
#                    self.stdout.write(self.style.WARNING(f"Test template already exists: {test_template.name}"))

#        except json.JSONDecodeError:
#            self.stdout.write(self.style.ERROR("Invalid JSON format in african_tests_json."))
#        except Exception as e:
#            self.stdout.write(self.style.ERROR(f"An error occurred: {e}"))

import uuid
#from decimal import Decimal
import os
import pdfplumber
from django.core.management.base import BaseCommand
from modelmixins.models import Department, SampleType, TestTemplate
from decouple import config
from labs.utils import parse_price, infer_sample_types, guess_patient_preparation


ENV = config("DJANGO_ENV", default="development").lower()


class Command(BaseCommand):
    help = 'Load tests from the ADVANZ Diagnostics PDF into the database'

    def handle(self, *args, **kwargs):
        if ENV == "production":
            pdf_path = "/home/ubuntu/labconnect/test.pdf"
        else:
            pdf_path = '/data/data/com.termux/files/home/storage/documents/projects/labconnect/test.pdf'

        if not os.path.exists(pdf_path):
            self.stdout.write(self.style.ERROR(f"PDF file not found at: {pdf_path}"))
            return

        self.stdout.write(self.style.NOTICE(f"Using PDF at: {pdf_path}"))

        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, start=1):
                table = page.extract_table()
                if not table:
                    self.stdout.write(self.style.WARNING(f"No table found on page {page_num}"))
                    continue

                headers = table[0]
                rows = table[1:]

                for row in rows:
                    if len(row) < 6:
                        self.stdout.write(self.style.WARNING(f"Incomplete row skipped on page {page_num}: {row}"))
                        continue

                    try:
                        test_id, department_name, test_code, test_name, cash_price, labs_price = row[:6]

                        if not test_name:
                            self.stdout.write(self.style.WARNING(f"Row without test name skipped: {row}"))
                            continue

                        department, _ = Department.objects.get_or_create(name=department_name.strip())

                        test, created = TestTemplate.objects.get_or_create(
                            name=test_name.strip(),
                            defaults={
                                "test_code": test_code.strip() if test_code else None,
                                "price": parse_price(cash_price) if cash_price else 0,
                                "turn_around_time": "4 hours",
                                "department": department,
                                 "discount_price": parse_price(labs_price) if labs_price else None,
                                 "patient_preparation": guess_patient_preparation(test_name)
                            }
                        )

                        if not created:
                            # Optionally update department if it has changed
                            if test.department != department:
                                test.department = department
                                test.save()
                                self.stdout.write(self.style.SUCCESS(f"Updated department for: {test_name}"))
                            else:
                                self.stdout.write(self.style.WARNING(f"Skipped existing: {test_name}"))
                        else:
                            self.stdout.write(self.style.SUCCESS(f"Added: {test_name}"))
                        
                        sample_types = infer_sample_types(test_name)
                        test.sample_type.set(sample_types)
                        self.stdout.write(self.style.SUCCESS(f"Assigned sample types to {test_name}: {[s.sample_name for s in sample_types]}"))

                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Error on row {row}: {e}"))