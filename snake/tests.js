QUnit.test("testBoard", function (assert) {
    var board = new snek.Board(2, 3);
    for (var i = 0; i < board.hTiles; i++) {
        for (var j = 0; j < board.vTiles; j++) {
            assert.deepEqual(board.tiles[i][j], new snek.Tile(i, j));
        }
    }
    board = new snek.Board(3, 2);
    for (i = 0; i < board.hTiles; i++) {
        for (j = 0; j < board.vTiles; j++) {
            assert.deepEqual(board.tiles[i][j], new snek.Tile(i, j));
        }
    }
});

QUnit.test("testAddRemoveTile", function (assert) {
    var board = new snek.Board(5, 5);
    var tile = new snek.Tile(3, 2, "snek");
    assert.ok(board.isOpenTile(3, 2));
    board.addTile(tile);
    assert.notOk(board.isOpenTile(3, 2));
    board.removeTile(3, 2);
    assert.ok(board.isOpenTile(3, 2));
    board.addTile(tile);
    assert.notOk(board.isOpenTile(3, 2));
    board.removeTile(tile);
    assert.ok(board.isOpenTile(3, 2));
});

QUnit.test("testGetEmptyTiles", function (assert) {
    var board = new snek.Board(5, 5);
    assert.equal(board.getEmptyTiles().length, 25);
    board.addTile(new snek.Tile(2, 3, "snek"));
    board.addTile(new snek.Tile(4, 3, "snek"));
    assert.equal(board.getEmptyTiles().length, 23);
    board.removeTile(2, 3);
    assert.equal(board.getEmptyTiles().length, 24);
    board.removeTile(4, 3);
    assert.equal(board.getEmptyTiles().length, 25);
    board = new snek.Board(1, 1);
    assert.equal(board.getEmptyTiles().length, 1);
    board.addTile(new snek.Tile(0, 0, "snek"));
    assert.equal(board.getEmptyTiles().length, 0);
});

QUnit.test("testCreateSnake", function (assert) {
    var board = new snek.Board(5, 5);
    var snake = new snek.Snake(board, 5, 250, 3, 2);
    var block = snake.head;
    while (block) {
        assert.equal(block.x, 3);
        assert.equal(block.y, 2);
        block = block.next;
    }
    assert.equal(board.getTileType(3, 2), "snek");
    for (var i = 0; i < board.hTiles; i++) {
        for (var j = 0; j < board.vTiles; j++) {
            if (i != 3 || j != 2) {
                assert.notEqual(board.getTileType(i, j), "snek");
            }
        }
    }
});

QUnit.test("testAddNextBlock", function (assert) {
    var block = new snek.Block(0, 0);
    assert.notOk(block.next);
    block.addNextBlock();
    assert.ok(block.next);
    assert.equal(block.x, block.next.x);
    assert.equal(block.y, block.next.y);
});

QUnit.test("testInitialLength", function (assert) {
    var snake = new snek.Snake(new snek.Board(5, 5), 5);
    assert.ok(snake.head);
    assert.equal(snake.length(), 5);
});

QUnit.test("testIsSamePosition", function (assert) {
    var block = new snek.Block(5, 5);
    block.addNextBlock();
    var block2 = new snek.Block(2, 5);

    assert.ok(block.isSamePosition(block.next));
    assert.ok(block.next.isSamePosition(block));

    assert.notOk(block.isSamePosition(block2));
    assert.notOk(block2.isSamePosition(block));
    block2.y = 2;
    assert.notOk(block.isSamePosition(block2));
    assert.notOk(block2.isSamePosition(block));
    block2.x = 5;
    assert.notOk(block.isSamePosition(block2));
    assert.notOk(block2.isSamePosition(block));
    block2.y = 5;
    assert.ok(block.isSamePosition(block2));
    assert.ok(block2.isSamePosition(block));
});

QUnit.test("testPullNextBlock", function (assert) {
    var block = new snek.Block(5, 5);
    block.addNextBlock();
    block.next.addNextBlock();

    assert.ok(block.isSamePosition(block.next));
    block.pullNextBlock();
    assert.ok(block.isSamePosition(block.next));

    block.x = 6;
    assert.notOk(block.isSamePosition(block.next));
    assert.ok(block.next.isSamePosition(block.next.next));
    block.pullNextBlock();
    assert.ok(block.isSamePosition(block.next));
    assert.notOk(block.next.isSamePosition(block.next.next));

    block = new snek.Block(5, 5);
    block.addNextBlock();
    block.next.addNextBlock();

    block.y = 6;
    assert.notOk(block.isSamePosition(block.next));
    assert.ok(block.next.isSamePosition(block.next.next));
    block.pullNextBlock();
    assert.ok(block.isSamePosition(block.next));
    assert.notOk(block.next.isSamePosition(block.next.next));
});

