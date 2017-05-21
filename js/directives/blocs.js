module.exports = function(myAppModule) {
    myAppModule.directive('blocs', function ($rootScope, $firebaseObject, $location) {
        return {
            restrict: 'E',
            scope: {
                page: "=",
                isdropdown: "@"
            },
            templateUrl: '/partials/blocs.html',
            link: function ($scope, element, attrs) {
                var page = $scope.page || "accueil"
                var db = firebase.database()

                $scope.uniq = Math.floor(Math.random() * 999999)

                $scope.blocs = []
                $scope.layout = []
                $scope.edit_id = -1

                $scope.edit_bloc = function(ind, mode) {
                    $scope.edit_id = ind
                    $scope.edit_mode = mode
                }

                $scope.add_bloc = function(ind, tpl) {
                    $scope.blocs.splice(ind, 0, {
                        text: "",
                        id: "",
                        obj: $firebaseObject(db.ref("textes/" + (tpl ? tpl : "new_empty")))
                    })
                }

                $scope.remove_bloc = function(ind) {
                    $scope.blocs.splice(ind, 1)
                    $scope.edit_id = -1
                    $scope.layout_obj.$value = JSON.stringify($scope.blocs.map(function(bloc) { return bloc.id }))
                    $scope.layout_obj.$save()
                }

                $scope.move_up = function(ind) {
                    var bloc = $scope.blocs[ind]
                    $scope.blocs.splice(ind, 1)
                    $scope.blocs.splice(ind - 1, 0, bloc)
                    if ($scope.edit_id == ind) {
                        $scope.edit_id--
                    }
                    if ($scope.edit_id == ind - 1) {
                        $scope.edit_id++
                    }
                    $scope.layout_obj.$value = JSON.stringify($scope.blocs.map(function(bloc) { return bloc.id }))
                    $scope.layout_obj.$save()
                }

                $scope.move_down = function(ind) {
                    var bloc = $scope.blocs[ind]
                    $scope.blocs.splice(ind, 1)
                    $scope.blocs.splice(ind + 1, 0, bloc)
                    if ($scope.edit_id == ind) {
                        $scope.edit_id++
                    }
                    if ($scope.edit_id == ind + 1) {
                        $scope.edit_id--
                    }
                    $scope.layout_obj.$value = JSON.stringify($scope.blocs.map(function(bloc) { return bloc.id }))
                    $scope.layout_obj.$save()
                }

                $scope.select_mode = function(mode) {
                    $scope.edit_mode = mode
                }

                $scope.edit_save = function() {
                    var bloc = $scope.blocs[$scope.edit_id]
                    if (bloc.new) {
                        bloc.obj = $firebaseObject(db.ref("textes/" + bloc.id))
                        if ($rootScope.blocs_names.indexOf(bloc.id) == -1) {
                            $rootScope.blocs_names.push(bloc.id)
                        } else {
                            alert('Le nom de bloc existe deja')
                            return
                        }
                    }
                    bloc.obj.$value = bloc.text
                    bloc.obj.$save()
                    delete bloc.old
                    delete bloc.new
                    $scope.edit_id = -1
                    $scope.layout_obj.$value = JSON.stringify($scope.blocs.map(function(bloc) { return bloc.id }))
                    $scope.layout_obj.$save()
                }

                $scope.edit_cancel = function() {
                    var bloc = $scope.blocs[$scope.edit_id]
                    if (bloc.new && ! bloc.old) {
                        $scope.blocs.splice($scope.edit_id, 1)
                        $scope.edit_id = -1
                        if (! $scope.blocs.length) {
                            $scope.add_bloc(0)
                        }
                        return
                    }

                    if (bloc.old) {
                        bloc.obj = bloc.old
                        delete bloc.old
                    }
                    bloc.text = bloc.obj.$value
                    bloc.id = bloc.obj.$id
                    $scope.edit_id = -1
                }

                $scope.change_bloc = function(ind) {
                    var bloc = $scope.blocs[ind]
                    return $firebaseObject(db.ref("textes/" + bloc.id)).$loaded().then(function(v) {
                        bloc.text = v.$value || ""
                        bloc.obj = v
                        if ( ! bloc.id || bloc.id.substr(0,4) == "new_") {
                            bloc.new = true
                            bloc.id = ""
                            $scope.edit_bloc(ind)
                        }
                        else if ($scope.edit_id != ind) {
                            $scope.edit_bloc(ind, 'apercu')
                        }

                        bloc.old = ! bloc.new && (bloc.old || bloc.obj)
                    })
                }

                $rootScope.$on('app:signout', function() {
                    if ($scope.edit_id != -1) {
                        $scope.edit_cancel()
                    }
                })

                return $firebaseObject(db.ref("layouts/" + page)).$loaded().then(function(layout) {
                    $scope.layout_obj = layout
                    if ( ! layout.$value) {
                        if ($rootScope.isadmin) {
                            $scope.layout = []
                        } else {
                            $location.path('/')
                        }
                        return []
                    }
                    $scope.layout = JSON.parse(layout.$value)
                    return Promise.all(
                        $scope.layout.map(function(v) {
                            return $firebaseObject(db.ref("textes/" + v)).$loaded()
                        })
                    )
                }).then(function(textes) {
                    $scope.blocs = textes.map(function(v) {
                        return {
                            text: v.$value || "",
                            id: v.$id,
                            obj: v
                        }
                    })
                    if (! $scope.blocs.length) {
                        $scope.add_bloc(0)
                    }
                }).catch(function(e) {
                    console.error(e)
                });
            }
        };
    });
}