from public.app import app

from flask import request

import json


@app.route('/api/get_resorts', methods=['GET', 'POST'])
def get_resorts():
    from utils.db import get_db_connection
    from models.resorts import get_resorts_by_departure

    try:
        if request.method == 'POST':
            data = json.loads(request.data)
            departure = data['departure']
        else:
            departure = request.args.get('departure')

        conn = get_db_connection()
        resorts = get_resorts_by_departure(conn, departure)
        return json.dumps(resorts.to_dict(orient='records'))

    except TypeError:
        return json.dumps({'error': 'invalid request'})
