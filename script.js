// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const para = document.querySelector("p");

let count = 0;

// random number

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// random color

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Shape class

class Shape {
    constructor(x, y, velX, velY) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
    }
}

// Ball class

class Ball extends Shape {
    constructor(x, y, velX, velY, size, color) {
        super(x, y, velX, velY);

        this.color = color;
        this.size = size;
        this.exists = true;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if (this.x + this.size >= width) {
            this.velX = -Math.abs(this.velX);
        }

        if (this.x - this.size <= 0) {
            this.velX = Math.abs(this.velX);
        }

        if (this.y + this.size >= height) {
            this.velY = -Math.abs(this.velY);
        }

        if (this.y - this.size <= 0) {
            this.velY = Math.abs(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (const ball of balls) {
            if (!(this === ball) && ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    const color = randomRGB();
                    this.color = color;
                    ball.color = color;
                }
            }
        }
    }
}

// Evil Circle

class EvilCircle extends Shape {
    constructor(x, y) {
        super(x, y, 20, 20);

        this.color = "white";
        this.size = 10;

        window.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "a":
                    this.x -= this.velX;
                    break;
                case "d":
                    this.x += this.velX;
                    break;
                case "w":
                    this.y -= this.velY;
                    break;
                case "s":
                    this.y += this.velY;
                    break;
                case "ArrowLeft":
                    this.x -= this.velX;
                    break;

                case "ArrowRight":
                    this.x += this.velX;
                    break;

                case "ArrowUp":
                    this.y -= this.velY;
                    break;

                case "ArrowDown":
                    this.y += this.velY;
                    break;

                case " ":
                    this.velX = 40;
                    this.velY = 40;

                    setTimeout(() => {
                        this.velX = 20;
                        this.velY = 20;
                    }, 500);
                    break;

                case " ":
                    this.velX = 40;
                    this.velY = 40;

                    setTimeout(() => {
                        this.velX = 20;
                        this.velY = 20;
                    }, 500);

                    break;
            }
        });
    }

    draw() {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }

    checkBounds() {
        if (this.x + this.size >= width) {
            this.x = width - this.size;
        }

        if (this.x - this.size <= 0) {
            this.x = this.size;
        }

        if (this.y + this.size >= height) {
            this.y = height - this.size;
        }

        if (this.y - this.size <= 0) {
            this.y = this.size;
        }
    }

    collisionDetect() {
        for (const ball of balls) {
            if (ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.exists = false;
                    count--;
                    if (count % 5 === 0) {
                        this.size += 3;
                    }
                    document.body.style.background = randomRGB();
                    para.textContent = `Ball count: ${count}`;
                    if (count <= 10) {
                        para.style.color = "yellow";
                    }

                    if (count <= 5) {
                        para.style.color = "red";
                    }
                    if (count === 0) {
                        alert("🎉 You caught all the balls!");
                    }
                }
            }
        }
    }
}

// create balls

const balls = [];

function randomVelocity() {
    let value;

    do {
        value = random(-10, 10);
    } while (value === 0);

    return value;
}

while (balls.length < 25) {
    const size = random(10, 20);

    const ball = new Ball(
        random(size, width - size),
        random(size, height - size),
        randomVelocity(),
        randomVelocity(),
        size,
        randomRGB()
    );

    balls.push(ball);

    count++;
}

para.textContent = `Ball count: ${count}`;

// create evil circle

const evilCircle = new EvilCircle(
    random(0, width),
    random(0, height)
);

// animation loop

function loop() {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
    }

    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();

    requestAnimationFrame(loop);
}

loop();

document.getElementById("restart").addEventListener("click", () => {
    location.reload();
});