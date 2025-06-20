# PYTHON FLASK APP WITH MYSQL INTEGRATION
from flask import Flask, request, jsonify, render_template, redirect, url_for, make_response, Blueprint
import mysql.connector
import time

projects_api = Blueprint('projects_api', __name__)

# MySQL Configuration
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='root',
    database='waste_management'
)
cursor = conn.cursor(dictionary=True)

# API: Get all projects
@projects_api.route('/api/projects', methods=['GET'])
def get_projects():
    cursor.execute("SELECT * FROM waste_management_projects")
    projects = cursor.fetchall()
    response = make_response(jsonify(projects))
    response.headers['Content-Type'] = 'application/json'
    return response

# API: Create a new project
@projects_api.route('/api/projects', methods=['POST'])
def add_project():
    data = request.get_json()
    query = ("INSERT INTO waste_management_projects (id, title, description, date, location, "
             "status, wasteType, houses, weight, image, featured) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
    values = (
        data["id"], data['title'], data['description'], data['date'], data['location'],
        data['status'], data['wasteType'], data['houses'], data['weight'], data['image'], data['featured']
    )
    cursor.execute(query, values)
    conn.commit()
    response = make_response(jsonify({"message": "Record added successfully"}))
    response.headers['Content-Type'] = 'application/json'
    return response

# API: Update a project
@projects_api.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    data = request.get_json()
    query = ("UPDATE waste_management_projects SET date=%s, title=%s, description=%s, data=%s, location=%s, wasteType=%s, houses=%s, "
             "status=%s, weight=%s, image=%s, featured=%s WHERE id=%s")
    values = (
        data["id"], data['title'], data['description'], data['date'], data['location'],
        data['status'], data['wasteType'], data['houses'], data['weight'], data['image'], data['featured'], record_id
    )
    cursor.execute(query, values)
    conn.commit()
    response = make_response(jsonify({"message": "Project updated successfully"}))
    response.headers['Content-Type'] = 'application/json'
    return response

# API: Delete a project
@projects_api.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_record(project_id):
    cursor.execute("DELETE FROM waste_management_projects WHERE id = %s", (project_id,))
    conn.commit()
    response = make_response(jsonify({"message": "Project deleted successfully"}))
    response.headers['Content-Type'] = 'application/json'
    return response, 200


@projects_api.route('/api/projects/add', methods=['GET', 'POST'])
def add():
    data = request.form
    if request.is_json:
        data = request.get_json()
        print("json",  data)
    else:
        data = request.form
        print("form", data)
    
    id = time.time()
    query = ("INSERT INTO waste_management_projects (id, title, description, date, location, status, wasteType, houses, weight, image, featured) "
             "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
    values = ( str(id), data['title'], data['description'], data['date'], data['location'],
        data['status'], data['wasteType'], data['houses'], data['weight'], data['image'], data['featured'])
    cursor.execute(query, values)
    conn.commit()
    message = jsonify({"message": "Record added successfully"})
    response = make_response(message)
    response.headers['Content-Type'] = 'application/json'
    print(message)
    return response, 200


@projects_api.route('/api/projects/delete/<id>', methods=['DELETE'])
def delete(id):
    cursor.execute("DELETE FROM waste_management_projects WHERE id=%s", (id,))
    conn.commit()
    response = make_response(jsonify({"message": "Record {} deleted successfully".format(id)}))
    response.headers['Content-Type'] = 'application/json'
    return response, 200

@projects_api.route('/api/projects/update/<id>', methods=['POST'])
def update(id):
    data = request.form
    query = ("UPDATE waste_management_projects SET date=%s, location=%s, driveType=%s, houses=%s, "
             "society=%s, vehicle=%s, weight=%s, remarks=%s WHERE id=%s")
    values = ( 
        data["id"], data['title'], data['description'], data['date'], data['location'],
        data['status'], data['wasteType'], data['houses'], data['weight'], data['image'], data['featured'], id
        )
    cursor.execute(query, values)
    conn.commit()
    response = make_response(jsonify({"message": "Record {} updated successfully".format(id)}))
    response.headers['Content-Type'] = 'application/json'
    return response, 200