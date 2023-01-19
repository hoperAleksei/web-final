async function getResorts(departure_id) {
    let res = await fetch('/api/get_resorts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            departure: departure_id
        })
    });

    return await res.json();

}

async function getTourById(tour_id) {
    let res = await fetch('/api/get_tour_by_id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            tour_id: tour_id
        })
    });

    return await res.json();
}

async function fillResorts() {
    let departures_id = document.getElementById('departure').value || 1;

    let resorts = document.getElementById('resort');

    resorts.innerHTML = '';

    let resorts_list = await getResorts(departures_id);

    let cur = "";

    let optgroup = undefined;

    console.log(resorts_list);

    for (let i = 0; i < resorts_list.length; i++) {
        if (cur !== resorts_list[i]['arrival']) {
            if (optgroup) {
                resorts.add(optgroup);
            }

            optgroup = document.createElement('optgroup');
            optgroup.label = resorts_list[i]['arrival'];

            let option = document.createElement('option');
            option.text = resorts_list[i]['name'];
            option.value = resorts_list[i]['id'];
            optgroup.appendChild(option);

            cur = resorts_list[i]['arrival'];
        } else {


            let option = document.createElement('option');
            option.text = resorts_list[i]['name'];
            option.value = resorts_list[i]['id'];
            optgroup.appendChild(option);
        }
        resorts.add(optgroup);
    }

    // getResorts(departures_id).then(function (data) {
    //     for (let i = 0; i < data.length; i++) {
    //         let option = document.createElement('option');
    //         option.text = data[i]['name'];
    //         option.value = data[i]['id'];
    //         resorts.add(option);
    //     }
    // });
}


function createHotelInfo(hotel_name, stars) {
    let hotel_info = document.createElement("div");
    hotel_info.className = "hotel__info";

    let hotel_name_el = document.createElement("div");
    hotel_name_el.className = "hotel__name";
    hotel_name_el.innerHTML = hotel_name;

    let hotel_stars_el = document.createElement("div");
    hotel_stars_el.className = "hotel__stars";
    hotel_stars_el.innerHTML = stars;

    hotel_info.appendChild(hotel_name_el);
    hotel_info.appendChild(hotel_stars_el);

    return hotel_info;
}

function createTour(date, duration, meal, count, price, tour_id) {
    let tour = document.createElement("div");
    tour.className = "tour";

    let tour_date = document.createElement("div");
    tour_date.className = "tour__date";
    tour_date.innerHTML = date;

    let tour_duration = document.createElement("div");
    tour_duration.className = "tour__duration";
    tour_duration.innerHTML = duration;

    let tour_meal = document.createElement("div");
    tour_meal.className = "tour__meal";
    tour_meal.innerHTML = meal;

    let tour_count = document.createElement("div");
    tour_count.className = "tour__count";
    tour_count.innerHTML = count;

    let tour_price = document.createElement("div");
    tour_price.className = "tour__price";
    tour_price.innerHTML = price;

    let tour_dict = {};

    if (tour_id) {

        getTourById(tour_id).then(function (data) {
            tour_dict = data[0];
        });

    }

    let tour_buy = document.createElement("div");
    tour_buy.className = "tour__buy";
    tour_buy.innerHTML = "Купить";

    if (tour_id) {
        tour_buy.onclick = function () {
            createBuyMenu(tour_dict);
        }

    }

    tour.appendChild(tour_date);
    tour.appendChild(tour_duration);
    tour.appendChild(tour_meal);
    tour.appendChild(tour_count);
    tour.appendChild(tour_price);
    tour.appendChild(tour_buy);


    return tour;
}

function insertHotel(hotel_name, stars, tour_list, tour_id) {
    let container = document.getElementById("container");

    let hotel = document.createElement("section");
    hotel.className = "hotel";

    hotel.appendChild(createHotelInfo(hotel_name, stars));

    let tours = document.createElement("div");
    tours.className = "tours";

    let tour_caption = createTour("Дата начала", "Количество дней", "Питание", "Количество мест", "Цена");

    tour_caption.classList.add("tour__caption");

    tours.appendChild(tour_caption);

    for (let i = 0; i < tour_list.length; i++) {
        tours.appendChild(createTour(tour_list[i].date, tour_list[i].duration, tour_list[i].meal, tour_list[i].count, tour_list[i].price, tour_list[i].tour_id));
    }

    hotel.appendChild(tours);

    container.appendChild(hotel);

}

