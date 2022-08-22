const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let score_value = document.getElementById('score_number')
const start_button = document.getElementById('start_button')
const menu_element = document.getElementById('user_interface')
const final_score_tag = document.getElementById('final_score_tag')
const final_score_number = document.getElementById('points_text')
const score_board = document.getElementById('container')

normal_face = new Image()
normal_face.src = 'normal.png'
attack_face = new Image()
attack_face.src = 'attack.png'
zombie_face = new Image()
zombie_face.src = 'zombie.png'

let beginning_sound = new Audio('start.mp3')
let death_sound = new Audio('deathsound.mp3')
let zombie_sound = new Audio('zomsound.mp3')
zombie_sound.volume = 0.09;
let knife_sound = new Audio('knife.mp3')
let gun_sound = new Audio('gun.mp3')
let bomb_sound = new Audio('bomb.mp3')

let current_face = normal_face;

const canvas_data = canvas.getContext('2d')

let now = false;
let score = 0
let bullet_coordinates = []
let should_shoot = false;

class MainPlayer{
    constructor(x, y, r, color, image){
        this.x = x
        this.y = y
        this.r = r
        this.color = color
        this.image = image;
    }
    initiliaze_player(){
        canvas_data.beginPath()
        canvas_data.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
        canvas_data.drawImage(this.image, this.x-2.58*this.r, this.y-2.16*this.r, 5.4*this.r, 3.6*this.r)
        //canvas_data.fillStyle = this.color
        canvas_data.fill()
    }

    update_player(new_image){this.image = new_image;}

}

let first_player = new MainPlayer(window.innerWidth/2, window.innerHeight/2, 36, "rgb(255,255,255)", current_face)
first_player.initiliaze_player()

let death_array = []
class Death{
    constructor(x, y, vx, vy){this.x = x; this.y = y; this.vx = vx; this.vy = vy}

    initiliaze_death(){
        canvas_data.beginPath()
        canvas_data.arc(this.x, this.y, 2, 0, Math.PI * 2, true)
        canvas_data.fillStyle = 'red'
        canvas_data.fill()
    }
    update(){
        this.initiliaze_death()
        this.x = this.x + this.vx
        this.y = this.y + this.vy 
    }


    }


class Bullet{
    constructor(x_pos, y_pos, radius, velocity, color){
        this.x = x_pos
        this.y = y_pos
        this.r = radius
        this.v = velocity
        this.color = color
    }
    initiliaze_bullet(){
        canvas_data.beginPath()
        canvas_data.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
        canvas_data.fillStyle = this.color
        canvas_data.fill()
    }
    update(){
        this.initiliaze_bullet()
        this.x = this.x + this.v.x
        this.y = this.y + this.v.y
    }
}

class Enemies{
    constructor(x_pos, y_pos, radius, velocity, color){
        this.x = x_pos
        this.y = y_pos
        this.r = radius
        this.v = velocity
        this.color = color
        this.initial_r = radius
    }
    initiliaze_enemies(){
        canvas_data.beginPath()
        canvas_data.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
        canvas_data.fillStyle = this.color;
        canvas_data.fill()
        canvas_data.drawImage(zombie_face, this.x-1.5*this.r, this.y-1.2*this.r, 3.6*this.r, 3*this.r)
    }
    update(){
        this.initiliaze_enemies()
        this.x = this.x + this.v.x
        this.y = this.y + this.v.y
    }

    update_angle(new_x, new_y){
        this.v.x = new_x;
        this.v.y = new_y;
    }

}
let enemy_list = []
x_flag = false

function spawnEnemies(){
    setInterval(()=>{
        zombie_green = "rgba(0,120,0,0.6)";
        zombie_purple = "rgba(60,0,90,0.6)";
        zombie_color = [zombie_green, zombie_purple, zombie_green, zombie_green]
        random_color = Math.floor(Math.random()*3)
        color = zombie_color[random_color];
        
        x = Math.floor(Math.random()*window.innerWidth) 
        if (x>window.innerWidth/2){x = x + window.innerWidth/3}
        else{x = x - innerWidth/3}
        if (x > (0.95*window.innerWidth) || x < 0.05*window.innerWidth){
            x_value = x
            x_flag = true}

        y_value = Math.floor(Math.random()*window.innerHeight)
        if (y_value > window.innerHeight*0.95 || y_value < window.innerHeight*0.05){
            x_value = Math.floor(Math.random()*window.innerWidth)
        }

        if (x_flag){
        angle = Math.atan2(y_value - first_player.y, x_value - first_player.x)
        velocity = {x: -Math.cos(angle)/2  , y: -Math.sin(angle)/2}
        radiuss = Math.floor(Math.random()*42) + 12
        enemy_list.push(new Enemies(x_value, y_value, radiuss, velocity, color))
        console.log(enemy_list)
        x_flag = false}

    }, 900)}
    

