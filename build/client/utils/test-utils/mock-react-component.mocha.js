"use strict";
var chai_1 = require('chai');
var mock_react_component_1 = require('./mock-react-component');
describe('mockReactComponent', function () {
    var TestClass = (function () {
        function TestClass() {
        }
        TestClass.prototype.render = function () {
            throw new Error('Hey, render is supposed to be stubbed !');
        };
        TestClass.prototype.componentDidMount = function () {
            throw new Error('Hey, componentDidMount is supposed to be stubbed !');
        };
        return TestClass;
    }());
    it('should stub render and componentDidMount', function () {
        mock_react_component_1.mockReactComponent(TestClass);
        var myInstance = new TestClass();
        chai_1.expect(myInstance.render()).to.equal(null);
        chai_1.expect(myInstance.componentDidMount()).to.equal(undefined);
    });
    it('should restore render and componentDidMount', function () {
        TestClass.restore();
        var myInstance = new TestClass();
        chai_1.expect(function () { return myInstance.render(); })
            .to.throw('Hey, render is supposed to be stubbed !');
        chai_1.expect(function () { return myInstance.componentDidMount(); })
            .to.throw('Hey, componentDidMount is supposed to be stubbed !');
    });
});
