/**
 * Devrama-Lazyload Version 0.9.0
 * Developed by devrama.com
 * 
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */


(function($){
	var DrLazyload = function(element, options){
		this.type = 'window';
		this.loading_list = {};
		
		this.options = {
			effect: 'fadein', // 'none', 'fadein'
			data_attr_name: 'lazy-src'
		};
		
		$.extend(this.options, options);
		
		if(element !== null){
			this.type = 'box';
			this.$element = $(element);
			this.$container = this.$element;
			if(this.$element.css('position') == 'static'){
				this.$element.css('position', 'relative');
			}
			
		}
		else{
			this.type = 'window';
			this.$element = $('body');
			this.$container = $(window); 
		}
	};
	
	DrLazyload.prototype = {
		constructor: DrLazyload,
		
		_init: function(){
			this._init_loading_list();
			this._on_scroll();
			
		},
		
		_on_scroll: function(){
			var that = this;
			this.$container.off('scroll.drlazyload.image');
			this.$container.on('scroll.drlazyload.image', function(e) {
				that._lazyload();
    		});
    		
		},
		
		_init_loading_list: function(){
			var that = this;
			var transparent_data = 'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
			
			this.$element.find('[data-'+this.options.data_attr_name+']').each(function(index, value){
				that.loading_list[index] = this;
				
				$(this).attr('src', transparent_data);
				if($(this).data('size')){
					var size = $(this).data('size').split(":");
					if(size[0] != '') $(this).css('width', size[0]+'px');
					if(size[1] != '') $(this).css('height', size[1]+'px');
				}
				
			});
			that._lazyload();
		},
		
		_lazyload: function(){
			var that = this;
			
			var container_top = this.$container.scrollTop() + this.$container.height();
			
			$.each(this.loading_list, function(index, value){
				if(that.type == 'window') image_position = $(value).offset();
				else image_position = $(value).position();
				/*
				console.log('index '+index);
				console.log('photo-top '+image_position.top);
				console.log('photo-height '+$(value).outerHeight());
				console.log('scroll-top '+that.$container.scrollTop());
				console.log('container-top '+container_top);
				console.log('----------------------------');
				*/
				if(image_position.top + $(value).outerHeight() >= that.$container.scrollTop() &&
						image_position.top <= container_top){
					var data_url = that.options.data_attr_name;
					var $element = $(this);
					
					var tmp_image = new Image();
					tmp_image.onload = tmp_image.onerror = function(){
						$element.hide();
						$element.attr('src', $element.data(data_url));
						switch(that.options.effect){
							case 'fadein':
								$element.fadeIn();
								break;
							case 'none':
								$element.show();
								break;
							default:
								$element.show();
								break;
						}
												
						
		    		};
						
					tmp_image.src = $(this).data(data_url);
					if(!tmp_image){
						$element.hide();
						$element.attr('src', $element.data(data_url));
						switch(that.options.effect){
							case 'fadein':
								$element.fadeIn();
								break;
							case 'none':
								$element.show();
								break;
							default:
								$element.show();
								break;
						}
						
					}
					
					
					delete that.loading_list[index];
				}
			});
			
			//console.log('---------------------------------------------------------');
			
			
		}
		
		
	};
	
	$.DrLazyload = function (options){
		var $window = $(window);
		var data = $window.data('DrLazyload');
		if (!data) $window.data('DrLazyload', (data = new DrLazyload(null, options)));
		data._init();
		
		return this;
	};
	
	$.DrLazyload.Constructor = DrLazyload;
	
	$.fn.DrLazyload = function (options) {
		if (typeof options === 'string') {
			var $this = $(this);
			var data = $this.data('DrLazyload');
			if (!data) $this.data('DrLazyload', (data = new DrLazyload(this, options)));
			
			return data[options].apply(data, Array.prototype.slice.call(arguments, 1));
		}
		
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('DrLazyload');
			if (!data) $this.data('DrLazyload', (data = new DrLazyload(this, options)));
			data._init();
			
		});
		
	};
	
	
	$.fn.DrLazyload.Constructor = DrLazyload;
	
	
}(jQuery));