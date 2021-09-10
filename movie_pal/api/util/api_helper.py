API_VERSION = 'v1'


def url(path: str) -> str:
    return f'/api/{API_VERSION}/{path}'
