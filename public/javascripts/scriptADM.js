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
            if(data != undefined){
                // console.log("Token Validado");
            }
        });    
    }
});

function logOut(){
    if(window.confirm("Deseja terminar sua sessão?")){
        sessionStorage.removeItem('xTokenx');
        location.reload();
    }
}