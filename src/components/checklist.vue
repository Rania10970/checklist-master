<template>
    <div class="page">
        <v-dialog v-model="initialConfigurationDialog" width="700" overlay-opacity="0.8">
            <v-card v-if="initialConfigurationDialog">
                <v-toolbar elevation="2" color="#005686" dark>
                    <v-toolbar-title>New Checklist</v-toolbar-title>
                </v-toolbar>
                <v-text-field
                    v-model="checklistTitle"
                    solo
                    label
                    color="#005686"
                    filled
                    hidedetails
                    placeholder="Type a Checklist title"
                    class="mt-5 mx-4 h1 font-weight-bold"
                    @keyup.enter="turnPage(checklistTitle)"
                />
            </v-card>
        </v-dialog>
        <v-toolbar elevation="0">
            <v-toolbar-title>
                <v-text-field
                    v-model="checklistTitle"
                    hide-details
                    single-line
                    solo
                    flat
                    placeholder="[Checklist Title]"
                    color="#005686"
                    class="text-h6 font-weight-bold"
                    @keyup.enter="updateTitle(checklistTitle)"
                    @focus.stop="updateTitle(checklistTitle)"
                />
            </v-toolbar-title>
            <v-spacer />
            <v-dialog v-model="dialog" width="600">
                <template #activator="{ on, attrs }">
                    <v-btn icon>
                        <v-icon class="ma-0" color="#B4B6BA" medium v-bind="attrs" small v-on="on">mdi-cog</v-icon>
                    </v-btn>
                </template>
                <v-card min-width="580" min-height="400">
                    <v-tabs background-color="#F9F9F9" color="#005686" prev-icon="mdi-arrow-left-bold-box-outline">
                        <v-tab>
                            <v-icon left small>mdi-cog</v-icon>
                            Settings
                        </v-tab>
                        <v-tab>
                            <v-icon left small>mdi-rocket-launch</v-icon>
                            Coming
                        </v-tab>
                        <v-tab>
                            <v-icon left small>mdi-information</v-icon>
                            About
                        </v-tab>

                        <v-tab-item>
                            <v-card flat class="px-5">
                                <v-container fluid>
                                    <v-row>
                                        <v-col>
                                            Background Color:
                                            <v-btn class="ml-3" small :color="widgetBackgroundColor" dark dense @click.stop="colorPickerDialog = true">
                                                Change
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-divider class="my-5" left />
                                    <v-row>
                                        <v-col>
                                            Delete ALL items:
                                            <v-btn class="ml-3" small color="#005686" dark dense @click.stop="deleteAll">
                                                <v-icon left small class="p-1 border border-1" color="white">mdi-bomb</v-icon> Start Fresh !
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <v-dialog v-model="colorPickerDialog" max-width="290" persistent>
                                    <v-color-picker v-model="widgetBackgroundColor" elevation="3" />
                                    <v-btn color="#005686" dark @click="colorPickerDialog = false" @click.stop="updateBackgroundColor(widgetBackgroundColor)">
                                        Apply
                                    </v-btn>
                                </v-dialog>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat>
                                <v-card-title class="mt-5 ml-2 mb-0"> In Work </v-card-title>
                                <v-list two-line subheader class="ml-5 mt-0">
                                    <v-list-item>
                                        <v-list-item-icon class="mx-1">
                                            <v-icon color="#CC092F" small>mdi-fire</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Custom Tags</v-list-item-title>
                                            <v-list-item-subtitle>Create & apply your colored custom tags to the items</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-icon class="mx-1">
                                            <v-icon color="#CC092F" small>mdi-fire</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Shortcuts</v-list-item-title>
                                            <v-list-item-subtitle>Keep your hands on the keyboard</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-icon class="mx-1">
                                            <v-icon color="#005686" x-small>mdi-checkbox-blank-circle</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Pin Items</v-list-item-title>
                                            <v-list-item-subtitle>Keep them on top</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                                <v-dialog v-model="colorPickerDialog" max-width="290" persistent>
                                    <v-color-picker v-model="widgetBackgroundColor" elevation="3" />
                                    <v-btn color="#005686" dark @click="colorPickerDialog = false" @click.stop="updateBackgroundColor(widgetBackgroundColor)">
                                        Apply
                                    </v-btn>
                                </v-dialog>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                </v-card>
            </v-dialog>
        </v-toolbar>
        <v-toolbar elevation="1" color="#F9F9F9">
            <v-toolbar-title class="addItemToolbar">
                <v-text-field
                    v-model="newItemTitle"
                    hide-details
                    single-line
                    color="#005686"
                    class="addItemToolbar font-weight-bold"
                    autofocus
                    @keypress.enter="add(newItemTitle)"
                >
                    <template slot="prepend">
                        <v-icon size="23">mdi-plus </v-icon>
                    </template>
                </v-text-field>
            </v-toolbar-title>
        </v-toolbar>
        <v-data-table
            dense
            disable-pagination
            :headers="headers"
            hide-default-footer
            hide-default-header
            :items="getItems(true)"
            :mobile-breakpoint="0"
            class="elevation-1 activeTable"
            style="height:{getTableHeight}"
        >
            <!-- TITLE -->
            <template #item.title="{ item }">
                <v-text-field
                    v-model="item.title"
                    hide-details
                    single-line
                    solo
                    flat
                    dense
                    class="py-2 font-weight-regular"
                    @keyup.enter="updateItem"
                    @focus.stop="updateItem"
                >
                    <template slot="prepend">
                        <v-hover>
                            <v-container slot-scope="{ hover }" class="m-0 my-0 pa-0" @click="closeItem(item)">
                                <v-icon v-if="hover" color="#005686" medium size="26" class="mx-0 mr-1">mdi-checkbox-marked-outline</v-icon>
                                <v-icon v-else color="#77797C" medium size="26" class="mx-0 mr-1">mdi-checkbox-blank-outline</v-icon>
                            </v-container>
                        </v-hover>
                    </template>
                </v-text-field>
            </template>
            <template #no-data>
                <v-text-field
                    hide-details
                    single-line
                    solo
                    flat
                    dense
                    placeholder="Nothing here, start adding items up there"
                    disabled
                    class="ma-2 font-weight-bold"
                />
            </template>
        </v-data-table>
        <v-toolbar color="white" class="mt-10" dense @click="showClosedItems = !showClosedItems">
            <v-icon color="#77797C" size="22" class="mr-3">mdi-checkbox-marked-outline</v-icon>
            <v-toolbar-title class="text-subtitle-1 font-weight-bold" style="color: #77797c">Closed Items </v-toolbar-title>
            <v-icon class="ml-2" color="#77797C">mdi-chevron-down</v-icon>
        </v-toolbar>
        <v-expand-transition>
            <v-data-table
                v-show="showClosedItems"
                dense
                :headers="headers"
                hide-default-footer
                hide-default-header
                :mobile-breakpoint="0"
                :items="getItems(false)"
                class="elevation-1"
            >
                <!-- TITLE -->
                <template #item.title="{ item }">
                    <v-text-field v-model="item.title" hide-details single-line solo flat dense class="py-2 font-weight-medium" disabled>
                        <template slot="prepend">
                            <v-icon color="#77797C" size="22" @click="reOpenItem(item)">mdi-checkbox-marked-outline</v-icon>
                        </template>
                    </v-text-field>
                </template>
                <template #no-data>
                    <v-text-field hide-details single-line solo flat dense class="py-2" disabled>fd</v-text-field>
                </template>
            </v-data-table>
        </v-expand-transition>
    </div>
