from enum import Enum


class ResponseInputType(Enum):
    TEXT_FIELD = "text_field"
    NUMBER_FIELD = "number_field"
    RADIO_BUTTON = "radio_button"
    CHECKBOXES = "checkboxes"
    RANGER_SLIDER = "range_slider"


class Colors(Enum):
    GREY = "#808080"
    RED = "#ff0000"
    ORANGE = "#ffa500"
    GREEN = "#00ff00"


class ReferralStatus(Enum):
    NEW = "new"
    REVIEW = 'review'
    COMPLETED = "completed"


class SyncStatus(Enum):
    IDLE = "idle"
    PROGRESS = "progress"
    FAILED = 'failed'
    COMPLETED = "completed"
