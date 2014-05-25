var Hiptactoe = (function() {
    var exports = {},
    board = [],
    board_size = 3,
    BOARD_STATE = {
        X: 0,
        O: 1,
        CLEAR: 2
    },
    GAME_STATE = {
        HUMAN_WINS: "You win!",
        COMPUTER_WINS: "You lose!",
        DRAW: "Draw!",
        PLAYING: ""
    },
    HEURISTIC_VALUE = {},
    best_move,
    background_color = 190,
    fill_color = 0,
    cell_width = 200,
    canvas_width = 620,
    divider_width = 10,
    icon_center = cell_width / 2,
    icon_offset = cell_width + divider_width,
    canvas = document.getElementById("main"),
    game_state = GAME_STATE.PLAYING,
    win,
    font,
    p;

    exports.board_size = board_size;
    exports.BOARD_STATE = BOARD_STATE;
    exports.GAME_STATE = GAME_STATE;

    exports.clear = function(board) {
        for(i = 0; i < board_size; i++) {
            for(j = 0; j < board_size; j++) {
                board[i][j] = BOARD_STATE.CLEAR
            }
        }
    }

    exports.is_clear = function(board) {
        var i,
        j;
        for(i = 0; i < board_size; i++) {
            for(j = 0; j < board_size; j++) {
                if(board[i][j] != BOARD_STATE.CLEAR) {
                    return false;
                }
            }
        }
        return true;
    }

    exports.choose = function(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    exports.is_full = function(board) {
        var i,
        j;
        for(i = 0; i < board_size; i++) {
            for(j = 0; j < board_size; j++) {
                if(board[i][j] === BOARD_STATE.CLEAR) {
                    return false;
                }
            }
        }
        return true;
    }

    exports.get_possible_moves = function(board) {
        var i,
        j,
        possible_moves = [];
        
        for(i = 0; i < board_size; i++) {
            for(j = 0; j < board_size; j++) {
                if(board[i][j] === BOARD_STATE.CLEAR) {
                    possible_moves.push([i, j]);
                }
            }
        }
        return possible_moves;
    }

    exports.occupied = function(x, y, board) {
        return board[x][y] !== BOARD_STATE.CLEAR;
    }

    exports.board_with_move = function(old_board, move, state) {
        var new_board = [],
        i,
        x,
        y;

        for(i = 0; i < board_size; i++) {
            new_board.push([]);
        }
        for(x = 0; x < board_size; x++) {
            for(y = 0; y < board_size; y++) {
                new_board[x][y] = old_board[x][y];
            }
        }
        new_board[move[0]][move[1]] = state;
        return new_board;
    }

    exports.terminal_state = function(board) {
        win = exports.find_win(board);
        if(win) {
            return win.winner === BOARD_STATE.O ? GAME_STATE.COMPUTER_WINS : GAME_STATE.HUMAN_WINS;
        }
        else if(exports.is_full(board)) {
            return GAME_STATE.DRAW;
        }
        return false;
    }

    exports.find_win = function(board) {
        var x,
            y,
            win = false;

        // columns
        for(x = 0; x < board_size; x++) {
            if(board[x][0] !== BOARD_STATE.CLEAR &&
               board[x][0] === board[x][1] && 
               board[x][0] === board[x][2]) {
                return {
                    start: [x, 0], 
                    end: [x, 2],
                    winner: board[x][0]
                };
            }
        }

        // rows
        for(y = 0; y < board_size; y++) {
            if(board[0][y] !== BOARD_STATE.CLEAR &&
               board[0][y] === board[1][y] && 
               board[0][y] === board[2][y]) {
                return {
                    start: [0, y], 
                    end: [2, y],
                    winner: board[0][y]
                };
            }
        }

        // diagonals
        if(board[0][0] !== BOARD_STATE.CLEAR &&
           board[0][0] === board[1][1] && 
           board[0][0] === board[2][2]) {
            return {
                start: [0, 0], 
                end: [2, 2],
                winner: board[0][0]
            };
        }

        if(board[0][2] !== BOARD_STATE.CLEAR &&
           board[0][2] === board[1][1] && 
           board[0][2] === board[2][0]) {
            return {
                start: [0, 2], 
                end: [2, 0],
                winner: board[0][2]
            };
        }

        return false;
    }

    // implementation of Minimax adapted from http://en.wikipedia.org/wiki/Minimax
    exports.minimax = function(node, maximizing_player, record_move) {
        var terminal = exports.terminal_state(node),
        child_value,
        best_value,
        moves = exports.get_possible_moves(node),
        i;

        if(terminal) {
            return HEURISTIC_VALUE[terminal];
        }

        if(maximizing_player) {
            best_value = -Infinity;
            for(i = 0; i < moves.length; i++) {
                child_value = exports.minimax(exports.board_with_move(node, moves[i], BOARD_STATE.O), false, false);
                if(child_value > best_value) {
                    best_value = child_value;
                    if(record_move) {
                        best_move = moves[i];
                    }
                }
            }
           return best_value;
        }
        else {
            best_value = Infinity;
            for(i = 0; i < moves.length; i++) {
                child_value = exports.minimax(exports.board_with_move(node, moves[i], BOARD_STATE.X), true, false);
                best_value = Math.min(child_value, best_value);
            }
            return best_value;
       }
    }

    exports.init = function() {
        HEURISTIC_VALUE[GAME_STATE.HUMAN_WINS] = -1;
        HEURISTIC_VALUE[GAME_STATE.COMPUTER_WINS] = 1;
        HEURISTIC_VALUE[GAME_STATE.DRAW] = 0;
        p = new Processing(canvas, init_processing);
    }

    function init_processing(p) {
        p.setup = function() {
            var i = 0,
            j = 0;
            p.background(background_color);
            p.noStroke();
            p.size(canvas_width, canvas_width);
            p.frameRate(30);
            p.fill(fill_color);
            console.log(p.PFont.list());
            font = p.createFont("sans-serif", 45);
            p.textFont(font, 45);

            for(i = 0; i < board_size; i++) {
                board.push([]);
            }

            exports.clear(board);
            make_computer_move();
        }
        
        p.mouseClicked = function() {
            var x,
            y;

            if(game_state != GAME_STATE.PLAYING) {
                exports.clear(board);
                game_state = GAME_STATE.PLAYING
                make_computer_move();
            }
            else {
                if(!clicked_divider(p.mouseX, p.mouseY)) {
                    x = Math.floor(p.mouseX / (cell_width + divider_width));
                    y = Math.floor(p.mouseY / (cell_width + divider_width));

                    if(!exports.occupied(x, y, board)) {
                        board[x][y] = BOARD_STATE.X;

                        update_game_state();

                        if(game_state === GAME_STATE.PLAYING) {                        
                            make_computer_move();
                            update_game_state();
                        }
                    }
                }
            }
        }

        p.draw = function() {
            var i = 0,
            j = 0;
            p.background(background_color);
            draw_dividers();
            for(i = 0; i < board_size; i++) {
                for(j = 0; j < board_size; j++) {
                    draw_icon(i, j, board[i][j]);
                }
            }

            if(game_state !== GAME_STATE.PLAYING) {
                if(game_state != GAME_STATE.DRAW) {
                    draw_win_strikethrough();
                }
                draw_game_over_dialog();
            }
        };
    }

    function update_game_state() {
        var next_state = exports.terminal_state(board);
        if(next_state) {
            game_state = next_state;
        }
    }

    function make_computer_move() {
        var move;

        if(exports.is_clear(board)) {
            // use 'opening book' initially
            move = exports.choose([[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]]);
        }
        else {
            // otherwise minimax
            exports.minimax(board, true, true);
            move = best_move;
        }
        board[move[0]][move[1]] = BOARD_STATE.O;
    }

    function draw_icon(x, y, state) {
        if(state === BOARD_STATE.X) {
            draw_x(x, y);
        }
        else if(state == BOARD_STATE.O) {
            draw_o(x, y);
        }
    }

    function draw_dividers() {
        p.rect(cell_width, 0, divider_width, canvas_width);
        p.rect(2 * cell_width + divider_width, 0, divider_width, canvas_width);
        p.rect(0, cell_width, canvas_width, divider_width);
        p.rect(0, 2 * cell_width + divider_width, canvas_width, divider_width);
    }

    function clicked_divider(x, y) {
        return (x >= cell_width && x < cell_width + divider_width) ||
               (x >= 2 * cell_width + divider_width && x < 2 * cell_width + 2 * divider_width) ||
               (y >= cell_width && y < cell_width + divider_width) ||
               (y >= 2 * cell_width + divider_width && y < 2 * cell_width + 2 * divider_width);
    }

    function draw_x(x, y) {
        p.strokeWeight(10);
        p.stroke(0);
        p.line(divider_width + icon_offset * x, divider_width + icon_offset * y, cell_width - divider_width + icon_offset * x, cell_width - divider_width + icon_offset * y);
        p.line(divider_width + icon_offset * x, cell_width - divider_width + icon_offset * y, cell_width - divider_width + icon_offset * x, divider_width + icon_offset * y);
        p.noStroke();
    }

    function draw_o(x, y) {
        p.ellipse(icon_center + icon_offset * x, icon_center + icon_offset * y, 180, 180);
        p.fill(background_color);
        p.ellipse(icon_center + icon_offset * x, icon_center + icon_offset * y, 160, 160);
        p.fill(fill_color);
    }

    function draw_win_strikethrough() {
        var start = win.start;
        var end = win.end;
        var base_width = (cell_width + divider_width);
        var offset = (cell_width / 2);

        p.strokeWeight(20);
        p.stroke(255, 0, 0);
        p.line((start[0] + 1) * base_width - offset, (start[1] + 1) * base_width - offset, (end[0] + 1) * base_width - offset, (end[1] + 1) * base_width - offset);
        p.noStroke();
    }

    function draw_game_over_dialog() {
        p.fill(100, 100, 100, 240);
        p.rect(cell_width - divider_width * 6, cell_width - divider_width * 6, cell_width + 2 * divider_width + divider_width * 12, cell_width + 2 * divider_width + divider_width * 4);
        p.fill(0);
        p.text(game_state, cell_width - divider_width * 4, cell_width + divider_width * 4);
        p.textFont(font, 25);
        p.text("Click to start another game.", cell_width - divider_width * 4, cell_width + divider_width * 8);
        p.textFont(font, 45);
    }

    return exports;
})();
