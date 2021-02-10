/*
    author: Simon Zhang
    Winter 2021
*/ 


import * as Matter from 'matter-js';

var colors = [
    "#fff200",
    "#fff200",
    "#ec1c24",
    "#0ed145",
    "#F038FF",
     "#3f48cc",
     "#70E4EF "
]

export const bordercolor =   {
    fillStyle: "#3f48cc",
} 

function getColor() {
    return colors[Math.round(Matter.Common.random(0,(colors.length -1)))]
}


export var width = window.innerWidth
export var height = window.innerHeight

//export var height = window.visualViewport !== null ?  window.visualViewport.height : window.innerHeight


export var border = 50

interface matterPhysics {
    engine: Matter.Engine,
    runner: Matter.Runner
    render: Matter.Render
    canvas: HTMLCanvasElement
    stop: () => void

}

export function createMin(){
    
    var Common = Matter.Common,
        Bodies = Matter.Bodies

    var x = Common.random(rel(40), rel(140))
    var y = Common.random(rel(10), rel(20))
    var sides = Math.round(Common.random(1, 8));


    var chamfer = null;

    return Bodies.polygon(x, y, sides, rel(4), { 
        chamfer: chamfer ,
        render: {
            fillStyle: getColor(),
            strokeStyle: "#3f48cc",
            lineWidth: rel(1)

        } 
    });

   
}

export function createHr(time: number) {
    var Common = Matter.Common,
        Bodies = Matter.Bodies

    var x = Common.random(rel(20), rel(80))
    var y = rel(20)

    var sides = Math.round(Common.random(1, 8));



    var chamfer = null;

    return Bodies.polygon(x, y, sides, rel(14), { 
        chamfer: chamfer,  
         render: {
            fillStyle: getColor(),
            strokeStyle: "#3f48cc",
            lineWidth: rel(1)

        } 
    });
    
}

export var init = (): matterPhysics  => {
    var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Common = Matter.Common,
    Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
    world = engine.world;

var canvas: HTMLCanvasElement = document.getElementById('world') as HTMLCanvasElement;

canvas.width = width;
canvas.height = height;

world.bounds ={ min: { 
    x: 0, 
    y: 0 }, max: { 
        x: width, 
        y:  height
    } }

// create renderer
var render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false,
        //showAngleIndicator: false
        //showAngleIndicator: true,
    }
});



Render.run(render);
//@ts-ignore
Render.setPixelRatio(render, 'auto')
// create runner
var runner = Runner.create();
Runner.run(runner, engine);



World.add(world, [

    //vertical walls
    Bodies.rectangle(width, height/2, border, height, { isStatic: true, render:bordercolor }),
    Bodies.rectangle(0, height/2, border, height, { isStatic: true, render: bordercolor })
]);


// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        //@ts-ignore
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

//mouse.pixelRatio = 1;
// keep the mouse in sync with rendering
//@ts-ignore
render.mouse = mouse;


// // fit the render viewport to the scene
// Render.lookAt(render, {
//     min: { x: 0, y: 0 },
//     max: { x: width, y: height}
// });
//  // add gyro control
//  var clamp = 90
//  var scale = 45
//  if (typeof window !== 'undefined') {
//     var updateGravity = function(event: DeviceOrientationEvent) {
//         var orientation = typeof window.orientation !== 'undefined' ? window.orientation : 0,
//             gravity = engine.world.gravity;
        
//         if (orientation === 0) {
//             gravity.x = Common.clamp(event.gamma, -clamp, clamp) / scale;
//             gravity.y = Common.clamp(event.beta, -clamp, clamp) / scale;
//         } else if (orientation === 180) {
//             gravity.x = Common.clamp(event.gamma, -clamp, clamp) / scale;
//             gravity.y = Common.clamp(-event.beta, -clamp, clamp) / scale;
//         } else if (orientation === 90) {
//             gravity.x = Common.clamp(event.beta, -clamp, clamp) / scale;
//             gravity.y = Common.clamp(-event.gamma, -clamp, clamp) / scale;
//         } else if (orientation === -90) {
//             gravity.x = Common.clamp(-event.beta, -clamp, clamp) / scale;
//             gravity.y = Common.clamp(event.gamma, -clamp, clamp) / scale;
//         }
//     };

    //window.addEventListener('deviceorientation', updateGravity);
//}
//engine.world.gravity.y = 2;

//@ts-ignore
mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
//@ts-ignore
mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
// context for MatterTools.Demo
return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function() {
        Matter.Render.stop(render);
        Matter.Runner.stop(runner);
    }
};
}


export function rel(percent: number) {
    let length = (width > height ? height :width)
    return Math.round(percent/100 *length );
  }

