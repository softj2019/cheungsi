var res_id;

$(function(){
	loadCategory1();
	loadCategory2(1);
	
	res_id = new URLSearchParams(location.search).get('res_id');
	if(res_id) loadDetail(res_id);
	/******************************************* listener start *******************************************/
	$('.op-add').click(function(){
        var tr = ''+ 
        '<tr>' +
	        '<td>' +
	            '<select name="option_name" id="option_name">' +
	                '<option value="서핑강습" selected="selected">서핑강습</option>' +
	                '<option value="서핑렌탈">서핑렌탈</option>' +
	                '<option value="파티">파티</option>' +
	                '<option value="펍">펍</option>' +
	            '</select>' +
	        '</td>' +
	        '<td>' +
	            '<input type="text" class="hastxt" name="option_quantity">개' +
	        '</td>' +
	        '<td>' +
	            '<input type="text" class="hastxt" name="option_payment">원' +
	        '</td>' +
	        '<td>' +
	            '<select name="option_pay_method" id="">' +
	                '<option value="네이버 강릉 서핑" selected="selected">네이버 강릉 서핑</option>' +
	                '<option value="네이버 양양 서핑">네이버 양양 서핑</option>' +
	                '<option value="네이버 게스트 하우스">네이버 게스트 하우스</option>' +
	                '<option value="현금">현금</option>' +
	                '<option value="카드">카드</option>' +
	                '<option value="서비스">서비스</option>' +
	                '<option value="현장결제 카드">현장결제 카드</option>' +
	                '<option value="현장결제 현금">현장결제 현금</option>' +
	                '<option value="custom">직접입력</option>' +
	            '</select>' +
	            '<div class="date option_pay_method_text_div hide">' +
	                '<input type="text" name="option_pay_method_text" placeholder="직접입력" class="option_pay_method_text">' +
	                '<i class="arr-d"></i>' +
	            '</div>' +
	        '</td>' +
	        '<td>' +
	            '<div class="date">' +
	                '<input id="datetimepicker2" type="text" class="input2 datetimepicker2" name="option_hope_time">' +
	                '<i class="cal1"></i>' +
	            '</div>' +
	        '</td>' +
	        '<td>' +
	            '<select name="option_use_yn" id="">' +
	                '<option value="Y" >수강</option>' +
	                '<option value="N" selected="selected">미수강</option>' +
	            '</select>' +
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
    $(document).on('click', '.op-del', function(){
        $(this).parents('tr').remove();
    })

    $(function() { 
		$('.ck-cu').click(function(){
		    $(this).toggleClass('c-active')
		});              
    });
    
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
    
    //셀렉트박스 직접입력선택
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
    });
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
			var option_pay_method_html = '';
			if(el.option_pay_method != '네이버 강릉 서핑' &&
			   el.option_pay_method != '네이버 양양 서핑' &&
			   el.option_pay_method != '네이버 게스트 하우스' &&
			   el.option_pay_method != '현금' &&
			   el.option_pay_method != '카드' &&
			   el.option_pay_method != '서비스' &&
			   el.option_pay_method != '현장결제 카드' &&
			   el.option_pay_method != '현장결제 현금'){
				option_pay_method_html += '' +
				'<select name="option_pay_method" id="" class="hide">' +
		            '<option value="네이버 강릉 서핑" selected="selected">네이버 강릉 서핑</option>' +
		            '<option value="네이버 양양 서핑">네이버 양양 서핑</option>' +
		            '<option value="네이버 게스트 하우스">네이버 게스트 하우스</option>' +
		            '<option value="현금">현금</option>' +
		            '<option value="카드">카드</option>' +
		            '<option value="서비스">서비스</option>' +
		            '<option value="현장결제 카드">현장결제 카드</option>' +
		            '<option value="현장결제 현금">현장결제 현금</option>' +
		            '<option value="custom">직접입력</option>' +
		        '</select>' +
		        '<div class="date option_pay_method_text_div">' +
		            '<input type="text" name="option_pay_method_text" placeholder="직접입력" class="option_pay_method_text" value="' + el.option_pay_method + '">' +
		            '<i class="arr-d"></i>' +
		        '</div>';
			}else{
				option_pay_method_html += '' +
				'<select name="option_pay_method" id="">' +
		            '<option value="네이버 강릉 서핑" ' + (el.option_pay_method == '네이버 강릉 서핑' ? 'selected="selected"' : '') + '>네이버 강릉 서핑</option>' +
		            '<option value="네이버 양양 서핑" ' + (el.option_pay_method == '네이버 양양 서핑' ? 'selected="selected"' : '') + '>네이버 양양 서핑</option>' +
		            '<option value="네이버 게스트 하우스" ' + (el.option_pay_method == '네이버 게스트 하우스' ? 'selected="selected"' : '') + '>네이버 게스트 하우스</option>' +
		            '<option value="현금" ' + (el.option_pay_method == '현금' ? 'selected="selected"' : '') + '>현금</option>' +
		            '<option value="카드" ' + (el.option_pay_method == '카드' ? 'selected="selected"' : '') + '>카드</option>' +
		            '<option value="서비스" ' + (el.option_pay_method == '서비스' ? 'selected="selected"' : '') + '>서비스</option>' +
		            '<option value="현장결제 카드" ' + (el.option_pay_method == '현장결제 카드' ? 'selected="selected"' : '') + '>현장결제 카드</option>' +
		            '<option value="현장결제 현금" ' + (el.option_pay_method == '현장결제 현금' ? 'selected="selected"' : '') + '>현장결제 현금</option>' +
		            '<option value="custom">직접입력</option>' +
		        '</select>' +
		        '<div class="date option_pay_method_text_div hide">' +
		            '<input type="text" name="option_pay_method_text" placeholder="직접입력" class="option_pay_method_text">' +
		            '<i class="arr-d"></i>' +
		        '</div>';
			}
			
			html += '' +
			'<tr>' +
				'<input name="option_id" type="hidden" value="' + el.option_id + '"/>' +
		        '<td>' +
		            '<select name="option_name" id="option_name">' +
		                '<option value="서핑강습" ' + (el.option_name == '서핑강습' ? 'selected="selected"' : '') + '>서핑강습</option>' +
		                '<option value="서핑렌탈" ' + (el.option_name == '서핑렌탈' ? 'selected="selected"' : '') + '>서핑렌탈</option>' +
		                '<option value="파티" ' + (el.option_name == '파티' ? 'selected="selected"' : '') + '>파티</option>' +
		                '<option value="펍" ' + (el.option_name == '펍' ? 'selected="selected"' : '') + '>펍</option>' +
		            '</select>' +
		        '</td>' +
		        '<td>' +
		            '<input type="text" class="hastxt" name="option_quantity" value="' + el.option_quantity + '">개' +
		        '</td>' +
		        '<td>' +
		            '<input type="text" class="hastxt" name="option_payment" value="' + el.option_payment + '">원' +
		        '</td>' +
		        '<td>' +
		            option_pay_method_html + 
		        '</td>' +
		        '<td>' +
		            '<div class="date">' +
		                '<input id="datetimepicker2" type="text" class="input2 datetimepicker2" name="option_hope_time" value="' + new Date(el.option_hope_time).format('yyyy-MM-dd HH:mm:ss') + '">' +
		                '<i class="cal1"></i>' +
		            '</div>' +
		        '</td>' +
		        '<td>' +
		            '<select name="option_use_yn" id="">' +
		                '<option value="Y"  ' + (el.option_use_yn == 'Y' ? 'selected="selected"' : '') + '>수강</option>' +
		                '<option value="N"  ' + (el.option_use_yn == 'N' ? 'selected="selected"' : '') + '>미수강</option>' +
		            '</select>' +
		        '</td>' +
		        '<td>' +
		            '<button type="button" class="btn-red2 op-del">삭제</button>' +
		        '</td>' +
		    '</tr>';
		});
		$(".option_table").html(html);
		$('.datetimepicker2').datetimepicker({
    		format:'Y-m-d H:i',
    	});
	})
}