import { widget, disableDefaultCSS } from "@widget-lab/3ddashboard-utils";
import Vue from "vue";
import App from "./components/app.vue";
import vuetify from "./plugins/vuetify";

function start() {
    disableDefaultCSS(true);

    const mainComponent = new Vue({
        vuetify,
        render: h => h(App)
    });

    mainComponent.$mount("app");
}
widget.addEvent("onLoad", () => {
    start();
});
