import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database
    # return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ORDER BY id
        ;
        """
    )


def get_cards_for_board(board_id):
    # remove this code once you implement the database
    # return [{"title": "title1", "id": 1}, {"title": "board2", "id": 2}]

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ORDER BY status_id, card_order
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def save_new_board(board_title):
    data_manager.execute_update(
    """
    INSERT INTO boards (title)
    VALUES (%(board_title)s);
    """, {"board_title": board_title})


def rename_board(board_id, board_title):
    title = data_manager.execute_update(
        """
        UPDATE boards
        SET title = %(board_title)s
        WHERE id = %(board_id)s
        ;
        """
        , {"board_title": board_title, "board_id": board_id})

    return title


def add_new_status(status_title):
    data_manager.execute_update(
        """
        INSERT INTO statuses (title)
        VALUES (%(status_title)s)
        ON CONFLICT (title)
        DO NOTHING;
        """
        , {"status_title": status_title})

    status_id = data_manager.execute_select(
        """
        SELECT id FROM statuses
        WHERE statuses.title = %(title)s
        ;
        """
        , {"title": status_title})

    return status_id



def count_cards(board_id, status_id):
    result = data_manager.execute_select(
        """
        SELECT COUNT(id) as count FROM cards
        WHERE (board_id = %(board_id)s AND status_id = %(status_id)s)
        """, {"board_id": board_id, "status_id": status_id}
    )
    return result


def update_card_status(card_id, status_id, card_order):
    data_manager.execute_update(
        """
        UPDATE cards
        SET status_id = %(status_id)s, card_order = %(card_order)s
        WHERE id = %(card_id)s;
        """, {"card_id": card_id, "status_id": status_id, "card_order": card_order}
    )


def delete_card(card_id):
    data_manager.execute_update(
    """
        DELETE FROM cards
        WHERE id = %(card_id)s
    """, {"card_id": card_id}
    )


def save_new_card(board_id, status_id, title, card_order):
    data_manager.execute_update(
    """
    INSERT INTO cards (board_id, status_id, title, card_order)
    VALUES (%(board_id)s, %(status_id)s, %(title)s, %(card_order)s);
    """, {"board_id": board_id, "status_id": status_id, "title": title, "card_order": card_order})


def get_new_card(board_id):
    result = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE (board_id = %(board_id)s AND status_id = 1)
        ORDER BY id DESC
        LIMIT 1
        """, {"board_id": board_id}
    )
    return result


def add_new_column(board_id, status_id):
    data_manager.execute_update(
        """
        INSERT INTO board_columns (board_id, status_id)
        VALUES (%(board_id)s, %(status_id)s);
        """, {"board_id": board_id, "status_id": status_id})


def rename_card(card_id, title):
    data_manager.execute_update(
        """
        UPDATE cards
        SET title = %(title)s
        WHERE id = %(card_id)s;
        """, {"card_id": card_id, "title": title}
    )


def get_column_names_by_board(board_id):
    data_manager.execute_select("""
        SELECT board_columns.status_id, s.title FROM board_columns
        JOIN statuses s on board_columns.status_id = s.id
        WHERE board_columns.board_id = 1;
    """)


def save_new_user(username, password):
    data_manager.execute_update(
        """
        INSERT INTO users (username, password)
        VALUES (%(username)s, %(password)s);
        """, {"username": username, "password": password})


def get_user_password_by_username(username):
    hashed_password = data_manager.execute_select(
        """
        SELECT password
        FROM users
        WHERE username LIKE %(username)s;
        """, {"username": username})
    return hashed_password
