from flask import Flask
from records_apis import records_api
from projects_apis import projects_api

app = Flask(__name__)
app.register_blueprint(records_api)
app.register_blueprint(projects_api)

if __name__ == '__main__':
    app.run(debug=True) 