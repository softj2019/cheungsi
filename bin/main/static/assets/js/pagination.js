//페이징처리
function pagination(searchVO, loadFunction){
	var html = '';
	
	if(searchVO.totPage > 1){
		if(searchVO.page > 1){
			html += '<li class="page-item"><a class="page-link" href="javascript:movePage(1,\'' + loadFunction + '\')">≪</a></li>' +
					'<li class="page-item"><a class="page-link" href="javascript:movePage(' + (searchVO.page-1) + ',\'' + loadFunction + '\')">＜</a></li>';
		}
		
		for(var i=searchVO.pageStart; i<searchVO.pageEnd+1; i++){
			if(i == searchVO.page){
				html += '<li class="page-item"><a class="page-link active" href="#">' + i + '</a></li>';
			}else{
				html += '<li class="page-item"><a class="page-link" href="javascript:movePage(' + i + ',\'' + loadFunction + '\')">' + i + '</a></li>';
			}
		}
		
		if(searchVO.totPage > searchVO.page){
			html += '<li class="page-item"><a class="page-link" href="javascript:movePage(' + (searchVO.page+1) + ',\'' + loadFunction + '\')">＞</a></li>' +
					'<li class="page-item"><a class="page-link" href="javascript:movePage(' + searchVO.totPage + ',\'' + loadFunction + '\')">≫</a></li>';
		}
	}
	$("ul.pagination").html(html);
}

//페이지클릭
function movePage(page, loadFunction){
	searchVO['page'] = page;
	eval(loadFunction);
}