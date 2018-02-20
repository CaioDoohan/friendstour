$(document).ready(function(){
    var arrUrl = window.location.href.split('/');
    
    if(arrUrl[arrUrl.length-1]!='admin'){
        $.ajax({
            url : '/admin/verify',
            type: 'get',
            dataType: 'text',
            headers: {
                "Authorization": 'bearer ' + sessionStorage.getItem('xTokenx')
            },
            error: function (request, status, error) {
                 window.location.href='/admin';
            }
        }).done(function(data){ 
            //console.log('CALLBACK:',data);
            if(data != undefined){
                console.log("Token Validado");
            }
        });    
    }
});