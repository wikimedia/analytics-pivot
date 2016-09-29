"use strict";
var ImmutableFormDelegate = (function () {
    function ImmutableFormDelegate(form) {
        this.form = form;
        this.form.state = {
            canSave: false,
            errors: {}
        };
        this.onChange = this.onChange.bind(this);
        this.updateErrors = this.updateErrors.bind(this);
    }
    ImmutableFormDelegate.prototype.setState = function (state, callback) {
        return this.form.setState.call(this.form, state, callback);
    };
    ImmutableFormDelegate.prototype.updateErrors = function (path, isValid, error) {
        var errors = this.form.state.errors;
        errors[path] = isValid ? false : error;
        var canSave = true;
        for (var key in errors)
            canSave = canSave && (errors[key] === false);
        return { errors: errors, canSave: canSave };
    };
    ImmutableFormDelegate.prototype.onChange = function (newItem, isValid, path, error) {
        var _a = this.updateErrors(path, isValid, error), errors = _a.errors, canSave = _a.canSave;
        if (isValid) {
            this.setState({
                errors: errors,
                newInstance: newItem,
                canSave: canSave
            });
        }
        else {
            this.setState({
                errors: errors,
                canSave: false
            });
        }
    };
    return ImmutableFormDelegate;
}());
exports.ImmutableFormDelegate = ImmutableFormDelegate;
