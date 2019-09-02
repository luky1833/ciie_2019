from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/demo')
def demo():
    return 'this is demo!'


if __name__ == '__main__':
    app.run()
