describe('justTesting', function () {
    describe('TestingController', function () {
        it('login', function () {
            angular.module('Login');

            var scope = {};
            var ctrl;
            inject(function ($controller) {
                ctrl = $controller('LoginController', {$scope: scope});
            });
            expect(scope.login).toBeDefined();
            expect(scope.login).toBe("ifigeneia", "test");

        });
    });


});