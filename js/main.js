
const zonaJuego = document.getElementById('zonaJuego');
let bola;
const mensajeElement = document.getElementById('message');
const instructions = document.getElementById('instructions');
estadoJuego = "PAUSE";

class Paleta {

    element;
    y = 0;
    speed = 15;
    movement;
    height = 200;
    PaletaWidth = 20;

    constructor() {
        this.element = document.createElement('div');
        this.element.classList = "paleta";
        zonaJuego.children[0].appendChild(this.element);
        this.resetPosition()
    }

    subir() {
        if (!this.movement) {
            this.movement = setInterval(() => {
                this.y -= this.speed;
                if (this.y < 0) {
                    this.y = 0;
                    this.freeze()
                }
                this.element.style.top = this.y + "px";
            }, 20)
        }
    };

    bajar() {
        if (!this.movement) {
            this.movement = setInterval(() => {
                this.y += this.speed;
                const limit = document.body.clientHeight - this.height
                if (this.y > limit) {
                    this.y = limit;
                    this.freeze()
                }
                this.element.style.top = this.y + "px";
            }, 20)
        }
    };

    freeze() {
        clearInterval(this.movement);
        this.movement = undefined;
    };

    resetPosition() {
        this.y = document.body.clientHeight / 2 - this.height / 2;
        this.element.style.top = this.y + "px";
    };

    getCenter() {
        return this.y + this.height / 2;
    }
};

class Bola {

    x;
    y;
    dx = -10;
    dy = 0;
    width = 30;
    movement;

    constructor() {
        this.element = document.createElement('div');
        this.element.classList = "bola";
        zonaJuego.appendChild(this.element);
        this.resetPosition();
        this.mover();
        mensajeElement.classList = 'hide';
        instructions.classList.toggle("hide", true);
    };

    resetPosition() {
        this.x = document.body.clientWidth / 2 - this.width / 2;
        this.element.style.left = this.x + "px";
        this.y = document.body.clientHeight / 2 - this.width / 2;
        this.element.style.top = this.y + "px";
    };

    mover() {
        if (!this.movement) {
            this.movement = setInterval(() => {
                /* horizontal movement */
                this.x += this.dx;

                // choque con paletas
                // player 1
                if (this.x < 0 + player1.PaletaWidth &&
                    this.y + this.width / 2 > player1.y &&
                    this.y + this.width / 2 < player1.y + player1.height) {
                    this.dy += this.obtenerVariacionY(player1)
                    this.dx = this.dx * -1;
                };
                // player 2
                if (this.x + this.width > document.body.clientWidth - player2.PaletaWidth &&
                    this.y + this.width / 2 > player2.y &&
                    this.y + this.width / 2 < player2.y + player2.height) {
                    this.dy += this.obtenerVariacionY(player2)
                    this.dx = this.dx * -1;
                };


                //score point
                if (this.x < 0 || this.x > document.body.clientWidth - this.width) {
                    console.log("punto");
                    tablero.sumar(this.x < 100 ? 2 : 1)
                }
                this.element.style.left = this.x + "px";

                /* vertical movement */
                this.y += this.dy;
                if (this.y < 0 || this.y > document.body.clientHeight - this.width) {
                    this.dy = this.dy * -1;
                }
                this.element.style.top = this.y + "px";
            }, 20)
        };
    };

    eliminar() {
        clearInterval(this.movement);
        zonaJuego.removeChild(this.element);
        bola = undefined;
    };

    obtenerVariacionY(j) {
        const diferencia = this.getCenter() - j.getCenter();
        return diferencia / 10;
    };

    getCenter() {
        return this.y + this.width / 2;
    }
};

class Tablero {

    player1Score = 0;
    player2Score = 0;
    MaxScore = 6;


    constructor() {
        this.element = document.createElement('p');
        this.element.id = "tablero";
        zonaJuego.appendChild(this.element);
        this.updateText();
    };

    updateText() {
        this.element.textContent = this.player1Score + "-" + this.player2Score;
    };

    sumar(p) {
        if (p === 1) this.player1Score++
        else this.player2Score++;
        this.updateText();
        bola.eliminar();
        player1.resetPosition();
        player2.resetPosition();
        mensajeElement.classList.toggle("hide", false);
        mensajeElement.textContent = 'Press "space" to continue';
        this.estadoJuego = "PAUSE";

        if (this.player1Score >= this.MaxScore) {
            this.ganar(1);
        }
        else if (this.player2Score >= this.MaxScore) {
            this.ganar(2)
        }
    };

    ganar(p) {
        mensajeElement.textContent = 'Player ' + p + ' wins!!';
        mensajeElement.classList.toggle("ganadorAnimation", true);
        estadoJuego = "END";
    };

    reset() {
        this.player1Score = 0;
        this.player2Score = 0;
        this.updateText();
        mensajeElement.classList.toggle("ganadorAnimation", false)
    }
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            player1.subir();
            break;
        case "s":
            player1.bajar();
            break;
        case "ArrowUp":
            player2.subir();
            break;
        case "ArrowDown":
            player2.bajar();
            break;
        case " ":
            if (estadoJuego === "END") tablero.reset()
            if (!bola) bola = new Bola();
            estadoJuego = "PLAY";
            break;
    }
});

document.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w":
        case "s":
            player1.freeze();
            break;
        case "ArrowUp":
        case "ArrowDown":
            player2.freeze();
            break
    }
});

const player1 = new Paleta();
const player2 = new Paleta();
const tablero = new Tablero();