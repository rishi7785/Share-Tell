var express = require ('express');
var router = express.Router ();


router.get ('/', function (request, response) {
response.send ('posts', {               //test route
    // response.render ('posts', {               //test route
    //     // response.render ('posts', {
    //         data: {
    //             name: 'bob',
    //             value: 42,
    //             phrase: 'lorem ipsum...'
    //         }
    //     });
    // });
    data: {
            name: 'bob',
            value: 42,
            phrase: 'lorem ipsum...'
        }
    });
});

router.post ('/save', function (request, response) {
    // response.send (
    //     'POST was working...' + 'title: ' + request.body.title
    // );

    // Use the 'request.body' to pull data out of any
    // POST request object's data.
    console.log ('body: ', request.body);

    response.redirect ('/post');
});

router.get ('/redirect', function (request, response) {

    response.redirect ('/about');
});

module.exports = router;
