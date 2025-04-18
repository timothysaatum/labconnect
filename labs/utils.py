import json
from uuid import UUID
# from geographiclib.geodesic import Geodesic
from django.db.models import Q
from .constants import LEVEL_ORDER
# from concurrent.futures import ThreadPoolExecutor
import logging
from decimal import InvalidOperation,  Decimal
# import socket
# import time
from modelmixins.models import SampleTypeTemplate
from modelmixins.utils import calculate_distance

logger = logging.getLogger(__name__)



def parse_price(price_str):
    try:
        return Decimal(price_str.replace("GH₵", "").replace(",", "").strip())
    except InvalidOperation:
        return None

def filter_by_facility_level(query, facility_level):

    """
    Filter facilities by their level.
    """

    if facility_level not in LEVEL_ORDER:
        return query  # Return unfiltered query if the level is invalid

    level_value = LEVEL_ORDER[facility_level]
    valid_levels = [
        level for level, value in LEVEL_ORDER.items() if value >= level_value
    ]

    return query.filter(
        Q(hospitallab__level__in=valid_levels) | Q(branch__level__in=valid_levels)
    )


def get_nearby_branches(query=None, user_lat=None, user_long=None, max_distance_km=None):

    """
    Retrieve branches within max_distance_km from the user's location.
    """

    nearby_branches = []
    user_lat, user_long = float(user_lat), float(user_long)

    for facility in query:
        try:
            # Extract lat/lon and calculate distance
            # branch = facility.branch
            if not facility.gps_coordinates:
                continue  # Skip facilities without GPS coordinates

            lat, lon = map(float, facility.gps_coordinates.split(","))
            distance = calculate_distance(user_lat, user_long, lat, lon)

            if distance <= max_distance_km:
                nearby_branches.append((facility, distance))

        except ValueError:
            # Handle invalid GPS data
            continue

    # Sort branches by distance and return the facilities
    return [branch[0] for branch in sorted(nearby_branches, key=lambda x: x[1])]


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return str(obj)
        return json.JSONEncoder.default(self, obj)


