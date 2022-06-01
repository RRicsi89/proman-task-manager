from flask import Flask, render_template, url_for, request, session, redirect
from dotenv import load_dotenv

import authentication
from util import json_response
import mimetypes
import queries
import secret_key

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv("./.env")
app.secret_key = secret_key.key


@app.route("/")
def index():
    if session:
        return render_template('index.html', username=session['username'])
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
        queries.save_new_column_name(status_id, column_name)
        return queries.add_new_column(board_id, status_id)


@app.route("/api/boards/<int:board_id>/title", methods=['GET', 'POST', 'PUT'])
@json_response
def rename_board_column(board_id: int):
    if request.method == 'PUT':
        title = request.get_json()
        return queries.add_new_status(title)


@app.route("/api/card/<int:card_id>", methods=["GET", "POST", "PUT"])
@json_response
def rename_card(card_id):
    title = request.get_json()
    return queries.rename_card(card_id, title)


@app.route("/api/register", methods=["PUT"])
@json_response
def register():
    if request.method == 'PUT':
        user_data = request.get_json()
        username = user_data[0]
        password = user_data[1]
        hashed_password = authentication.hash_password(password)  # convert password to hashed password
        return queries.save_new_user(username, hashed_password)


@app.route('/api/statuses/<int:board_id>')
@json_response
def get_statuses_by_board_id(board_id: int):
    return queries.get_column_names_by_board(board_id)


@app.route('/api/rename/<int:status_id>', methods=["GET", "PUT"])
@json_response
def rename_column(status_id):
    title = request.get_json()
    return queries.rename_column(status_id, title)


@app.route("/api/login/<username>/<password>", methods=["GET"])
@json_response
def login(username, password):
    if queries.get_user_password_by_username(username):
        hashed_password = queries.get_user_password_by_username(username)[0]['password']
        is_matching = authentication.verify_password(password, hashed_password)
        if is_matching:
            session['username'] = username
            return [f"Welcome {username}!", username]
        else:
            return f"Invalid password or username."
    return f"Invalid password or username."



def main():
    app.run(
    port=8000,
    debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
