/*
    author: Simon Zhang
    Winter 2021

*/ 

import 'normalize.css';
import '../scss/index.scss';

import * as matterPhysics from './matter';
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
}

var state: state = {
    hrs: [],
    mins: [],
    hrsDif: 0,
    minsDif: 0,
    hrCurrent: 1
}


function init() {
    var data = matterPhysics.init(),
        Body = Matter.Body,
        duration = 200,
        step = matterPhysics.height / duration,
        world = data.engine.world;
        
    var TopWall = Matter.Bodies.rectangle(matterPhysics.width/2, 0, matterPhysics.width, matterPhysics.border, { isStatic: true })
    var BotWall = Matter.Bodies.rectangle(matterPhysics.width/2, matterPhysics.height, matterPhysics.width, matterPhysics.border, { isStatic: true })

    Matter.World.add(world, [
        //vertical walls
        TopWall,
        BotWall
    ]);
    // do animations
    Matter.Events.on(data.engine, 'beforeUpdate', function(event) {
        if (isHourChange) {
            
            // move top wall down
            Body.setVelocity(TopWall, { x: matterPhysics.width/2, y: step*hourCounter - TopWall.position.y });
            Body.setPosition(TopWall, { x: matterPhysics.width/2, y: step*hourCounter });
            
            // move bottom wall down
            Body.setVelocity(BotWall, { x: matterPhysics.width/2, y: step*hourCounter - TopWall.position.y });
            Body.setPosition(BotWall, { x: matterPhysics.width/2, y: step*hourCounter });
            if (hourCounter > duration - ((matterPhysics.border / 2)/ step)) {
                Body.setPosition(BotWall, { x: matterPhysics.width/2, y: - matterPhysics.border / 2});
            }
            hourCounter += 1;

            // run at the end of animation
            if (hourCounter > duration) {
                isHourChange = false;
                hourCounter = 0;
                Body.setPosition(TopWall, { x: matterPhysics.width/2, y:0 })
                Body.setPosition(BotWall, { x: matterPhysics.width/2, y:matterPhysics.height})
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
            }
            // if hr bodies needed, spawn them, and make sure the spawn happens after the clearing animation
            if (state.hrsDif > 0 && hourCounter == 0) {
                var newHr = matterPhysics.createHr(state.hrCurrent)
                Matter.World.add(world,newHr)
                state.hrs.push(newHr)
                state.hrsDif -= 1
            } else if(state.hrsDif < 0) {
                var toRemove = state.hrs.pop()
                Matter.World.remove(world, toRemove);
                state.hrsDif += 1

            }
        }

        

        // if min bodies needed, spawn them, and make sure the spawn happens after the clearing animation

        if (state.minsDif > 0 && hourCounter == 0) {
            var newMin = matterPhysics.createMin()
            Matter.World.add(world,newMin)
            state.mins.push(newMin)
            state.minsDif -= 1
        }else if(state.minsDif < 0) {
            var toRemove = state.mins.pop()
            Matter.World.remove(world, toRemove);
            state.hrsDif += 1

        }
    })

}


let prevMins = 300;
let prevHrs = 300;
function clock () {
    let date = new Date();
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let period = "AM"
    // run every minute
    if (prevMins !== mins ) {
        state.minsDif = mins - state.mins.length
        isMinuteChange = true;
        prevMins = mins
        console.log(state)
    }

    // run every hour
    if (prevHrs !== hrs) {
        console.log("hr")
        prevHrs = hrs
        if (hrs == 0) {
            hrs = 12;
          } else if (hrs >= 12) {
            hrs = hrs - 12;
            period = "PM"
        }
        state.hrsDif = hrs - state.hrs.length
        state.hrCurrent = hrs;
        isHourChange = true
        console.log(state)

    }
    
  };


init()


var i = setInterval(clock, 3000)

//toggleHr()

