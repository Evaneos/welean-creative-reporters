(function($) {
    $.fn.toggleDisabled = function(){
        return this.each(function(){
            this.disabled = !this.disabled;
        });
    };
    $.fn.toggleReadonly = function(){
        return this.each(function(){
            var val = $(this).attr('readonly');
            if (val) {
                $(this).removeAttr('readonly');
            } else {
                $(this).attr('readonly', 'readonly');
            }
        });
    };
})(jQuery);