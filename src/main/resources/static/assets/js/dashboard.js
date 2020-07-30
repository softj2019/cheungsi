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
	
	//이름td 선택시 상세창
	$(document).on('click','td.reservation_name',function(){
		reservationPopup($(this).attr("data-id"));
    });
	
	//카테고리td 선택시 예약등록창 카테고리표시 
	$(document).on('click','td.category2-td',function(){
		var category_id = $(this).attr("category-id");
		var upper_id = $(this).attr("upper-id");
		reservationPopupCategory(category_id,upper_id);
    });
    /******************************************* listener end *******************************************/
});

//테이블 로드
function loadReservationTable() {
	var total_payment = 0;
	var option_default_cnt = 0;
	var option_surfing_class_cnt = 0;
	var option_surfing_class_cnt_obj = {};
	var option_surfing_rental_cnt = 0;
	var option_party_cnt_m = 0;
	var option_party_cnt_w = 0;
	var option_pub_cnt_m = 0;
	var option_pub_cnt_w = 0;
	var payment_ngs = 0;
	var payment_nys = 0;
	var payment_ngh = 0;
	var payment_frip = 0;
	var payment_cash = 0;
	var payment_card = 0;
	var payment_service = 0;
	var payment_fcash = 0;
	var payment_fcard = 0;
	var payment_custom = 0;
	
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
								'<td class="td-t1 category2-td" upper-id="'+category.category_upper_id+'" category-id="'+category.category_id+'">'+category.category_name+'<br><span>(</span><span class="quantity_max">'+category.category_max_quantity+'</span><span>인) / </span><span class="quantity_total">0</span></td>' +
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
						                	'<td class="td-re"></td>' +
						                	'<td class="td-t1"></td>' +
						                '</tr>' +
					                '</table>' +
								'</td>' +
							'</tr>';
				}else{
					html += '<tr>' +
					'<td class="td-t1 category2-td" upper-id="'+category.category_upper_id+'" category-id="'+category.category_id+'">'+category.category_name+'<br><span>(</span><span class="quantity_max">'+category.category_max_quantity+'</span><span>인) / </span><span class="quantity_total">0</span></td>' +
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

				if(class_time){
					surfingClassYesterday_quantity_total += parseInt(surfingClass.option_quantity);
					option_surfing_class_cnt += parseInt(surfingClass.option_quantity);
					if(!option_surfing_class_cnt_obj[class_time]) option_surfing_class_cnt_obj[class_time] = parseInt(surfingClass.option_quantity);
					else option_surfing_class_cnt_obj[class_time] += parseInt(surfingClass.option_quantity);
					
					surfingClassYesterdayHtml += '<tr class="reservation_tr" data-id="'+el.res_id+'">' +
			                    '<td class="td-name reservation_name" data-id="'+el.res_id+'">'+el.res_name+'</td>' +
			                    '<td class="td-ph">'+el.res_phone+'</td>' +
			                    '<td class="td-w">'+el.res_pay_method+'</td>' +
			                    '<td class="td-w">'+el.res_payment.toLocaleString('en')+'</td>' +
			                    '<td class="td-w">'+(el.res_sex ? el.res_sex : '')+' '+el.res_quantity+'명</td>' +
			                    '<td class="td-w">'+new Date(el.res_date).format("yyyy-MM-dd")+'</td>' +
			                    '<td class="td-w toggleCheckinYn '+(el.res_checkin_yn == 'Y' ? 'bgBlue' : '')+'" data-id="'+el.res_id+'">'+el.res_checkin_yn+'</td>' +
								'<td class="td-w">'+(el.res_sex ? el.res_sex : '')+' '+surfingClass.option_quantity+'명</td>' +
								'<td class="td-w">'+class_time+'</td>' +
								'<td data-id="'+surfingClass.option_id+'" class="td-w toggleUseYn '+(surfingClass.option_use_yn == 'Y' ? 'bgBlue' : '')+'">'+surfingClass.option_use_yn+'</td>' +
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
				option_default_cnt += parseInt(el.res_quantity);
				total_payment += parseInt(el.res_payment);
				
				switch (el.res_pay_method) {
				case '강릉 서핑':
					payment_ngs += parseInt(el.res_payment);
					break;
				case '양양 서핑':
					payment_nys += parseInt(el.res_payment);
					break;
				case '게스트 하우스':
					payment_ngh += parseInt(el.res_payment);
					break;
				case '프립':
					payment_frip += parseInt(el.res_payment);
					break;
				case '현금':
					payment_cash += parseInt(el.res_payment);
					break;
				case '카드':
					payment_card += parseInt(el.res_payment);
					break;
				case '서비스':
					payment_service += parseInt(el.res_payment);
					break;
				case '현장결제 현금':
					payment_fcash += parseInt(el.res_payment);
					break;
				case '현장결제 카드':
					payment_fcard += parseInt(el.res_payment);
					break;
				default:
					payment_custom += parseInt(el.res_payment);
					break;
				}
				
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
	                        '<td rowspan="'+optionLen+'" class="td-name reservation_name" data-id="'+el.res_id+'">'+el.res_name+'</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-ph">'+el.res_phone+'</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-w">'+el.res_pay_method+'</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-w">'+el.res_payment.toLocaleString('en')+'</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-w">'+(el.res_sex ? el.res_sex : '')+' '+el.res_quantity+'명</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-w">'+new Date(el.res_date).format("yyyy-MM-dd")+'</td>' +
	                        '<td rowspan="'+optionLen+'" class="td-w toggleCheckinYn '+(el.res_checkin_yn == 'Y' ? 'bgBlue' : '')+'" data-id="'+el.res_id+'">'+el.res_checkin_yn+'</td>';
				options.forEach(function(elSub, idx){
					if(elSub){
						switch (idx) {
						case 1:
							option_surfing_rental_cnt += parseInt(elSub.option_quantity);
							break;
						case 2:
							if(el.res_sex && el.res_sex == '남') option_party_cnt_m += parseInt(elSub.option_quantity);
							if(el.res_sex && el.res_sex == '여') option_party_cnt_w += parseInt(elSub.option_quantity);
							break;
						case 3:
							if(el.res_sex && el.res_sex == '남') option_pub_cnt_m += parseInt(elSub.option_quantity);
							if(el.res_sex && el.res_sex == '여') option_pub_cnt_w += parseInt(elSub.option_quantity);
							break;
						}
						
						html += '' +
							'<td class="td-w">'+(el.res_sex ? el.res_sex : '')+' '+elSub.option_quantity+'명</td>';
						if(idx == 0){
							var class_time = '';
							if(new Date(elSub.option_hope_time).format("yyyyMMdd") == new Date(el.res_date).format("yyyyMMdd")){
								class_time = new Date(elSub.option_hope_time).format("a/phh시")

								option_surfing_class_cnt += parseInt(elSub.option_quantity);
								if(!option_surfing_class_cnt_obj[class_time]) option_surfing_class_cnt_obj[class_time] = parseInt(elSub.option_quantity);
								else option_surfing_class_cnt_obj[class_time] += parseInt(elSub.option_quantity);
							}else{
								class_time = new Date(elSub.option_hope_time).format("익일 a/phh시")
							}
							html += '' +
							'<td class="td-w">'+class_time+'</td>' +
							'<td data-id="'+elSub.option_id+'" class="td-w toggleUseYn '+(elSub.option_use_yn == 'Y' ? 'bgBlue' : '')+'">'+elSub.option_use_yn+'</td>';
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
		
		$("span.total_payment").text(total_payment.toLocaleString('en'));
		$("span.option_default_cnt").text(option_default_cnt.toLocaleString('en'));
		$("span.option_surfing_class_cnt").text(option_surfing_class_cnt.toLocaleString('en'));
		$("span.option_surfing_rental_cnt").text(option_surfing_rental_cnt.toLocaleString('en'));
		$("span.option_party_cnt_m").text(option_party_cnt_m.toLocaleString('en'));
		$("span.option_party_cnt_w").text(option_party_cnt_w.toLocaleString('en'));
		$("span.option_pub_cnt_m").text(option_pub_cnt_m.toLocaleString('en'));
		$("span.option_pub_cnt_w").text(option_pub_cnt_w.toLocaleString('en'));
		$("span.payment_ngs").text(payment_ngs.toLocaleString('en'));
		$("span.payment_nys").text(payment_nys.toLocaleString('en'));
		$("span.payment_ngh").text(payment_ngh.toLocaleString('en'));
		$("span.payment_frip").text(payment_frip.toLocaleString('en'));
		$("span.payment_cash").text(payment_cash.toLocaleString('en'));
		$("span.payment_card").text(payment_card.toLocaleString('en'));
		$("span.payment_service").text(payment_service.toLocaleString('en'));
		$("span.payment_fcash").text(payment_fcash.toLocaleString('en'));
		$("span.payment_fcard").text(payment_fcard.toLocaleString('en'));
		$("span.payment_custom").text(payment_custom.toLocaleString('en'));
		
		var surfingClassTimeHtml = '';
		option_surfing_class_cnt_obj = sortObject(option_surfing_class_cnt_obj);
		$.each(option_surfing_class_cnt_obj, function(item,index){
			surfingClassTimeHtml += '<p>서핑강습 '+item+': '+index+'명'+'</p>';
		});
		$(".surfingClassTimeTotal").html(surfingClassTimeHtml);
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