sample_defaults = {
    "blood": {
        "sample_name": "Blood",
        "sample_tube": "EDTA / Plain Tube",
        "collection_procedure": "Collect via venipuncture using sterile equipment.",
        "collection_time": "Morning",
        "storage_requirements": "Store at 2–8°C.",
        "transport_requirements": "Cold chain recommended.",
        "collection_volume": 5.0,
        "collection_instructions": "Mix with anticoagulant if needed.",
        "required_fasting": True,
        "storage_temperature": "2–8°C",
        "maximum_storage_duration": "48 hours",
        "transport_medium": "None",
        "packaging_requirements": "Use biohazard-labeled bags with absorbent material.",
        "biosafety_level": "BSL-2",
        "infectious_risk": True
    },
    "urine": {
        "sample_name": "Urine",
        "sample_tube": "Sterile Urine Container",
        "collection_procedure": "Midstream clean-catch into sterile container.",
        "collection_time": "First morning sample",
        "storage_requirements": "Refrigerate if delay > 1hr.",
        "transport_requirements": "Leak-proof container with cold pack.",
        "collection_volume": 10.0,
        "collection_instructions": "Avoid contamination.",
        "required_fasting": False,
        "storage_temperature": "2–8°C",
        "maximum_storage_duration": "24 hours",
        "transport_medium": "None",
        "packaging_requirements": "Leak-proof and labeled.",
        "biosafety_level": "BSL-1",
        "infectious_risk": False
    },
    "stool": {
        "sample_name": "Stool",
        "sample_tube": "Sterile Stool Container",
        "collection_procedure": "Collect fresh stool in sterile container.",
        "collection_time": "Anytime",
        "storage_requirements": "Refrigerate within 2 hours.",
        "transport_requirements": "Cool box with ice pack.",
        "collection_volume": 5.0,
        "collection_instructions": "Avoid urine or toilet paper contamination.",
        "required_fasting": False,
        "storage_temperature": "2–8°C",
        "maximum_storage_duration": "24 hours",
        "transport_medium": "None",
        "packaging_requirements": "Triple package with biohazard label.",
        "biosafety_level": "BSL-2",
        "infectious_risk": True
    },
    "sputum": {
        "sample_name": "Sputum",
        "sample_tube": "Sterile Container",
        "collection_procedure": "Instruct patient to cough deeply to expectorate.",
        "collection_time": "Morning before brushing teeth",
        "storage_requirements": "Refrigerate immediately.",
        "transport_requirements": "Cool box preferred.",
        "collection_volume": 3.0,
        "collection_instructions": "Avoid saliva contamination.",
        "required_fasting": False,
        "storage_temperature": "2–8°C",
        "maximum_storage_duration": "12 hours",
        "transport_medium": "None",
        "packaging_requirements": "Use sealed sterile container.",
        "biosafety_level": "BSL-2",
        "infectious_risk": True
    },
    "swab": {
        "sample_name": "Swab",
        "sample_tube": "Sterile Swab with Transport Medium",
        "collection_procedure": "Swab target area with sterile technique.",
        "collection_time": "Anytime",
        "storage_requirements": "Use transport medium.",
        "transport_requirements": "Keep upright in cool box.",
        "collection_volume": 1.0,
        "collection_instructions": "Avoid contamination. Use appropriate site.",
        "required_fasting": False,
        "storage_temperature": "Room temperature or 4°C",
        "maximum_storage_duration": "24 hours",
        "transport_medium": "Transport medium (e.g., Amies)",
        "packaging_requirements": "Transport in sealed swab holder.",
        "biosafety_level": "BSL-2",
        "infectious_risk": True
    },
    "serum": {
        "sample_name": "Serum",
        "sample_tube": "Plain Tube (Red cap)",
        "collection_procedure": "Allow blood to clot and centrifuge to obtain serum.",
        "collection_time": "Morning",
        "storage_requirements": "Store at -20°C for long term.",
        "transport_requirements": "Frozen if >24h delay.",
        "collection_volume": 3.0,
        "collection_instructions": "Ensure proper clotting before centrifugation.",
        "required_fasting": True,
        "storage_temperature": "-20°C",
        "maximum_storage_duration": "7 days (frozen)",
        "transport_medium": "None",
        "packaging_requirements": "Secondary container with absorbent.",
        "biosafety_level": "BSL-2",
        "infectious_risk": True
    },
    "csf": {
        "sample_name": "CSF",
        "sample_tube": "Sterile CSF Vial",
        "collection_procedure": "Collected via lumbar puncture by physician.",
        "collection_time": "Anytime (urgent)",
        "storage_requirements": "Room temp for microbiology, 2–8°C for chemistry.",
        "transport_requirements": "Immediate transport preferred.",
        "collection_volume": 1.0,
        "collection_instructions": "Label tubes appropriately by order of collection.",
        "required_fasting": False,
        "storage_temperature": "Room temp / 2–8°C",
        "maximum_storage_duration": "1–2 hours",
        "transport_medium": "None",
        "packaging_requirements": "Triple package.",
        "biosafety_level": "BSL-2",
        "infectious_risk": True
    },
    "plasma": {
        "sample_name": "Plasma",
        "sample_tube": "Heparin / Citrate / EDTA Tube",
        "collection_procedure": "Centrifuge anticoagulated blood to obtain plasma.",
        "collection_time": "Morning",
        "storage_requirements": "Store at -20°C or lower.",
        "transport_requirements": "Frozen transport if delay >24h.",
        "collection_volume": 3.0,
        "collection_instructions": "Ensure prompt separation after collection.",
        "required_fasting": True,
        "storage_temperature": "-20°C",
        "maximum_storage_duration": "7 days",
        "transport_medium": "None",
        "packaging_requirements": "Sealed vial in cool box.",
        "biosafety_level": "BSL-2",
        "infectious_risk": True
    },
    "semen": {
        "sample_name": "Semen",
        "sample_tube": "Sterile Semen Container",
        "collection_procedure": "Collected via masturbation into sterile container.",
        "collection_time": "After 2–7 days abstinence",
        "storage_requirements": "Maintain at body temp (37°C).",
        "transport_requirements": "Deliver to lab within 1 hour.",
        "collection_volume": 2.0,
        "collection_instructions": "Avoid contamination.",
        "required_fasting": False,
        "storage_temperature": "37°C",
        "maximum_storage_duration": "1 hour",
        "transport_medium": "None",
        "packaging_requirements": "Sterile container in biohazard bag.",
        "biosafety_level": "BSL-2",
        "infectious_risk": True
    },
    "tissue": {
        "sample_name": "Tissue",
        "sample_tube": "Formalin Container",
        "collection_procedure": "Excised and preserved in 10% formalin.",
        "collection_time": "In theatre or biopsy session",
        "storage_requirements": "Room temp in fixative.",
        "transport_requirements": "Leak-proof fixative container.",
        "collection_volume": 1.0,
        "collection_instructions": "Submerge completely in fixative.",
        "required_fasting": False,
        "storage_temperature": "Room temp",
        "maximum_storage_duration": "7 days",
        "transport_medium": "Formalin",
        "packaging_requirements": "Triple packaging with hazard label.",
        "biosafety_level": "BSL-2",
        "infectious_risk": True
    },
    "aspirate": {
        "sample_name": "Aspirate",
        "sample_tube": "Sterile Syringe / Tube",
        "collection_procedure": "Collected via needle aspiration.",
        "collection_time": "During procedure",
        "storage_requirements": "Refrigerate or fix as appropriate.",
        "transport_requirements": "Cold box or appropriate fixative.",
        "collection_volume": 1.0,
        "collection_instructions": "Ensure sterility.",
        "required_fasting": False,
        "storage_temperature": "2–8°C",
        "maximum_storage_duration": "24 hours",
        "transport_medium": "None or fixative",
        "packaging_requirements": "Leak-proof with absorbent material.",
        "biosafety_level": "BSL-2",
        "infectious_risk": True
    },
    "fluid": {
        "sample_name": "Body Fluid",
        "sample_tube": "Sterile Container",
        "collection_procedure": "Aspirated under sterile conditions.",
        "collection_time": "As clinically indicated",
        "storage_requirements": "Refrigerate promptly.",
        "transport_requirements": "Transport within 1 hour.",
        "collection_volume": 2.0,
        "collection_instructions": "Avoid contamination.",
        "required_fasting": False,
        "storage_temperature": "2–8°C",
        "maximum_storage_duration": "24 hours",
        "transport_medium": "None",
        "packaging_requirements": "Triple packaging.",
        "biosafety_level": "BSL-2",
        "infectious_risk": True
    }
}

