var reservationChild;

//ajax
function postCallAjax(url, data, success){
	$.ajax({
		type:'post',
		url: url,
		data: data,
		success: success,
		error: function(e){
			console.log(e);
			alert('ERROR');
		}
	});
}

//예약등록팝업
function reservationPopup(res_id){
    if(reservationChild != undefined){
    	reservationChild.close()
    }

    reservationChild = window.open('/popup/resv-pop?res_id='+(res_id ? res_id : ''),'_blank','width=700, height=950, toolbar=no, menubar=no, scrollbars=yes, resizable=yes');
}

//예약등록팝업 카테고리선택시
function reservationPopupCategory(category_id, upper_id){
    if(reservationChild != undefined){
    	reservationChild.close()
    }

    reservationChild = window.open('/popup/resv-pop?category_id='+(category_id ? category_id : '')+'&upper_id='+(upper_id ? upper_id : ''),'_blank','width=700, height=950, toolbar=no, menubar=no, scrollbars=yes, resizable=yes');
}

//날짜포맷
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

//null or undefined To String
function nullToStr(str){
	return str ? str : '';
}

//object를 키 이름으로 정렬하여 반환
function sortObject(o) {
    var sorted = {},
    key, a = [];

    // 키이름을 추출하여 배열에 집어넣음
    for (key in o) {
        if (o.hasOwnProperty(key)) a.push(key);
    }

    // 키이름 배열을 정렬
    a.sort();
    
    // 정렬된 키이름 배열을 이용하여 object 재구성
    for (key=0; key<a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}