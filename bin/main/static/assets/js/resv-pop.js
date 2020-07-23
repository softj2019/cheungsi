var res_id;

$(function(){
	loadCategory1();
	loadCategory2(1);
	
	res_id = new URLSearchParams(location.search).get('res_id');
	if(res_id) loadDetail(res_id);
	/******************************************* listener start *******************************************/
	$('.op-add').click(function(){
		if($("tr.option_tr").length == 4) return;
        var tr = '<tr class="option_tr">' +
			        '<td>' +
			            '<select name="option_name" id="option_name">' +
			                '<option value="서핑강습" selected="selected">서핑강습</option>' +
			                '<option value="서핑렌탈">서핑렌탈</option>' +
			                '<option value="파티">파티</option>' +
			                '<option value="펍">펍</option>' +
			            '</select>' +
			        '</td>' +
			        '<td class="option_additional">' +
			            '<select name="option_hope_time" id="option_hope_time">' +
			                '<option value="today10">오전10시</option>' +
			                '<option value="today11">오전11시</option>' +
			                '<option value="today12">오후12시</option>' +
			                '<option value="today13">오후01시</option>' +
			                '<option value="today14">오후02시</option>' +
			                '<option value="today15">오후03시</option>' +
			                '<option value="today16">오후04시</option>' +
			                '<option value="tomorrow10">익일 오전10시</option>' +
			                '<option value="tomorrow11">익일 오전11시</option>' +
			                '<option value="tomorrow12">익일 오후12시</option>' +
			                '<option value="tomorrow13">익일 오후01시</option>' +
			                '<option value="tomorrow14">익일 오후02시</option>' +
			                '<option value="tomorrow15">익일 오후03시</option>' +
			                '<option value="tomorrow16">익일 오후04시</option>' +
			            '</select>' +
			        '</td>' +
			        '<td>' +
			            '<input type="text" class="hastxt" name="option_quantity">개' +
			            '<input type="hidden" name="option_use_yn" value="N">' +
			        '</td>' +
			        '<td>' +
			            '<button type="button" class="btn-red2 op-del">삭제</button>' +
			        '</td>' +
			    '</tr>';
        $(tr).appendTo('.greyTable.v2 tbody');
        $('.datetimepicker2').datetimepicker({
    		format:'Y-m-d H:i',
    	});
    })
    //옵션삭제
    $(document).on('click', '.op-del', function(){
        $(this).parents('tr').remove();
    })
    //옵션선택 서브셀렉트변경
    $(document).on('change', 'select[name=option_name]', function(){
        var value = $(this).val();
    	var html = '';
        
    	switch(value){
    	case '서핑강습':
    		html += '<select name="option_hope_time" id="option_hope_time">' +
    			        '<option value="today10">오전10시</option>' +
    			        '<option value="today11">오전11시</option>' +
    			        '<option value="today12">오후12시</option>' +
    			        '<option value="today13">오후1시</option>' +
    			        '<option value="today14">오후2시</option>' +
    			        '<option value="today15">오후3시</option>' +
    			        '<option value="today16">오후4시</option>' +
    			        '<option value="tomorrow10">익일 오전10시</option>' +
    			        '<option value="tomorrow11">익일 오전11시</option>' +
    			        '<option value="tomorrow12">익일 오후12시</option>' +
    			        '<option value="tomorrow13">익일 오후1시</option>' +
    			        '<option value="tomorrow14">익일 오후2시</option>' +
    			        '<option value="tomorrow15">익일 오후3시</option>' +
    			        '<option value="tomorrow16">익일 오후4시</option>' +
    			    '</select>';
    		break;
    	case '서핑렌탈':
    		html += '<select name="option_hope_time" id="option_hope_time">' +
    			        '<option value="보드/슈트">보드/슈트</option>' +
    			        '<option value="보드">보드</option>' +
    			        '<option value="슈트">슈트</option>' +
    			    '</select>';
    		break;
    	case '파티':
    		html += '<select name="option_hope_time" id="option_hope_time">' +
    			        '<option value="바베큐파티">바베큐파티</option>' +
    			    '</select>';
    		break;
    	case '펍':
    		html += '<select name="option_hope_time" id="option_hope_time">' +
    			        '<option value="펍파티">펍파티</option>' +
    			    '</select>';
    		break;
    	}
    	$(this).parents('td').siblings('td.option_additional').html(html);
    	
/*    	if(value == '파티' || value == '펍'){
    		$(this).parents('td').next().next().children('input[name=option_quantity]').focus();
    	}*/
    })
    
    $.datetimepicker.setLocale('kr');//20.07.13 추가~
    $('#datetimepicker1').datetimepicker({
        timepicker:false,
        format:'Y-m-d'
    });
	$('.datetimepicker2').datetimepicker({
		format:'Y-m-d H:i',
	});
    
    //예약저장버튼
    $("#res_save_btn").click(function(){
    	if(validateCheck()) return;
    	
    	var formData = $("#reservationForm").serialize();
    	
    	postCallAjax('/api/insertReservation', formData, function(data){
    		if(data.msg == 'success'){
	    		window.opener.loadReservationTable();
	    		self.close();
    		}else{
    			alert("ERROR");
    		}
    	});
    });
    //예약삭제버튼
    $("#res_del_btn").click(function(){
    	if(!confirm("삭제하시겠습니까?")) return;
    	
    	var formData = {
			res_id: $("input[name=res_id]").val(),
			res_no: $("input[name=res_no]").val()
    	};
    	
    	postCallAjax('/api/deleteReservation', formData, function(data){
    		if(data.msg == 'success'){
	    		window.opener.loadReservationTable();
	    		self.close();
    		}else{
    			alert("ERROR");
    		}
    	});
    });
    
    //카테고리1 클릭
    $("select[name=category1]").on('change',function(){
    	var upperId = $('select[name=category1] option:selected').attr('data-id');
    	loadCategory2(upperId);
    })
    
    //라디오버튼 직접입력선택
    $(document).on('input',"input[name=res_pay_method]",function(){
    	var value = $(this).val();
    	if(value == 'custom'){
    		$("input[name=res_pay_method_text]").removeClass('hide');
    	}else{
    		$("input[name=res_pay_method_text]").addClass('hide');
    	}
    });
    
    /*//셀렉트박스 직접입력선택
    $(document).on('change',"select[name=option_pay_method]",function(){
    	var value = $(this).val();
    	if(value == 'custom'){
        	console.log(1)
    		$(this).addClass('hide');
    		$(this).siblings(".option_pay_method_text_div").removeClass('hide');
    	}else{
        	console.log(2)
    		$(this).removeClass('hide');
    		$(this).siblings(".option_pay_method_text_div").addClass('hide');
    	}
    });
    //셀렉트박스로돌아가기
    $(document).on('click',".option_pay_method_text_div i.arr-d",function(){
    	console.log(3)
    	$(this).parent().siblings("select[name=option_pay_method]").val('네이버 강릉 서핑');
    	$(this).parent().siblings("select[name=option_pay_method]").show();
		$(this).parent().hide();
    });*/
    /******************************************* listener end *******************************************/
    
});

