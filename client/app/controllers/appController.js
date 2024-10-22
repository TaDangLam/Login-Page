const appController = ($scope, $http, $window) => {
    $scope.user = {};
    $scope.secret = '';
    $scope.userId = '';
    $scope.currentPage = {
        loginPage: true,
        registerPage: false,
        userPage: false,
    }
    $scope.loginData = {
        email: '',
        password: '',
    };
    $scope.registerData = {
        username: '',
        password: '',
        confirmPassword: '',
        fullname: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: ''
    };

    $scope.showRegister = () => {
        $scope.currentPage = {
            loginPage: false,
            registerPage: true,
            userPage: false,
        }
    }

    $scope.showLogin = () => {
        $scope.currentPage = {
            loginPage: true,
            registerPage: false,
            userPage: false,
        }
    };

    $scope.showUser = () => {
        $scope.currentPage = {
            loginPage: false,
            registerPage: false,
            userPage: true,
        }
    };

    // $scope.getDetailUser = () => {
    //     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiNjcxMzk1NmYxNjYxOTA5OTY5YTliNzgzIiwicm9sZSI6ImN1c3RvbWVyIn0sImlhdCI6MTcyOTQ0Njg0NiwiZXhwIjoxNzI5NTMzMjQ2fQ.bSLB18-eKIEmpdmrhNOmnXhFqrc8H0dU1nZ3P8KnKCw';
    //     const userId = '6713956f1661909969a9b783';
    //     $http.get($window.config.URL_BACKEND + `/get-detail-user/${userId}`, {
    //         headers: {
    //             'token': `Bearer ${token}`
    //         }
    //     })
    //     .then(response => {
    //         $scope.user = response.data.data;
    //         // $scope.$apply();                             use $apply() when using axios
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
    // };
    // $scope.getDetailUser();

    $scope.handleLogin = () => {
        const data = {
            email: $scope.loginData.email,
            password: $scope.loginData.password
        }

        $http.post($window.config.URL_BACKEND + '/login', data)
            .then(response => {
                if(response.data.status === 'Pending OTP') {
                    $scope.secret = response.data.secret;
                    $scope.userId = response.data.userId;
                    Swal.fire({
                        title: 'Enter OTP',
                        input: 'text',
                        inputPlaceholder: 'Enter your OTP',
                        showCancelButton: true,
                        confirmButtonText: 'Verify',
                        preConfirm: (otp) => {
                            if (!otp) {
                                Swal.showValidationMessage('Please login again!');
                            } else {
                                $scope.handleVerifyOtp(otp);
                            }
                        },
                        didOpen: () => {
                            const confirmButton = Swal.getConfirmButton();
                            confirmButton.style.backgroundColor = '#005aa7';
                            confirmButton.style.color = 'white';
                        }
                    });
                    $scope.loginData.email = '';
                    $scope.loginData.password = '';
                }
            })
            .catch(error => {
                console.log('Login error: ', error);
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    }
                  });
                  Toast.fire({
                    icon: "error",
                    title: `${error.data.error}`
                  });
            })
    }

    $scope.handleVerifyOtp = (otp) => {
        const otpData = {
            secret: $scope.secret,
            token: otp,
            userId: $scope.userId
        };
    
        $http.post($window.config.URL_BACKEND + '/verify-totp', otpData)
            .then(response => {
                if (response.data.status === 'OK') {
                    const accessToken = response.data.accessToken;
                    $window.localStorage.setItem('accessToken', accessToken);
                    $scope.user = response.data.data;
                    console.log($scope.user)
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.onmouseenter = Swal.stopTimer;
                          toast.onmouseleave = Swal.resumeTimer;
                        }
                      });
                      Toast.fire({
                        icon: "success",
                        title: "Verify OTP in successfully!"
                      });
                    $scope.currentPage = {
                        loginPage: false,
                        registerPage: false,
                        userPage: true,
                    }
                }
            })
            .catch(error => {
                console.log('OTP verification error: ', error);
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    }
                  });
                  Toast.fire({
                    icon: "error",
                    title: `${error.data.error}`
                  });
            });
    }

    $scope.refreshToken = () => {
        const refreshToken = $scope.user.longToken;
        return $http.post($window.config.URL_BACKEND + '/refresh-token', { token: refreshToken })
            .then(response => {
                const newAccessToken = response.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);
                return newAccessToken;
            })
            .catch(error => {
                console.log("Failed to refresh token:", error);
            });
    };


    $scope.handleUpdateInfo = () => {
        const token = localStorage.getItem('accessToken');
        $http.patch($window.config.URL_BACKEND + `/update-user/${$scope.userId}`, $scope.user, {
            headers: {
                'token': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Then thành công lần 1: ', response.data)
            $scope.user = response.data.data
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Update Info is success!"
              });
            
        })
        .catch(error => {
            if(error.status === 403  && error.statusText === 'Forbidden'){
                $scope.refreshToken()
                    .then(newAccessToken => {
                        $http.patch($window.config.URL_BACKEND + `/update-user/${$scope.userId}`, $scope.user, {
                            headers: {
                                'token': `Bearer ${newAccessToken}`
                            }
                        })
                    // depends on .then above
                    .then(response => {
                        console.log('then 1-2: ', response.data);
                        $scope.user = response.data.data;
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                              toast.onmouseenter = Swal.stopTimer;
                              toast.onmouseleave = Swal.resumeTimer;
                            }
                          });
                          Toast.fire({
                            icon: "success",
                            title: "Update Info After Token Faile is success!"
                          });
                    })
                    .catch(refreshError => {
                        console.log('catch 1-2: ',refreshError);
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                              toast.onmouseenter = Swal.stopTimer;
                              toast.onmouseleave = Swal.resumeTimer;
                            }
                          });
                          Toast.fire({
                            icon: "error",
                            title: `${refreshError.data}`
                          });
                    })
                })
            } else {
                console.log(error)
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                  Toast.fire({
                    icon: "error",
                    title: `${'else: ', error.data}`
                });
            }
        })
    }

    $scope.logout = () => {
        $window.localStorage.removeItem('accessToken');
        $scope.user = {};
        $scope.currentPage = {
            loginPage: true,
            registerPage: false,
            userPage: false,
        };
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "Logged out!!!"
        });
    }
}

angular.module('myApp')
    .controller('AppController', appController);
