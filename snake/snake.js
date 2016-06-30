var snek = (function (window, document, undefined) {

    /**
     * Default Game Settings
     * @type {number}
     * @const
     */
    var TILE_SIZE = 10,
        H_TILES = 30,
        V_TILES = 30,
        INITIAL_LENGTH = 7,
        INITIAL_SPEED = 150, // Speed is milliseconds per movement
        GROW_AMOUNT = 3;

    var board = new Board(H_TILES, V_TILES);

    // Set up canvas
    var canvas = document.createElement('canvas'),
        width = TILE_SIZE * H_TILES,
        height = TILE_SIZE * V_TILES;
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');

    var start = function () {
        document.body.appendChild(canvas);
        setInterval(step, 5);
    };

    var keysDown = {};

    window.addEventListener("keydown", function (event) {
        keysDown[event.keyCode] = true;
    });

    window.addEventListener("keyup", function (event) {
        delete keysDown[event.keyCode];
    });

    var time = Date.now();
    var step = function () {
        var now = Date.now(),
            dt = now - (time || now);
        time = now;

        update(dt);
        render(dt);
    };

    var update = function (delta) {
        for (var key in keysDown) {
            var value = Number(key);
            switch (value) {
                case 37: // left arrow
                    if (snake.direction != "right") {
                        snake.nextDirection = "left";
                    }
                    break;
                case 38: // up arrow
                    if (snake.direction != "down") {
                        snake.nextDirection = "up";
                    }
                    break;
                case 39: // right arrow
                    if (snake.direction != "left") {
                        snake.nextDirection = "right";
                    }
                    break;
                case 40: // down arrow
                    if (snake.direction != "up") {
                        snake.nextDirection = "down";
                    }
                    break;
                default:
            }
        }

        snake.update(delta);
        if (apple.eaten) {
            apple = new Apple(board);
        }
        if (snake.dead) {
            if (snake.length() == 0) {
                snake = new Snake(board);
            }
        }
    };

    var render = function (delta) {
        context.fillStyle = "#000000";
        context.fillRect(0, 0, width, height);
        snake.render();
        apple.render();
    };

    /**
     * Creates a game board.
     * @param hTiles the number of horizontal tiles on the board
     * @param vTiles the number of vertical tiles on the board
     * @constructor
     */
    function Board(hTiles, vTiles) {
        this.hTiles = hTiles ? hTiles : H_TILES;
        this.vTiles = vTiles ? vTiles : V_TILES;

        this.tiles = [];
        for (var i = 0; i < this.hTiles; i++) {
            this.tiles[i] = [];
            for (var j = 0; j < this.vTiles; j++) {
                this.tiles[i][j] = 0;
            }
        }
    }

    Board.prototype.isOpenTile = function (x, y) {
        return !this.tiles[x][y];
    };

    Board.prototype.getTileType = function (x, y) {
        var tile = this.tiles[x][y];
        return tile ? tile.type : tile;
    };

    Board.prototype.addTile = function (tile) {
        if (this.isOpenTile(tile.x, tile.y)) {
            this.tiles[tile.x][tile.y] = tile;
        } else {
            throw new Error("Tile is not empty!");
        }
    };

    Board.prototype.removeTile = function (tileOrX, y) {
        if (y === undefined) {
            this.tiles[tileOrX.x][tileOrX.y] = 0;
        } else {
            this.tiles[tileOrX][y] = 0;
        }
    };

    function Tile(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type ? type : "appl";
    }

    Tile.prototype.isSamePosition = function (tile) {
        return this.x == tile.x && this.y == tile.y;
    };

    function Block(x, y) {
        Tile.call(this, x, y, "snek");
        this.next = null;
    }

    Block.prototype = Object.create(Tile.prototype);
    Block.prototype.constructor = Block;

    Block.prototype.render = function () {
        context.fillStyle = "#00FF00";
        context.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    };

    Block.prototype.addNextBlock = function () {
        this.next = new Block(this.x, this.y);
    };

    /**
     * This will cause the trailing block to take the place of the parent block unless it is already in that position.
     * This did not work out and is currently unused.
     */
    Block.prototype.pullNextBlock = function () {
        if (this.next && !this.next.isSamePosition(this)) {
            this.next.x = this.x;
            this.next.y = this.y;
        }
    };

    function Snake(board, length, speed, x, y) {
        this.head = new Block(x ? x : Math.floor(board.hTiles / 2), y ? y : Math.floor(board.vTiles / 2));
        this.direction = "up";
        this.nextDirection = "up";
        this.speed = speed ? speed : INITIAL_SPEED;
        this.timeSinceMove = 0;
        this.dead = false;

        this.board = board;
        this.board.addTile(this.head);

        if (!length) {
            length = INITIAL_LENGTH;
        }
        var block = this.head;
        for (var i = 1; i < length; i = i + 1) { // start at 1 because head already exists
            block.addNextBlock();
            block = block.next;
        }
    }

    Snake.prototype.render = function () {
        var block = this.head;
        while (block) {
            block.render();
            block = block.next;
        }
    };

    Snake.prototype.length = function () {
        var count = 0;
        var block = this.head;

        while (block) {
            count++;
            block = block.next;
        }

        return count;
    };

    Snake.prototype.move = function (direction) {
        var newX = this.head.x,
            newY = this.head.y;

        switch (direction) {
            case "up":
                this.head.y--;
                break;
            case "down":
                this.head.y++;
                break;
            case "left":
                this.head.x--;
                break;
            case "right":
                this.head.x++;
                break;
        }

        if (this.head.x < 0 || this.head.y < 0 || this.head.x >= H_TILES || this.head.y >= V_TILES) {
            this.dead = true;
        } else {
            this.eat(this.board.tiles[this.head.x][this.head.y]);
        }

        if (!this.dead) {
            this.board.addTile(this.head);
        }

        var last = this.head;
        var block = this.head.next,
            oldX, oldY;
        while (block) {
            oldX = block.x;
            oldY = block.y;
            block.x = newX;
            block.y = newY;
            newX = oldX;
            newY = oldY;

            last = block;
            block = block.next;
        }

        if (oldX && (last.x != oldX || last.y != oldY)) {
            this.board.removeTile(oldX, oldY);
        }
    };

    Snake.prototype.getTail = function () {
        var block = this.head;
        var next = this.head.next;
        while (next) {
            block = next;
            next = block.next;
        }
        return block;
    };

    Snake.prototype.grow = function (amount) {
        var block = this.getTail();
        for (var i = 0; i < amount; i++) {
            block.addNextBlock();
            block = block.next;
        }
    };

    Snake.prototype.eat = function (tile) {
        switch (tile.type) {
            case "snek":
                this.dead = true;
                break;
            case "appl":
                this.board.removeTile(tile);
                tile.eaten = true;
                this.grow(tile.growAmount);
                break;
            default:
        }
    };

    Snake.prototype.update = function (delta) {
        this.timeSinceMove += delta;
        if (this.timeSinceMove >= this.speed) {
            if (this.dead) {
                // Kill the snake one block per movement
                this.head = this.head ? this.head.next : this.head;
            }

            if (this.head) { // Keep moving the snake as long as it's got a "head"
                if (!this.dead) { // ignore directions if already dead
                    this.direction = this.nextDirection;
                }
                this.move(this.direction);
                this.timeSinceMove = Math.max(0, this.timeSinceMove - this.speed);
            }
        }
    };

    function Apple(board, x, y, growAmount) {
        Tile.call(this, x ? x : Math.floor(Math.random() * board.hTiles),
            y ? y : Math.floor(Math.random() * board.vTiles), "appl");
        while (!board.isOpenTile(this.x, this.y)) { // TODO: need a better method here as this can ultimately produce an infinite loop
            this.x = Math.floor(Math.random() * board.hTiles);
            this.y = Math.floor(Math.random() * board.vTiles);
        }
        board.addTile(this);

        this.growAmount = growAmount ? growAmount : GROW_AMOUNT;
        this.eaten = false;
    }

    Apple.prototype = Object.create(Tile.prototype);
    Apple.prototype.constructor = Apple;

    Apple.prototype.render = function () {
        context.fillStyle = "#FF0000";
        context.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    };

    var snake = new Snake(board);
    var apple = new Apple(board);

    // Set up the module to export
    var module = {};
    module.start = start;
    module.Snake = Snake;
    module.Block = Block;
    module.Tile = Tile;
    module.Board = Board;
    module.Apple = Apple;
    return module;
}(window, document));