//카테고리1 로드
function loadCategory1(){
	postCallAjax('/api/getCategorys',{category_upper_id: 0},function(data){
		var html = '';
		if(data.categorys){
			data.categorys.forEach(function(el){
				html += '<option value="' + el.category_id + '" data-id="' + el.category_id + '">' + el.category_name + '</option>'
			});
		}
		$("select[name=category1]").html(html);
	});
}
//카테고리2 로드
function loadCategory2(upperId){
	postCallAjax('/api/getCategorys',{category_upper_id: upperId},function(data){
		var html = '';
		if(data.categorys){
			data.categorys.forEach(function(el){
				html += '<option value="' + el.category_id + '" data-id="' + el.category_id + '">' + el.category_name + '</option>'
			});
		}
		$("select[name=category2]").html(html);
	});
}

//수정시 디테일 로드
function loadDetail(res_id){
	postCallAjax('/api/getReservationDetail',{res_id: res_id},function(data){
		var detail = data.detail;
		console.log(detail);
		$("input[name=res_id]").val(detail.res_id);
		$("input[name=res_no]").val(detail.res_no);
		$("input[name=res_date]").val(new Date(detail.res_date).format('yyyy-MM-dd'));
		$("select[name=category1]").val(detail.category1).trigger('change');
		setTimeout(function(){
			$("select[name=category2]").val(detail.category2).trigger('change');
		},50);
		$("input[name=res_name]").val(detail.res_name);
		$("input[name=res_phone]").val(detail.res_phone);
		$("input[name=res_quantity]").val(detail.res_quantity);
		$("input[name=res_payment]").val(detail.res_payment);
		if(detail.res_pay_method != '네이버 강릉 서핑' &&
			detail.res_pay_method != '네이버 양양 서핑' &&
			detail.res_pay_method != '네이버 게스트 하우스' &&
			detail.res_pay_method != '현금' &&
			detail.res_pay_method != '카드' &&
			detail.res_pay_method != '프립' &&
			detail.res_pay_method != '서비스' &&
			detail.res_pay_method != '현장결제 카드' &&
			detail.res_pay_method != '현장결제 현금'){
			$("input[name=res_pay_method][value=custom]").trigger('click');
			$("input[name=res_pay_method_text]").val(detail.res_pay_method);
		}else{
			$("input[name=res_pay_method][value='"+detail.res_pay_method+"']").prop("checked",true);
		}
		$("select[name=res_checkin_yn]").val(detail.res_checkin_yn);
		$("textarea[name=remark]").val(detail.remark);
		
		var options = detail.res_options;
		var html = '';
		options.forEach(function(el){
			var option_additional_html = '';
			switch(el.option_name){
			case '서핑강습':
				var class_time = '';
				if(new Date(el.option_hope_time).format("yyyyMMdd") == new Date(detail.res_date).format("yyyyMMdd")){
					class_time = new Date(el.option_hope_time).format("a/phh시")
				}else{
					class_time = new Date(el.option_hope_time).format("익일 a/phh시")
				}
				console.log(class_time);
				option_additional_html += '<select name="option_hope_time" id="option_hope_time">' +
	    			        '<option value="today10" ' + (class_time == '오전10시' ? 'selected="selected"' : '') + '>오전10시</option>' +
	    			        '<option value="today11" ' + (class_time == '오전11시' ? 'selected="selected"' : '') + '>오전11시</option>' +
	    			        '<option value="today12" ' + (class_time == '오후12시' ? 'selected="selected"' : '') + '>오후12시</option>' +
	    			        '<option value="today13" ' + (class_time == '오후01시' ? 'selected="selected"' : '') + '>오후01시</option>' +
	    			        '<option value="today14" ' + (class_time == '오후02시' ? 'selected="selected"' : '') + '>오후02시</option>' +
	    			        '<option value="today15" ' + (class_time == '오후03시' ? 'selected="selected"' : '') + '>오후03시</option>' +
	    			        '<option value="today16" ' + (class_time == '오후04시' ? 'selected="selected"' : '') + '>오후04시</option>' +
	    			        '<option value="tomorrow10" ' + (class_time == '익일 오전10시' ? 'selected="selected"' : '') + '>익일 오전10시</option>' +
	    			        '<option value="tomorrow11" ' + (class_time == '익일 오전11시' ? 'selected="selected"' : '') + '>익일 오전11시</option>' +
	    			        '<option value="tomorrow12" ' + (class_time == '익일 오후12시' ? 'selected="selected"' : '') + '>익일 오후12시</option>' +
	    			        '<option value="tomorrow13" ' + (class_time == '익일 오후01시' ? 'selected="selected"' : '') + '>익일 오후01시</option>' +
	    			        '<option value="tomorrow14" ' + (class_time == '익일 오후02시' ? 'selected="selected"' : '') + '>익일 오후02시</option>' +
	    			        '<option value="tomorrow15" ' + (class_time == '익일 오후03시' ? 'selected="selected"' : '') + '>익일 오후03시</option>' +
	    			        '<option value="tomorrow16" ' + (class_time == '익일 오후04시' ? 'selected="selected"' : '') + '>익일 오후04시</option>' +
	    			    '</select>';
	    		break;
	    	case '서핑렌탈':
	    		option_additional_html += '<select name="option_hope_time" id="option_hope_time">' +
	    			        '<option value="보드/슈트" ' + (el.option_additional == '보드/슈트' ? 'selected="selected"' : '') + '>보드/슈트</option>' +
	    			        '<option value="보드" ' + (el.option_additional == '보드' ? 'selected="selected"' : '') + '>보드</option>' +
	    			        '<option value="슈트" ' + (el.option_additional == '슈트' ? 'selected="selected"' : '') + '>슈트</option>' +
	    			    '</select>';
	    		break;
	    	case '파티':
	    		option_additional_html += '<select name="option_hope_time" id="option_hope_time">' +
	    			        '<option value="바베큐파티" ' + (el.option_additional == '바베큐파티' ? 'selected="selected"' : '') + '>바베큐파티</option>' +
	    			    '</select>';
	    		break;
	    	case '펍':
	    		option_additional_html += '<select name="option_hope_time" id="option_hope_time">' +
	    			        '<option value="펍파티" ' + (el.option_additional == '펍파티' ? 'selected="selected"' : '') + '>펍파티</option>' +
	    			    '</select>';
	    		break;
			}
			
			html += '' +
			'<tr class="option_tr">' +
				'<input name="option_id" type="hidden" value="' + el.option_id + '"/>' +
		        '<td>' +
		            '<select name="option_name" id="option_name">' +
		                '<option value="서핑강습" ' + (el.option_name == '서핑강습' ? 'selected="selected"' : '') + '>서핑강습</option>' +
		                '<option value="서핑렌탈" ' + (el.option_name == '서핑렌탈' ? 'selected="selected"' : '') + '>서핑렌탈</option>' +
		                '<option value="파티" ' + (el.option_name == '파티' ? 'selected="selected"' : '') + '>파티</option>' +
		                '<option value="펍" ' + (el.option_name == '펍' ? 'selected="selected"' : '') + '>펍</option>' +
		            '</select>' +
		        '</td>' +
		        '<td class="option_additional">' +
		        	option_additional_html + 
		        '</td>' +
		        '<td>' +
		            '<input type="text" class="hastxt" name="option_quantity" value="' + el.option_quantity + '">개' +
		            '<input type="hidden" name="option_use_yn" value="' + el.option_use_yn + '">' +
		            '<input type="hidden" class="hastxt" name="option_payment" value="' + el.option_payment + '">' +
		        '</td>' +
		        '<td>' +
		            '<button type="button" class="btn-red2 op-del">삭제</button>' +
		        '</td>' +
		    '</tr>';
		});
		$(".option_table").html(html);
		/*$('.datetimepicker2').datetimepicker({
    		format:'Y-m-d H:i',
    	});*/
	})
}

