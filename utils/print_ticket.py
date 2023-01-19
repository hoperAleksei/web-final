from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

import tempfile
import pathlib

import datetime

import hashlib

import transliterate


def form(path, tour):
    pdf = canvas.Canvas(path, pagesize=letter)
    pdf.setLineWidth(.3)
    pdf.setFont("Helvetica", 12)
    pdf.drawString(30, 750, "OFFICIAL TICKET # {ticket_number}".format(ticket_number=tour["ticket"]))
    pdf.drawString(30, 735, "TRAVEL AGENCY")
    pdf.drawString(500, 750, "{today}".format(today=datetime.date.today().isoformat()))
    pdf.line(480, 747, 580, 747)
    pdf.drawString(275, 725, "TOUR COST:")
    pdf.drawString(500, 725, "{cost} RUB".format(cost=tour["cost"]))
    pdf.line(378, 723, 580, 723)
    pdf.drawString(30, 703, "RECEIVED BY:")
    pdf.line(120, 700, 580, 700)
    pdf.drawString(120, 703,
                   "{buyer_name} : {buyers_id}".format(
                       buyer_name=transliterate.translit(tour["buyer_name"], language_code="ru", reversed=True),
                       buyers_id=tour["buyer_id"]))

    tour_str = {
        "TOUR DATE: ": tour["tour_date"],
        "TOUR HOTEL: ": tour["hotel"],
        "MEAL TYPE: ": tour["meal_type"],
        "DAYS: ": tour["days"],
        "FROM: ": transliterate.translit(tour["from"], language_code="ru", reversed=True),
        "TO: ": transliterate.translit(tour["to"], language_code="ru", reversed=True),
    }

    y = 703

    for t in tour_str:
        y -= 25
        pdf.drawString(30, y, "{name}".format(name=t))
        pdf.line(120, y - 3, 580, y - 3)
        pdf.drawString(120, y, "{value}".format(value=tour_str[t]))

    pdf.save()


test_tour = {
    "ticket": "1",
    "cost": "1000",
    "buyer_name": "John Doe",
    "buyer_id": "1234567890",
    "tour_date": "2019-01-01",
    "hotel": "Hotel",
    "meal_type": "All inclusive",
    "days": "7",
    "from": "Москва",
    "to": "Анталья",
}

if __name__ == "__main__":
    with tempfile.TemporaryDirectory() as tmp_dir:
        file_path = (pathlib.Path(tmp_dir) / "{ticket}.pdf".format(
            ticket=hashlib.md5(test_tour['ticket'].encode()).hexdigest())).__str__()
        import webbrowser

        form(file_path, test_tour)

        print(file_path)

        webbrowser.open(
            file_path
        )

        import time

        time.sleep(100)
