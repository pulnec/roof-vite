import config from '../config/config.json';

const evtRoof = async (action) => {  
    const roofs = [];

    const eventRoof = (id) => {
        fetch(`http://${id}/${action}`)
    }

    config.roof.forEach((el) => {
        roofs.push(eventRoof(el, 'open'));
    });

    const result = Promise.allSettled(roofs);

    console.log(result);
}

export {
    evtRoof
}