QUnit.test("testGetTail", function (assert) {
    var snake = new snek.Snake(new snek.Board(1, 6), 3, 30, 0, 5);
    var tail = snake.getTail();
    assert.notOk(tail.next);
    assert.equal(tail.y, 5);
    snake.move("up");
    tail = snake.getTail();
    assert.notOk(tail.next);
    assert.equal(tail.y, 5);
    snake.move("up");
    tail = snake.getTail();
    assert.notOk(tail.next);
    assert.equal(tail.y, 5);
    /*
    snake.move("up");
    tail = snake.getTail();
    assert.notOk(tail.next);
    assert.equal(tail.y, 4);
    */
});

QUnit.test("testGrowShrink", function (assert) {
    var board = new snek.Board(10, 10);
    var snake = new snek.Snake(board, 3, 30, 5, 5);
    snake.move("up");
    snake.move("up");

    var tail = snake.getTail();
    assert.equal(tail.x, 5);
    assert.equal(tail.y, 5);

    assert.equal(snake.length(), 3);
    snake.grow(1);
    assert.equal(snake.length(), 4);

    tail = snake.getTail();
    assert.equal(tail.x, 5);
    assert.equal(tail.y, 5);
    assert.equal(board.getTileType(5, 5), "snek");

    snake.move("up");
    tail = snake.getTail();
    assert.equal(tail.x, 5);
    assert.equal(tail.y, 5);
    assert.equal(board.getTileType(5, 5), "snek");

    snake.move("up");
    tail = snake.getTail();
    assert.equal(tail.x, 5);
    assert.equal(tail.y, 4);
    assert.equal(board.getTileType(5, 4), "snek");
    assert.notEqual(board.getTileType(5, 5), "snek");

    snake.grow(5);
    assert.equal(snake.length(), 9);
    snake.shrink(5);
    assert.equal(snake.length(), 4);

    assert.equal(tail.x, 5);
    assert.equal(tail.y, 4);
    assert.equal(board.getTileType(5, 4), "snek");
    assert.notEqual(board.getTileType(5, 5), "snek");

    snake.shrink(1);
    tail = snake.getTail();
    assert.equal(snake.length(), 3);
    assert.equal(tail.x, 5);
    assert.equal(tail.y, 3);
    assert.equal(board.getTileType(5, 3), "snek");
    assert.notEqual(board.getTileType(5, 4), "snek");

    snake.shrink(1);
    tail = snake.getTail();
    assert.equal(snake.length(), 2);
    assert.equal(tail.x, 5);
    assert.equal(tail.y, 2);
    assert.equal(board.getTileType(5, 2), "snek");
    assert.notEqual(board.getTileType(5, 3), "snek");

    snake.shrink(1);
    tail = snake.getTail();
    assert.equal(snake.length(), 1);
    assert.equal(snake.head, snake.tail);
    assert.equal(tail.x, 5);
    assert.equal(tail.y, 1);
    assert.equal(board.getTileType(5, 1), "snek");
    assert.notEqual(board.getTileType(5, 2), "snek");
});

