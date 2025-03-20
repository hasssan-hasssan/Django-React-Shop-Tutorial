# Import the ZibalDatabaseAPIs and ZibalServerAPIs classes from the respective modules
# Handles database interactions for Zibal
from .database_apis import ZibalDatabaseAPIs
# Handles server-side API interactions for Zibal
from .server_apis import ZibalServerAPIs


# Define the ZibalAPIs class to encapsulate Zibal server and database operations
class ZibalAPIs:
    def __init__(self):
        # Initialize instances of server and database APIs as attributes of the class
        self.server_apis = ZibalServerAPIs()  # API for interacting with the Zibal server
        self.database_apis = ZibalDatabaseAPIs()  # API for managing Zibal-related database operations
