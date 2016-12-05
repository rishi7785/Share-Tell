// Bring in express.
var express = require ('express');

// Create an express router.
var router = express.Router ();

// Load the User schema object.
var User = require ('../model/user.js');

// Define routes.
router.get ('/login', function (request, response) {
    // response.send ('You are now on the login page.');

    // Check to see if the user session exists and
    // the user is defined.
    if (request.session.user) {
        // Redirect user to the dashboard.
        response.redirect ('/user/dashboard');
    }
    else {
        // Show the login template page.
        response.render ('login');
    }
});

router.post ('/login', function (request, response) {
    // response.send ('You have now posted to the login route.');

    // Run a query to pull the user from the database
    // using the 'username' field sent down by the
    // post data.
    db.collection ('users').findOne (
        // The filter or fields to search by.
        {
            username: request.body.username,
            password: request.body.password
        },

        // Additional query options.
        {},

        // Callback function.
        function (error, result) {

            // Check for errors.
            if (error) {
                console.error ('*** ERROR: Problem finding the user.');
                console.error (error);
                response.send ('There was an error with the page.');
            }
            else if (!result) {
                // The query was run but did NOT find a matching
                // object

                // Create a flash message to let the user know there
                // was a problem with their credentials.
                request.flash ('error', 'Your username or password is not correct');

                // Redirect back to the login page.
                response.redirect ('/user/login');
            }
            else {
                // Save the user to the session.
                console.log ('This is the found user: ', result);

                request.session.user = {
                    username: result.username,
                    email: result.email
                }

                console.log ('This is the session data: ', request.session);

                // The query was run and DID find a matching object.
                // response.send ('Found the user by the name: ' + result.username);
                response.redirect ('/user/dashboard');
            }

            // console.log ('This is the result of the query: ', result);
        }
    );
});


router.get ('/register', function (request, response) {
    response.render ('register');
});

router.post ('/register', function (request, response) {

    // Create the parts of the email.
    var toList = [
        {
            email: request.body.email
        },
        {
            email: 'ron.bravo@codercamps.com'
        }
    ]

    var emailTitle = 'Welcome to mydomain.com';
    var emailBody = 'Thanks for registering with us. username ' + request.body.username + ', email ' + request.body.email;


    // Create a user object from the User schmea.
    var user = User (request.body);

    // Save the user to the database using the user mongoose object.
    user.save (function (error, result) {
        // Check for errors.
        if (error) {
            // Display error to user.
            var errorMessage = 'Unable to save new user.';
            console.error ('*** ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            // Send a confirmation email.
            // Load in the http request module.
            var request = require ('request');

            // Make a request to the Sendgrid API service.
            request.post (
                // Configuration object with where to make the call.
                {
                    url: 'https://api.sendgrid.com/v3/mail/send',
                    headers: {
                        'Authorization': 'Bearer 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',
                        'Content-Type': 'application/json'
                    },

                    // The JSON or from data to send with the requst.
                    json: {

                        // The email subject and recipients.
                        personalizations: [
                            {
                                to: toList,
                                subject: emailTitle
                            }
                        ],
                        from: {
                            email: 'no-reply@bob.com'
                        },
                        content: [
                            {
                                type: 'text/html',
                                value: emailBody
                            }
                        ]
                    }
                }
            )
            .on ('response', function (requestReply) {  // Pass a callback for when the 'response' event is fired.
                console.log ('request reply: ', requestReply.statusCode);

                response.send ('Email sent and user registered.');
            })
            .on ('error', function (error) {
                response.error ('There was a problem sending the registration email.');
            })
            ; // end of request.
        }
    });
    //     {
    //         username: request.body.username,
    //         password: request.body.password,
    //         email: request.body.email
    //     },
    //
    //     // The callback function to run once the save is complete.
    //     function (error, result) {
    //         // Check for an error.
    //         if (error) {
    //             console.error ('*** ERROR: Unable to register user.');
    //             response.send ('Server error, unable to register user.');
    //         }
    //         else {
    //             // Redirect to the login page.
    //             response.redirect ('/user/login');
    //         }
    //     }
    // )

router.get ('/reset', function (request, response) {
    response.send ('Your are no the reset page.');
});

router.get ('/dashboard', function (request, response) {
    console.log ('session: ', request.session);

    response.render ('dashboard', {
        data: {
            user: request.session.user
        }
    });
});

router.get ('/logout', function (request, response) {
    request.session.destroy ();
    response.redirect ('/user/login');
});


router.get ('/test', function (request, response) {

    var newUser = User ({
        username: 'bobie bushe',
        password: 'secret'
    });

    newUser.save (function (error) {
        if (error) {
            console.error ('*** ERROR: Unable to save the user.');
            console.error (error);
        }
        else {
            console.log ('User was successfully saved to db: ', newUser);

            User.find ({ username: 'Rishi' }, function (error, foundUser) {
                if (error) {
                    console.error ('*** ERROR: Unable to find the user.');
                    console.error (error);
                }
                else {
                    console.log ('User found: ', foundUser);
                }
            });


            User.findById ('58348492e42f416e1413c130', function (error, foundUser) {
                if (error) {
                    console.error ('*** ERROR: Unable to find the user by id.');
                    console.error (error);
                }
                else {
                    console.log ('User found by id: ', foundUser);
                }
            });
        }
    });

    console.log ('test: ', User);
    response.send ('Testing out the user model.');
})

module.exports = router;
