/* global $ */
/* global angular */

$(function () {
    $("body").tooltip({selector: "[data-toggle='tooltip']"});
    
    $("#releasenotesbutton").tooltip({
        "html": "true",
        "placement": "top",
        "title": $("#releasenotes").html()
    });
});

var app=angular.module("calc",[]);

app.controller("calcController", ["$compile","$scope", function($compile,$scope) {
    this.addGeneral=function() {
        var newScope = $scope.$new(true);
        var generaldiv=$compile('<section class="container"><hr><calc-general></calc-general></section>')(newScope);
        $("calc-general").last().parent().after(generaldiv);
    };
}]);

app.directive("calcGeneral", function() {
    return {
        "restrict" : "E",
        "templateUrl" : "calc-general.html",
        "controller" : ["$scope", function($scope){
            var calc=this;
            
            calc.init = function() {
                calc.generals=generals_json;
                
                calc.general = {
                "name" : "",
                "prop" : 0,
                "prop_step" : 0,
                "type" : 1,
                "level" : 200,
                "star" : 0,
                "medicine" : 0,
                "fate" : 0,
                "reincarnate" : 0.0,
                "skill" : 0.0,
                "equip" : 2000,
                "fight" : 600,
                "gem" : 1200
                };
                
                calc.generalId="0";
                calc.changeGeneral();
            };
            
            calc.changeGeneral = function() {
                var newGeneral=calc.generals[calc.generalId];
                calc.general.name=newGeneral.name;
                calc.general.prop=newGeneral.prop;
                calc.general.prop_step=newGeneral.step;
                calc.general.type=newGeneral.type;
                calc.general.fate=0;
                calc.general.fates=newGeneral.fate;
            };
            
            calc.clickFate = function($event) {
                $($event.target).toggleClass("active").blur();
                var fateElems=$($event.target).parent().children(".active");
                var fate=0;
                fateElems.each(function(){
                    fate+=$(this).data("effect");
                });
                calc.general.fate=fate;
            };
            
            calc.equip = function() {
                var base = parseInt(calc.quickEquip);
                var level = Math.floor(calc.general.level * 1.2);
                switch (base) {
                    case 195:
                        return Math.floor((195+9.75*(level-1))*1.9);
                    break;
                    case 172:
                        return Math.floor((172+8.63*(level-1))*1.9);
                    break;
                    case 150:
                        return Math.floor((150+7.50*(level-1))*1.9);
                    break;
                    case 135:
                        return Math.floor((135+6.75*(level-1))*1.9);
                    break;
                    default:
                        return calc.general.equip;
                    break;
                }
            };
            
            calc.quick = function(type,value) {
                if (value != 0) {
                    calc.general[type]=value;
                }
            };
            
            $scope.$watch("calc.general.level", function() {
                //alert(calc.quickEquip);
                calc.general.equip=calc.equip();
            });
            
            calc.baseProp = function() {
                var 神突破加成=[1, 1.1, 1.2, 1.3, 1.45, 1.65];
                var 魔突破加成=[1, 1.125, 1.25, 1.4, 1.6, 2.01];
                var base=0;
                base = parseFloat(calc.general.prop);
                base += (parseFloat(calc.general.prop_step)*(parseInt(calc.general.level)-1));
                if (calc.general.grade==1) {
                    base=base*神突破加成[parseInt(calc.general.star)];
                }
                else {
                    base=base*魔突破加成[parseInt(calc.general.star)];
                }
                base += parseInt(calc.general.medicine);
                base = Math.floor(base);
                return base;
            };
            
            calc.prop = function() {
                var prop=0;
                var base = calc.baseProp();
                prop += base;
                prop += base * parseFloat(calc.general.fate)*0.01;
                prop += base * parseFloat(calc.general.reincarnate)*0.01;
                prop += base * parseFloat(calc.general.skill)*0.01;
                prop += parseInt(calc.general.equip);
                prop += parseInt(calc.general.fight);
                prop += parseInt(calc.general.gem);
                prop = Math.floor(prop);
                return prop;
            };
            
            calc.init();
        }],
        "controllerAs" : "calc"
    };
});
