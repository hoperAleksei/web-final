from public.app import app


@app.route('/')
def index():
    with open('views/index.html', 'rb') as f:
        return f.read().decode('utf-8')
