var $$setData = function(key, val) {
	return window.localStorage.setItem(key, val);
};

var $$getData = function(key) {
	return window.localStorage.getItem(key);
};


angular.module("demo.server", [])
.factory("ajx", function($q, $http, $ionicLoading) {
	return {
		sends: function(url, exconfig) {
			var defer = $q.defer();
			$http.defaults.headers.common['apikey'] = '3ae0c260ff3aeb61b434fc9d21785e85';
			$http.get(url, exconfig)
	        .error(function() {
				$ionicLoading.show({
					template: "请求失败",
					duration: 2000
				});
				defer.resolve({
					code: 999999
				});
				return false;
	        })
	        .success(function(res) {
	        	if(+res.code === 200) {
		        	defer.resolve(res);
	        	} else {
	        		defer.reject();
	        	}
	        });
			return defer.promise;
		}
	};
})
.factory("newsServer", function($q, $http, ajx){
	return {
		international: function(num, page) {
			return ajx.sends("http://apis.baidu.com/txapi/world/world", {
				params: {
					num: num,
					page: page
				}
			});
		},
		social: function(num, page) {
			return ajx.sends("http://apis.baidu.com/txapi/social/social", {
				params: {
					num: num,
					page: page
				}
			});
		},
		technology: function(num, page) {
			return ajx.sends("http://apis.baidu.com/txapi/keji/keji", {
				params: {
					num: num,
					page: page
				}
			});
		},
		sports: function(num, page) {
			return ajx.sends("http://apis.baidu.com/txapi/tiyu/tiyu", {
				params: {
					num: num,
					page: page
				}
			});
		},
		apple: function(num, page) {
			return ajx.sends("http://apis.baidu.com/txapi/apple/apple", {
				params: {
					num: num,
					page: page
				}
			});
		}
	};
});