QUnit.test("testMove", function (assert) {
    var board = new snek.Board(10, 10);
    var snake = new snek.Snake(board, 3, 30, 5, 5);

    assert.equal(snake.head.x, 5);
    assert.equal(snake.head.y, 5);
    assert.equal(snake.head.next.x, 5);
    assert.equal(snake.head.next.y, 5);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 5);
    assert.equal(board.getTileType(5, 5), "snek");

    snake.move("up");
    assert.equal(snake.head.x, 5);
    assert.equal(snake.head.y, 4);
    assert.equal(snake.head.next.x, 5);
    assert.equal(snake.head.next.y, 5);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 5);
    assert.equal(board.getTileType(5, 4), "snek");
    assert.equal(board.getTileType(5, 5), "snek");

    snake.move("up");
    assert.equal(snake.head.x, 5);
    assert.equal(snake.head.y, 3);
    assert.equal(snake.head.next.x, 5);
    assert.equal(snake.head.next.y, 4);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 5);
    assert.equal(board.getTileType(5, 3), "snek");
    assert.equal(board.getTileType(5, 4), "snek");
    assert.equal(board.getTileType(5, 5), "snek");

    snake.move("up");
    assert.equal(snake.head.x, 5);
    assert.equal(snake.head.y, 2);
    assert.equal(snake.head.next.x, 5);
    assert.equal(snake.head.next.y, 3);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 4);
    assert.equal(board.getTileType(5, 2), "snek");
    assert.equal(board.getTileType(5, 3), "snek");
    assert.equal(board.getTileType(5, 4), "snek");
    assert.notEqual(board.getTileType(5, 5), "snek");

    snake.move("right");
    assert.equal(snake.head.x, 6);
    assert.equal(snake.head.y, 2);
    assert.equal(snake.head.next.x, 5);
    assert.equal(snake.head.next.y, 2);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 3);
    assert.equal(board.getTileType(6, 2), "snek");
    assert.equal(board.getTileType(5, 2), "snek");
    assert.equal(board.getTileType(5, 3), "snek");
    assert.notEqual(board.getTileType(5, 4), "snek");

    snake.move("right");
    assert.equal(snake.head.x, 7);
    assert.equal(snake.head.y, 2);
    assert.equal(snake.head.next.x, 6);
    assert.equal(snake.head.next.y, 2);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 2);
    assert.equal(board.getTileType(7, 2), "snek");
    assert.equal(board.getTileType(6, 2), "snek");
    assert.equal(board.getTileType(5, 2), "snek");
    assert.notEqual(board.getTileType(5, 3), "snek");

    snake.move("down");
    assert.equal(snake.head.x, 7);
    assert.equal(snake.head.y, 3);
    assert.equal(snake.head.next.x, 7);
    assert.equal(snake.head.next.y, 2);
    assert.equal(snake.head.next.next.x, 6);
    assert.equal(snake.head.next.next.y, 2);
    assert.equal(board.getTileType(7, 3), "snek");
    assert.equal(board.getTileType(7, 2), "snek");
    assert.equal(board.getTileType(6, 2), "snek");
    assert.notEqual(board.getTileType(5, 2), "snek");
});

QUnit.test("testKill", function (assert) {
    var board = new snek.Board(10, 10);
    var snake = new snek.Snake(board, 5, 30, 5, 5);
    snake.move("up");
    snake.move("up");
    snake.move("up");
    snake.move("up");
    assert.equal(snake.head.y, 1);
    assert.equal(snake.head.next.y, 2);
    assert.equal(snake.head.next.next.y, 3);
    assert.equal(snake.head.next.next.next.y, 4);
    assert.equal(snake.head.next.next.next.next.y, 5);
    assert.equal(board.getTileType(5, 1), "snek");
    assert.equal(board.getTileType(5, 2), "snek");
    assert.equal(board.getTileType(5, 3), "snek");
    assert.equal(board.getTileType(5, 4), "snek");
    assert.equal(board.getTileType(5, 5), "snek");

    assert.equal(snake.length(), 5);
    snake.dead = true;
    assert.equal(snake.length(), 5);

    snake.update(250);
    assert.equal(snake.length(), 4);
    assert.equal(snake.head.y, 1);
    assert.equal(snake.head.next.y, 2);
    assert.equal(snake.head.next.next.y, 3);
    assert.equal(snake.head.next.next.next.y, 4);
    assert.notOk(snake.head.next.next.next.next);
    assert.equal(board.getTileType(5, 1), "snek");
    assert.equal(board.getTileType(5, 2), "snek");
    assert.equal(board.getTileType(5, 3), "snek");
    assert.equal(board.getTileType(5, 4), "snek");
    assert.ok(board.isOpenTile(5, 5));

    snake.update(250);
    assert.equal(snake.length(), 3);
    assert.equal(snake.head.y, 1);
    assert.equal(snake.head.next.y, 2);
    assert.equal(snake.head.next.next.y, 3);
    assert.notOk(snake.head.next.next.next);
    assert.equal(board.getTileType(5, 1), "snek");
    assert.equal(board.getTileType(5, 2), "snek");
    assert.equal(board.getTileType(5, 3), "snek");
    assert.ok(board.isOpenTile(5, 4));

    snake.update(250);
    assert.equal(snake.length(), 2);
    assert.equal(snake.head.y, 1);
    assert.equal(snake.head.next.y, 2);
    assert.notOk(snake.head.next.next);
    assert.equal(board.getTileType(5, 1), "snek");
    assert.equal(board.getTileType(5, 2), "snek");
    assert.ok(board.isOpenTile(5, 3));

    snake.update(250);
    assert.equal(snake.length(), 1);
    assert.equal(snake.head.y, 1);
    assert.notOk(snake.head.next);
    assert.equal(board.getTileType(5, 1), "snek");
    assert.ok(board.isOpenTile(5, 2));

    snake.update(250);
    assert.equal(snake.length(), 0);
    assert.notOk(snake.head);
    assert.ok(board.isOpenTile(5, 1));

    snake.update(250);
    assert.equal(snake.length(), 0);
    assert.notOk(snake.head);
    assert.ok(board.isOpenTile(5, 1));
});

