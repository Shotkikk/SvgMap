//https://github.com/adobe-webplatform/Snap.svg/issues/121
Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype;
    elproto.toBack = function () {
        this.prependTo(this.paper);
    };
    elproto.toFront = function () {
        this.appendTo(this.paper);
    };
});

for (var key in map) {
    var path = map[key];
    var name = path.data('name');

    var bbox = path.getBBox();
    var text = path.paper.text(bbox.x + (bbox.width / 2), bbox.y + (bbox.height / 2), name).attr({
        font: '10px Barlow Semi Condensed',
        'text-anchor' : "middle"
    });
    var group = svg.group(map[key], text);
    map[key] = group;
}

for (var key in map) {
    map[key][0].attr({
        'fill': '#ddd',
        'opacity' : 0.4,
        'stroke' : '#fff',
        'stroke-width' : 2
    });

    map[key].mouseover(function(e) {
        if (this != activeElement) {
            this.toFront();

            this[0].animate({
                'fill': '#1E88E5',
                'opacity' : 1,
                'stroke' : '#1565C0',
                'stroke-width' : 2
            }, 600);
            this[1].animate({
                'fill' : '#fff'
            }, 300);
        }

        //zawsze na koncu wyniesmy aktywny element na sama gore
        if (activeElement !=null) {
            activeElement.toFront();
        }
    });

    map[key].mouseout(function(e) {
        if (this != activeElement) {
            this.toBack();
            this[0].animate({
                'fill': '#ddd',
                'opacity' : 0.4,
                'stroke' : '#fff',
                'stroke-width' : 2
            }, 600);
            this[1].animate({
                fill : '##212121'
            }, 300)
        }
    });

    map[key].click(function() {
        if (activeElement != null && activeElement != this) {
            activeElement[0].data('active', false);
            activeElement[0].animate({
                'fill': '#ddd',
                'opacity' : 0.4,
                'stroke' : '#fff',
                'stroke-width' : 2
            }, 600);
            activeElement[1].animate({
                fill : '##212121'
            }, 300);
            activeElement[0].attr({
                'filter' : ''
            })
        }

        activeElement = this;

        this[0].data('active', true);
        this.toFront();

        this[0].animate({
            'fill': '#D32F2F',
            'opacity' : 1,
            'stroke' : '#C62828',
            'stroke-width' : 2
        }, 600);
        this[1].animate({
            fill : '#fff'
        }, 300)

        var f = svg.filter(Snap.filter.shadow(0, 2, 3));
        this[0].attr({
            filter: f
        });

        var pathName = this[0].data('name');
        $('.map-cnt').append('<span class="loading">Wczytuje dane</span>');

        $.ajax({
            url : 'skrypt-mapy.php',
            data : {
                id : this[0].data('id')
            },
            dataType : 'json',
            method : 'post',
            success : function(ret) {
                $('.map-data .data').empty();
                $('.map-data .name').html(pathName);
                $('.map-data .people-count').html(ret.people);
                $('.map-data .man-count').html(ret.man);
                $('.map-data .woman-count').html(ret.woman);
            },
            complete : function() {
                $('.map-cnt .loading').remove();
            }
        })
    })
}