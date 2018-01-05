class Main {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    constructor() {
        this.canvas = <HTMLCanvasElement> document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')
    }

    // 碰撞检测
    intersects(bodyA, bodyB) {
        return !(bodyA.x + bodyA.width < bodyB.x ||
            bodyB.x + bodyB.width < bodyA.x ||
            bodyA.y + bodyA.height < bodyB.y ||
            bodyB.y + bodyB.height < bodyA.y)
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

    draw() {
        if (!this.img.complete) {
            return
        }
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
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
}

class Ball extends Img {
    constructor(path: string) {
        super(path)
        this.x = 0
        this.y = 0
        this.speedX = this.speedY = 8
        this.width = this.height = 35
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
            this.collideHandle()
        }
        this.x += this.speedX
        this.y += this.speedY
    }

    collideHandle() {
        this.speedY *= -1
    }
}

class Block extends Img {
    isAlive: Boolean

    constructor(path) {
        super(path)
        this.isAlive = true
        this.width = 50
        this.height = 12
    }

    juedeAlive(ball) {
        // 碰撞时
        if (this.intersects(this, ball)) {
            this.isAlive = false
            return true
        }
        return false
    }
}

class Game extends Main {
    board: Board
    ball: Ball
    blocks: Array<Block>
    actions: Object
    keydowns: Object

    constructor() {
        super()
        this.board = new Board('./images/board.png')
        this.ball = new Ball('./images/ball.png')
        this.blocks = []
        for (let i = 0; i < 3; i++) {
            const b = new Block('./images/block.png')
            b.x = i * 150
            b.y = 50
            this.blocks.push(b)
        }
        this.actions = {}
        this.keydowns = {}
        // 左、w
        this.registerAction([65, 37], () => {
            this.board.moveLeft()
        })
        // 右、d
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
    registerAction(key: Array<number>, func) {
        key.forEach(item => {
            this.actions[item] = func
        })
    }

    // 状态更新
    update() {
        this.ball.move(this.board)
        this.blocks.forEach(item => {
            if (item.isAlive && item.juedeAlive(this.ball)) {
                this.ball.collideHandle()
            }
        })
    }

    // 绘制
    draw() {
        this.board.draw() // 挡板
        this.ball.draw() // 球
        this.blocks.forEach(item => { // 砖块
            item.isAlive && item.draw()
        })
    }

    // 事件处理
    eventsHandle() {
        Object.keys(this.keydowns).forEach(key => {
            if (this.keydowns[key] && this.actions[key]) {
                this.actions[key]()
            }
        })
    }

    run() {
        window.setInterval(() => {
            this.update()
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.eventsHandle()
            this.draw()
        }, 1000 / 60)
    }
}

const game = new Game()
game.run()