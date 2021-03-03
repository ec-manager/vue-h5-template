import Slide3d from './slide3d/index.vue';
import Slide from './slide/index.vue';

const install = (Vue) => {
    Vue.component('slide3d', Slide3d);
    Vue.component('slide', Slide);
};

export default {
    install
};

export {
    Slide3d,
    Slide
};
