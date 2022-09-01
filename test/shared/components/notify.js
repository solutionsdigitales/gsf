/* global element, by */
'use strict';
var chai = require('../../../client/node_modules/chai');
var expect = chai.expect;

module.exports = {

    hasSuccess: async () => {
        const val = await element(by.className('p-toast-message-success')).isPresent();
        expect(val).
            to.equal(true);
        await dismiss();
    },

    hasWarn: async () => {
        const val = await element(by.className('p-toast-message-warn')).isPresent();
        expect(val).
            to.equal(true);
        await dismiss();
    },

    hasInfo: async () => {
        const val = await element(by.className('p-toast-message-info')).isPresent();
        expect(val).
            to.equal(true);
        await dismiss();
    },

    hasDanger: async () => {
        const val = await element(by.className('p-toast-message-danger')).isPresent();
        expect(val).
            to.equal(true);
        await dismiss();
    },

    hasError: async () => {
        const val = await element(by.className('p-toast-message-error')).isPresent();
        expect(val).
            to.equal(true);
        await dismiss();
    },
};

async function dismiss() {
    return element(by.className('p-toast-icon-close p-link')).click();
}