function structurizeTours(tours) {
    let result = [];

    let prev = -1;

    for (let i = 0; i < tours.length; i++) {
        if (tours[i].hotel_id !== prev) {
            result.push({
                hotel_name: tours[i].hotel_name,
                stars: tours[i].hotel_stars,
                tour_list: [
                    {
                        date: tours[i].tour_date,
                        duration: tours[i].tour_days,
                        meal: tours[i].tour_meal,
                        count: tours[i].tour_count,
                        price: tours[i].tour_cost,
                        tour_id: tours[i].tour_id
                    }
                ]
            });
            prev = tours[i].hotel_id;
        } else {
            result[result.length - 1].tour_list.push({
                date: tours[i].tour_date,
                duration: tours[i].tour_days,
                meal: tours[i].tour_meal,
                count: tours[i].tour_count,
                price: tours[i].tour_cost,
                tour_id: tours[i].tour_id
            })
        }
    }

    return result;
}

async function getDepartures() {
    let res = await fetch('/api/get_departures');

    return await res.json();
}


async function fillDepartures() {
    let departures = document.getElementById('departure');

    departures.innerHTML = '';

    getDepartures().then(function (data) {
        for (let i = 0; i < data.length; i++) {
            let option = document.createElement('option');
            option.text = data[i]['name'];
            option.value = data[i]['id'];
            departures.add(option);
        }
    });
}


function datesToDats(dates) {
    let date = dates.split(' - ');

    let date_1_a = date[0].split('/');
    let date_2_a = date[1].split('/');

    let date_1 = date_1_a[2] + '-' + date_1_a[0] + '-' + date_1_a[1];
    let date_2 = date_2_a[2] + '-' + date_2_a[0] + '-' + date_2_a[1];

    return [date_1, date_2];
}

async function getTours(departure_id, resort_id, dates, durations) {
    let res = await fetch('/api/get_tours', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            departure: departure_id,
            resort: resort_id,
            dates: dates,
            durations: durations
        })
    });

    return await res.json();
}

function fillHotels(hotels) {
    let container = document.getElementById("container");

    container.innerHTML = '';

    for (let i = 0; i < hotels.length; i++) {
        insertHotel(hotels[i].hotel_name, hotels[i].stars, hotels[i].tour_list);
    }
}

function fillEmptyHotel(text) {

    let container = document.getElementById("container");

    container.innerHTML = '';

    let empty = document.createElement("section");
    empty.className = "hotel";
    empty.classList.add("empty");
    empty.innerHTML = text;

    container.appendChild(empty);

}


async function searchTours() {
    let departure = document.getElementById('departure').value;
    let resort = document.getElementById('resort').value;
    let dates = datesToDats(document.getElementById('dates').value);
    let duration_1 = document.getElementById('duration_1').value;
    let duration_2 = document.getElementById('duration_2').value;

    let tours = await getTours(departure, resort, dates, [duration_1, duration_2]);

    if (tours.length > 0) {
        fillHotels(structurizeTours(tours));
    } else {
        fillEmptyHotel("По вашему запросу ничего не найдено");
    }

    return tours;
}

function closeBuyMenu() {
    let wrapper = document.getElementById("scroll__block");

    wrapper.remove()
}

function buyTour(tour_id, buyer_name, buyer_id) {
    fetch('/api/create_ticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            tour_id: tour_id,
            buyer_name: buyer_name,
            buyer_id: buyer_id
        })
    }).then(res => res.blob()).then(blob => {
        let file = window.URL.createObjectURL(blob);
        let ret = window.open(file);
        ret.print();

        searchTours();
    });
}

