$(function(){
	$("#category_add_btn").show();
    $("#category_del_btn").hide();
    $("input[name=category_name]").show();
    $("input[name=category_max_quantity]").hide();
    $(".category-update-div").hide();
	/******************************************* listener start *******************************************/
	$('.category-out > li > a').click(function(e){
        e.preventDefault();
        $('.category-out > li > a').removeClass('active');
        $('.category-out > li > ul > li').removeClass('active');
        $(this).addClass('active');
        
        var value = $(this).attr('value');
        var upperId = $(this).attr('upper-id');
        var text = $(this).attr('category-name');
        selectCategory(value, text, upperId);
        
        $("#category_add_btn").show();
        $("#category_del_btn").show();
        $("input[name=category_name]").show();
        $("input[name=category_max_quantity]").show();
        $(".category-update-div").show();
        $("#category_max_quantity2").hide();
        $("#category_name2").val(text);
        $("input[name=category_id2]").val(value);
        $("input[name=category_name2]").val(text);
    });
    $('.category-out > li > ul > li').click(function(){
        $('.category-out > li > ul > li').removeClass('active');
        $('.category-out > li > a').removeClass('active');
        $(this).addClass('active');
        $(this).parent().parent().children('a').addClass('active');
        
        var value = $(this).attr('value');
        var upperId = $(this).attr('upper-id');
        var maxQuantity = $(this).attr('max-quantity');
        var text = $(this).attr('category-name');
        selectCategory(value, text, upperId);
        
        $("#category_add_btn").hide();
        $("#category_del_btn").show();
        $("input[name=category_name]").hide();
        $("input[name=category_max_quantity]").hide();
        $(".category-update-div").show();
        $("#category_max_quantity2").show();
        $("input[name=category_id2]").val(value);
        $("input[name=category_name2]").val(text);
        $("input[name=category_max_quantity2]").val(maxQuantity);
    });
    $("select[name=category_id]").change(function(){
    	if($(this).val() == '0'){
    		$("#category_add_btn").show();
    	    $("#category_del_btn").hide();
    	    $("input[name=category_name]").show();
    	    $("input[name=category_max_quantity]").hide();
    	}else{
    		if($(this).attr("upper-id") == '0'){
	    		$("#category_add_btn").show();
	    	    $("#category_del_btn").show();
	    	    $("input[name=category_name]").show();
	    	    $("input[name=category_max_quantity]").show();
    		}else{
    			$("#category_add_btn").hide();
	    	    $("#category_del_btn").show();
	    	    $("input[name=category_name]").hide();
	    	    $("input[name=category_max_quantity]").hide();
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
		category_max_quantity: $("input[name=category_max_quantity]").val(),
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

//수정버튼
function updateCategory(){
	var formData = {
		category_id: $("input[name=category_id2]").val(),
		category_name: $("input[name=category_name2]").val(),
		category_max_quantity: $("input[name=category_max_quantity2]").val(),
	}
	postCallAjax('/api/updateCategory', formData, function(data){
		location.reload();
	});
}