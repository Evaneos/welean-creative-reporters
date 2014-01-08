
module.exports = function(nconf) {

    return function(options) {

        return {

            to: '{0} <{1}>'.format('Mathieu LEMAIRE', 'lemaire.mathieu@gmail.com'),
            subject: 'Test email'

        };

    };

};