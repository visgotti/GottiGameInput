let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let halfScreenWidth = screenWidth/2;
let halfScreenHeight = screenHeight/2;

const demoDiv = document.getElementById('demo');
demoDiv.style.display = 'flex';
demoDiv.style.flexDirection = 'column';
const optWrapper = document.getElementById('option-wrapper');
const PLAYER_SPEED = 250;
const updatePlayerPosition = (input, delta) => {
    if(!input) return;
    const { moveLeft, moveRight, moveUp, moveDown} = input;
    const vel = PLAYER_SPEED * delta/1000;
    let moveX = 0;
    let moveY = 0;
    if (moveLeft) moveX -= vel;
    if (moveRight) moveX += vel;
    if (moveUp) moveY -= vel;
    if (moveDown) moveY += vel;
    const nextX = player.x + moveX;
    const nextY = player.y + moveY;
    if(nextX > halfScreenWidth + player.width/2 && nextX < screenWidth - player.width/2) {
        player.x = nextX;
    }
    if(nextY > player.height/2 && nextY < screenHeight - player.height/2) {
        player.y = nextY;
    }
}

const options = {
    KEYBOARD: {
        label: 'Keyboard + Mouse',
        inputHandler: (inputState, delta) => {
            const { keyboard, mouse } = inputState;
        //    console.log('Keyboard+Mouse handling', { keyboardState, mouseState })
            keyboard && updatePlayerPosition(keyboard.state, delta);
        }
    },
    CONTROLLER: {
        label: 'Controller',
        inputHandler: (inputState, delta) => {
            const { controller } = inputState;
            if(controller[0] && controller[0].state) {
                const { red, green, purple, orange, pink, black } = controller[0].state;
                console.log({ red, green, purple, orange, pink, black });
                if((red && green)) {
                    redrawPlayer(0x0000ff);
                } else if (green) {
                    redrawPlayer(0x00ff00);
                } else if(red) {
                    redrawPlayer(0xff0000);
                } else if (orange) {
                    redrawPlayer(0xfcba03)
                } else if (pink) {
                    redrawPlayer(0xd0b3ff)
                } else if (purple) {
                    redrawPlayer(0x6613ed)
                } else if (black) {
                    redrawPlayer(0x000000)
                } else {
                    redrawPlayer(0x0000ff)
                }
            }
            controller[0] && updatePlayerPosition(controller[0].state, delta);
        }
    },
    TOUCH: {
        label: 'Touch Input',
        inputHandler: (inputState, delta) => {
            const { touch } = inputState;
            touch && updatePlayerPosition(touch.state, delta);
        //    console.log('touch handling',touchState)
        }
    },
}
const { KEYBOARD, CONTROLLER, TOUCH } = options;
const optionsArray = [KEYBOARD, CONTROLLER, TOUCH];

let selectedOpt;
const setSelectedOpt = (opt) => {
    selectedOpt = opt;
    optionsArray.forEach(o => {
        const m = o === selectedOpt ? 'add' : 'remove'
        o.element.classList[m]('selected-input-option')
    });
}
optionsArray.forEach(o => {
    o.element = document.createElement('DIV');
    o.element.innerText = o.label;
    o.element.classList.add('input-option');
    o.element.addEventListener('click', () => {
        setSelectedOpt(o);
    });
    optWrapper.append(o.element);
});
setSelectedOpt(KEYBOARD)

let last = 0;
const canvas = document.getElementById('canvas');
const stage = new PIXI.Container();
const moveAreaBackground = new PIXI.Graphics();
stage.addChild(moveAreaBackground);
const resize = () => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    halfScreenWidth = screenWidth/2;
    halfScreenHeight = screenHeight/2;
    moveAreaBackground.clear();
    moveAreaBackground.beginFill(0xfff000, 1);
    moveAreaBackground.drawRect(halfScreenWidth, 0, halfScreenWidth, screenHeight);
}
resize();
const renderer = PIXI.autoDetectRenderer({
    width: window.innerWidth,
    height: window.innerHeight-optWrapper.clientHeight,
    antialias: false,
    roundPixels: false,
    resolution:  1,
    view: canvas,
});

const player = new PIXI.Graphics();
const redrawPlayer = (color, outlineColor) => {
    player.clear();
    player.beginFill(color);
    if(outlineColor) {
        player.lineStye(outlineColor, 2)
    }
    player.drawCircle(0, 10, 10);
}
redrawPlayer(0x0000bb)
player.x = halfScreenWidth + halfScreenWidth/2 - player.width/2
player.y = halfScreenHeight - player.height/2
stage.addChild(player);

const gameInput = new GottiGameInput(
    {
        keyboard: {
            'moveDown':  ["KeyS", "ArrowDown"],
            'moveUp':  ["KeyW", "ArrowUp"],
            'moveLeft':  ["KeyA", "ArrowLeft"],
            'moveRight':  ["KeyD", "ArrowRight"],
        },
        controller: {
            default: {
                buttons: {
                    'north': 'shoot',
                },
                triggers: {
                    l2: 'shootHold'
                },
                dpad: {
                    north: 'purple',
                    south: 'orange',
                    west: 'pink',
                    east: 'black',
                },
                sticks: {
                    leftPress: 'red',
                    rightPress: 'green',
                    left: {
                        'moveLeft': {min: 225-22.5, max: 315+22.5 },
                        'moveRight': {min: 45-22.5, max: 135+22.5},
                        'moveDown': { min: 135-22.5, max: 225+22.5 },
                        'moveUp': [{ min:315-22.5, max: 360 }, { min: 0, max: 45+22.5 }]
                    },
                }
            },
        }
    }
);

const tick = (now) => {
    const delta = now - last;
    const state = gameInput.update();
    selectedOpt.inputHandler(state, delta);
    renderer.render(stage);
    last = now;
    requestAnimationFrame(tick)
}
requestAnimationFrame(tick)