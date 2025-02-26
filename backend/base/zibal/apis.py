from .database_apis import ZibalDatabaseAPIs
from .server_apis import ZibalServerAPIs


class ZibalAPIs:
    def __init__(self):
        self.server_apis = ZibalServerAPIs()
        self.database_apis = ZibalDatabaseAPIs()