function createBuyMenu(tour) {
    let scroll_block = document.createElement("div");
    scroll_block.id = "scroll__block";
    scroll_block.className = "scroll__block";

    let wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    let buy_menu = document.createElement("div");
    buy_menu.className = "buy__menu";

    let buy_header = document.createElement("div");
    buy_header.className = "buy__header";

    let buy_caption = document.createElement("div");
    buy_caption.className = "buy__caption";
    buy_caption.innerHTML = "Оформление заказа";

    let close = document.createElement("div");
    close.className = "close";
    close.innerHTML = "X";
    close.addEventListener('click', closeBuyMenu)

    buy_header.appendChild(buy_caption);
    buy_header.appendChild(close);

    let buy_main = document.createElement("div");
    buy_main.className = "buy__main";

    let buy_info = document.createElement("div");
    buy_info.className = "buy__info";

    let hotel_info = document.createElement("div");
    hotel_info.className = "hotel__info";

    let hotel_stars = document.createElement("div");
    hotel_stars.className = "hotel__stars";
    hotel_stars.innerHTML = tour["hotel_stars"];

    let hotel_name = document.createElement("div");
    hotel_name.className = "hotel__name";
    hotel_name.innerHTML = tour["hotel_name"];

    let hotel_location = document.createElement("div");
    hotel_location.className = "hotel__location";
    hotel_location.innerHTML = tour["hotel_location"];

    hotel_info.appendChild(hotel_stars);
    hotel_info.appendChild(hotel_name);
    hotel_info.appendChild(hotel_location);

    let tour_info = document.createElement("div");
    tour_info.className = "tour__info";

    let tour_info_dict = {
        "Дата вылета": tour["tour_date"],
        "Количество дней": tour["tour_days"],
        "Тип питания": tour["tour_meal"],
        "Отправление из:": tour["from"],
    }

    for (let key in tour_info_dict) {
        let tour_field = document.createElement("div");
        tour_field.className = "tour__field";

        let tour_field_name = document.createElement("div");
        tour_field_name.className = "tour__field__name";
        tour_field_name.innerHTML = key;

        let tour_field_value = document.createElement("div");
        tour_field_value.className = "tour__field__value";
        tour_field_value.innerHTML = tour_info_dict[key];

        tour_field.appendChild(tour_field_name);
        tour_field.appendChild(tour_field_value);

        tour_info.appendChild(tour_field);
    }

    buy_info.appendChild(hotel_info);
    buy_info.appendChild(tour_info);

    let buy = document.createElement("div");
    buy.className = "buy";

    let buy_price = document.createElement("div");
    buy_price.className = "buy__price";
    buy_price.innerHTML = tour["tour_price"];

    let buy_form = document.createElement("form");
    buy_form.className = "buy__form";

    let tour_id = document.createElement("input");
    tour_id.type = "hidden";
    tour_id.name = "tour_id";
    tour_id.value = tour["tour_id"];

    let buyer_name = document.createElement("input");
    buyer_name.type = "text";
    buyer_name.name = "buyer_name";
    buyer_name.placeholder = "ФИО покупателя";

    let buyer_id = document.createElement("input");
    buyer_id.type = "text";
    buyer_id.name = "buyer_id";
    buyer_id.placeholder = "Паспортные данные";

    let buy_button = document.createElement("input");
    buy_button.type = "button";
    buy_button.value = "Купить";
    buy_button.name = "buy";
    buy_button.onclick = function () {
        buyTour(tour_id.value, buyer_name.value, buyer_id.value);
        closeBuyMenu();
    }

    buy_form.appendChild(tour_id);
    buy_form.appendChild(buyer_name);
    buy_form.appendChild(buyer_id);
    buy_form.appendChild(buy_button);

    buy.appendChild(buy_price);
    buy.appendChild(buy_form);

    buy_main.appendChild(buy_info);
    buy_main.appendChild(buy);

    buy_menu.appendChild(buy_header);
    buy_menu.appendChild(buy_main);

    wrapper.appendChild(buy_menu);

    scroll_block.appendChild(wrapper);

    document.body.appendChild(scroll_block);
}


tour = {
    "hotel_stars": "4",
    "hotel_name": "Hotel",
    "hotel_location": "Location",
    "tour_date": "Date",
    "tour_days": "Days",
    "tour_meal": "Meal",
    "from": "From",
    "tour_price": "Price",
    "tour_id": "ID"
}

fillEmptyHotel("Здесь отобразятся туры, когда вы их найдете");

