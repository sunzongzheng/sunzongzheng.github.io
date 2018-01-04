class Main {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    constructor() {
        this.canvas = <HTMLCanvasElement> document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')
    }
}

class Img extends Main {
    img: HTMLImageElement
    x: number
    y: number
    width: number
    height: number
    speedX: number
    speedY: number

    constructor(path) {
        super()
        this.img = this.imageFromPath(path)
    }

    imageFromPath(path) {
        const img = new Image()
        img.src = path
        return img
    }
}

class Board extends Img {
    constructor(path: string) {
        super(path)
        this.x = 0
        this.y = this.canvas.height - 50
        this.speedX = 10
        this.img.onload = () => {
            this.width = this.img.width
            this.height = this.img.height
        }
    }

    moveLeft() {
        this.x -= this.speedX
        if (this.x < 0) {
            this.x = 0
        }
    }

    moveRight() {
        this.x += this.speedX
        if (this.x > this.canvas.width - this.img.width) {
            this.x = this.canvas.width - this.img.width
        }
    }

    draw() {
        if (!this.img.complete) {
            return
        }
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

class Ball extends Img {
    constructor(path: string) {
        super(path)
        this.x = 0
        this.y = 0
        this.speedX = this.speedY = 8
        this.width = this.height = 50
    }

    move(board) {
        if (this.x < 0 || this.x > this.canvas.width - this.height) {
            this.speedX *= -1
        }
        if (this.y < 0 || this.y > this.canvas.height - this.height) {
            this.speedY *= -1
        }
        // 碰撞时
        if (this.intersects(this, board)) {
            this.speedY *= -1
        }
        this.x += this.speedX
        this.y += this.speedY
    }

    draw(board) {
        if (!this.img.complete) {
            return
        }
        this.move(board)
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }

    // 碰撞检测
    intersects(bodyA, bodyB) {
        return !(bodyA.x + bodyA.width < bodyB.x ||
            bodyB.x + bodyB.width < bodyA.x ||
            bodyA.y + bodyA.height < bodyB.y ||
            bodyB.y + bodyB.height < bodyA.y)
    }
}

class Game extends Main {
    board: Board
    ball: Ball
    actions: Object
    keydowns: Object

    constructor() {
        super()
        this.board = new Board('./images/board.png')
        this.ball = new Ball('./images/ball.png')
        this.actions = {}
        this.keydowns = {}
        // 左
        this.registerAction([65, 37], () => {
            this.board.moveLeft()
        })
        this.registerAction([68, 39], () => {
            this.board.moveRight()
        })
        window.addEventListener('keydown', (event) => {
            console.log(event.keyCode)
            this.keydowns[event.keyCode] = true
        })
        window.addEventListener('keyup', (event) => {
            this.keydowns[event.keyCode] = false
        })
    }

    // 注册按键事件
    registerAction(key: any, func) {
        switch (Object.prototype.toString.call(key)) {
            case '[object Array]':
                key.forEach(item => {
                    this.actions[item] = func
                })
                break
            case '[object String]':
                this.actions[key] = func
                break
        }
    }

    run() {
        window.setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.board.draw()
            this.ball.draw(this.board)
            Object.keys(this.keydowns).forEach(key => {
                if (this.keydowns[key] && this.actions[key]) {
                    this.actions[key]()
                }
            })
        }, 1000 / 60)
    }
}

const game = new Game()
game.run()