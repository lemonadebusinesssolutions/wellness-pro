import json
from replit import db

# Fetch all data from the database
data = {key: db[key] for key in db.keys()}

# Save it to a JSON file
with open("database_export.json", "w") as file:
    json.dump(data, file)
