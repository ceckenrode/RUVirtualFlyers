$(document).ready(function() {


    switch (window.location.pathname) {
        case '/feed':
            $('#all').addClass('active');
            break;
        case '/feed/food':
            $('#food').addClass('active');
            break;
        case '/feed/nightlife':
            $('#nightlife').addClass('active');
            break;
        case '/feed/restaurants':
            $('#restaurants').addClass('active');
            break;
        case '/feed/shopping':
            $('#shopping').addClass('active');
            break;
        case '/feed/active+life':
            $('#activeLife').addClass('active');
            break;
        case '/feed/arts+%26+entertainment':
            $('#arts').addClass('active');
            break;
        case '/feed/automotive':
            $('#automotive').addClass('active');
            break;
        case '/feed/beauty+%26+spas':
            $('#beauty').addClass('active');
            break;
        case '/feed/education':
            $('#education').addClass('active');
            break;
        case '/feed/event+planning+%26+services':
            $('#event').addClass('active');
            break;
        case '/feed/health+%26+medical':
            $('#health').addClass('active');
            break;
        case '/feed/home+services':
            $('#home').addClass('active');
            break;
        default:
            $('#all').addClass('active');
    }

});
