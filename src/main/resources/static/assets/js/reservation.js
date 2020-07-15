$(function(){
	$("#category_add_btn").show();
    $("#category_del_btn").hide();
    $("input[name=category_name]").show();
	
	/******************************************* listener start *******************************************/
	$('.category-out > li > a').click(function(e){
        e.preventDefault();
        $('.category-out > li > a').removeClass('active');
        $('.category-out > li > ul > li').removeClass('active');
        $(this).addClass('active');
        
        var value = $(this).attr('value');
        var upperId = $(this).attr('upper-id');
        var text = $(this).text();
        selectCategory(value, text, upperId);
        $("#category_add_btn").show();
        $("#category_del_btn").show();
        $("input[name=category_name]").show();
    });
    $('.category-out > li > ul > li').click(function(){
        $('.category-out > li > ul > li').removeClass('active');
        $('.category-out > li > a').removeClass('active');
        $(this).addClass('active');
        $(this).parent().parent().children('a').addClass('active');
        
        var value = $(this).attr('value');
        var upperId = $(this).attr('upper-id');
        var text = $(this).text();
        selectCategory(value, text, upperId);
        $("#category_add_btn").hide();
        $("#category_del_btn").show();
        $("input[name=category_name]").hide();
    });
    $("select[name=category_id]").change(function(){
    	if($(this).val() == '0'){
    		$("#category_add_btn").show();
    	    $("#category_del_btn").hide();
    	    $("input[name=category_name]").show();
    	}else{
    		if($(this).attr("upper-id") == '0'){
	    		$("#category_add_btn").show();
	    	    $("#category_del_btn").show();
	    	    $("input[name=category_name]").show();
    		}else{
    			$("#category_add_btn").hide();
	    	    $("#category_del_btn").show();
	    	    $("input[name=category_name]").hide();
    		}
    	}
    });
    /******************************************* listener end *******************************************/
});

//카테고리 선택시
function selectCategory(value, text, upperId){
	var html = '<option value="0">최상위분류</option>';
	html += '<option value="' + value + '" upper-id="' + upperId + '">' + text + '</option>';
	
	$("select[name=category_id]").html(html);
	$("select[name=category_id]").val(value);	
}


//추가버튼
function addCategory(){
	var formData = {
		category_name: $("input[name=category_name]").val(),
		category_upper_id: $("select[name=category_id]").val(),
	}
	postCallAjax('/api/insertCategory', formData, function(data){
		location.reload();
	});
}

//삭제버튼
function delCategory(){
	var formData = {
			category_id: $("select[name=category_id]").val(),
	}
	postCallAjax('/api/deleteCategory', formData, function(data){
		location.reload();
	});
}