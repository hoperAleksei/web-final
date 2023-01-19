from public.app import app

from flask import request

import json


@app.route('/api/get_tours', methods=['GET', 'POST'])
def get_tours():
    from utils.db import get_db_connection
    from models.tours import get_tours

    try:
        if request.method == 'POST':
            data = json.loads(request.data)
            departure = data['departure']
            resort = data['resort']
            dates = data['dates']
            days = data['durations']
        else:
            departure = request.args.get('departure')
            resort = request.args.get('resort')
            dates = request.args.get('dates')
            days = request.args.get('durations')

        conn = get_db_connection()
        resorts = get_tours(conn, departure, resort, dates, days)

        return json.dumps(resorts.to_dict(orient='records'))

    except TypeError:
        return json.dumps({'error': 'invalid request'})


@app.route('/api/get_tour_by_id', methods=['GET', 'POST'])
def get_tour_by_id():
    from utils.db import get_db_connection
    from models.tours import get_tour_by_id

    try:
        if request.method == 'POST':
            data = json.loads(request.data)
            tour_id = data['tour_id']
        else:
            tour_id = request.args.get('tour_id')

        conn = get_db_connection()
        tour = get_tour_by_id(conn, tour_id)

        return json.dumps(tour.to_dict(orient='records'))

    except TypeError:
        return json.dumps({'error': 'invalid request'})