def infer_sample_types(test_name):
    matched_samples = []
    lower_name = test_name.lower()

    for keyword, sample_data in sample_defaults.items():
        if keyword in lower_name:
            sample_type, created = SampleTypeTemplate.objects.get_or_create(
                sample_name=sample_data["sample_name"],
                defaults=sample_data
            )

            if not created:
                # Optional: update only missing fields
                for key, value in sample_data.items():
                    if getattr(sample_type, key) in [None, '', 0]:
                        setattr(sample_type, key, value)
                sample_type.save()

            matched_samples.append(sample_type)

    # Default if no match
    if not matched_samples:
        sample_data = sample_defaults["blood"]
        sample_type, created = SampleTypeTemplate.objects.get_or_create(
            sample_name=sample_data["sample_name"],
            defaults=sample_data
        )
        if not created:
            for key, value in sample_data.items():
                if getattr(sample_type, key) in [None, '', 0]:
                    setattr(sample_type, key, value)
            sample_type.save()
        matched_samples.append(sample_type)

    return matched_samples
    
    
    
def guess_patient_preparation(test_name):
    name = test_name.lower()

    if "fasting" in name or any(x in name for x in ["glucose", "lipid", "cholesterol", "fbs", "rbs"]):
        return "Patient should fast for 8–12 hours before sample collection."
    elif "urine" in name:
        return "Collect midstream urine sample in a sterile container."
    elif "stool" in name:
        return "Provide a fresh stool sample in a sterile container. Avoid contamination."
    elif "sputum" in name:
        return "Collect early morning sputum sample before brushing teeth."
    elif "semen" in name:
        return "Abstain from sexual activity for 2–5 days before sample collection."
    elif "blood" in name:
        return "Patient should remain seated or lying down during sample collection."
    elif "swab" in name:
        return "Do not use antibiotics or antiseptics before sample collection."
    elif "csf" in name:
        return "Collected via lumbar puncture by a qualified physician."
    else:
        return "Follow standard pre-test instructions provided by the lab."