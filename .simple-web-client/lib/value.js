/**
 * A `Value` is a wrapper for any type of variable.
 * A `Value` is useful because it allows for one-way binding to `Element` properties.
 */
export class Value {
    _value;
    elements = [];
    constructor(value) {
        this._value = value;
    }
    /**
     * Returns the current value of a `Value`.
     */
    get value() {
        return this._value;
    }
    /**
     * Sets the current value of a `Value` and updates all bound properties.
     */
    set value(value) {
        this._value = value;
        this.updateElementProperties();
    }
    /**
     * Sets the current value of a `Value` using a callback and updates all bound properties.
     * @param callback A callback that is provided with the current value and must return a value of the same type.
     */
    set(callback) {
        this._value = callback(this._value);
        this.updateElementProperties();
    }
    /**
     * Updates all bound properties with the current value of a `Value`.
     *
     * This method is automatically called when using the setter or the `set` method.
     */
    updateElementProperties() {
        for (const templateElement of this.elements) {
            for (const property of templateElement.properties.entries()) {
                this.setElementProperty(templateElement.element, property[0], property[1]);
            }
        }
    }
    setElementProperty(element, property, callback) {
        try {
            element[property] = callback ? callback(this._value) : this._value;
        }
        catch (error) {
            console.error("Error while setting template element property: ", error);
        }
    }
    /**
     * Binds the value of a `Value` to a property of an `Element`.
     * When the value is updated, the property will be updated as well.
     *
     * Instead of simply setting the bound property to the value, an optional callback can be used to set the property based on the value.
     * @param element An `Element`.
     * @param property A property of the provided `Element`.
     * @param callback A function that is passed the value and returns the property's value.
     */
    bindElementProperty(element, property, callback) {
        this.setElementProperty(element, property, callback);
        let existingElement = this.elements.find((e) => e.element === element);
        if (!existingElement) {
            existingElement = {
                element: element,
                properties: new Map()
            };
            this.elements.push(existingElement);
        }
        existingElement.properties.set(property, callback);
    }
    /**
     * Unbinds the value of a `Value` from a property of an `Element`.
     * When the value is updated, the property will no longer be updated.
     *
     * This function does not clear the property's value.
     *
     * @param element An `Element`.
     * @param property A property of the provided `Element`.
     */
    unbindElementProperty(element, property) {
        let elementIndex = this.elements.findIndex((e) => e.element === element);
        if (elementIndex === -1)
            return;
        const properties = this.elements[elementIndex].properties;
        if (properties.delete(property) && properties.size === 0) {
            this.elements.splice(elementIndex, 1);
        }
    }
    /**
     * Unbinds the value of a `Value` from all bound properties.
     * When the value is updated, no property will be updated.
     */
    unbindAllElementProperties() {
        this.elements.length = 0;
    }
}
