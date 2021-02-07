import 'normalize.css';

import '../scss/index.scss';

import * as matterPhysics from './matter';




function init() {
    var data = matterPhysics.init();

    var world = data.engine.world;


}

init()