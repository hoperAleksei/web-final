from public.app import app

import json


@app.route('/api/get_departures', methods=['GET', 'POST'])
def get_departures():
    from utils.db import get_db_connection
    from models.departure import get_departures
    conn = get_db_connection()
    departures = get_departures(conn)
    return json.dumps(departures.to_dict(orient='records'))
