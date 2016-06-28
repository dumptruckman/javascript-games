// overloads the game's onload so the game does not actually run
window.onload = function () {

};

QUnit.test("testAddNextBlock", function( assert ) {
    var block = new snek.Block(0, 0);
    assert.notOk(block.next);
    block.addNextBlock();
    assert.ok(block.next);
    assert.equal(block.x, block.next.x);
    assert.equal(block.y, block.next.y);
});

QUnit.test("testInitialLength", function( assert ) {
    var snake = new snek.Snake(5);
    assert.ok(snake.head);
    assert.equal(snake.length(), 5);
});

QUnit.test("testIsSamePosition", function( assert ) {
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

QUnit.test("testPullNextBlock", function( assert ) {
    var block = new snek.Block (5, 5);
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

    block = new snek.Block (5, 5);
    block.addNextBlock();
    block.next.addNextBlock();

    block.y = 6;
    assert.notOk(block.isSamePosition(block.next));
    assert.ok(block.next.isSamePosition(block.next.next));
    block.pullNextBlock();
    assert.ok(block.isSamePosition(block.next));
    assert.notOk(block.next.isSamePosition(block.next.next));
});

QUnit.test("testMove", function( assert ) {
    var snake = new snek.Snake(3, 500, 5, 5);
    assert.equal(snake.head.x, 5);
    assert.equal(snake.head.y, 5);
    assert.equal(snake.head.next.x, 5);
    assert.equal(snake.head.next.y, 5);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 5);

    snake.move("up");
    assert.equal(snake.head.x, 5);
    assert.equal(snake.head.y, 4);
    assert.equal(snake.head.next.x, 5);
    assert.equal(snake.head.next.y, 5);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 5);

    snake.move("up");
    assert.equal(snake.head.x, 5);
    assert.equal(snake.head.y, 3);
    assert.equal(snake.head.next.x, 5);
    assert.equal(snake.head.next.y, 4);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 5);

    snake.move("up");
    assert.equal(snake.head.x, 5);
    assert.equal(snake.head.y, 2);
    assert.equal(snake.head.next.x, 5);
    assert.equal(snake.head.next.y, 3);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 4);

    snake.move("right");
    assert.equal(snake.head.x, 6);
    assert.equal(snake.head.y, 2);
    assert.equal(snake.head.next.x, 5);
    assert.equal(snake.head.next.y, 2);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 3);

    snake.move("right");
    assert.equal(snake.head.x, 7);
    assert.equal(snake.head.y, 2);
    assert.equal(snake.head.next.x, 6);
    assert.equal(snake.head.next.y, 2);
    assert.equal(snake.head.next.next.x, 5);
    assert.equal(snake.head.next.next.y, 2);

    snake.move("down");
    assert.equal(snake.head.x, 7);
    assert.equal(snake.head.y, 3);
    assert.equal(snake.head.next.x, 7);
    assert.equal(snake.head.next.y, 2);
    assert.equal(snake.head.next.next.x, 6);
    assert.equal(snake.head.next.next.y, 2);
});

QUnit.test("testKill", function( assert ) {
    var snake = new snek.Snake(5, 250, 5, 5);
    snake.move("up");
    snake.move("up");
    snake.move("up");
    snake.move("up");
    assert.equal(snake.head.y, 1);
    assert.equal(snake.head.next.y, 2);
    assert.equal(snake.head.next.next.y, 3);
    assert.equal(snake.head.next.next.next.y, 4);
    assert.equal(snake.head.next.next.next.next.y, 5);

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
    snake.update(250);
    assert.equal(snake.length(), 3);
    assert.equal(snake.head.y, 1);
    assert.equal(snake.head.next.y, 2);
    assert.equal(snake.head.next.next.y, 3);
    assert.notOk(snake.head.next.next.next);
    snake.update(250);
    assert.equal(snake.length(), 2);
    assert.equal(snake.head.y, 1);
    assert.equal(snake.head.next.y, 2);
    assert.notOk(snake.head.next.next);
    snake.update(250);
    assert.equal(snake.length(), 1);
    assert.equal(snake.head.y, 1);
    assert.notOk(snake.head.next);
    snake.update(250);
    assert.equal(snake.length(), 0);
    assert.notOk(snake.head);
    snake.update(250);
    assert.equal(snake.length(), 0);
    assert.notOk(snake.head);
});