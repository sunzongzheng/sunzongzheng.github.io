var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Main = /** @class */ (function () {
    function Main() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    // 碰撞检测
    Main.prototype.intersects = function (bodyA, bodyB) {
        return !(bodyA.x + bodyA.width < bodyB.x ||
            bodyB.x + bodyB.width < bodyA.x ||
            bodyA.y + bodyA.height < bodyB.y ||
            bodyB.y + bodyB.height < bodyA.y);
    };
    return Main;
}());
var Img = /** @class */ (function (_super) {
    __extends(Img, _super);
    function Img(path) {
        var _this = _super.call(this) || this;
        _this.img = _this.imageFromPath(path);
        return _this;
    }
    Img.prototype.imageFromPath = function (path) {
        var img = new Image();
        img.src = path;
        return img;
    };
    Img.prototype.draw = function () {
        if (!this.img.complete) {
            return;
        }
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    };
    return Img;
}(Main));
var Board = /** @class */ (function (_super) {
    __extends(Board, _super);
    function Board(path) {
        var _this = _super.call(this, path) || this;
        _this.x = 0;
        _this.y = _this.canvas.height - 50;
        _this.speedX = 10;
        _this.img.onload = function () {
            _this.width = _this.img.width;
            _this.height = _this.img.height;
        };
        return _this;
    }
    Board.prototype.moveLeft = function () {
        this.x -= this.speedX;
        if (this.x < 0) {
            this.x = 0;
        }
    };
    Board.prototype.moveRight = function () {
        this.x += this.speedX;
        if (this.x > this.canvas.width - this.img.width) {
            this.x = this.canvas.width - this.img.width;
        }
    };
    return Board;
}(Img));
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball(path) {
        var _this = _super.call(this, path) || this;
        _this.x = 0;
        _this.y = 0;
        _this.speedX = _this.speedY = 8;
        _this.width = _this.height = 35;
        return _this;
    }
    Ball.prototype.move = function (board) {
        if (this.x < 0 || this.x > this.canvas.width - this.height) {
            this.speedX *= -1;
        }
        if (this.y < 0 || this.y > this.canvas.height - this.height) {
            this.speedY *= -1;
        }
        // 碰撞时
        if (this.intersects(this, board)) {
            this.collideHandle();
        }
        this.x += this.speedX;
        this.y += this.speedY;
    };
    Ball.prototype.collideHandle = function () {
        this.speedY *= -1;
    };
    return Ball;
}(Img));
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block(path) {
        var _this = _super.call(this, path) || this;
        _this.isAlive = true;
        _this.width = 50;
        _this.height = 12;
        return _this;
    }
    Block.prototype.juedeAlive = function (ball) {
        // 碰撞时
        if (this.intersects(this, ball)) {
            this.isAlive = false;
            return true;
        }
        return false;
    };
    return Block;
}(Img));
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        _this.board = new Board('./images/board.png');
        _this.ball = new Ball('./images/ball.png');
        _this.blocks = [];
        for (var i = 0; i < 3; i++) {
            var b = new Block('./images/block.png');
            b.x = i * 150;
            b.y = 50;
            _this.blocks.push(b);
        }
        _this.actions = {};
        _this.keydowns = {};
        // 左、w
        _this.registerAction([65, 37], function () {
            _this.board.moveLeft();
        });
        // 右、d
        _this.registerAction([68, 39], function () {
            _this.board.moveRight();
        });
        window.addEventListener('keydown', function (event) {
            console.log(event.keyCode);
            _this.keydowns[event.keyCode] = true;
        });
        window.addEventListener('keyup', function (event) {
            _this.keydowns[event.keyCode] = false;
        });
        return _this;
    }
    // 注册按键事件
    Game.prototype.registerAction = function (key, func) {
        var _this = this;
        key.forEach(function (item) {
            _this.actions[item] = func;
        });
    };
    // 状态更新
    Game.prototype.update = function () {
        var _this = this;
        this.ball.move(this.board);
        this.blocks.forEach(function (item) {
            if (item.isAlive && item.juedeAlive(_this.ball)) {
                _this.ball.collideHandle();
            }
        });
    };
    // 绘制
    Game.prototype.draw = function () {
        this.board.draw(); // 挡板
        this.ball.draw(); // 球
        this.blocks.forEach(function (item) {
            item.isAlive && item.draw();
        });
    };
    // 事件处理
    Game.prototype.eventsHandle = function () {
        var _this = this;
        Object.keys(this.keydowns).forEach(function (key) {
            if (_this.keydowns[key] && _this.actions[key]) {
                _this.actions[key]();
            }
        });
    };
    Game.prototype.run = function () {
        var _this = this;
        window.setInterval(function () {
            _this.update();
            _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this.eventsHandle();
            _this.draw();
        }, 1000 / 60);
    };
    return Game;
}(Main));
var game = new Game();
game.run();
