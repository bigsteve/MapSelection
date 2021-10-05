/**
 * 
 * Class: JavaScript class MapSelection
 * Version 1.1
 * copyright Stefan Miller
 * ALL RIGHTS RESERVED
 * 
 * Description: application for free drawing a polygon map selection which creates a collection of the polygon points as geographic coordinates in json format
 *
 * Redistributions of source code or the binary form of this software must retain the above copyright notice, this list of
 * conditions and the following disclaimer:
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */
 
 
 
function MapSelection(mapObject, canv) {
    
    var mapContainer = mapObject._container;
    var mapMenu;
    var consoleDebug = false;
    var canvasEl;
    var buttonDraw;
    var buttonDelete;
    var canvasOffset = new Object();
    makeCanvas();
    var countPoints = 0;
    var countAreas = 1;
    var mapType = "leaflet";
    var cWidth = document.documentElement.clientWidth;
    var cHeight = document.documentElement.clientHeight;
    var ctx = canvasEl.getContext("2d");
    var areaImage;
    var isDrawing;
    var showCanvasLine = false;
    var captureCanvasImage = false;
    var points = [];
    var areaShape = "polygon";
    var areaName = null;
    var pointX;
    var pointY;
    var processResolution = 20; // perimeter points to be processed at server
    var areaResolution = 1; // area display reduction factor
    var tickness = 10;
    var shapeTickness = 3;
    var color = "200, 70, 0";
    
    var isTouchSupported = "ontouchstart" in window;
    var clickEvent = isTouchSupported ? "tap" : "click";
    var startEvent = isTouchSupported ? "touchstart" : "mousedown";
    var moveEvent = isTouchSupported ? "touchmove" : "mousemove";
    var endEvent = isTouchSupported ? "touchend" : "mouseup";
    var areas;
    var selectedArea;
    var areaCoordinates;
    var mW, mH, N, E, S, W, zoom, maxZoom, bounds;
    setAreaObjects();
    
    
    
    
    
    this.options = function(v){
        areaShape = v.areaShape;
        shapeTickness = v.shapeTickness;
        areaResolution = (v.areaResolution > 0 & v.areaResolution < 11) ? 11-v.areaResolution : 1;
        areaResolution = (areaShape === "rectangle") ? 1 : areaResolution;
    };
    
    
    
    
    
    
    function setAreaObjects() {
        areas = {"features": []};
        selectedArea;
        areaCoordinates = [];
    }
    
    
    
    
   
    function makeCanvas(){
        
        if(mapType = "leaflet") {
            mW = mapObject.getSize().x;
            mH = mapObject.getSize().y;
            N = mapObject.getBounds()._northEast.lat;
            E = mapObject.getBounds()._northEast.lng;
            S = mapObject.getBounds()._southWest.lat;
            W = mapObject.getBounds()._southWest.lng;
            zoom = mapObject.getZoom();
            maxZoom = mapObject.getMaxZoom();
            bounds = mapObject.getBounds();
            mapMenu = mapObject.zoomControl._container;
        }
        
        
        
        if(canv != undefined) {
            
            canvasEl = canv;
            
        } else {
            
            canvasEl = createEl("canvas", {"id":"canvas-"+ mapContainer.id,"style":"position:absolute;left:"+mapContainer.offsetLeft + "px;top:"+mapContainer.offsetTop + "px;","width":mapContainer.clientWidth+";display:none;background:rgba(25,130,215,.2);z-index:999;","height":mapContainer.clientHeight}, mapContainer.parentNode,"");
            
            buttonDraw = createEl(
                "a",
                {"class":"leaflet-control-draw-area","style":"line-height:40px; height:40px;font-weight:bold; cursor:pointer;"},
                mapMenu,
                "S"
            );
        
            buttonDelete = createEl(
                "a",
                {"class":"leaflet-control-draw-area","style":"line-height:40px; height:40px;font-weight:bold; cursor:pointer;"},
                mapMenu,
                "D"
            );
        
     
        }
        
        
        if (mapContainer != undefined) {
            canvasEl.style.display = "none";
            canvasEl.style.background   = "rgba(25,130,215,.2)";
        }
        
        
        mapContainer.getElementsByClassName("leaflet-top leaflet-left")[0].style.zIndex = 1000;
        canvasEl.style.zIndex   = 999;
    }
    
    
    
    
    
    
    function createEl(tagName, attr, appendTo, innerH) {
        
        var el = document.createElement(tagName);
        
        for (var index in attr) {
            
            if (!attr.hasOwnProperty(index)) {
                continue;
            }
            
            el.setAttribute(index, attr[index]);
        }
        
        el.innerHTML = innerH;
        appendTo.appendChild(el);
        
        return el;
    }
    
    
    
    
    
    function setCanvas(){
        getElementOffset(mapContainer);
        canvasEl.addEventListener(startEvent, pointerDown, false);
        canvasEl.addEventListener(moveEvent, pointerMove, false);
        canvasEl.addEventListener(endEvent, pointerUp, false);
        buttonDraw.addEventListener(startEvent, useCanvas, false);
        buttonDelete.addEventListener(startEvent, deleteSelections, false);
        ctx.lineWidth = tickness;
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.shadowBlur = 2;
        ctx.shadowColor = "rgb("+color+", 1)";
        ctx.strokeStyle = "rgb("+color+")";
        ctx.fillStyle = "rgba("+color+", .06)";    
        canvasEl.width = mapContainer.clientWidth;
        canvasEl.height = mapContainer.clientHeight;
    }
    

    
    
    setCanvas();
    
    function useCanvas(){
        
        if(canvasEl.style.display === "none"){
            canvasEl.style.display = "block";
            buttonDraw.style.color   = "rgba(255,0,0,1)";
        } else {
            canvasEl.style.display = "none";
            buttonDraw.style.removeProperty("color");
        }
    }
    
    
    
    
    
    
    function deleteSelections() {
        
        var paths = mapContainer.getElementsByTagName("path");
        var l = paths.length;
        
        for(var i = 0; i < l; i++) {
            paths[0].remove();
        }
        
        setAreaObjects();
    }
    
    
    
    
    
    
    
    window.onresize = function(e){
        setCanvas();
    };
    
    
    onElementHeightChange(document.body, function(){
       setCanvas();
    });
 
    
    
    
    
    function pointerDown(e) {
        
        if(isDrawing) {
            return;
        } else {
            isDrawing = true;
        }
        color = Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1);
        areaName = "Area " + countAreas++;
        areaCoordinates = [];
        countPoints = 0
    };


    

    
    
    



    function pointerMove(e) {

        e.preventDefault();
        if (!isDrawing) return;
        getPoints(e);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        points.push({ x: pointX, y: pointY });
        var ppp = mapObject.layerPointToLatLng([pointX - mapObject._mapPane._leaflet_pos.x,pointY - mapObject._mapPane._leaflet_pos.y]);
        getCoordinates(ppp.lat, ppp.lng);
        
        if(showCanvasLine){
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            bezierLine(points);
            ctx.stroke();
        }
        
        createLine();
        countPoints++;
        
    };

    


    
    
    
    

   function pointerUp() {
        
        if(consoleDebug) debug();
        
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    
        
        if(showCanvasLine & captureCanvasImage) areaCapture(canvasEl);
        createArea();
        isDrawing = false;
        
        
        points.length = 0;
        

    };

    
    
    
    
    
    
    function getCoordinates(latitude, longitude){
        if(countPoints%areaResolution === 0) {
            areaCoordinates.push({ lat: latitude, lng: longitude });
        }
        
    }
    
    
    
      
    function getElementOffset(el) {
        
        var ely = el;
        
        
        var _offsetLeft = 0;
        
        do {
          if ( !isNaN( el.offsetLeft )){
              
              _offsetLeft += el.offsetLeft;
          }
          
        } while( el = el.offsetParent );
        
        
        var _offsetTop = 0;
        
        do {
          if (!isNaN( ely.offsetTop)){
              
              _offsetTop += ely.offsetTop;
          }
          
        } while(ely = ely.offsetParent);
        
        canvasOffset.x = _offsetLeft;
        canvasOffset.y = _offsetTop;
        
        
    }
    
    
    
    /**
    * function created by vsync
    * https://stackoverflow.com/users/104380/vsync
    *
    */
    function onElementHeightChange(el, callback){
        
        var lastHeight = el.clientHeight, newHeight;
        
        (function run(){
            newHeight = el.clientHeight;
            if( lastHeight != newHeight )
                callback();
            lastHeight = newHeight;

            if( el.onElementHeightChangeTimer )
                clearTimeout(el.onElementHeightChangeTimer);

            el.onElementHeightChangeTimer = setTimeout(run, 200);
            
        })();
    }
    

    

    
    function getPoints(e){
         pointX = (isTouchSupported) ? e.touches[0].pageX : e.pageX;
         pointY = (isTouchSupported) ? e.touches[0].pageY : e.pageY;
         pointX = pointX - canvasOffset.x;
         pointY = pointY - canvasOffset.y;
    }


    
    
    
    
    
    function bezierLine(points){
         for (var i = 1; i < points.length; i++) {
             if(i%4 === 0 && i > 8) {
                 ctx.bezierCurveTo(     ( points[i-9].x + points[i-7].x + points[i-5].x + points[i-3].x )/4, ( points[i-9].y + points[i-7].y  + points[i-5].y  + points[i-3].y )/4,
                                        ( points[i-8].x + points[i-6].x + points[i-4].x + points[i-2].x )/4, ( points[i-8].y + points[i-6].y  + points[i-4].y  + points[i-2].y )/4,
                                        ( points[i-6].x + points[i-4].x + points[i-2].x + points[i].x )/4,    ( points[i-6].y + points[i-4].y  + points[i-2].y  + points[i].y )/4
                                            );
            }
        }
    }
    
    

    
    
    
    function coordinatesSummary(p){
        var o = [];
        var r = (p.length/processResolution > 0) ? Math.round(p.length/processResolution) : 1;
        for(var i = 0; i < p.length; i++) {
            if(i%r === 0) {
                o.push({ lat: p[i].lat, lng: p[i].lng });
            }
        }
        return o;
    }

    
    
    
    
    

    
    
    
    function getTileURL(lat, lon, zoom) {
        var xtile = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
        var ytile = parseInt(Math.floor( (1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1<<zoom) ));
        return "" + zoom + "/" + xtile + "/" + ytile;
    }
    
    
    

    

    
    
    
    function createArea(){
        if(selectedArea != null) mapObject.removeLayer(selectedArea);
        var shapeProp = [[areaCoordinates],{color: "rgba("+color+",1)", weight: shapeTickness}];
        switch(areaShape){
            case "polygon":    
                selectedArea = (new L.Polygon(shapeProp[0], shapeProp[1])).addTo(mapObject).bindPopup(areaName);
            break
            case "rectangle":
                selectedArea = (new L.Rectangle([areaCoordinates[0], areaCoordinates[areaCoordinates.length-1]], shapeProp[1])).addTo(mapObject).bindPopup(areaName);
            break
        }
        
        var gjson = selectedArea.toGeoJSON();
        gjson.type = areaShape; 
        gjson.properties = {name:areaName, color: "rgba("+color+",1)", weight: shapeTickness};
        areas.features.push(gjson);
        selectedArea = null;
    }
    
    
    
    
    
    
    
    
    
    function createLine(){

        if(selectedArea != null) mapObject.removeLayer(selectedArea);
        
        var shapeProp = [[areaCoordinates],{color: "rgba("+color+",1)", weight: shapeTickness}];
        
        switch(areaShape){
            case "polygon":    
            selectedArea = (new L.Polyline(shapeProp[0], shapeProp[1])).addTo(mapObject).bindPopup(areaName);
            break
            case "rectangle":
                selectedArea = (new L.Rectangle([areaCoordinates[0], areaCoordinates[areaCoordinates.length-1]], shapeProp[1])).addTo(mapObject).bindPopup(areaName);
            break
        }
        
                      
    }
    
    
    
    
    
    
    

    function areaCapture(el){
     
         elemRemove = document.getElementById("areaImage");
         if(elemRemove != null) elemRemove.parentNode.removeChild(elemRemove);

         dataUrl = el.toDataURL();
         areaImage = document.createElement("img");
         areaImage.src = dataUrl;

         // capture style
         
         areaImage.style.width = el.width + "px";
         areaImage.style.height = el.height + "px";
         areaImage.id = "areaImage";

         // append capture
         document.body.appendChild(areaImage);
    }
    
    
    
    
    
    
    
    function debug(){
        console.log("All coordinates: ",areaCoordinates);
        console.log("Coordinates summary: ",coordinatesSummary(areaCoordinates));
        console.log(selectedArea.toGeoJSON());
        console.log("areas:", areas);
        
    }
    
    
    
    this.getAreas = function(){
        return areas;
    }
    
    
    
    this.filterLocations = function(){
        return "not implemented";
    };
    

};
