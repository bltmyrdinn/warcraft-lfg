(function() {
    'use strict';

    angular
        .module('app.guild')
        .controller('GuildReadController', GuildRead)
        .controller('GuildUpdateController', GuildUpdate)
        .controller('GuildDeleteController', GuildDelete)
        .controller('GuildListController', GuildList)
    ;

    GuildRead.$inject = ["$scope","socket","$state","$stateParams"];
    function GuildRead($scope,socket,$state,$stateParams) {
        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        $scope.guild_ad = null;
        $scope.$parent.loading = true;

        socket.emit('get:guild',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:guild',$scope);
        $scope.$on('socket:get:guild',function(ev,guild){
            $scope.$parent.loading = false;
            $scope.guild = guild;
        });

        $scope.updateGuild = function(){
            $scope.$parent.loading = true;
            socket.emit('update:guild',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});
        };

        socket.forward('update:guild',$scope);
        $scope.$on('socket:update:guild',function(ev,queuePosition){
            $scope.queuePosition = queuePosition;
            $scope.$parent.loading = false;

        });


    }

    GuildUpdate.$inject = ["$scope","socket","$state","$stateParams","LANGUAGES"];
    function GuildUpdate($scope,socket,$state,$stateParams,LANGUAGES) {
        //Reset error message
        $scope.$parent.error=null;

        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function() {
            if($scope.$parent.user && $scope.$parent.user.logged_in===false)
                $state.go('dashboard');
        });


        //Initialize $scope variables
        $scope.languages= LANGUAGES;
        $scope.$parent.loading = true;


        socket.emit('get:guild',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:guild',$scope);
        $scope.$on('socket:get:guild',function(ev,guild){
            $scope.$parent.loading = false;
            //If not exit, redirect user to dashboard
            if(guild===null)
                $state.go("dashboard");
            $scope.guild = guild;
        });

        $scope.save = function(){
            socket.emit('put:guildAd',$scope.guild);
            $scope.$parent.loading = true;
        };

        socket.forward('put:guildAd',$scope);
        $scope.$on('socket:put:guildAd',function(){
            $scope.$parent.loading = false;
            $state.go("account");
        });
    }

    GuildDelete.$inject = ['$scope','socket','$state','$stateParams'];
    function GuildDelete($scope, socket, $state, $stateParams) {
        //Reset error message
        $scope.$parent.error=null;


        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function() {
            if($scope.$parent.user && $scope.$parent.user.logged_in===false)
                $state.go('dashboard');
        });

        //Initialize var
        $scope.guildAd = {name:$stateParams.name, realm:$stateParams.realm, region:$stateParams.region};

        $scope.delete = function(){
            $scope.$parent.loading = true;
            socket.emit('delete:guildAd',$scope.guild);
        };

        socket.forward('delete:guildAd',$scope);
        $scope.$on('socket:delete:guildAd',function(ev,guild){
            $scope.$parent.loading = false;
            $state.go("account");
        });
    }

    GuildList.$inject = ['$scope','$stateParams','$translate','socket','LANGUAGES'];
    function GuildList($scope, $stateParams, $translate, socket,LANGUAGES) {


        $scope.$parent.error=null;
        $scope.guilds = [];
        $scope.languages = [];

        angular.copy(LANGUAGES,$scope.languages);
        $scope.languages.unshift("");


        $translate(['ALL_CLASSES','SELECT_ALL','SELECT_NONE','RESET','SEARCH','HEALS','TANKS','RANGED_DPS','MELEE_DPS','CLASS_1', 'CLASS_2', 'CLASS_3', 'CLASS_4', 'CLASS_5', 'CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11']).then(function (translations) {
            $scope.classes = [
                {name: translations.TANKS, msGroup: true},
                {id:1, role:"tank", name: "<span class='class-1'>"+translations.CLASS_1+"</span>", icon:"<img src='/assets/images/icon/16/class-1.png'>", selected:false},
                {id:11, role:"tank", name: "<span class='class-11'>"+translations.CLASS_11+"</span>", icon:"<img src='/assets/images/icon/16/class-11.png'>", selected:false},
                {id:2, role:"tank", name: "<span class='class-2'>"+translations.CLASS_2+"</span>", icon:"<img src='/assets/images/icon/16/class-2.png'>", selected:false},
                {id:10, role:"tank", name: "<span class='class-10'>"+translations.CLASS_10+"</span>", icon:"<img src='/assets/images/icon/16/class-10.png'>", selected:false},
                { msGroup: false},
                {name: translations.HEALS, msGroup: true},
                {id:11, role:"heal", name: "<span class='class-11'>"+translations.CLASS_11+"</span>", icon:"<img src='/assets/images/icon/16/class-11.png'>", selected:false},
                {id:5, role:"heal", name: "<span class='class-5'>"+translations.CLASS_5+"</span>", icon:"<img src='/assets/images/icon/16/class-5.png'>", selected:false},
                {id:2, role:"heal", name: "<span class='class-2'>"+translations.CLASS_2+"</span>", icon:"<img src='/assets/images/icon/16/class-2.png'>", selected:false},
                {id:7, role:"heal", name: "<span class='class-7'>"+translations.CLASS_7+"</span>", icon:"<img src='/assets/images/icon/16/class-7.png'>", selected:false},
                {id:10, role:"heal", name: "<span class='class-10'>"+translations.CLASS_10+"</span>", icon:"<img src='/assets/images/icon/16/class-10.png'>", selected:false},
                { msGroup: false},
                {name: translations.MELEE_DPS, msGroup: true},
                {id:11, role:"melee_dps", name: "<span class='class-11'>"+translations.CLASS_11+"</span>", icon:"<img src='/assets/images/icon/16/class-11.png'>", selected:false},
                {id:6, role:"melee_dps", name: "<span class='class-6'>"+translations.CLASS_6+"</span>", icon:"<img src='/assets/images/icon/16/class-6.png'>", selected:false},
                {id:2, role:"melee_dps", name: "<span class='class-2'>"+translations.CLASS_2+"</span>", icon:"<img src='/assets/images/icon/16/class-2.png'>", selected:false},
                {id:10, role:"melee_dps", name: "<span class='class-10'>"+translations.CLASS_10+"</span>", icon:"<img src='/assets/images/icon/16/class-10.png'>", selected:false},
                {id:7, role:"melee_dps", name: "<span class='class-7'>"+translations.CLASS_7+"</span>", icon:"<img src='/assets/images/icon/16/class-7.png'>", selected:false},
                {id:1, role:"melee_dps", name: "<span class='class-1'>"+translations.CLASS_1+"</span>", icon:"<img src='/assets/images/icon/16/class-1.png'>", selected:false},
                {id:4, role:"melee_dps", name: "<span class='class-4'>"+translations.CLASS_4+"</span>", icon:"<img src='/assets/images/icon/16/class-4.png'>", selected:false},
                { msGroup: false},
                {name: translations.RANGED_DPS, msGroup: true},
                {id:5, role:"ranged_dps", name: "<span class='class-5'>"+translations.CLASS_5+"</span>", icon:"<img src='/assets/images/icon/16/class-5.png'>", selected:false},
                {id:7, role:"ranged_dps", name: "<span class='class-7'>"+translations.CLASS_7+"</span>", icon:"<img src='/assets/images/icon/16/class-7.png'>", selected:false},
                {id:3, role:"ranged_dps", name: "<span class='class-3'>"+translations.CLASS_3+"</span>", icon:"<img src='/assets/images/icon/16/class-3.png'>", selected:false},
                {id:9, role:"ranged_dps", name: "<span class='class-9'>"+translations.CLASS_9+"</span>", icon:"<img src='/assets/images/icon/16/class-9.png'>", selected:false},
                {id:8, role:"ranged_dps", name: "<span class='class-8'>"+translations.CLASS_8+"</span>", icon:"<img src='/assets/images/icon/16/class-8.png'>", selected:false},
                { msGroup: false}
            ];
            $scope.localClasses = {
                selectAll       : translations.SELECT_ALL,
                selectNone      : translations.SELECT_NONE,
                reset           : translations.RESET,
                search          : translations.SEARCH,
                nothingSelected : translations.ALL_CLASSES
            };
        });

        $scope.filters = {};
        $scope.filters.faction = "";
        $scope.filters.region = "";
        $scope.filters.language ="";
        $scope.filters.classes = [];
        $scope.filters.raids_per_week = {};
        $scope.filters.raids_per_week.min = 1;
        $scope.filters.raids_per_week.max = 7;

        /* if params load filters */
        if($stateParams.region)
            $scope.filters.region = $stateParams.region;
        if($stateParams.language)
            $scope.filters.language = $stateParams.language;
        if($stateParams.faction)
            $scope.filters.faction = $stateParams.faction;

        $scope.$watch('filters.raids_per_week.min', function() {
            $scope.updateFilters();
        });
        $scope.$watch('filters.raids_per_week.max', function() {
            $scope.updateFilters();
        });
        $scope.$watch('filters.classes', function() {
            $scope.updateFilters();
        });

        $scope.getMoreGuilds = function(){
            if($scope.$parent.loading || $scope.loading)
                return;

            $scope.loading = true;
            if($scope.guilds.length>0)
                $scope.filters.last = $scope.guilds[$scope.guilds.length-1].ad.updated;
            socket.emit('get:guildAds',$scope.filters);
        };

        $scope.updateFilters = function(){
            if($scope.$parent.loading || $scope.loading)
                return;
            $scope.$parent.loading = true;
            $scope.filters.last = null;
            $scope.guilds =[];
            socket.emit('get:guildAds',$scope.filters);

        };
        socket.forward('get:guildAds',$scope);
        $scope.$on('socket:get:guildAds',function(ev,guilds){
            $scope.$parent.loading = false;
            $scope.loading = false;
            $scope.guilds = $scope.guilds.concat(guilds);
        });
    }
})();