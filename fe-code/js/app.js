$(document).ready(function () {
    const txtSearchfor = $('input[name="txtSearch"]');
    $('input[name="search"]').on('change', function (e) {
        e.preventDefault();
        const invalidEmailError = 'Please enter a valid email address';
        const invalidPhoneError = 'Please enter a valid phone number';
        const emailPlaceHolder = 'Enter an Email Address';
        const phonePlaceHolder = 'Enter a Phone Number';
        let searchType = $('input[name="search"]:checked').val();
        showHideError(false);
        if (searchType.toLowerCase() === 'emailaddress') {
            $('.error-msg').html(invalidEmailError);
            txtSearchfor[0].placeholder = emailPlaceHolder;
        }
        else {
            $('.error-msg').html(invalidPhoneError);
            txtSearchfor[0].placeholder = phonePlaceHolder;
        }
    });


    $("#btn-search").on('click', function (e) {
        e.preventDefault();
        let searchType = $('input[name="search"]:checked').val();
        if (searchType.toLowerCase() === 'emailaddress') {
            processSearch(true);
        }
        else {
            processSearch(false);
        }
        
    });

    
    $('input[type="text"]').keypress(function (event) {
        let searchValue, url;
        let searchType = $('input[name="search"]:checked').val();
        searchValue = txtSearchfor.val();

        var isvalidated = false;
        if (searchType.toLowerCase() === 'emailaddress') {
             if (validation.isEmailAddress(searchValue)) {
                url = 'https://ltv-data-api.herokuapp.com/api/v1/records.json?email=' + searchValue;
                isvalidated = true;
            }
        }
        else {
            if (validation.isPhoneNumber(searchValue)) {
                url = 'https://ltv-data-api.herokuapp.com/api/v1/records.json?phone=' + searchValue;
                isvalidated = true;
            }
        }

        keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            /**
             * Makes a request to ltv API to search an specific email address.
             * If there's a response, it gets stored in the local storage and redirects to results page
             */
            event.preventDefault();
            localStorage.clear(); //Clears storage for next request
            showHideError(false);
            if (isvalidated === true) {
                getRespectiveInormation(url);

            } else if (isvalidated !== true) {
                showHideError(true);
            }
        }
    });

    function processSearch(isEmail) {
        localStorage.clear(); //Clears storage for next request.
        let searchValue = txtSearchfor.val();
        var isvalidated = false;
        let url;
        if (isEmail) {
             if (validation.isEmailAddress(searchValue.toLowerCase())) {
                url = 'https://ltv-data-api.herokuapp.com/api/v1/records.json?email=' + searchValue;
                isvalidated = true;
            }
        }
        else {
            if (validation.isPhoneNumber(searchValue)) {
                url = 'https://ltv-data-api.herokuapp.com/api/v1/records.json?phone=' + searchValue;
                isvalidated = true;
            }
        }

        if (isvalidated === true) {
            showHideError(false);
            getRespectiveInormation(url);
        } else if (isvalidated !== true) {
            showHideError(true);
        }
    }

    function showHideError(iserror) {
        if (iserror) {
            txtSearchfor[0].parentNode.classList.add('error');
        }
        else {
            txtSearchfor[0].parentNode.classList.remove('error');
        }
    }

    function getRespectiveInormation(url) {
        const proxyurl = '';
        $('.mainbody').hide();
        $('#loader').show();
        fetch(proxyurl + url)
            .then((response) => response.text())
            .then(function (contents) {
                localStorage.setItem('userObject', contents);
                window.location.href = 'result.html';
            })
            .catch((e) => {
                console.log(e);
                $('.mainbody').show();
                $('#loader').hide();
            });
    }

    let validation = {
        isEmailAddress: function (email) {
            const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            return email.match(emailRegEx);  // returns a boolean
        },
        isPhoneNumber: function (phone) {
            const phoneRegEx = /^[0-9]{10}$/;
            return phone.match(phoneRegEx);  // returns a boolean
        }
    };

});
