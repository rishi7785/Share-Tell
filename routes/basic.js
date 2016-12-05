var express = require ('express');

var router = express.Router ();


router.get ('/', function (request, response) {
    response.render ('home');
});

router.get ('/about', function (request, response) {
    response.render ('about');
});
router.get ('/contact', function (request, response) {
    response.render ('contact');
});

router.get ('/faq', function (request, response) {
    response.render ('faq');
});

module.exports = router;
