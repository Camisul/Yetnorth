// ==UserScript==
// @name         Yetnorth
// @namespace    http://tampermonkey.net/
// @version      0.21a
// @description  playlist downlader
// @author       Nextsoul
// @match        https://vk.com/audios*
// @downloadURL  https://raw.githubusercontent.com/left2x/Yetnorth/master/Yetnorth.js
// @updateURL    https://raw.githubusercontent.com/left2x/Yetnorth/master/Yetnorth.js
// @grant        none
// ==/UserScript==

function downladerMain() {

    /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
    var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}

    function drawPannel() {
        var div = document.createElement('div');
        div.className = "page_block listDld";
        div.innerHTML = " Внимание! Для корректного получения списка треков необходимо проскролить до самого конца страницы.";
        var elements = document.getElementsByClassName("_audio_page_content_block_wrap audio_page_content_block_wrap");
        var reqElement = elements[0];
        var parentDiv = reqElement.parentNode;
        parentDiv.insertBefore(div, reqElement);
        var btn = document.createElement('button');
        btn.id = "listBtn";
        btn.innerHTML = "Скачать список песен";
        btn.onclick = function(){
            grabAndSave();
        }
        var block = document.getElementsByClassName('listDld')[0];
        block.insertBefore(btn, null)
        block.style.padding = "15px 21px";
        var button = document.getElementById('listBtn');
        button.style.backgroundColor =  "#577ca1";
        button.style.border = "none";
        button.style.color = "#fff";
        button.style.padding = "5px 15px";
        button.style.textAlign = "center";
        button.style.textDecoration = "none";
        button.style.display = "inline-block";
        button.style.fontSize = "12.5px";
        button.style.margin = "4px 2px 2px 0px";
        button.style.cursor = "pointer";
        button.style.borderRadius = "3px";
        button.style.fontFamily = "-apple-system,BlinkMacSystemFont,Roboto,Open Sans,Helvetica Neue,sans-serif";
    }

    function grabAndSave() {

        var artist = [];
        var songName = [];
        var fullId = [];
        var downladLink = [];
        var downladInfo = [];
        var readyForSearch = [];

        var rawArtists = [];
        var rawName = [];

        rawName = document.getElementsByClassName("audio_row__title_inner _audio_row__title_inner");
        rawArtists = document.getElementsByClassName("audio_row__performer");
        rawCover = document.getElementsByClassName("audio_row_with_cover");

        for (var i = 0; i < rawArtists.length; i++) {
            artist[i] = document.getElementsByClassName("audio_row__performer")[i].text;
        }

        for (i = 0; i < rawArtists.length; i++) {
            songName[i] = document.getElementsByClassName("audio_row__title_inner _audio_row__title_inner")[i].innerText;
        }

        for (i = 0; i < artist.length; i++) {
            readyForSearch[i] = artist[i] + " - " + songName[i] + "\n";
        }

        function set_url(el){
                var id = el.dataset["fullId"];
                var info = vkopt.audio.__full_audio_info_cache[id];
                    // если не в загруженной инфе и очередях загрузки
                var hq = vkopt.audio.__hover_load_queue;
                if (!info && vkopt.audio.__loading_queue.indexOf(id) == -1 &&  vkopt.audio.__load_queue.indexOf(id) == -1){
                      var idx = hq.indexOf(id);
                      if (idx == -1){ // не знаю возможно ли, но лучше добавлю проверку.
                         hq.push(id);
                         idx = hq.length - 1;
                      }
                      var start = Math.max(0, idx - 2);
                      var end = Math.min(start + rawCover.length, hq.length) - start;
                      var to_load = hq.splice(start, end);
                      vkopt.audio.__load_queue = vkopt.audio.__load_queue.concat(to_load);
                      vkopt.audio.load_audio_urls(); // запускаем процесс загрузки инфы об аудио из очереди
                   }
        }

        set_url(rawCover[0]);

        for (i = 0; i < rawCover.length; i++) {

            fullId[i] = rawCover[i].dataset.fullId;
            downladInfo[i] = vkopt.audio.__full_audio_info_cache[fullId[i]];
            downladLink[i] = downladInfo[i].url;
        }

        for (i = 0; i < readyForSearch.length; i++) {
            console.log(readyForSearch[i] + downladLink[i]);
        }


        var sth = new Blob(readyForSearch+downladLink,{type: "text/plain;charset=utf-8"});

        saveAs(sth, "songlist.txt");
    }

    drawPannel();

}



function set_url(el){
        var id = el.dataset["fullId"];
        var info = vkopt.audio.__full_audio_info_cache[id];
            // если не в загруженной инфе и очередях загрузки
        var hq = vkopt.audio.__hover_load_queue;
        if (!info && vkopt.audio.__loading_queue.indexOf(id) == -1 &&  vkopt.audio.__load_queue.indexOf(id) == -1){
              var idx = hq.indexOf(id);
              if (idx == -1){ // не знаю возможно ли, но лучше добавлю проверку.
                 hq.push(id);
                 idx = hq.length - 1;
              }
              var start = Math.max(0, idx - 2);
              var end = Math.min(start + 5, hq.length) - start;
              var to_load = hq.splice(start, end);
              vkopt.audio.__load_queue = vkopt.audio.__load_queue.concat(to_load);
              vkopt.audio.load_audio_urls(); // запускаем процесс загрузки инфы об аудио из очереди
           }
}

if (window.loaded) {
    downladerMain();
} else {
    var inject = function() {
        window.loaded = 1;
        var script = document.createElement('script');
        script.appendChild(document.createTextNode('(' + downladerMain + ')();'));
        (document.body || document.head || document.documentElement).appendChild(script);
    };

    //if (document.readyState == 'complete') inject();
    window.addEventListener("load", function() {
        inject();
    });
}
