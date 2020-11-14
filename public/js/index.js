var adata={}
$(function () {
	$("#login-btn").click(function () {
		var phone=$("#login-username").val()
		var password=$("#login-password").val()
		login_user(phone,password)
	})
	$("#register-btn").click(function () {
		var name=$("#register-name").val()
		var phone=$("#register-phone").val()
		var arr=[{fn:"Name",val:name},{fn:"Phone number",val:phone}]
		var cr=check_empty(arr)
		if(!cr)
			return 0;
		vr=validate_phone(phone)
		if(!vr)
			return 0;
		$("#confirm-phone-div").modal("show")
		$("#confirm-text").text("We'll send you a verification code to "+phone)
		return 0;
		
	})
	$(".go-to-register").click(function (argument) {
		$(".child-div").hide()
		$("#register-div").show()
	})
	$(".go-to-login").click(function (argument) {
		$(".child-div").hide()
		$("#login-div").show()
	})
	$("#confirm-register").click(function function_name(argument) {
		var name=$("#register-name").val()
		var phone=$("#register-phone").val()
		var data={rq:"register",name:name,phone:phone}
		adata.phone=phone;
		ajax_go(data,function (rst) {
			$("#confirm-phone-div").modal("hide")
			if(!rst.errmsg){
				$(".child-div").hide()
				$("#verification-div").show()
			}
			
			
		})
	})
	$(".reset-password").click(function () {
		$(".child-div").hide()
		$("#reset-div").show()
	})
	$(".req-reset-code").click(function (argument) {
		var phone=$("#reset-phone").val()
		adata.phone=phone;
		send_reset_code()

	})
	$(".send-reset-code").click(function function_name(argument) {
		send_reset_code()
	})
	$("#submit-reset-code").click(function () {
		var reset_code=$("#reset-code").val()
		var phone=adata.phone;
		var data={rq:"verify-code",phone:phone,reset_code:reset_code}
		ajax_go(data,function (rst) {
			if(!rst.errmsg){
				$(".child-div").hide()
				$("#new-password-div").show()
			}
		})
	})
	$("#submit-new-password").click(function (argument) {
		var password=$("#new-password").val()
		var phone=adata.phone;
		var data={rq:"reset-password",phone:phone,password:password}

		ajax_go(data,function (rst) {
			//login one in auto'cly
			login_user(phone,password)

		})
	})

})

function login_user(phone,password) {
	console.log(phone,password)
	ajax_login(phone,password,function (rst) {
		window.location="/market"
	})
}
function send_reset_code() {
	var phone=adata.phone;
	var data={rq:"send-reset-code",phone:phone}
	adata.phone=phone;
	ajax_go(data,function (rst) {
		if(!rst.errmsg){
			$(".child-div").hide()
			$("#verification-div").show()
		}
		
		
	})
}