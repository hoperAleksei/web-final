import pandas as pd


def get_resorts_by_departure(conn, departure_id):
    return pd.read_sql(
        """
        SELECT DISTINCT resort.name, resort.id, ac.name as arrival
        FROM resort
                 join hotel h on resort.id = h.resort_id
                 join tour t on h.id = t.hotel_id
                 join departure_city dc on dc.id = t.city_id
                 join arrival_country ac on ac.id = resort.arrival_country_id
        WHERE dc.id = {};
        """.format(departure_id), conn
    )