//validate 확인
function validateCheck() {
	var key = $("select[name=category2]").val();
	var cur_quantity = parseInt(opener.$("td[category-id="+key+"]").children('span.quantity_total').text()) + parseInt($("input[name=res_quantity]").val());
	
	if(parseInt(opener.$("td[category-id="+key+"]").children('span.quantity_max').text()) < cur_quantity){
		alert("수량을 초과했습니다.");
		return true;
	}
	if(!$("input[name=res_date]").val()){
		alert("예약날짜를 입력하세요.");
		$("input[name=res_date]").focus();
		return true;
	}
	if(!$("input[name=res_name]").val()){
		alert("이름을 입력하세요.");
		$("input[name=res_name]").focus();
		return true;
	}
	if(!$("input[name=res_phone]").val()){
		alert("연락처를 입력하세요.");
		$("input[name=res_phone]").focus();
		return true;
	}
	if(!$("input[name=res_quantity]").val()){
		alert("수량을 입력하세요.");
		$("input[name=res_quantity]").focus();
		return true;
	}
	if(!$("input[name=res_payment]").val()){
		alert("금액을 입력하세요.");
		$("input[name=res_payment]").focus();
		return true;
	}
	var optionQuantityCheck = false;
	$("input[name=option_quantity]").each(function(){
		if(!$(this).val()){
			optionQuantityCheck = true;
		}
	});
	if(optionQuantityCheck) {
		alert("옵션 수량을 입력하세요.");
		return true;
	}
}