var searchVO = {};
$(function(){
	loadReservationTable();
	
	/******************************************* listener start *******************************************/
	//강습선택
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
	});
	
	//tr선택시 상세창
	$(document).on('click','tr.reservation_tr',function(){
		reservationPopup($(this).attr("data-id"));
    });
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
				var optionLen = el.res_options.length ? el.res_options.length : 1;
				var option = el.res_options;

				html += '<tr class="reservation_tr" data-id="'+el.res_id+'">' +
				            '<td>'+el.category1+'</td>' +
				            '<td>'+el.category2+'</td>' +
				            '<td>' +
				                '<table class="sub-in-table">' +
				                    '<tbody>' +
				                        '<tr>' +
				                        	'<td rowspan="'+optionLen+'" class="td-name">'+el.res_id+'</td>' +
				                            '<td rowspan="'+optionLen+'" class="td-name">'+el.res_name+'</td>' +
				                            '<td rowspan="'+optionLen+'" class="td-ph">'+el.res_phone+'</td>' +
				                            '<td rowspan="'+optionLen+'" class="td-w">'+el.res_quantity+'</td>' +
				                            '<td rowspan="'+optionLen+'" class="td-w">'+el.res_payment.toLocaleString('en')+'</td>' +
				                            '<td rowspan="'+optionLen+'" class="td-w">'+el.res_pay_method+'</td>' +
				                            '<td rowspan="'+optionLen+'" class="td-w">'+new Date(el.res_date).format("yyyy-MM-dd")+'</td>' +
				                            '<td rowspan="'+optionLen+'" class="td-w toggleCheckinYn '+(el.res_checkin_yn == 'Y' ? 'bgBlue' : '')+'" data-id="'+el.res_id+'">'+el.res_checkin_yn+'</td>';
				if(option.length){
					html +=					'<td class="td-w">'+option[0].option_name+'</td>' +
				                            '<td class="td-w">'+option[0].option_quantity+'</td>' +
				                            '<td class="td-w">'+option[0].option_payment.toLocaleString('en')+'</td>' +
				                            '<td class="td-w">'+option[0].option_pay_method+'</td>' +
				                            '<td class="td-w">'+new Date(option[0].option_hope_time).format("yyyy-MM-dd HH:mm")+'</td>' +
				                            '<td class="td-w toggleUseYn '+(option[0].option_use_yn == 'Y' ? 'c-active' : '')+'" data-id="'+option[0].option_id+'">'+option[0].option_use_yn +'</td>' +
				                        '</tr>';
					option.forEach(function(elSub, idx){
						if(idx == 0) return true;
						html +=			'<tr>' +
											'<td class="td-w">'+elSub.option_name+'</td>' +
					                        '<td class="td-w">'+elSub.option_quantity+'</td>' +
					                        '<td class="td-w">'+elSub.option_payment.toLocaleString('en')+'</td>' +
					                        '<td class="td-w">'+elSub.option_pay_method+'</td>' +
					                        '<td class="td-w">'+new Date(elSub.option_hope_time).format("yyyy-MM-dd HH:mm")+'</td>' +
					                        '<td class="td-w toggleUseYn '+(elSub.option_use_yn == 'Y' ? 'c-active' : '')+'" data-id="'+elSub.option_id+'">'+elSub.option_use_yn +'</td>' +
					                    '</tr>';
					});
				}else{
					html +=					'<td class="td-w">-</td>' +
						                    '<td class="td-w">-</td>' +
						                    '<td class="td-w">-</td>' +
						                    '<td class="td-w">-</td>' +
						                    '<td class="td-w">-</td>' +
						                    '<td class="td-w">-</td>' +
						                '</tr>';
				}
				html +=				'</tbody>' +
				                '</table>' +
				            '</td>' +
				            '<td colspan="'+optionLen+'">2020-07-01</td>' +
				          '</tr>';
			});
		}else{
			html += '<tr>'+
						'<td colspan="4">No Data.</td>' +
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