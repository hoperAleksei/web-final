from flask import Flask

app = Flask(__name__, static_folder="C:\\Users\\Aleksei\\Desktop\\web-final\\static", static_url_path="/static")

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# views
import controllers.index

# api
import controllers.get_departures
import controllers.get_resorts
import controllers.get_tours
import controllers.create_ticket
