$(function(){
	loadCategory1();
	loadCategory2(1);
	
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
	            '<div class="option_pay_method_text_div">' +
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
    
    //카테고리1 클릭
    $("select[name=category1]").change(function(){
    	var upperId = $('select[name=category1] option:selected').attr('data-id');
    	loadCategory2(upperId);
    })
    
    //라디오버튼 직접입력선택
    $("input[name=res_pay_method]").on('input',function(){
    	var value = $(this).val();
    	if(value == 'custom'){
    		$("input[name=res_pay_method_text]").show();
    	}else{
    		$("input[name=res_pay_method_text]").hide();
    	}
    });
    
    //셀렉트박스 직접입력선택
    $(document).on('input',"select[name=option_pay_method]",function(){
    	var value = $(this).val();
    	if(value == 'custom'){
    		$(this).hide();
    		$(this).siblings(".option_pay_method_text_div").show();
    	}else{
    		$(this).show();
    		$(this).siblings(".option_pay_method_text_div").hide();
    	}
    });
    //셀렉트박스로돌아가기
    $(document).on('click',".option_pay_method_text_div i.arr-d",function(){
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