var searchVO = {};
$(function(){
	$.datetimepicker.setLocale('kr');
    $('.date_pick').datetimepicker({
        timepicker:false,
        format:'Y-m-d'
    });
    $('.date_pick').val(new Date().format('yyyy-MM-dd'));
    
    searchTable();
	
	/******************************************* listener start *******************************************/
	//강습선택
	$(document).on('click','.toggleUseYn',function(){
		var formData = {
				option_id: $(this).attr('data-id'),
				option_use_yn: ($(this).is('.bgBlue') ? 'N' : 'Y'),
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
});

//테이블 로드
function loadReservationTable() {
	postCallAjax('/api/getReservations', searchVO, function(data){
		console.log(data);
		searchVO = data.searchVO;
		var list = data.reservations;
		var listYesterday = data.reservationsYesterday;
		var categoryList = data.categorys
		var html = '';
		
		var groupCategory =  categoryList.reduce(function(acc, cur, idx){
			if(!acc[cur['category_upper_name']]) acc[cur['category_upper_name']] = [];
			acc[cur['category_upper_name']].push(cur);
			return acc;
		},{});
		
		$.each(groupCategory,function(key, val){
			val.forEach(function(category, idx){
				if(idx == 0){
					html += '<tr>' +
								'<td class="td-t1" rowspan="'+val.length+'">'+key+'</td>' +
								'<td class="td-t1" category-id="'+category.category_id+'">'+category.category_name+'<br><span>(</span><span class="quantity_max">'+category.category_max_quantity+'</span><span>인) / </span><span class="quantity_total">0</span></td>' +
								'<td>' +
									'<table class="sub-in-table" category-id="'+category.category_id+'">' +
						                '<tr>' +
						                	'<td class="td-name"></td>' +
						                	'<td class="td-ph"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-re"></td>' +
						                	'<td class="td-t1"></td>' +
						                '</tr>' +
					                '</table>' +
								'</td>' +
							'</tr>';
				}else{
					html += '<tr>' +
					'<td class="td-t1" category-id="'+category.category_id+'">'+category.category_name+'<br><span>(</span><span class="quantity_max">'+category.category_max_quantity+'</span><span>인) / </span><span class="quantity_total">0</span></td>' +
								'<td class="td-t1">' +
									'<table class="sub-in-table" category-id="'+category.category_id+'">' +
						                '<tr>' +
						                	'<td class="td-name"></td>' +
						                	'<td class="td-ph"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-w"></td>' +
						                	'<td class="td-re"></td>' +
						                	'<td class="td-t1"></td>' +
						                '</tr>' +
					                '</table>' +
								'</td>' +
							'</tr>';
				}
			});
		})
		$("tbody.tbodyReservation").html(html);
		
		var surfingClassYesterdayHtml = '';
		var surfingClassYesterday_quantity_total = 0;
		
		listYesterday.forEach(function(el){
			var option = el.res_options;
			
			var surfingClass = option.find(function(el){
				return el.option_name == '서핑강습';
			});
			
			if(surfingClass){
				var class_time = '';
				if(new Date(surfingClass.option_hope_time).format("yyyyMMdd") != new Date(el.res_date).format("yyyyMMdd")){
					class_time = new Date(surfingClass.option_hope_time).format("a/phh시")
				}
				console.log(class_time);
				if(class_time){
					surfingClassYesterday_quantity_total += parseInt(surfingClass.option_quantity);
					
					surfingClassYesterdayHtml += '<tr class="reservation_tr" data-id="'+el.res_id+'">' +
			                    '<td class="td-name">'+el.res_name+'</td>' +
			                    '<td class="td-ph">'+el.res_phone+'</td>' +
			                    '<td class="td-w">'+el.res_quantity+'</td>' +
			                    '<td class="td-w">'+el.res_payment.toLocaleString('en')+'</td>' +
			                    '<td class="td-w">'+el.res_pay_method+'</td>' +
			                    '<td class="td-w">'+new Date(el.res_date).format("yyyy-MM-dd")+'</td>' +
			                    '<td class="td-w toggleCheckinYn '+(el.res_checkin_yn == 'Y' ? 'bgBlue' : '')+'" data-id="'+el.res_id+'">'+el.res_checkin_yn+'</td>' +
								'<td class="td-w">'+surfingClass.option_quantity+'</td>' +
			                    '<td class="td-w">'+surfingClass.option_payment.toLocaleString('en')+'</td>' +
			                    '<td class="td-w">'+surfingClass.option_pay_method+'</td>' +
								'<td data-id="'+surfingClass.option_id+'" class="td-w toggleUseYn '+(surfingClass.option_use_yn == 'Y' ? 'bgBlue' : '')+'">'+class_time+'</td>' +
								'<td class="td-w"></td>' +
								'<td class="td-w"></td>' +
			                    '<td class="td-w"></td>' +
			                    '<td class="td-w"></td>' +
			                    '<td class="td-w"></td>' +
			                    '<td class="td-w"></td>' +
			                    '<td class="td-w"></td>' +
			                    '<td class="td-w"></td>' +
			                    '<td class="td-w"></td>' +
			                    '<td class="td-w"></td>' +
			                    '<td class="td-re">'+el.remark+'</td>' +
			                    '<td class="td-t1">'+new Date(el.reg_date).format('yyyy-MM-dd')+'</td>' +
					          '</tr>';
				}
			}
		});
		//전날예약중에서 다음날서핑강습추가
		$("td[category-id="+42+"]").children('span.quantity_total').text(surfingClassYesterday_quantity_total);
		$("table[category-id="+42+"]").html(surfingClassYesterdayHtml);
		
		var groupList =  list.reduce(function(acc, cur, idx){
			if(!acc[cur['category_id']]) acc[cur['category_id']] = [];
			acc[cur['category_id']].push(cur);
			return acc;
		},{});
		
		$.each(groupList, function(key,val){
			var html = '';
			var quantity_total = 0;
			val.forEach(function(el){
				quantity_total += parseInt(el.res_quantity);
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
	                        '<td rowspan="'+optionLen+'" class="td-name">'+el.res_name+'</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-ph">'+el.res_phone+'</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-w">'+el.res_quantity+'</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-w">'+el.res_payment.toLocaleString('en')+'</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-w">'+el.res_pay_method+'</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-w">'+new Date(el.res_date).format("yyyy-MM-dd")+'</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-w toggleCheckinYn '+(el.res_checkin_yn == 'Y' ? 'bgBlue' : '')+'" data-id="'+el.res_id+'">'+el.res_checkin_yn+'</td>';
				options.forEach(function(elSub, idx){
					if(elSub){
						html += '' +
							'<td class="td-w">'+elSub.option_quantity+'</td>' +
	                        '<td class="td-w">'+elSub.option_payment.toLocaleString('en')+'</td>' +
	                        '<td class="td-w">'+elSub.option_pay_method+'</td>';
						if(idx == 0){
							var class_time = '';
							if(new Date(elSub.option_hope_time).format("yyyyMMdd") == new Date(el.res_date).format("yyyyMMdd")){
								class_time = new Date(elSub.option_hope_time).format("a/phh시")
							}else{
								class_time = new Date(elSub.option_hope_time).format("익일 a/phh시")
							}
							html += '' +
							'<td data-id="'+elSub.option_id+'" class="td-w toggleUseYn '+(elSub.option_use_yn == 'Y' ? 'bgBlue' : '')+'">'+class_time+'</td>';
						}
						if(idx == 1){
							html += '' +
							'<td class="td-w">'+elSub.option_additional+'</td>';
						}
					}else{
						html += '' +
							'<td class="td-w"></td>' +
	                        '<td class="td-w"></td>' +
	                        '<td class="td-w"></td>';
						if(idx == 0 || idx == 1){
							html +=	'' +
							'<td class="td-w"></td>';
						}
					}
				});
				html +=		'<td class="td-re" colspan="'+optionLen+'">'+el.remark+'</td>' +
							'<td class="td-t1" colspan="'+optionLen+'">'+new Date(el.reg_date).format('yyyy-MM-dd')+'</td>' +
				          '</tr>';
			})
			
			//전날예약중에서 다음날서핑강습추가
			if(key == 42){
				quantity_total += surfingClassYesterday_quantity_total;
				html += surfingClassYesterdayHtml;
			}
			$("td[category-id="+key+"]").children('span.quantity_total').text(quantity_total);
			$("table[category-id="+key+"]").html(html);
		});
//		pagination(searchVO, 'loadReservationTable()');
	});
}

//검색버튼
function searchTable(){
	if(!$('input[name=res_date]').val()){
		alert('예약일은 필수사항입니다.');
		$('input[name=res_date]').focus();
		return;
	}
	searchVO['res_date'] = $('input[name=res_date]').val();
	
	loadReservationTable();
}