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
}

angular.module('myApp')
    .controller('AppController', appController);
