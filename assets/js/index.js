console.log('Hola Sixtus');

const canvas = document.querySelector('canvas');
const score = document.getElementById('scoreElement');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;


class Player {
    constructor() {
        this.velocity = {
            x : 0,
            y : 0,
        }

        this.rotation = 0;

        this.opacity = 1;

        const image = new Image();
        image.src = "/assets/img/spaceship.png";
        image.onload = () => 
        {
            const scale = .15;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            
            this.position = {
            x : canvas.width / 2 - this.width / 2,
            y : canvas.height - this.height - 30,
            }
        }
    }

    draw() {
        // c.fillStyle = 'red';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);

        c.save();

        c.globalAlpha = this.opacity;

        c.translate(
            player.position.x + player.width / 2, 
            player.position.y + player.height / 2
            );

        c.rotate(this.rotation);

        c.translate(
            -player.position.x - player.width / 2, 
            -player.position.y - player.height / 2
            );
        c.drawImage(this.image,this.position.x,this.position.y,this.width, this.height);
        c.restore();
    }

    update ()
    {
        if(this.image){
            this.draw();
            this.position.x += this.velocity.x;
        }
    }
}

//Create projectile
class Projectile
{
    constructor ({position, velocity})
    {
        this.position = position;
        this.velocity = velocity;

        this.radius = 4;
    } 

    draw ()
    {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

        c.fillStyle = "red";
        c.fill();
        c.closePath();
    }

    update ()
    {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

//Create new Class 
class Particle
{
    constructor ({position, velocity, radius, color, fades})
    {
        this.position = position;
        this.velocity = velocity;

        this.radius = radius;
        this.color = color;
        this.opacity = 1;
        this.fades = fades;
    } 

    draw ()
    {
        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }


    update ()
    {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.fades) this.opacity -= 0.01;
    }
}
//Create projectile from your enemies
class InvaderProjectile
{
    constructor ({position, velocity})
    {
        this.position = position;
        this.velocity = velocity;

        this.width = 3;
        this.height = 10;
    } 

