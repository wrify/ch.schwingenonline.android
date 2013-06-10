/**
 * onGoing click event listener for internal links.
 * We need this to process clicks. on for ajax loaded content.
 */
$(document).on('click', 'a[data-routing]', function(e) {
    e.preventDefault();

    var $this = $(this);
    var notification = navigator.notification;

    notification.activityStart("Laden", "Inhalt wird geladen...");

    async.waterfall([
        function(callback) {
            process_click($this, callback);
        },
        function(callback) {
        	wait_for_images(callback);
        },
        function(callback) {
        	update_scroller(callback);
        }
    ], function (err, result) {
    	setTimeout(function() {
    		notification.activityStop();
    	}, 450);
    });
});

/**
 * onGoing click event listener for actiobar-spinner links.
 * We need this to close the menu after clicking an item.
 */
$(document).on('click', '.spinner-item', function(e) {
	e.preventDefault();
	$(this).parent('.action-overflow-list').toggle().removeClass('active');
});

/**
 * Click event listener for action-overflow-icon.
 * We need this to prevent default behavior.
 */
$('.action-overflow-icon').click(function(e) {
    e.preventDefault();
});

/******************************************************************************
* LAYOUT EVENTS END
******************************************************************************/

/**
 * iScroll scroll refresh event.
 * This event is raised every time the iscroll object gets refreshed (e.g. when scrolling).
 *
 * @param puller - puller object
 */
function onScrollerRefresh(puller) {
    var dom = puller.dom;

    if (dom.hasClass('loading')) {
        dom.removeClass();
        dom.find('.pullUpLabel').html("Ziehen zum Aktualisieren...");
    }
}

/**
 * iScroll scroll move event.
 * This event is raised every time the iscroll puller object gets moved.
 *
 * @param puller - puller object
 */
function onScrollerMove(puller) {
    var dom = puller.dom;

    if (_iscroll.y < (_iscroll.maxScrollY - 5) && !dom.hasClass('flip')) {
        dom.addClass('flip');
        dom.find('.pullUpLabel').html("Loslassen zum Aktualisieren...");
        _iscroll.maxScrollY = _iscroll.maxScrollY;
    } else if (_iscroll.y > (_iscroll.maxScrollY + 5) && dom.hasClass('flip')) {
        dom.removeClass();
        dom.find('.pullUpLabel').html("Ziehen zum Aktualisieren...");
        _iscroll.maxScrollY = puller.offset;
    }
}

/**
 * iScroll scroll end event.
 * This event is raised every time the iscroll puller object has been fully released.
 *
 * @param puller - puller object
 */
function onScrollerEnd(puller) {
    var dom = puller.dom;

    if (dom.hasClass('flip')) {
        dom.removeClass('flip').addClass('loading');
        dom.find('.pullUpLabel').html("Laden...");
        onPullUpRelease();
    }
}

/**
 * iScoll "callback" event for fully released pullers.
 * Fired by onScrollerEnd().
 */
function onPullUpRelease() {
    setTimeout(function() {
        var el, li, i;
        el = document.getElementById('mustache');

        for (i = 0; i < 3; i++) {
            li = document.createElement('li');
            li.innerText = 'Generated row ' + i;
            el.appendChild(li, el.childNodes[0]);
        }

        _iscroll.refresh();
    }, 1000);
}

/******************************************************************************
* SCOLLER EVENTS END
******************************************************************************/
