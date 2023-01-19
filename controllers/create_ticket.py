from public.app import app

import json

from flask import request
from flask import make_response

import tempfile
import pathlib

import hashlib


@app.route('/api/create_ticket', methods=['GET', 'POST'])
def create_ticket():
    from utils.db import get_db_connection
    from models.ticket import create_ticket, get_tour_by_ticket

    try:
        if request.method == 'POST':
            data = json.loads(request.data)
            tour_id = data['tour_id']
            buyer_id = data['buyer_id']
            buyer_name = data['buyer_name']
        else:
            tour_id = request.args.get('tour_id')
            buyer_id = request.args.get('buyer_id')
            buyer_name = request.args.get('buyer_name')

        conn = get_db_connection()
        ticket_id = create_ticket(conn, tour_id=tour_id, buyer_id=buyer_id, buyer_name=buyer_name)

        tour = get_tour_by_ticket(conn, ticket_id=ticket_id).to_dict(orient='records')

        if tour:
            tour = tour[0]
        else:
            return json.dumps({'error': 'invalid request'})

        with tempfile.TemporaryDirectory() as tmp_dir:
            file_path = (pathlib.Path(tmp_dir) / "{ticket}.pdf".format(
                        ticket=hashlib.md5(str(tour['ticket']).encode()).hexdigest())).__str__()

            from utils.print_ticket import form

            form(file_path, tour)

            response = make_response(open(file_path, 'rb').read())
            response.headers['Content-Type'] = 'application/pdf'
            response.headers['Content-Disposition'] = 'inline; filename=%s.pdf' % 'ticket'

            return response

    except TypeError:
        return json.dumps({'error': 'invalid request'})