    draw ()
    {
        c.fillStyle = "blue";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update ()
    {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
class Invader {
    constructor({position}) {
        this.velocity = {
            x : 0,
            y : 0,
        }

        const image = new Image();
        image.src = "/assets/img/invader.png";
        image.onload = () => 
        {
            const scale = 1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            
            this.position = {
                x : position.x,
                y : position.y,
            }
        }
    }

    draw() {
        
        c.drawImage(this.image,this.position.x,this.position.y,this.width, this.height);
        
    }

    update ({velocity})
    {
        if(this.image){
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }

    shoot(InvaderProjectiles)
    {
        InvaderProjectiles.push(new InvaderProjectile({
            position : 
            {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height,
            },
            velocity : 
            {
                x : 0,
                y : 5,
            }
        }))
        
    }
}

//Create a GRID INVADER CLASS
class Grid
{
    constructor()
    {
        this.position =
        {
            x: 0,
            y: 0,
        }

        this.velocity = 
        {
            x: 3,
            y: 0
        }

        this.invader = 
        [
            
        ]

        const rows = Math.floor(Math.random() * 5 + 2);
        const colums = Math.floor(Math.random() * 10 + 2);

        this.width = colums * 30;

        for (let x=0; x < rows; x++){

            for (let y=0; y < colums; y++){
                this.invader.push(
                    new Invader({
                        position : {
                            x: x * 30,
                            y: y * 30,
                        }
                    })
                )
            }
        }
        // console.log(this.invader);
    }

    update ()
    {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0; 

        if(this.position.x + this.width >= canvas.width || this.position.x <= 0)
        {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 20;
        }
    }
}
const projectile = [];

const player = new Player();
const grids = [];
const invaderProjectile = [];
const particles = [];
const keys = 
{
    a: {
        pressed : false
    },
    d: {
        pressed : false
    },
    space: {
        pressed : false
    }
}



let frames = 0;
let randomInterval = Math.floor((Math.random() * 500) + 500);
let game = 
{
    over : false,
    active : true,
}

let scoreRecord = 0;

            for(let i = 0; i < 100; i++){
            particles.push(new Particle(
            {  
            position : {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            },

            velocity : 
            {
            x : 0,
            y : 2,
            },

            radius : Math.random() * 2,

            color: "white",
        })
    )
}

function createParticles({object, color, fades})
{
        for(let i = 0; i < 15; i++){
            particles.push(new Particle(
        {  
        position : 
        {
            x: object.position.x + object.width / 2,
            y: object.position.y + object.height / 2,
        },

        velocity : 
        {
            x : (Math.random() - .5) * 2,
            y : (Math.random() - .5) * 2,
        },

        radius : Math.random() * 3,

        color: color || '#BAA0DE',
        fades : true,
    })
        )
    }
}

function animate ()
{
    if (!game.active) return
    requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0,0,canvas.width, canvas.height);
    player.update();
    particles.forEach((particle, i) => 
        {
            if(particle.position.y - particle.radius >= canvas.height)
            {
                particle.position.x = Math.random() * canvas.width;
                particle.position.y = -particle.radius;
            }
            if(particle.opacity <= 0)
            {
                setTimeout(() => 
                {
                    particles.splice(i, 1);
                }, 0)
            }else {
                particle.update();
            }

        })

    // console.log(particles)
    invaderProjectile.forEach((invaderProjectiles, index) => 
    {   
        if (invaderProjectiles.position.y + invaderProjectile.height >= canvas.height)
        {

            setTimeout(() => {
                invaderProjectile.splice(index, 1)
            }, 0);
        }else 
        {
            invaderProjectiles.update();
        }
        //projectile hits player 
        if(invaderProjectiles.position.y + invaderProjectiles.height 
            >= 
            player.position.y && 
            invaderProjectiles.position.x + invaderProjectiles.width 
            >= 
            player.position.x && 
            invaderProjectiles.position.x <= player.position.x + 
            player.width)
        {

            console.log("you lose");

            setTimeout(() => {
                invaderProjectile.splice(index, 1);
                player.opacity = 0;
                game.over = true;
            }, 0);

            setTimeout(() => {
                game.active = false;
            }, 2000);

            createParticles(
                {
                    object: player,
                    color: "white",
                    fades : true,
                })
        }
    });

    console.log(invaderProjectile);
    projectile.forEach(( projectiles , index) => 
        {
            if (projectiles.position.y + projectiles.radius <= 0)
            {
                setTimeout(() => {
                    projectile.splice(index, 1)
                }, 0);
            }else 
            {
                projectiles.update();
            }
            
        }
    )

    grids.forEach((grid, gridIndex) => {
        grid.update();

        //spawn projectiles
        if(frames % 100 === 0 && grid.invader.length > 0)
        {
            grid.invader[Math.floor(Math.random() * grid.invader.length)].shoot(invaderProjectile);
        }
        grid.invader.forEach((invader, i) => {
                invader.update({ velocity: grid.velocity });

                //projectiles hit enemies 
                projectile.forEach((projectiles, j) => {

                        if (projectiles.position.y - projectiles.radius <= 
                                invader.position.y + invader.height && 
                            projectiles.position.x + projectiles.radius >= 
                                invader.position.x && 
                            projectiles.position.x - projectiles.radius <= 
                                invader.position.x  + invader.width && 
                            projectiles.position.y + projectiles.radius >= 
                                invader.position.y
                            ) {

                            setTimeout(() => 
                            {
                                const invaderFound = grid.invader.find((invader2) => invader2 === invader);

                                const projectileFound = projectile.find((projectile2) => projectile2 === projectiles
                                )

                                // remove invader & projectile
                                if (invaderFound && projectileFound){
                                    scoreRecord +=100;
                                    score.textContent = scoreRecord; 
                                createParticles({
                                    object : invader,
                                    fades : true,
                                })
                                grid.invader.splice(i, 1);
                                projectile.splice(j, 1);

                                    if (grid.invader.length > 0 )
                                    { d
                                        const firstInvader = grid.invader[0];
                                        const lastInvader = grid.invader[grid.invader.length - 1];

                                        grid.width = 
                                        lastInvader.position.x - 
                                        firstInvader.position.x + 
                                        lastInvader.width;

                                        grid.position.x = firstInvader.position.x;
                                    }else 
                                    {
                                        grids.splice(gridIndex, 1);
                                    }

                                }
                            }, 0)
                        }
                    })
            })
    })

    if(keys.a.pressed && player.position.x >= 0)
    {
        player.velocity.x = -7;
        player.rotation = -0.15;

    } else if (keys.d.pressed && 
        player.position.x + player.width <= canvas.width)
    {
        player.velocity.x = 7;
        player.rotation = 0.15;
    }else
    {
        player.velocity.x = 0;
        player.rotation = 0;
    }

    // console.log(frames);
    //spawing enemies
    if (frames % randomInterval === 0)
    {
        grids.push(new Grid());
        randomInterval = Math.floor(Math.random()* 500 + 500);
        frames = 0;
        console.log(randomInterval);
    }

    //spawn projectile 
    frames++;
}


animate();

//para hacer moverse al jugador necesitamos el uso de eventos 
addEventListener('keydown', ({ key })=> 
{
    if(game.over) return 
    switch(key)
    {
        case 'a': 
            // console.log('left');
            keys.a.pressed = true;
        break;

        case 'd':
            // console.log('right');
            keys.d.pressed = true;
        break;

        case ' ':
            // // console.log('space');
            projectile.push(new Projectile({
            
                position : {
                    x: player.position.x + player.width / 2,
                    y: player.position.y,
                },

                velocity : {
                    x : 0,
                    y : -10
                }
            }));
            // console.log(projectile);
            break;
    }
})

addEventListener('keyup', ({ key })=> 
{
    switch(key)
    {
        case 'a': 
            // console.log('left');
            keys.a.pressed = false;
        break;

        case 'd':
            // console.log('right');
            keys.d.pressed = false;
        break;

        case ' ':
            // console.log('space');
        break;
    }
})