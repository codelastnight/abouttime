/*
    author: Simon Zhang
    Winter 2021

*/ 

import 'normalize.css';
import '../scss/index.scss';

import * as mp from './matter';
import * as Matter from 'matter-js';



let isHourChange = false,
    isMinuteChange = false,
    updateBodiesChange = false,
    hourCounter = 0


interface state {
    hrCurrent: number
    hrs: Matter.Body[],
    hrsDif: number,
    mins: Matter.Body[]
    minsDif: number
    minsMax: number
}

var state: state = {
    hrs: [],
    mins: [],
    hrsDif: 0,
    minsDif: 0,
    hrCurrent: 1,
    minsMax: 0
}


function init() {
    var data = mp.init(),
        Body = Matter.Body,
        duration = 200,
        step = mp.height / duration,
        world = data.engine.world;
        
    var TopWall = Matter.Bodies.rectangle(mp.width/2, 0, mp.width, mp.border, { isStatic: true, render: mp.bordercolor })
    var BotWall = Matter.Bodies.rectangle(mp.width/2, mp.height, mp.width, mp.border, { isStatic: true, render: mp.bordercolor })
    
    let area = (mp.width - mp.border*2) * (mp.height - mp.border*2) 

    // how many smalls in an hour
    var smallsArea= (3*(mp.rel(5)**2))
    var largeArea = state.hrCurrent*3*(mp.rel(11)**2)
    state.minsMax = Math.round((area - largeArea) / smallsArea )

    Matter.World.add(world, [
        //vertical walls
        TopWall,
        BotWall
    ]);



    // do animations
    Matter.Events.on(data.engine, 'beforeUpdate', function(event) {
        if (isHourChange) {
            
            // move top wall down
            Body.setVelocity(TopWall, { x: mp.width/2, y: step*hourCounter - TopWall.position.y });
            Body.setPosition(TopWall, { x: mp.width/2, y: step*hourCounter });
            
            // move bottom wall down
            Body.setVelocity(BotWall, { x: mp.width/2, y: step*hourCounter - TopWall.position.y });
            Body.setPosition(BotWall, { x: mp.width/2, y: step*hourCounter });
            if (hourCounter > duration - ((mp.border / 2)/ step)) {
                Body.setPosition(BotWall, { x: mp.width/2, y: - mp.border / 2});
            }
            hourCounter += 1;

            // run at the end of animation
            if (hourCounter > duration) {
                isHourChange = false;
                hourCounter = 0;
                Body.setVelocity(TopWall, { x: 0, y: 0 });

                Body.setPosition(TopWall, { x: mp.width/2, y:0 })
                Body.setVelocity(BotWall, { x: 0, y: 0 });

                Body.setPosition(BotWall, { x: mp.width/2, y:mp.height})
                // garbage collection
                state.hrs.forEach((hr) => {
                    Matter.World.remove(world, hr);
                })
                state.mins.forEach((min) => {
                    Matter.World.remove(world, min);
                })
                // remove reference once done
                state.hrs = []
                state.mins = []
                isMinuteChange = true;
            }
            
        }

        

        // if min bodies needed, spawn them, and make sure the spawn happens after the clearing animation

        if (state.minsDif > 0) {
            if ( hourCounter == 0 || hourCounter >= duration ) {
                var newMin = mp.createMin()
                Matter.World.add(world,newMin)
                state.mins.push(newMin)
                state.minsDif -= 1
            }
           
        }else if(state.minsDif < 0) {
            var toRemove = state.mins.pop()
            Matter.World.remove(world, toRemove);
            state.hrsDif += 1

        }

        // if hr bodies needed, spawn them, and make sure the spawn happens after the clearing animation
        if (state.hrCurrent - state.hrs.length > 0 && hourCounter == 0) {
            var newHr = mp.createHr(state.hrCurrent)
            Matter.World.add(world,newHr)
            state.hrs.push(newHr)
            state.hrsDif -= 1
        } else if(state.hrCurrent - state.hrs.length < 0) {
            var toRemove = state.hrs.pop()
            Matter.World.remove(world, toRemove);
            state.hrsDif += 1

        }
    })

}


let prevSecs = 300;
let prevHrs = 300;

function triggerHrs(hrs:number) {
    console.log("hr")
    prevHrs = hrs
    if (hrs == 0) {
        hrs = 12;
      } else if (hrs > 12) {
        hrs = hrs - 12;
    }
    state.hrsDif = hrs - state.hrs.length
    state.hrCurrent = hrs;
    isHourChange = true
}

function triggerMins(mins: number, secs:number) {
    let amount =   Math.round(((mins*60 + secs) / 3600) * state.minsMax)
    state.minsDif = amount - state.mins.length
    console.log(amount, state.minsDif)
    isMinuteChange = true;
    prevSecs = secs
}

(window as any).testrigger = function testrigger() {
    isHourChange = true;

    state.hrsDif = state.hrCurrent - state.hrs.length
    console.log(state)
};

(window as any).appState = state;

function clock () {
    let date = new Date();
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    let period = "AM"
    // run every second
    if (prevSecs !== secs ) {
        triggerMins(mins, secs)
        
    }

    if (state.mins.length == 0) {
        triggerMins(mins, secs)

    }
    // run every hour
    if (prevHrs !== hrs) {
        triggerHrs(hrs)

    }
    
  };


init()

var messages = [
    "hey",
    "whats good dave (or johnathan idk who looks at this)",
    "this is my clock",
    "clocks are devices that tell time",
    "the big shapes tell the hour",
    "the little shapes fill up the remaining space as a % of the hour",
    "pretty visual right",
    "you can drag the shapes around btw",
    "well thats all i got",
    "lol",
    "~simon",
    ""
]

var i = setInterval(clock, 600)

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function displayText() {
    for (var i =0; i < messages.length; i++) {
        document.getElementById("displaytext").innerText = messages[i];
        await sleep(4000);
    }
}

displayText()


