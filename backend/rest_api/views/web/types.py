from serde import serde


@serde
class FlagStatus:
    flag: str
    final_color_code: str
    computed_color_code: str