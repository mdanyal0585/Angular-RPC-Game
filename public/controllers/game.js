var game = angular.module('myModule', ['ngMaterial']);

game.controller('gameController', ['$scope', '$http', '$mdDialog', function ($scope, $http, $mdDialog){
    $scope.choice = '';
    $scope.playerScore = 0;
    $scope.computerScore = 0;
    $scope.isLoading = false;
    $scope.playBtnText = 'Play';
    $scope.rockBtnStyle = '';
    $scope.paperBtnStyle = '';
    $scope.scissorsBtnStyle = '';

    $scope.setChoice = function(value){
        if( value === 'rock'){
            $scope.rockBtnStyle = 'burlywood';
            $scope.paperBtnStyle = '';
            $scope.scissorsBtnStyle = '';
        }
        if( value === 'paper'){
            $scope.rockBtnStyle = '';
            $scope.paperBtnStyle = 'gray';
            $scope.scissorsBtnStyle = '';
        }
        if( value === 'scissors'){
            $scope.rockBtnStyle = '';
            $scope.paperBtnStyle = '';
            $scope.scissorsBtnStyle = 'hotpink';
        }
        $scope.choice = value;
    };

    $scope.getData = function() {
        $scope.isLoading = true;
        if ($scope.choice !== '') {
            var req = {
                method: 'POST',
                url: 'http://localhost:3000/match',
                data: 'choice=' + $scope.choice,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            }

            // Simple POST request example:
            $http(req).then(function successCallback(response) {
                addPoint(response.data);
                }, function errorCallback(response) {
                $scope.isLoading = false;
                displayErr('');
                resetData();
            });
        } else {
            $scope.isLoading = false;
        }
    };

    addPoint = function(data) {
        var stringify = JSON.stringify(data);
        var resultObj = JSON.parse(stringify);
        var result = resultObj['result'];
        if (result === 'win') {
            $scope.isLoading = false;
            $scope.playerScore++;
            showAlert(resultObj);
        }
        if (result === 'lose') {
            $scope.isLoading = false;
            $scope.computerScore++;
            showAlert(resultObj);
        }
        if (result === 'tie') {
            $scope.isLoading = false;
            showAlert(resultObj);
        }
        resetData();
    };

    resetData = function() {
        $scope.playBtnText = 'Play Again'
        $scope.choice = '';
        $scope.rockBtnStyle = '';
        $scope.paperBtnStyle = '';
        $scope.scissorsBtnStyle = '';
    }

    showAlert = function(result) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title(result['result'] !== 'tie' ? 'You ' + result['result'] : 'It\'s a tie')
            .textContent('Computer Choice: ' + result['computerChoice'])
            .ok('Okay!')
        );
    };

    $scope.disableBtn = function() {
        if ($scope.choice === '') {
            return true;
        } else {
            return false;
        }
    };

    $scope.showInstructions = function() {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .textContent('Choose Rock, Paper or Scissors from the buttons on the left and then press play!')
                .ok('Okay!')
            );
    };

    displayErr = function(result) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Error')
            .textContent('We has a slight hiccup, please try again!')
            .ok('Okay!')
        );
    };

}]);