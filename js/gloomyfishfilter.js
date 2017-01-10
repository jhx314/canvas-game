(function(){
	var gfilter = gfilter || {
		type : 'canvas',
		name : 'filters',
		author : 'jeson',
		getInfo : function(){
			return this.author + ' ' + this.type + ' ' + this.name;
		},
		/*
		*	深度复制数据
		*/
		copyImageData: function(context, src){
			var dst = context.createImageData(src.width, src.height);
        	dst.data.set(src.data);
        	return dst; 
		},
		/*
		*	反色: 获取一个像素点的RGB，则一个新的像素点的RGB为（255-r, 255-g, 255-b）
		*/
		colorInvertProcress: function(context, canvasData){
			var tempCanvasData = this.copyImageData(context, canvasData);
			var binaryData = tempCanvasData.data;
			var l = tempCanvasData.width*tempCanvasData.height*4;
			for(var i = 0; i < l; i += 4){
				var r = binaryData[i];
				var g = binaryData[i + 1];
				var b = binaryData[i + 2];
				
				canvasData.data[i] = 255 - r;
				canvasData.data[i + 1] = 255 - g;
				canvasData.data[i + 2] = 255 - b;
			}
		},
		/*
		* 灰色调
		*/
		colorAdjustProcress: function(context, canvasData){
			var tempCanvasData = this.copyImageData(context, canvasData);
			var binaryData = tempCanvasData.data;
			var l = tempCanvasData.width*tempCanvasData.height*4;
			for(var i = 0; i < l; i += 4){
				var r = binaryData[i];
				var g = binaryData[i + 1];
				var b = binaryData[i + 2];
				
				canvasData.data[i] = (r * 0.272) + (g * 0.534) + (b * 0.131);
				canvasData.data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
				canvasData.data[i + 2] = (r * 0.393) + (g * 0.769) + (b * 0.189);
			}
		},
		/*
		* 模糊效果
		*/
		blurProcress: function(context, canvasData){
			var tempCanvasData = this.copyImageData(context, canvasData);  
	        var sumred = 0.0, sumgreen = 0.0, sumblue = 0.0;  
	        for ( var x = 0; x < tempCanvasData.width; x++) {      
	            for ( var y = 0; y < tempCanvasData.height; y++) {      
	      
	                // Index of the pixel in the array      
	                var idx = (x + y * tempCanvasData.width) * 4;         
	                for(var subCol=-2; subCol<=2; subCol++) {  
	                    var colOff = subCol + x;  
	                    if(colOff <0 || colOff >= tempCanvasData.width) {  
	                        colOff = 0;  
	                    }  
	                    for(var subRow=-2; subRow<=2; subRow++) {  
	                        var rowOff = subRow + y;  
	                        if(rowOff < 0 || rowOff >= tempCanvasData.height) {  
	                            rowOff = 0;  
	                        }  
	                        var idx2 = (colOff + rowOff * tempCanvasData.width) * 4;      
	                        var r = tempCanvasData.data[idx2 + 0];      
	                        var g = tempCanvasData.data[idx2 + 1];      
	                        var b = tempCanvasData.data[idx2 + 2];  
	                        sumred += r;  
	                        sumgreen += g;  
	                        sumblue += b;  
	                    }  
	                }  
	                  
	                // calculate new RGB value  
	                var nr = (sumred / 25.0);  
	                var ng = (sumgreen / 25.0);  
	                var nb = (sumblue / 25.0);  
	                  
	                // clear previous for next pixel point  
	                sumred = 0.0;  
	                sumgreen = 0.0;  
	                sumblue = 0.0;  
	                  
	                // assign new pixel value      
	                canvasData.data[idx + 0] = nr; // Red channel      
	                canvasData.data[idx + 1] = ng; // Green channel      
	                canvasData.data[idx + 2] = nb; // Blue channel      
	                canvasData.data[idx + 3] = 255; // Alpha channel      
	            }  
	        }  
		},
		/*
		* 浮雕效果
		*/
		reliefProcess: function(context, canvasData){
			var tempCanvasData = this.copyImageData(context, canvasData);
			for(var x=1; x<tempCanvasData.width-1; x++){
				for(var y=1; y<tempCanvasData.height-1; y++){
					// Index of the pixel in the array      
	                var idx = (x + y * tempCanvasData.width) * 4;         
	                var bidx = ((x-1) + y * tempCanvasData.width) * 4;  
	                var aidx = ((x+1) + y * tempCanvasData.width) * 4;  
	                  
	                // calculate new RGB value  
	                var nr = tempCanvasData.data[aidx + 0] - tempCanvasData.data[bidx + 0] + 128;  
	                var ng = tempCanvasData.data[aidx + 1] - tempCanvasData.data[bidx + 1] + 128;  
	                var nb = tempCanvasData.data[aidx + 2] - tempCanvasData.data[bidx + 2] + 128;  
	                nr = (nr < 0) ? 0 : ((nr >255) ? 255 : nr);  
	                ng = (ng < 0) ? 0 : ((ng >255) ? 255 : ng);  
	                nb = (nb < 0) ? 0 : ((nb >255) ? 255 : nb);  
	                  
	                // assign new pixel value      
	                canvasData.data[idx + 0] = nr; // Red channel      
	                canvasData.data[idx + 1] = ng; // Green channel      
	                canvasData.data[idx + 2] = nb; // Blue channel      
	                canvasData.data[idx + 3] = 255; // Alpha channel 
				}
			}
		},
		/*
		* 雕刻效果
		*/
		diaokeProcess: function(context, canvasData){
			var tempCanvasData = this.copyImageData(context, canvasData);  
	        for ( var x = 1; x < tempCanvasData.width-1; x++)   
	        {      
	            for ( var y = 1; y < tempCanvasData.height-1; y++)  
	            {      
	      
	                // Index of the pixel in the array      
	                var idx = (x + y * tempCanvasData.width) * 4;         
	                var bidx = ((x-1) + y * tempCanvasData.width) * 4;  
	                var aidx = ((x+1) + y * tempCanvasData.width) * 4;  
	                  
	                // calculate new RGB value  
	                var nr = tempCanvasData.data[bidx + 0] - tempCanvasData.data[aidx + 0] + 128;  
	                var ng = tempCanvasData.data[bidx + 1] - tempCanvasData.data[aidx + 1] + 128;  
	                var nb = tempCanvasData.data[bidx + 2] - tempCanvasData.data[aidx + 2] + 128;  
	                nr = (nr < 0) ? 0 : ((nr >255) ? 255 : nr);  
	                ng = (ng < 0) ? 0 : ((ng >255) ? 255 : ng);  
	                nb = (nb < 0) ? 0 : ((nb >255) ? 255 : nb);  
	                  
	                // assign new pixel value      
	                canvasData.data[idx + 0] = nr; // Red channel      
	                canvasData.data[idx + 1] = ng; // Green channel      
	                canvasData.data[idx + 2] = nb; // Blue channel      
	                canvasData.data[idx + 3] = 255; // Alpha channel      
	            }  
	        }  
		},
		/*
		* 镜像映射
		*/
		mirrorProcess: function(context, canvasData){
			var tempCanvasData = this.copyImageData(context, canvasData);  
	        for ( var x = 0; x < tempCanvasData.width; x++) // column  
	        {      
	            for ( var y = 0; y < tempCanvasData.height; y++) // row  
	            {      
	      
	                // Index of the pixel in the array      
	                var idx = (x + y * tempCanvasData.width) * 4;         
	                var midx = (((tempCanvasData.width -1) - x) + y * tempCanvasData.width) * 4;  
	                  
	                // assign new pixel value      
	                canvasData.data[midx + 0] = tempCanvasData.data[idx + 0]; // Red channel      
	                canvasData.data[midx + 1] = tempCanvasData.data[idx + 1]; ; // Green channel      
	                canvasData.data[midx + 2] = tempCanvasData.data[idx + 2]; ; // Blue channel      
	                canvasData.data[midx + 3] = 255; // Alpha channel      
	            }  
	        }  
		}
	};
	
	if(!window.gfilter){
		window.gfilter = gfilter;
	}
})();