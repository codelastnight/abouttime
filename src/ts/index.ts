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
    hrCurrent: 0
}


function init() {
    var data = matterPhysics.init(),
        Body = Matter.Body,
        duration = 300,
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
        }
        if (isMinuteChange) {

        }
        if (updateBodiesChange) {
            matterPhysics.createHr(state.hrCurrent)
        }
    })

}

init()

let prevMins = 0;
let prevHrs = 0;
let clock = () => {
    let date = new Date();
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let period = "AM"
    // run every minute
    if (prevMins != mins ) {
        console.log("a min has passed")
        state.minsDif = mins - state.mins.length
        isMinuteChange = true;

    }
    // run every hour
    if (prevHrs != hrs) {
        if (hrs == 0) {
            hrs = 12;
          } else if (hrs >= 12) {
            hrs = hrs - 12;
            period = "PM"
        }
        state.hrsDif = hrs - state.hrs.length
        state.hrCurrent = hrs;
        isHourChange = true

    }
   
    prevMins = mins
    prevHrs = hrs
    // check every 3 seconds
    setTimeout(clock, 3000);
  };

function toggleHr() {
    isHourChange = true;
}
toggleHr()