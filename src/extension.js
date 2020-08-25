class Extension {
    mount(hellBot) {
        throw new Error('Try to mount from abstract Extension!');
    }
}

module.exports = Extension;