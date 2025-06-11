import re


def generate_insert_statements(filePath, tableName, sqlFile):
    print(filePath)
    # Load the data
    with open(filePath, 'r') as f:
        raw_data = f.read()

    # Match individual objects (between curly braces)
    entries = re.findall(r'\{(.*?)\}', raw_data, re.DOTALL)

    insert_statements = []

    for entry in entries:
        if tableName == "waste_collection_entry":
            # Extract each field using regex
            id_ = re.search(r"id:\s*'([^']+)'", entry).group(1)
            date = re.search(r"date:\s*'([^']+)'", entry).group(1)
            society = re.search(r"society:\s*'([^']+)'", entry).group(1)
            location = re.search(r"location:\s*'([^']+)'", entry).group(1)
            driveType = re.search(r"driveType:\s*'([^']+)'", entry).group(1)
            houses = re.search(r"houses:\s*(\d+)", entry).group(1)
            weight = re.search(r"weight:\s*([\d.]+)", entry).group(1)
            vehicle = re.search(r"vehicle:\s*'([^']+)'", entry).group(1)
            remarks = re.search(r"remarks:\s*'([^']+)'", entry, re.DOTALL).group(1).replace("'", "''")

            # Create SQL INSERT statement
            sql = (
                f"INSERT INTO {tableName} (id, date, society, location, driveType, houses, weight, vehicle, remarks) "
                f"VALUES ('{id_}', '{date}', '{society}', '{location}', '{driveType}', {houses}, {weight}, '{vehicle}', '{remarks}');"
            )
        elif tableName == "waste_management_projects":
            id_ = re.search(r"id:\s*'([^']+)'", entry).group(1)
            title = re.search(r"title:\s*'([^']+)'", entry).group(1)
            description = re.search(r"description:\s*'([^']+)'", entry).group(1)
            date = re.search(r"date:\s*'([^']+)'", entry).group(1)
            location = re.search(r"location:\s*'([^']+)'", entry).group(1)
            status = re.search(r"status:\s*'([^']+)'", entry).group(1)
            wasteType = re.search(r"wasteType:\s*'([^']+)'", entry).group(1)
            houses = re.search(r"houses:\s*(\d+)", entry).group(1)
            weight = re.search(r"weight:\s*([\d.]+)", entry).group(1)
            image = re.search(r"image:\s*'([^']+)'", entry).group(1)
            featured = re.search(r"featured:\s*([true|false]*)", entry).group(1)
            

            # Create SQL INSERT statement
            sql = (
                f"INSERT INTO {tableName} (id, title, description, date, location, status, wasteType, houses, weight, image, featured) "
                f"VALUES ('{id_}', '{title}', '{description}', '{date}', '{location}', '{status}', '{wasteType}', '{houses}', '{weight}', '{image}', {featured});"
            )
        
        insert_statements.append(sql)

    # Save to .sql file
    sqlFilePath = "{}.sql".format(sqlFile)
    print(sqlFilePath)
    with open(sqlFilePath, 'w') as fout:
        fout.write('\n'.join(insert_statements))
        

    print("✅ INSERT statements saved to insert_waste_data.sql")

generate_insert_statements("waste_Data.txt", "waste_collection_entry", "waste_collection_entry")
generate_insert_statements("projects_Data.txt", "waste_management_projects", "waste_management_projects")
