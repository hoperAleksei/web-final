import pandas as pd


def get_departures(conn):
    return pd.read_sql(
        "SELECT * FROM departure_city",
        conn
    )
