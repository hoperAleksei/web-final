import pandas as pd


def get_tours(conn, departure_id, resort_id, dates, days):
    return pd.read_sql(
        """
        SELECT tour.hotel_id  as hotel_id,
               h.name         as hotel_name,
               h.stars        as hotel_stars,
               tour.id        as tour_id,
               tour.date      as tour_date,
               tour.days      as tour_days,
               tour.meal_type as tour_meal,
               tour.count     as tour_count,
               tour.cost      as tour_cost
        from tour
                 join departure_city dc on dc.id = tour.city_id
                 join hotel h on tour.hotel_id = h.id
                 join resort r on r.id = h.resort_id
        WHERE dc.id = {}
          AND r.id = {}
          AND tour.date >= '{}'
          AND tour.date <= '{}'
          AND tour.days >= {}
          AND tour.days <= {}
          AND tour.count > 0
        order by tour.hotel_id, tour.date, tour.cost;
        """.format(departure_id, resort_id, dates[0], dates[1], days[0], days[1]), conn
    )


def get_tour_by_id(conn, tour_id):
    return pd.read_sql(
        """
            SELECT h.name         as hotel_name,
                   h.stars        as hotel_stars,
                   tour.id        as tour_id,
                   tour.date      as tour_date,
                   tour.days      as tour_days,
                   tour.meal_type as tour_meal,
                   tour.cost      as tour_price,
                   dc.name        as `from`,
                   (ac.name || ', ' || r.name) as `hotel_location`
            from tour
                     join departure_city dc on dc.id = tour.city_id
                     join hotel h on tour.hotel_id = h.id
                     join resort r on r.id = h.resort_id
                     join arrival_country ac on ac.id = r.arrival_country_id
            WHERE tour.id = {}
        """.format(tour_id), conn
    )
