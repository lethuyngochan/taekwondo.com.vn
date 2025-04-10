(function ($) {

    var jackieAuthValidation = {

        init: function () {
            jQuery('body').delegate('.jackie-pro-login-link', 'click', function (e) {
                jQuery.ajax({
                    type: "POST",
                    url: jackie_urls.ajaxurl,
                    data: {
                        action: 'jackie_pro_show_login_form_popup',
                    },
                    success: function (response) {
                        jQuery('body').find('.jackie-pro-login-form-container').remove();
                        jQuery('body').find('.jackie-pro-login-form-overlay').remove();
                        jQuery('body').append(response);
                        jQuery('#user_login').focus();
                        jackieAuthValidation.addPlaceholder();
                    }
                });
                e.preventDefault();
            });

            jQuery('body').delegate('.jackie-pro-login-form-overlay', 'click', function (e) {
                jQuery('body').find('.jackie-pro-login-form-container').fadeOut();
                jQuery('body').find('.jackie-pro-login-form-overlay').fadeOut();
                e.preventDefault();
            });

            jQuery('body').on('click', '#jackie-custom-auth-register-button', function (e) {
                e.preventDefault();
                var first_name = jQuery('#first_name').val();
                var last_name = jQuery('#last_name').val();
                var user_name = jQuery('#user_name').val();
                var password = jQuery('#password').val();
                var user_email = jQuery('#user_email').val();
                var cpassword = jQuery('#cpassword').val();
                jQuery('.jackie-custom-auth-register-alert-error').text('');
                if (!first_name || !last_name || !user_name || !password || !user_email) {
                    jQuery('.jackie-custom-auth-register-alert-error').text('Please fill all the fields').show();
                    return;
                } else if (password !== cpassword) {
                    jQuery('.jackie-custom-auth-register-alert-error').text('Passwords do not match').show();
                    return;
                } else if (!isValidEmail(user_email)) {
                    jQuery('.jackie-custom-auth-register-alert-error').text('Please enter a valid email address').show();
                    return;
                }

                jQuery.ajax({
                    type: "POST",
                    url: jackie_urls.ajaxurl,
                    data: {
                        action: 'jackie_pro_register_user_front_end',
                        first_name: first_name,
                        last_name: last_name,
                        user_name: user_name,
                        password: password,
                        user_email: user_email
                    },
                    success: function (results) {
                        if (results =="Your registration is completed successfully! To get your credential please check you mail!.")
                            jQuery('.jackie-custom-auth-register-alert-success').text(results).show();
                        else
                            jQuery('.jackie-custom-auth-register-alert-error').text(results).show();
                    },
                    error: function (xhr, status, error) {
                        jQuery('.jackie-custom-auth-register-alert-success').text('An error occurred: ' + error).show();
                    }
                });

                function isValidEmail(email) {
                    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailPattern.test(email);
                }
            });
        },

        addPlaceholder: function () {
            $('#loginform input[id="user_login"]').attr('placeholder', 'Username');
            $('#loginform input[id="user_pass"]').attr('placeholder', 'Password');

            $('#loginform label[for="user_login"]').contents().filter(function () {
                return this.nodeType === 3;
            }).remove();
            $('#loginform label[for="user_pass"]').contents().filter(function () {
                return this.nodeType === 3;
            }).remove();

            $('input[type="checkbox"]').click(function () {
                $(this + ':checked').parent('label').css("background-position", "0px -20px");
                $(this).not(':checked').parent('label').css("background-position", "0px 0px");
            });
        },

        validateLogin: function (formData, isWpDashboard = false) {
            formData.is_wp_dashboard = isWpDashboard;
            $.ajax({
                type: "POST",
                url: jackie_pro_ajax_object.ajax_url,
                data: {
                    action: 'jackie_pro_validate_login',
                    data: formData,
                    is_wp_dashboard: isWpDashboard.toString(),
                },
                success: function (response) {
                    if (response.success) {
                        if (response.data.redirect_url) {
                            window.location.href = response.data.redirect_url;
                        } else {
                            $('#login-message').html('<div class="error">Redirect URL not found.</div>');
                        }
                    } else {
                        $('#login-message').html('<div class="error">' + response.data.message + '</div>');
                    }
                },
                error: function (xhr, status, error) {
                    console.error(error);
                    $('#login-message').html('<div class="error">An error occurred: ' + error + '</div>');
                },
            });
        }

    }

    "use strict";
    $(document).ready(function () {
        jackieAuthValidation.init();

        // Custom register page
        if ($('#signup-content').length) {
            $('body').addClass('wdt-custom-auth-form');
            $('.wrapper').addClass('wdt-custom-auth-form');
        }
    });

    window.customLogin = function (event) {
        event.preventDefault();
        var user_name = $('#user_login').val();
        var user_password = $('#user_pass').val();
        var rememberme = $('#rememberme').is(':checked') ? 'forever' : '';

        if (user_name === '') {
            $('#login-message').text('Please enter your username').show();
        } else if (user_password === '') {
            $('#login-message').text('Please enter your password').show();
        } else {
            var formData = {
                user_name: user_name,
                user_password: user_password,
                rememberme: rememberme
            };
            jackieAuthValidation.validateLogin(formData);
        }
    };

})(jQuery);
