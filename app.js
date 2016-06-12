'use strict';

var myApp = angular.module('myApp',[]);

myApp.controller('mainCtrl',function($scope, $http, initDataService){
    //Announcement global namespace of controller
    $scope.mainNs={};

    $scope.mainNs.selectIce = sessionStorage.getItem('selectIce');

    //Service method of asynchronous loading menu
    initDataService.getData($scope, $http);

    //Service  method of initialization and visualization form interface
    initDataService.init($scope);

    //Service method of visualization of the current step
    initDataService.setUpByPosition($scope.mainNs.stepPosition);

    //The function of the transition to the next step
    $scope.mainNs.incrementPosition = function(){
        if($scope.mainNs.stepPosition < 4 && $scope.mainNs.dataIce.iceName){
            $scope.mainNs.stepPosition++;
            sessionStorage.setItem('stepPosition', $scope.mainNs.stepPosition);
            initDataService.setUpByPosition($scope.mainNs.stepPosition);
        }
    };

    //The function of the transition to the previous step
    $scope.mainNs.decrementPosition = function(){
        if($scope.mainNs.stepPosition > 1){
            $scope.mainNs.stepPosition--;
            sessionStorage.setItem('stepPosition', $scope.mainNs.stepPosition);
            initDataService.setUpByPosition($scope.mainNs.stepPosition);
        }
    };

    //The surveillance function of the change of name control and the processing result input
    $scope.$watch('mainNs.selectiveName',function(oldValue, newValue){
        if(oldValue){
            for(var cnt in $scope.mainNs.menuData){
                if($scope.mainNs.menuData[cnt].iceName == oldValue){
                    $('#inputMessage').hide();
                    $scope.mainNs.dataIce = $scope.mainNs.menuData[cnt];
                    sessionStorage.setItem('dataIce', JSON.stringify($scope.mainNs.dataIce));
                    sessionStorage.setItem('selectIce', oldValue);
                    $scope.mainNs.selectIce = sessionStorage.getItem('selectIce');
                    //initDataService.setRecomendTara($scope);
                    return;
                }else{
                    $('#inputMessage span').text('Такого вида в меню нет').css('color','darkred');
                    $('#inputMessage').show();
                    $scope.mainNs.dataIce = {};
                    sessionStorage.setItem('dataIce', JSON.stringify($scope.mainNs.dataIce));
                    sessionStorage.setItem('selectIce', oldValue);
                }
            }
        }
    });

    //Function setting activity class
    $scope.setActiveClass = function(currentPosition){
        if(currentPosition == $scope.mainNs.dataIce.recomendTara){
            return 'activeTara';
        }else{
            return '';
        }
    };

    //The function of selecting and changing the position of the selected container goods
    $scope.selectTara = function(taraPosition){
        $('#selectMessage').hide();
        $scope.mainNs.dataIce.recomendTara = taraPosition;
        console.log($scope.mainNs.dataIce.recomendTara);
    };
});

myApp.service('initDataService',function(){
    //Public  method of initialization and visualization form interface
    this.init = function(scope){
        if(sessionStorage.getItem('stepPosition')){
            scope.mainNs.stepPosition=Number(sessionStorage.getItem('stepPosition'));
        }else{
            scope.mainNs.stepPosition = 1;
            sessionStorage.setItem('stepPosition', scope.mainNs.stepPosition);
        }

        if(sessionStorage.getItem('dataIce')){
            scope.mainNs.dataIce = JSON.parse(sessionStorage.getItem('dataIce'));
        }else{
            scope.mainNs.dataIce = {};
        }

        if(sessionStorage.getItem('selectIce')){
            scope.mainNs.selectiveName = sessionStorage.getItem('selectIce');
        }
    };

    //Public method of asynchronous loading menu
    this.getData = function(scope, http){
        http.get('data/menuData.json').success(function(data){
            scope.mainNs.menuData = data;
        });
    };

    //Static method of visualisation the header of form in the current step
    var setHeaderForm = function(position){
        var liColl = $('.headerForm ul li');
        switch(position){
            case 1:
                liColl.eq(0).addClass('activeStep');
                liColl.eq(1).removeClass('activeStep');
                liColl.eq(2).removeClass('activeStep');
                break;
            case 2:
                liColl.eq(0).removeClass('activeStep');
                liColl.eq(1).addClass('activeStep');
                liColl.eq(2).removeClass('activeStep');
                break;
            case 3:
                liColl.eq(0).removeClass('activeStep');
                liColl.eq(1).removeClass('activeStep');
                liColl.eq(2).addClass('activeStep');
                break;
            case 4:
                liColl.eq(0).removeClass('activeStep');
                liColl.eq(1).removeClass('activeStep');
                liColl.eq(2).removeClass('activeStep');
                break;
        }
    };

    //Static method of visualisation the title of form in the current step
    var setTitleForm = function(position){
        var titleCol = $('#titleForm');
        switch(position){
            case 1:
                titleCol.html("<img src='content/img/opisanie_ico.png'/>Описание");
                break;
            case 2:
                titleCol.html("<img src='content/img/ingridient_ico.png'/>Ингридиенты");
                break;
            case 3:
                titleCol.html("<img src='content/img/posuda_ico.png'/>Серверовка");
                break;
            case 4:
                titleCol.html("<img src='content/img/opisanie_ico.png'/>Ваш заказ принят и подготавливается");
                break;
        }
    };

    //Static method of visualisation the navigation of form in the current step
    var setNavForm = function(position){
        var prevNavEl = $('#prevNav');
        var nextNavEl = $('#nextNav');
        switch(position){
            case 1:
                prevNavEl.hide();
                nextNavEl.html('<span>Ингридиенты</span>').show();
                break;
            case 2:
                prevNavEl.html('<span>Описание</span>').show();
                nextNavEl.html('<span>Серверовка</span>').show();
                break;
            case 3:
                prevNavEl.html('<span>Ингридиенты</span>').show();
                nextNavEl.html('<span>Оформить</span>').show();
                break;
            case 4:
                prevNavEl.html('<span>Серверовка</span>').show();
                nextNavEl.html('<span>Оформить</span>').hide();
                break;
        }
    };

    //Public method of visualization of the current step
    this.setUpByPosition = function(position){
        setHeaderForm(position);
        setTitleForm(position);
        setNavForm(position);
    };

});

//Directive generate a list of tips Input name
myApp.directive('showListIceNameDirective', function(){
    return {
        replace: false,
        restrict:"A",
        template:"<option ng-repeat='item in mainNs.menuData' value='{{item.iceName}}'>"
    }
});
