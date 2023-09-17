from enum import Enum


class ResponseInputType(Enum):
    TEXT_FIELD = "text_field"
    NUMBER_FIELD = "number_field"
    RADIO_BUTTON = "radio_button"
    CHECKBOXES = "checkboxes"
    RANGER_SLIDER = "range_slider"