const friction = 0.984
let particle_list = []
class Particle{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1
    }
    initiliaze_particles(){
        canvas_data.save()
        canvas_data.beginPath()
        canvas_data.globalAlpha = this.alpha
        canvas_data.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
        canvas_data.fillStyle = this.color
        canvas_data.fill()
        canvas_data.restore()
    }
    update(){
        this.initiliaze_particles()
        this.velocity.x = this.velocity.x * friction
        this.velocity.y = this.velocity.y * friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha = this.alpha - 0.006
    }

}


let animationframe
function Animate(){
    animationframe = requestAnimationFrame(Animate)
    //canvas_data.clearRect(0, 0, window.innerWidth, window.innerHeight)
    canvas_data.fillStyle = "rgba(0,0,0, 0.06)"
    canvas_data.fillRect(0, 0, window.innerWidth, window.innerHeight)
    first_player.initiliaze_player()
    score_value.textContent = score.toFixed(2).toString() + "$";
    first_player.update_player(current_face);
   
    first_player.color = "rgb(255" + "," + (Math.floor(255-score/4)).toString() + ","  + (Math.floor(255-score/4)).toString() + ')'
    particle_list.forEach((Particle, particle_index) => {if(Particle.alpha>0){Particle.update()} else{particle_list.splice(particle_index, 1)}})
    bullet_coordinates.forEach((Bullet, indexx) => {Bullet.update(); if(Bullet.x-Bullet.r<0 || Bullet.x - Bullet.r> window.innerWidth || Bullet.y-Bullet.r<0 || Bullet.y - Bullet.r> window.innerHeight){setTimeout(()=>{bullet_coordinates.splice(indexx, 1)},0.1)}})

    if(UpKey && first_player.y - first_player.r > 0){first_player.y -= 4.8;}
    if(DownKey && first_player.y + first_player.r < window.innerHeight){first_player.y += 4.8;}
    if(LeftKey && first_player.x - first_player.r > 0){first_player.x -= 4.8;}
    if(RightKey && first_player.x + first_player.r < window.innerWidth){first_player.x += 4.8;}

    if(enemy_list.length > 8){current_face = attack_face;}
    else{current_face = normal_face;}

    enemy_list.forEach((Enemies, enemy_index) => {
        Enemies.update()
        new_angle = Math.atan2(Enemies.y - first_player.y, Enemies.x - first_player.x)
        new_velocity = {x: -Math.cos(new_angle)/2  , y: -Math.sin(new_angle)/2}
        Enemies.update_angle(new_velocity.x, new_velocity.y);

        safe_distance = Math.hypot(first_player.x - Enemies.x, first_player.y - Enemies.y)

            if (safe_distance < first_player.r + Enemies.r && is_knife<=0){ should_shoot = false;
                 for (let k=0; k<60; k++){death_array.push(new Death(first_player.x, first_player.y, (Math.random()-0.5)*12, (Math.random()-0.5)*12))}
                 death_array.forEach((Death) => Death.update())
                 should_shoot = false;
                 UpKey = false; DownKey = false; LeftKey = false; RightKey = false;
                first_player.color = 'red'
                death_sound.play();
                setTimeout(() => {
                cancelAnimationFrame(animationframe); 
                enemy_list = [];
                document.getElementById('extra_items').style.visibility = 'hidden';
                menu_element.style.visibility = 'visible';
                start_button.textContent = "RESTART"
                final_score_tag.textContent = 'Final Score:'
                final_score_number.style.visibility = 'visible'
                final_score_number.textContent = score.toFixed(2)}, 900)

            }
            if(safe_distance < first_player.r + Enemies.r && is_knife>0){enemy_list.splice(enemy_index, 1); is_knife -= 1; 
                knife_button.innerText = "Knife (" + is_knife.toString() + ")"; 
                score = score + 6;
                if(is_knife == 0){ knife_button.innerText = "Knife";}
                for (let i=0; i<(Math.floor(Enemies.initial_r)/6) + 6; i++){particle_list.push( new Particle(Enemies.x, Enemies.y, Math.random()*3, Enemies.color, {x: (Math.random()-0.5)*Enemies.initial_r/3, y: (Math.random()-0.5)*Enemies.initial_r/3} )) 
            }
            }



        bullet_coordinates.forEach((Bullet, bullet_index) => {
            distance = Math.hypot(Bullet.x - Enemies.x, Bullet.y - Enemies.y)
            if (distance < Enemies.r + Bullet.r + 2){setTimeout(() => {bullet_coordinates.splice(bullet_index, 1)}, 0.1); score = score + 0.6; 
                if (Enemies.r > bullet_size + 6){gsap.to(Enemies, {r : Enemies.r - bullet_size})}
                else{setTimeout(()=>{enemy_list.splice(enemy_index, 1)},0.1); score = score + 12; 
                    zombie_sound.play();
                    for (let i=0; i<(Math.floor(Enemies.initial_r)/6) + 6; i++){particle_list.push( new Particle(Enemies.x, Enemies.y, Math.random()*3, Enemies.color, {x: (Math.random()-0.5)*Enemies.initial_r/3, y: (Math.random()-0.5)*Enemies.initial_r/3} )) 
                }

            }
            }
        })
    })

    
}