</template>

<style scoped>
.v-data-table >>> .v-input__slot {
    padding-left: 8px !important;
}
.v-toolbar :hover {
    cursor: pointer;
}

.v-card :hover {
    cursor: pointer;
}
.v-data-table.activeTable /deep/ tbody /deep/ tr:hover:not(.v-table__expanded__content) {
    background: #fbfbfb !important;
    cursor: pointer;
}

.v-data-table.activeTable /deep/ tbody /deep/ tr:hover:not(.v-table__expanded__content) input:focus {
    color: #005686;
    font-weight: 700;
}
.v-data-table.activeTable /deep/ tbody /deep/ tr:not(.v-table__expanded__content) input:hover {
    color: #3d3d3d;
}

.v-data-table.activeTable /deep/ tbody /deep/ tr:hover:not(.v-table__expanded__content) .showIcon {
    color: #b4b6ba !important;
}

.v-data-table.activeTable /deep/ tbody /deep/tr:hover:not(.v-table__expanded__content) .showIcon:hover {
    color: #005686 !important;
}

.addItemToolbar {
    height: 40px !important;
    width: 70% !important;
    color: #005686 !important;
}

.v-data-table >>> tbody >>> tr:not(.v-table__expanded__content) input {
    color: #77797c;
    font-size: 10pt;
}
.v-data-table >>> .v-input__control {
    border: 1px solid white !important;
}
.v-data-table >>> .v-input__control:hover {
    border: 1px solid #d1d4d4 !important;
}
.v-data-table >>> .v-input__control:focus {
    border: 1px solid #005686 !important;
}

