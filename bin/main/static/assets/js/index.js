var searchVO = {};
$(function(){
	
	/******************************************* listener start *******************************************/
	/*//강습선택
	$(document).on('click','.toggleUseYn',function(){
		var formData = {
				option_id: $(this).attr('data-id'),
				option_use_yn: ($(this).text() == 'Y' ? 'N' : 'Y'),
		};
		postCallAjax('/api/updateOptionStats', formData, function(data){
			if(data.msg == 'success'){
				loadReservationTable();
    		}else{
    			alert("ERROR");
    		}
		})
    });
	
	//입실선택
	$(document).on('click','.toggleCheckinYn',function(){
		var formData = {
				res_id: $(this).attr('data-id'),
				res_checkin_yn: ($(this).text() == 'Y' ? 'N' : 'Y'),
		};
		postCallAjax('/api/updateReservationStats', formData, function(data){
			if(data.msg == 'success'){
				loadReservationTable();
    		}else{
    			alert("ERROR");
    		}
		})
	});*/
	
	//tr선택시 상세창
	/*$(document).on('click','tr.reservation_tr',function(){
		reservationPopup($(this).attr("data-id"));
    });*/
    /******************************************* listener end *******************************************/
	$.datetimepicker.setLocale('kr');
    $('.date_pick').datetimepicker({
        timepicker:false,
        format:'Y-m-d'
    });
});

//테이블 로드
function loadReservationTable() {
	postCallAjax('/api/getReservations', searchVO, function(data){
		searchVO = data.searchVO;
		var list = data.reservations;
		var html = '';

		if(list && list.length > 0){
			list.forEach(function(el){
//				var optionLen = el.res_options.length ? el.res_options.length : 1;
				var optionLen = 1;
				var option = el.res_options;
				var surfingClass = option.find(function(el){
					return el.option_name == '서핑강습';
				});
				var surfingRental = option.find(function(el){
					return el.option_name == '서핑렌탈';
				});
				var party = option.find(function(el){
					return el.option_name == '파티';
				});
				var pub = option.find(function(el){
					return el.option_name == '펍';
				});
				var options = [surfingClass,surfingRental,party,pub];

				html += '<tr class="reservation_tr" data-id="'+el.res_id+'">' +
				            '<td>'+el.category1+'</td>' +
				            '<td>'+el.category2+'</td>' +
                            '<td rowspan="'+optionLen+'" class="td-name">'+el.res_name+'</td>' +
                            '<td rowspan="'+optionLen+'" class="td-ph">'+el.res_phone+'</td>' +
                            '<td rowspan="'+optionLen+'" class="td-w">'+el.res_pay_method+'</td>' +
                            '<td rowspan="'+optionLen+'" class="td-w">'+el.res_payment.toLocaleString('en')+'</td>' +
                            '<td rowspan="'+optionLen+'" class="td-w">'+el.res_quantity+'</td>' +
                            '<td rowspan="'+optionLen+'" class="td-w">'+new Date(el.res_date).format("yyyy-MM-dd")+'</td>' +
                            '<td rowspan="'+optionLen+'" class="td-w toggleCheckinYn '+(el.res_checkin_yn == 'Y' ? 'bgBlue' : '')+'" data-id="'+el.res_id+'">'+el.res_checkin_yn+'</td>';
				options.forEach(function(elSub, idx){
					if(elSub){
						html += '' +
							'<td class="td-w">'+elSub.option_quantity+'</td>';
						if(idx == 0){
							var class_time = '';
							if(new Date(elSub.option_hope_time).format("yyyyMMdd") == new Date(el.res_date).format("yyyyMMdd")){
								class_time = new Date(elSub.option_hope_time).format("a/phh시")
							}else{
								class_time = new Date(elSub.option_hope_time).format("익일 a/phh시")
							}
							html += '' +
							'<td class="td-w">'+class_time+'</td>' +
							'<td class="td-w toggleUseYn '+(elSub.option_use_yn == 'Y' ? 'bgBlue' : '')+'">'+elSub.option_use_yn+'</td>';
						}
						if(idx == 1){
							html += '' +
							'<td class="td-w">'+elSub.option_additional+'</td>';
						}
					}else{
						html += '' +
	                        '<td class="td-w"></td>';
						if(idx == 0){
							html +=	'' +
							'<td class="td-w"></td>' +
							'<td class="td-w"></td>';
						}
						if(idx == 1){
							html +=	'' +
							'<td class="td-w"></td>';
						}
					}
				});
				html +=		'<td colspan="'+optionLen+'">'+el.remark+'</td>' +
							'<td colspan="'+optionLen+'">'+new Date(el.reg_date).format('yyyy-MM-dd')+'</td>' +
				          '</tr>';
			});
		}else{
			html += '<tr>'+
						'<td colspan="25">No Data.</td>' +
					'</tr>';
		}
		
		$("tbody.tbodyReservation").html(html);
		pagination(searchVO, 'loadReservationTable()');
	});
}

//검색버튼
function searchTable(){
	searchVO['res_name'] = $('input[name=res_name]').val();
	searchVO['reg_date'] = $('input[name=reg_date]').val();
	
	loadReservationTable();
}