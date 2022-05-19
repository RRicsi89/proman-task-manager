from flask import Flask, render_template, url_for, request
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv("./.env")


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards", methods=["GET", "POST"])
@json_response
def get_boards():
    if request.method == "GET":
        return queries.get_boards()
    elif request.method == "POST":
        board_title = request.get_json()
        return queries.save_new_board(board_title)


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/api/boards/<int:board_id>/", methods=['GET', 'POST', 'PUT'])
@json_response
def rename_board(board_id: int):
    if request.method == 'PUT':
        title = request.get_json()
        return queries.rename_board(board_id, title)
    elif request.method == "POST":
        title = request.get_json()
        status = 1
        card_order = queries.count_cards(board_id, status)[0]["count"]
        return queries.save_new_card(board_id, status, title, card_order)


@app.route("/api/boards/<int:board_id>/statuses/<int:status_id>/")
@json_response
def get_card_count(board_id: int, status_id: int):
    return queries.count_cards(board_id, status_id)


@app.route("/api/cards/<int:card_id>", methods=["GET", "POST", "PUT", "DELETE"])
@json_response
def update_card_data(card_id):
    if request.method == "PUT":
        data = request.get_json()
        status_id = data["status_id"]
        card_order = int(data["card_order"]) + 1
        return queries.update_card_status(card_id, status_id, card_order)
    elif request.method == 'DELETE':
        return queries.delete_card(card_id)


@app.route("/api/board/<int:board_id>")
@json_response
def get_new_card_data(board_id: int):
    return queries.get_new_card(board_id)


@app.route("/api/boards/<int:board_id>/<int:status_id>/new_column", methods=['GET', 'POST', 'PUT'])
@json_response
def add_new_column(board_id: int, status_id: int):
    if request.method == 'PUT':
        column_name = request.get_json()
        return queries.add_new_column(board_id, status_id)


@app.route("/api/boards/<int:board_id>/title", methods=['GET', 'POST', 'PUT'])
@json_response
def rename_board_column(board_id: int):
    if request.method == 'PUT':
        title = request.get_json()
        return queries.add_new_status(title)


def main():
    app.run(
    port=8000,
    debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