angular.module('demo', ['ionic', 'demo.server'])
.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('news', {
		  url: '/news?step',
		  templateUrl: 'templates/home.html',
		  controller: 'NewsController'
		})
		.state('detail', {
		  url: '/detail?url',
		  templateUrl: 'templates/detail.html',
		  controller: 'DetailController'
		});

	$urlRouterProvider.otherwise("/news");
})
.run(function($rootScope, $state, $ionicSideMenuDelegate) {
	$rootScope.leftMenu = [{
		name: '国际',
		click: function() {
			$state.go('news', {step: 'international'});
			$ionicSideMenuDelegate.toggleLeft();
		}
	},{
		name: '社会',
		click: function() {
			$state.go('news', {step: 'social'});
			$ionicSideMenuDelegate.toggleLeft();
		}
	},{
		name: '科技',
		click: function() {
			$state.go('news', {step: 'technology'});
			$ionicSideMenuDelegate.toggleLeft();
		}
	},{
		name: '体育',
		click: function() {
			$state.go('news', {step: 'sports'});
			$ionicSideMenuDelegate.toggleLeft();
		}
	},{
		name: '苹果',
		click: function() {
			$state.go('news', {step: 'apple'});
			$ionicSideMenuDelegate.toggleLeft();
		}
	}];
	$rootScope.toggleLeft = function() {
	  $ionicSideMenuDelegate.toggleLeft();
	};
})
.controller('NewsController', function($scope, $stateParams, newsServer) {
	$scope.articleList = [];
	if(!$stateParams.step || $stateParams.step === 'international') {
		// 国际新闻
		$scope.title = '国际新闻';
		$scope.load = true;
		$scope.moreArticle = function(page) {
		  	$scope.pageNo = page || 1;
		  newsServer.international(10, $scope.pageNo).then(function(res) {
		  	$scope.load = false;
		  	if(res.code === 200) {
		  		$scope.articleList = $scope.articleList.concat(res.newslist);
		  		$$setData('international', JSON.stringify($scope.articleList));
		  	} else {
			  	$scope.articleList = JSON.parse($$getData('international'));
		  	}
		  	$scope.$broadcast('scroll.infiniteScrollComplete');
		  });
		};
		$scope.moreArticle(1);

		$scope.update = function() {
			$scope.articleList = [];
			$scope.pageNo = 1;
			newsServer.international(10, $scope.pageNo).then(function(res) {
				if(res.code === 200) {
					$scope.articleList = $scope.articleList.concat(res.newslist);
				}
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
	}

	if($stateParams.step === 'social') {
		$scope.title = '社会新闻';
		  $scope.load = true;
		$scope.moreArticle = function(page) {
		  $scope.pageNo = page || 1;
		  newsServer.social(10, $scope.pageNo).then(function(res) {
		  	$scope.load = false;
		  	if(res.code === 200) {
		  		$scope.articleList = $scope.articleList.concat(res.newslist);
		  		$$setData('social', JSON.stringify($scope.articleList));
		  	} else {
			  	$scope.articleList = JSON.parse($$getData('social'));
		  	}
		  	$scope.$broadcast('scroll.infiniteScrollComplete');
		  });
		};
		$scope.moreArticle(1);

		$scope.update = function() {
			$scope.articleList = [];
			$scope.pageNo = 1;
			newsServer.social(10, $scope.pageNo).then(function(res) {
				if(res.code === 200) {
					$scope.articleList = $scope.articleList.concat(res.newslist);
				}
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
	}

	if($stateParams.step === 'technology') {
		$scope.title = '科技新闻';
	  $scope.load = true;
		$scope.moreArticle = function(page) {
		  $scope.pageNo = page || 1;
		  newsServer.technology(10, $scope.pageNo).then(function(res) {
		  	$scope.load = false;
		  	if(res.code === 200) {
		  		$scope.articleList = $scope.articleList.concat(res.newslist);
		  		$$setData('technology', JSON.stringify($scope.articleList));
		  	} else {
			  	$scope.articleList = JSON.parse($$getData('technology'));
		  	}
		  	$scope.$broadcast('scroll.infiniteScrollComplete');
		  });
		};
		$scope.moreArticle(1);

		$scope.update = function() {
			$scope.articleList = [];
			$scope.pageNo = 1;
			newsServer.technology(10, $scope.pageNo).then(function(res) {
				if(res.code === 200) {
					$scope.articleList = $scope.articleList.concat(res.newslist);
				}
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
	}
	if($stateParams.step === 'sports') {
		$scope.title = '体育新闻';
	  $scope.load = true;
		$scope.moreArticle = function(page) {
		  $scope.pageNo = page || 1;
		  newsServer.sports(10, $scope.pageNo).then(function(res) {
		  	$scope.load = false;
		  	if(res.code === 200) {
		  		$scope.articleList = $scope.articleList.concat(res.newslist);
		  		$$setData('sports', JSON.stringify($scope.articleList));
		  	} else {
			  	$scope.articleList = JSON.parse($$getData('sports'));
		  	}
		  	$scope.$broadcast('scroll.infiniteScrollComplete');
		  });
		};
		$scope.moreArticle(1);

		$scope.update = function() {
			$scope.articleList = [];
			$scope.pageNo = 1;
			newsServer.sports(10, $scope.pageNo).then(function(res) {
				if(res.code === 200) {
					$scope.articleList = $scope.articleList.concat(res.newslist);
				}
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
	}
	if($stateParams.step === 'apple') {
		$scope.title = '苹果新闻';
	  $scope.load = true;
		$scope.moreArticle = function(page) {
		  $scope.pageNo = page || 1;
		  newsServer.apple(10, $scope.pageNo).then(function(res) {
		  	$scope.load = false;
		  	if(res.code === 200) {
		  		$scope.articleList = $scope.articleList.concat(res.newslist);
		  		$$setData('apple', JSON.stringify($scope.articleList));
		  	} else {
			  	$scope.articleList = JSON.parse($$getData('apple'));
		  	}
		  	$scope.$broadcast('scroll.infiniteScrollComplete');
		  });
		};
		$scope.moreArticle(1);

		$scope.update = function() {
			$scope.articleList = [];
			$scope.pageNo = 1;
			newsServer.apple(10, $scope.pageNo).then(function(res) {
				if(res.code === 200) {
					$scope.articleList = $scope.articleList.concat(res.newslist);
				}
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
	}
})
.controller('DetailController', function($scope, $sce, $stateParams) {
	$scope.trustUrl = $sce.trustAsResourceUrl;
	$scope.url = $stateParams.url;
});