QUnit.test("testMoreDeaths", function (assert) {
    var board = new snek.Board(7, 7);
    testDeathDirection(assert, board, new snek.Snake(board, 3, 250, 3, 3), "left");
    testDeathDirection(assert, board, new snek.Snake(board, 3, 250, 3, 3), "left");
    testDeathDirection(assert, board, new snek.Snake(board, 3, 250, 3, 3), "right");
    testDeathDirection(assert, board, new snek.Snake(board, 3, 250, 3, 3), "right");
    testDeathDirection(assert, board, new snek.Snake(board, 3, 250, 3, 3), "up");
    testDeathDirection(assert, board, new snek.Snake(board, 3, 250, 3, 3), "up");
    testDeathDirection(assert, board, new snek.Snake(board, 3, 250, 3, 3), "down");
    testDeathDirection(assert, board, new snek.Snake(board, 3, 250, 3, 3), "down");
});

function testDeathDirection (assert, board, snake, dir) {
    snake.direction = dir;
    snake.move(dir);
    snake.move(dir);
    snake.move(dir);
    assert.notOk(snake.dead);
    snake.move(dir);
    assert.ok(snake.dead);
    snake.update(250);
    snake.update(250);
    snake.update(250);
    testForClearBoard(assert, board);
}

function testForClearBoard (assert, board) {
    for (var i = 0; i < board.hTiles; i++) {
        for (var j = 0; j < board.vTiles; j++) {
            assert.notEqual(board.getTileType(i, j), "snek");
        }
    }
}

QUnit.test("testEatApple", function (assert) {
    var board = new snek.Board(10, 10);
    var snake = new snek.Snake(board, 3, 30, 5, 6);
    var apple = new snek.Apple(board, 5, 2, 2);

    assert.equal(snake.length(), 3);
    assert.equal(board.getTileType(5, 2), "appl");
    assert.notOk(apple.eaten);

    snake.move("up");
    snake.move("up");
    assert.equal(board.getTileType(5, 6), "snek");

    snake.move("up");
    assert.ok(board.isOpenTile(5, 6));
    assert.equal(board.getTileType(5, 5), "snek");

    snake.move("up"); // apple is eaten

    assert.ok(apple.eaten);
    assert.equal(board.getTileType(5, 2), "snek");
    assert.equal(snake.length(), 5);
    assert.ok(board.isOpenTile(5, 6));
    assert.equal(board.getTileType(5, 5), "snek"); // growth causes the snake to "remain" in (5, 5)

    snake.move("up"); // because growth amount is 2, snake should cause snake to "remain" in (5, 5) again

    assert.equal(board.getTileType(5, 1), "snek");
    assert.equal(board.getTileType(5, 5), "snek");

    snake.move("up"); // snake should now vacate (5, 5);
    assert.equal(board.getTileType(5, 0), "snek");
    assert.ok(board.isOpenTile(5, 5));
});

QUnit.test("testBasicEvents", function (assert) {
    var started = false;
    snek.subscribe(snek.EVENT.GAME_START, function() { started = true; });
    assert.notOk(started);
    snek.start();
    assert.ok(started);
    snek.subscribe(snek.EVENT.GAME_STOP, function() { started = false; });
    assert.ok(started);
    snek.stop();
    assert.notOk(started);
});