start_button.addEventListener('click', function(){
    if (start_button.textContent == "START"){
        beginning_sound.play();
        document.getElementById('extra_items').style.visibility = 'visible';
        enemy_list = [];
        Animate();
        spawnEnemies();
        menu_element.style.visibility = 'hidden';
        score_board.style.visibility = 'visible';
        should_shoot = true;
        

    }

    if (start_button.textContent == "RESTART"){
        beginning_sound.play();
        document.getElementById('extra_items').style.visibility = 'visible';
        canvas_data.clearRect(0, 0, window.innerWidth, window.innerHeight)
        enemy_list = []
        death_array = []
        bullet_coordinates = []
        score = 0;
        bullet_size = 6;
        knife_button.innerText = "Knife";
        is_knife = false;
        particle_list = []
        first_player = new MainPlayer(window.innerWidth/2, window.innerHeight/2, 36, "rgb(255,255,255)", current_face)
        x_flag = false;
        Animate();
        //spawnEnemies();
        menu_element.style.visibility = 'hidden';
        final_score_number.style.visibility = 'hidden'
        should_shoot = true;
      

    }
})

let bullet_size = 6;
window.addEventListener('click', function(event){
    if (should_shoot == true){
        angle = Math.atan2(event.clientY - first_player.y, event.clientX - first_player.x)
        bullet_coordinates.push(new Bullet(first_player.x, first_player.y, bullet_size, {x: Math.cos(angle)*8  , y: Math.sin(angle)*8}, "rgb(240,240,240)"))}
    })

let LeftKey = false;
let RightKey = false;
let UpKey = false;
let DownKey = false;

    addEventListener('keydown', (event)=>{
        if (should_shoot == true){
        switch(event.code){
            case 'ArrowLeft':
                LeftKey = true;
                break;
            case 'ArrowRight':
               RightKey = true;
                break;
            case 'ArrowUp': 
                UpKey = true;
                break;
            case 'ArrowDown':
                DownKey = true;
                break;
        }}
        })


     addEventListener('keyup', (event)=>{
        if (should_shoot == true){
        switch(event.code){
            case 'ArrowLeft':
                LeftKey = false;
                break;
            case 'ArrowRight':
               RightKey = false;
                break;
            case 'ArrowUp': 
                UpKey = false;
                break;
            case 'ArrowDown':
                DownKey = false;
                break;
            }}
        })


is_knife = 0;

const knife_button = document.getElementById('knife');   
const gun_button = document.getElementById('better_gun'); 
const other_button = document.getElementById('faster'); 


knife_button.addEventListener('click', ()=>{
    if(score > 100){
        knife_sound.play();
        is_knife += 1;
        score = score - 100;
        knife_button.innerText = "Knife (" + is_knife.toString() + ")"
    }
})


gun_button.addEventListener('click', ()=>{
    if(score > 240){
        gun_sound.play();
        bullet_size += 1.8;
        score = score - 240;
    }
})

other_button.addEventListener('click', ()=>{
    if(score > 300){
        bomb_sound.play();
        enemy_list.forEach((Enemies) => {
        for (let i=0; i<(Math.floor(Enemies.initial_r)/6) + 6; i++){particle_list.push( new Particle(Enemies.x, Enemies.y, Math.random()*3, Enemies.color, {x: (Math.random()-0.5)*Enemies.initial_r/3, y: (Math.random()-0.5)*Enemies.initial_r/3} )) 
    }})
    enemy_list = [];
    score = score - 300;
    }
})