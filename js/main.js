var app = angular.module('app', []);

app.controller('AppController', function($scope, $timeout, $compile){
  var start_delay = 1000;
  var light_duration = 500;
  var light_delay = 1000;
  
  var boxs = ["green","red","yellow","blue"];
  $scope.game = {};
  $scope.game.history = [];
  $scope.game.player = [];
  $scope.game.isWin = false;
  $scope.isStrict = false;
  $scope.canPress = false;
  $scope.msg = "";
  
  // AUDIO
  
  var sources = [
    'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
    'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
    'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
    'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
  ];
  var a0 = document.createElement("audio"),
      a1 = document.createElement("audio"),
      a2 = document.createElement("audio"),
      a3 = document.createElement("audio");
  a0.src = sources[0];
  a1.src = sources[1];
  a2.src = sources[2];
  a3.src = sources[3];
  
  var audio = [a0,a1,a2,a3];
  
  // FUNCTION
  
  $scope.onStart = function() {
    $scope.game = {};
    $scope.game.level = "--";
    $scope.game.history = [];
    $scope.game.isWin = false;
    $scope.isStart = true;
    $scope.canPress = false;
    $scope.msg = "";
    
    $timeout(function() {
      // check level
      $scope.game.level = 0;
      $scope.nextLevel();      
    }, start_delay);    
  }
  
  $scope.nextLevel = function() {
    $scope.canPress = false;
    $scope.game.level++;
    // Create new box
    newBox();
    $scope.startLevel();
  }
  
  $scope.startLevel = function() {
    $scope.canPress = false;
    $scope.game.player = [];
    $scope.msg = "Level " + $scope.game.level;

    // turn light on
    $timeout(function() {
      computerPlay();
    }, 1000);
  }
  
  $scope.select = function(val) {
    
    if ($scope.canPress) {
      $scope.msg = "";
      $scope.game.player.push(boxs[val]);
      onLight(boxs[val]);

      if ($scope.game.player.length === $scope.game.history.length) {
        checkWin();
      }
    }
  };
  
  function computerPlay() {
    var delay = light_duration + light_delay; // > 1000s onlight
    // Replay history turn
    for (var i = 0; i < $scope.game.history.length; i++) {
      $timeout(function(y) {
        onLight($scope.game.history[y]);
      }, delay*i, true, i);
    }
    
    // Allow player play
    $timeout(function() {
      $scope.canPress = true;
      $scope.msg = "Repeat the order of light buttons";
    }, delay*$scope.game.history.length);
        
  }
  
  function newBox() {
    var i = Math.floor(Math.random()*boxs.length);
    $scope.game.box = boxs[i];
    $scope.game.history.push($scope.game.box);
  }
  
  function onLight(box) {
    // Play Sound
    audio[boxs.indexOf(box)].play();
    // Change light
    document.getElementById(box).className += ' ' + box + '2';
    $timeout(function() {
      document.getElementById(box).className = 'btn-press ' + box;
    }, light_duration);
  }
  
  function checkWin() {
    var delay = light_duration + light_delay;
    
    // Check win current level
    if ($scope.game.player.join(" ") === $scope.game.history.join(" ")) {
      // Check Win 20 levels
      if ($scope.game.history.length === 20) {            
        $timeout(function() {
          $scope.msg = "Awesome. You win!";
          $scope.isStart = true;
        }, delay);
      }
      // Right -> Next level
      $timeout(function() {
        $scope.msg = "Right answer";
      }, delay);

      $timeout(function() {
        $scope.nextLevel();
      }, delay+500);

    } else  {
      // Wrong -> Replay
      if (!$scope.isStrict) {
        // Normal mode: Replay at current level
        $timeout(function() {
          $scope.msg = "Wrong answer";
        }, 1500);

        $timeout(function() {
          $scope.startLevel();
        }, 2000);

      } else {
        // Strict mode: Restart game
        $timeout(function() {
          $scope.msg = "Wrong answer";
        }, 1500);

        $timeout(function() {
          $scope.onStart();
        }, 2000);

      }
    }
  }
  
  $scope.onStrict = function() {
    $scope.isStrict = !$scope.isStrict;
  }
  
});