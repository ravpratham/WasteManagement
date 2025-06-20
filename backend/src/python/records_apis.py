# PYTHON FLASK APP WITH MYSQL INTEGRATION
from flask import Flask, request, jsonify, render_template, redirect, url_for, make_response, Blueprint
import mysql.connector
import time

records_api = Blueprint('records_api', __name__)

# MySQL Configuration
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='root',
    database='waste_management'
)
cursor = conn.cursor(dictionary=True)

# API: Get all records
@records_api.route('/api/records', methods=['GET'])
def get_records():
    cursor.execute("SELECT * FROM waste_collection_entry")
    records = cursor.fetchall()
    response = make_response(jsonify(records))
    response.headers['Content-Type'] = 'application/json'
    return response

# API: Create a new record
@records_api.route('/api/records', methods=['POST'])
def add_record():
    data = request.get_json()
    query = ("INSERT INTO waste_collection_entry (id, date, location, driveType, houses, "
             "society, vehicle, weight, remarks) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)")
    values = (
        data["id"], data['date'], data['location'], data['driveType'], data['houses'],
        data['society'], data['vehicle'], data['weight'], data['remarks']
    )
    cursor.execute(query, values)
    conn.commit()
    response = make_response(jsonify({"message": "Record added successfully"}))
    response.headers['Content-Type'] = 'application/json'
    return response

# API: Update a record
@records_api.route('/api/records/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    data = request.get_json()
    query = ("UPDATE waste_collection_entry SET date=%s, location=%s, driveType=%s, houses=%s, "
             "society=%s, vehicle=%s, weight=%s, remarks=%s WHERE id=%s")
    values = (
        data['date'], data['location'], data['driveType'], data['houses'],
        data['society'], data['vehicle'], data['weight'], data['remarks'], record_id
    )
    cursor.execute(query, values)
    conn.commit()
    response = make_response(jsonify({"message": "Record updated successfully"}))
    response.headers['Content-Type'] = 'application/json'
    return response

# API: Delete a record
@records_api.route('/api/records/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    cursor.execute("DELETE FROM waste_collection_entry WHERE id = %s", (record_id,))
    conn.commit()
    response = make_response(jsonify({"message": "Record deleted successfully"}))
    response.headers['Content-Type'] = 'application/json'
    return response, 200

# Simple Web UI
@records_api.route('/')
def index():
    cursor.execute("SELECT * FROM waste_collection_entry")
    records = cursor.fetchall()
    return render_template('index.html', records=records)

@records_api.route('/api/add', methods=['GET', 'POST'])
def add():
    data = request.form
    if request.is_json:
        data = request.get_json()
        print("json",  data)
    else:
        data = request.form
        print("form", data)
    
    id = time.time()
    query = ("INSERT INTO waste_collection_entry (id, date, location, driveType, houses, society, vehicle, weight, remarks) "
             "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)")
    values = (str(id), data['date'], data['location'], data['driveType'], data['houses'],
              data['society'], data['vehicle'], data["weight"], data['remarks'])
    cursor.execute(query, values)
    conn.commit()
    response = make_response(jsonify({"message": "Record added successfully"}))
    response.headers['Content-Type'] = 'application/json'
    return response, 204

@records_api.route('/api/delete/<id>', methods=['DELETE'])
def delete(id):
    cursor.execute("DELETE FROM waste_collection_entry WHERE id=%s", (id,))
    conn.commit()
    response = make_response(jsonify({"message": "Record {} deleted successfully".format(id)}))
    response.headers['Content-Type'] = 'application/json'
    return response, 200

@records_api.route('/api/update/<id>', methods=['POST'])
def update(id):
    data = request.form
    query = ("UPDATE waste_collection_entry SET date=%s, location=%s, driveType=%s, houses=%s, "
             "society=%s, vehicle=%s, weight=%s, remarks=%s WHERE id=%s")
    values = (data['date'], data['location'], data['driveType'], data['houses'],
              data['society'], data['vehicle'], data["weight"], data['remarks'], id)
    cursor.execute(query, values)
    conn.commit()
    response = make_response(jsonify({"message": "Record {} updated successfully".format(id)}))
    response.headers['Content-Type'] = 'application/json'
    return response, 200