div.v-card__title {
    padding-top: 5px !important;
    padding-top: 0px !important;
}
.v-data-table >>> tbody >>> tr:hover:not(.v-table__expanded__content) {
    background: white !important;
}

div.activeTable {
    overflow-y: auto;
}
</style>

<script>
import { widget } from "@widget-lab/3ddashboard-utils";

export default {
    data: () => ({
        dialog: false,
        initialConfigurationDialog: null,
        headers: [
            {
                text: "",
                align: "start",
                sortable: false,
                value: "title"
            }
        ],
        showClosedItems: false,
        widgetBackgroundColor: "#005686",
        checklistTitle: "",
        checklistItems: [],
        colorPickerDialog: false,
        screenHeight: 0,
        newItemTitle: "",
        hover: false,
        tab: null
    }),
    computed: {
        getTableHeight() {
            return this.screenHeight.toString();
        }
    },
    mounted() {
        this.screenHeight = (window.screen.height * 65) / 100;

        let prefs = widget.getValue("checklistItems");
        if (prefs) {
            try {
                prefs = JSON.parse(prefs);
                this.checklistItems = prefs;
                widget.setTitle(window.title + widget.getValue("checklistTitle") + " (" + this.countActiveItems(true) + ")");
            } catch {
                prefs = {};
            }
        } else {
            console.log("Problem with items loading");
            prefs = {};
        }
        this.initialConfigurationDialog = widget.getValue("initialConfigurationDialog");
        this.checklistTitle = widget.getValue("checklistTitle");
        this.updateBackgroundColor(widget.getValue("backgroundColor"));
        this.widgetBackgroundColor = widget.getValue("backgroundColor");
    },

    methods: {
        updateBackgroundColor(color) {
            document.querySelector("div.v-content__wrap").style.background = color;
            widget.setValue("backgroundColor", color);
        },
        getItems(which) {
            if (typeof this.checklistItems !== "undefined" && this.checklistItems.length !== 0) {
                return this.checklistItems.filter(Items => Items.active === which);
            } else {
                return this.checklistItems;
            }
        },
        countActiveItems(which) {
            return this.getItems(which).length;
        },
        deleteItem(item) {
            this.checklistItems.splice(this.checklistItems.indexOf(item), 1);
            this.saveItemsInPref();
        },
        turnPage() {
            widget.setValue("checklistTitle", this.checklistTitle);
            this.initialConfigurationDialog = false;
            widget.setValue("initialConfigurationDialog", false);
        },
        closeItem(item) {
            this.checklistItems[this.checklistItems.indexOf(item)].active = false;
            this.saveItemsInPref();
        },
        reOpenItem(item) {
            this.checklistItems[this.checklistItems.indexOf(item)].active = true;
            this.checklistItems.unshift(this.checklistItems.indexOf(item));
            this.saveItemsInPref();
        },
        saveItemsInPref() {
            widget.setValue("checklistItems", JSON.stringify(this.checklistItems));
        },

        updateItem() {
            this.saveItemsInPref();
        },
        updateTitle() {
            widget.setValue("checklistTitle", this.checklistTitle);
        },
        add(item) {
            const insertedItem = { title: item, topic: "", active: true, pinned: false };
            this.checklistItems.splice(0, 0, insertedItem);
            this.newItemTitle = "";
            this.saveItemsInPref();
            window.title += " (" + this.checklistItems.length + ") ";
        },
        deleteAll() {
            this.checklistItems = [];
            widget.setValue("checklistTitle", this.checklistTitle);
        }
    }
};
</script>
