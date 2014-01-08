// override timeago settings
(function($) {
    $.timeago.settings = {
        refreshMillis: 60000,
        allowFuture: true,
        strings: {
            prefixAgo: "il y a",
            prefixFromNow: "dans",
            suffixAgo: null,
            suffixFromNow: null,
            seconds: "quelques secondes",
            minute: "une minute",
            minutes: "%d minutes",
            hour: "une heure",
            hours: "%d heures",
            day: "un jour",
            days: "%d jours",
            month: "un mois",
            months: "%d mois",
            year: "un an",
            years: "%d années",
            wordSeparator: " ",
            numbers: []
        }
    };
})(jQuery);