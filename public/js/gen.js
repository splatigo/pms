
$(function (argument) {
	$(".close-x").click(function (argument) {
		$(".success-msg,.err-msg").hide()
	})
})
var host="http://localhost:3000"
function check_empty(arr) {

    // body...

    for(var i=0;i<arr.length;i++){

        if(arr[i].val.length==0){

            var msg=arr[i].fn+" field is empty"

            display_err(msg,3000)
            return false;
        }
    }

    return true;

}
function ajax_login(username,password,callback) {

		var data={username:username,password:password}
		var url=host+"/auth-sign"
		$(".msg").hide()
		$(".loading-div").show()
		$.ajax({

	        type:"POST",
	        data:data,

	        dataType:'json',

	        url:url,

	        success: function(data) {

	        	$(".loading-div").hide()

	        	if(data.msg=="fail"){

	        		display_err("Incorrect Username (phone) or password")

	        	}

	        	else{
	        		callback()
	        	}

	        },

	        error  : function(err) {

	        	display_err("Unable to connect to server")

	        }

		});
}
function validate_phone(phone) {
	if(phone.length!=10)
	{	

		display_err("Incorrect phone number. Ensure number makes 10 Digits")
		return false;
	}
	var pref=phone.substring(0,3)
	if(pref=="079"||pref=="077"||pref=="075"||pref=="074"||pref=="071"||pref=="078"){
		//correct
		return true;
	}
	else{
		//incorrect number
		display_err("Incorrect phone number or format entered")
		return false
	}

}
function validatePhoneForE164(phoneNumber) {
    const regEx = /^\+[1-9]\d{10,14}$/;

    return regEx.test(phoneNumber);
};
function display_err(msg,duration) {

    $(".loading-div,.success-msg,.info-msg").hide()

    $(".err-content").html(msg)

    $(".err-msg").show(1000)

}

function display_succ(msg,duration) {

    $(".loading-div,.err-msg,.info-msg").hide()

    $(".success-content").html(msg)

    $(".success-msg").show(1000)

}

function display_info(msg,duration) {

    $(".loading-div,.err-msg,.success-msg").hide()

    $(".info-content").html(msg)

    $(".info-msg").show(1000)

}

function ajax_go(data,callback) {

    var url=host

    data.ajax=1

    if(data.url)

        url=url+data.url
    $.ajax({

            url: url,

            data: data,

            cache: false,

            type: "GET",

            success: function(result) {

                $(".loading-div").hide()

                if(result.errmsg){

                    

                    display_err(result.errmsg)

                }

                callback(result)

            },

            error: function(e) {

                
            	console.log(JSON.stringify(e))
                $(".loading-div").hide()

                display_err("Unable to connect to server, you are probably offline",3000)

            }

    });

}