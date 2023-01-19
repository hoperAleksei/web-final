import pandas as pd


def create_ticket(conn, tour_id, buyer_id, buyer_name):
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO ticket (cost, buyer_name, buyer_id, tour_id)
            VALUES ((SELECT cost FROM tour WHERE tour.id = {tour_id}), "{buyer_name}", "{buyer_id}", {tour_id});
        """.format(tour_id=tour_id, buyer_name=buyer_name, buyer_id=buyer_id)
    )

    conn.commit()
    return cur.lastrowid


def get_tour_by_ticket(conn, ticket_id):
    return pd.read_sql(
        """
        SELECT ticket.id   as ticket,
               ticket.cost as cost,
               buyer_name,
               buyer_id,
               t.date      as tour_date,
               h.name      as hotel,
               t.meal_type as meal_type,
               t.days      as days,
               dc.name     as `from`,
               (ac.name || ', ' || r.name) as `to`
        FROM ticket
                 join tour t on t.id = ticket.tour_id
                 join hotel h on h.id = t.hotel_id
                 join resort r on r.id = h.resort_id
                 join departure_city dc on dc.id = t.city_id
                 join arrival_country ac on ac.id = r.arrival_country_id
        WHERE ticket.id = {ticket_id};
        """.format(ticket_id=ticket_id), conn
    )
