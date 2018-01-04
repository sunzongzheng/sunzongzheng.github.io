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
    Board.prototype.draw = function () {
        if (!this.img.complete) {
            return;
        }
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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
        _this.width = _this.height = 50;
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
            this.speedY *= -1;
        }
        this.x += this.speedX;
        this.y += this.speedY;
    };
    Ball.prototype.draw = function (board) {
        if (!this.img.complete) {
            return;
        }
        this.move(board);
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    };
    // 碰撞检测
    Ball.prototype.intersects = function (bodyA, bodyB) {
        return !(bodyA.x + bodyA.width < bodyB.x ||
            bodyB.x + bodyB.width < bodyA.x ||
            bodyA.y + bodyA.height < bodyB.y ||
            bodyB.y + bodyB.height < bodyA.y);
    };
    return Ball;
}(Img));
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        _this.board = new Board('./images/board.png');
        _this.ball = new Ball('./images/ball.png');
        _this.actions = {};
        _this.keydowns = {};
        // 左
        _this.registerAction([65, 37], function () {
            _this.board.moveLeft();
        });
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
        switch (Object.prototype.toString.call(key)) {
            case '[object Array]':
                key.forEach(function (item) {
                    _this.actions[item] = func;
                });
                break;
            case '[object String]':
                this.actions[key] = func;
                break;
        }
    };
    Game.prototype.run = function () {
        var _this = this;
        window.setInterval(function () {
            _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this.board.draw();
            _this.ball.draw(_this.board);
            Object.keys(_this.keydowns).forEach(function (key) {
                if (_this.keydowns[key] && _this.actions[key]) {
                    _this.actions[key]();
                }
            });
        }, 1000 / 60);
    };
    return Game;
}(Main));
var game = new Game();
game.run();
