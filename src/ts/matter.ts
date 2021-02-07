import * as Matter from 'matter-js';


var width = window.innerWidth
var height = window.innerHeight
var border = 50

interface matterPhysics {
    engine: Matter.Engine,
    runner: Matter.Runner
    render: Matter.Render
    canvas: HTMLCanvasElement
    stop: () => void

}

export function create(x: number,y: number){
    var Common = Matter.Common,
        Bodies = Matter.Bodies

    var sides = Math.round(Common.random(1, 8));

    // triangles can be a little unstable, so avoid until fixed
    sides = (sides === 3) ? 4 : sides;

    // round the edges of some bodies
    var chamfer = null;
    if (sides > 2 && Common.random() > 0.7) {
        chamfer = {
            radius: 10
        };
    }

    switch (Math.round(Common.random(0, 1))) {
    case 0:
        if (Common.random() < 0.8) {
            return Bodies.rectangle(x, y, Common.random(25, 50), Common.random(25, 50), { chamfer: chamfer });
        } else {
            return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(25, 30), { chamfer: chamfer });
        }
    case 1:
        return Bodies.polygon(x, y, sides, Common.random(25, 50), { chamfer: chamfer });
    }
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

// add bodies
var stack = Composites.stack(20, 20, 10, 5, 0, 0, function(x:number, y:number) {
  return create(x,y);
});

World.add(world, stack);

World.add(world, [
    // walls
    Bodies.rectangle(width/2, 0, width, border, { isStatic: true }),
    Bodies.rectangle(width/2, height, width, border, { isStatic: true }),
    Bodies.rectangle(width, height/2, border, height, { isStatic: true }),
    Bodies.rectangle(0, height/2, border, height, { isStatic: true })
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

// keep the mouse in sync with rendering
//@ts-ignore
render.mouse = mouse;
// // fit the render viewport to the scene
// Render.lookAt(render, {
//     min: { x: 0, y: 0 },
//     max: { x: 800, y: 600 }
// });
 // add gyro control
 var clamp = 90
 var scale = 45
 if (typeof window !== 'undefined') {
    var updateGravity = function(event: DeviceOrientationEvent) {
        var orientation = typeof window.orientation !== 'undefined' ? window.orientation : 0,
            gravity = engine.world.gravity;

        if (orientation === 0) {
            gravity.x = Common.clamp(event.gamma, -clamp, clamp) / scale;
            gravity.y = Common.clamp(event.beta, -clamp, clamp) / scale;
        } else if (orientation === 180) {
            gravity.x = Common.clamp(event.gamma, -clamp, clamp) / scale;
            gravity.y = Common.clamp(-event.beta, -clamp, clamp) / scale;
        } else if (orientation === 90) {
            gravity.x = Common.clamp(event.beta, -clamp, clamp) / scale;
            gravity.y = Common.clamp(-event.gamma, -clamp, clamp) / scale;
        } else if (orientation === -90) {
            gravity.x = Common.clamp(-event.beta, -clamp, clamp) / scale;
            gravity.y = Common.clamp(event.gamma, -clamp, clamp) / scale;
        }
    };

    window.addEventListener('deviceorientation', updateGravity);
}
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