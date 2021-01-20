var adata={}
$(function () {
	$("#loading-div").hide()
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
	$("#fetch-number").click(function(){
		var username=$("#reset-phone").val()
		var data={rq:"fetch-number",username:username};
		ajax_go(data,function (rst) {
			if(rst.user)
				var phone=rst.user.phone;
			else
				return display_err("User does not exist")
			adata.phone=phone;
			adata.table=rst.user.table;
			adata.id=rst.user.id;
			adata.username=username
			$("#confirm-send-reset-div").modal("show")
			$("#confirm-send-reset-content").text("We'll send you a verification code to "+phone+". Is this fine?")
			
			
		})
	})
	$(".go-to-register").click(function () {
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
	
	$(".send-reset-code").click(function function_name(argument) {
		send_reset_code()
	})
	$("#submit-reset-code").click(function () {
		var reset_code=$("#reset-code").val()
		var phone=adata.phone;
		var table=adata.table

		var data={rq:"verify-code",phone:phone,reset_code:reset_code,table:table,id:adata.id}
		ajax_go(data,function (rst) {
			if(!rst.errmsg){
				$(".child-div").hide()
				$("#new-password-div").show()
			}
		})
	})
	$("#submit-new-password").click(function (argument) {
		var password=$("#new-password").val().trim()
		var phone=adata.phone;

		if(password.length<6)
			return display_err("Password should be more than 6 characters")
		if(password==phone)
			return display_err("Password can not be your phone number.")
		
		var data={rq:"reset-password",phone:phone,password:password,table:adata.table,id:adata.id}

		ajax_go(data,function (rst) {
			//login one in auto'cly
			login_user(adata.username,password)

		})
	})

})

function login_user(phone,password) {
	ajax_login(phone,password,function (rst) {
		if(rst.user.status==0){
			//reset password
		}
		if(rst.user.priv=="admin"||rst.user.priv=="funder")
			window.location="/admin"

		else if(rst.user.priv=="gm"){
			window.location="/group"
		}
		else if(rst.user.priv=="supplier")
			window.location="/supplier"
		else
			window.location="/market"

	})
}
function send_reset_code() {
	var phone=adata.phone;
	var data={rq:"send-reset-code",phone:phone,table:adata.table,id:adata.id}
	adata.phone=phone;
	ajax_go(data,function (rst) {
		if(!rst.errmsg){
			$(".child-div").hide()
			$("#verification-div").show()
			$("#confirm-send-reset-div").modal("hide")
		}
		
		
	})
}
