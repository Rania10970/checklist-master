<template>
    <v-app>
        <v-content>
            <v-container class="fill-height">
                <checklist />
            </v-container>
        </v-content>
    </v-app>
</template>

<!-- no scope for app.vue, style defined here is global for the app -->
<style>
html,
body {
    overflow-y: auto !important;
    height: 100%;
}

.page {
    width:80%;
    height:100%;
}
</style>

<script>
import Checklist from "./checklist.vue";

export default {
    name: "App",
    components: { Checklist }
};
</script>
