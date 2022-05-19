const { APP } = require('./GlobalManager');
const { v4: uuidv4 } = require('uuid');
const { DataManager } = require("./DataManager");
const { Group } = require("../models/core/Group");
const { GLOBAL } = require('../models/core/Scope');

class GroupManager extends DataManager {
    constructor() {
        super();
        APP.add('groups', this);

        APP.get('events').on('userremove', (user) => {
            this.clearUser(user);
        })

        APP.get('events').on('placeremove', (place) => {
            this.clearPlace(place);
        })
    }

    new(
        name = null,
        scope = GLOBAL,
        tz = null
    ) {
        let id = uuidv4();

        while (this.get(id)) {
            id = uuidv4();
        }

        let newGroup = new Group(id, name, scope, tz);
        this.add(newGroup);
        return newGroup;
    }

    add(group) {
        APP.get('events').emit('groupadd', group);
        return super.add(group.id, group);
    }

    get(groupid) {
        return super.get(groupid);
    }

    edit(group) {
        APP.get('events').emit('groupedit', group);
        return super.edit(group.id, group);
    }

    remove(group) {
        APP.get('events').emit('groupremove', group);
        return super.remove(group);
    }

    clearUser(user) {
        this.data.forEach(group => {
            group.removeUser(user.id);
        });
    }

    clearPlace(place) {
        this.data.forEach(group => {
            group.removePlace(place.id);
        });
    }
}

module.exports = { GroupManager };