var adata={}
$(function () {
	get_defaults()

	$(".a-dashboard").click(function () {
		$(".child-div").hide()
		$("#dashboard").show()
		get_defaults()

	})

	$(".a-get-chicken-status").click(function () {
		var data={url:"/group",rq:"get-chicken-status"}
		ajax_go(data,function (rst) {
			$(".child-div").hide()
			$("#chicken-status-div").show()

			load_chicken_status(rst)
		})
		
	})
	$("#a-new-cs").click(function (argument) {
		$("#cs-modal").modal("show")
		adata.axn="new-cs"
	})
	$("#save-cs").click(function () {
		var member_id=$("#cs-member-id").val()
		var healthy=$("#cs-healthy").val()
		var sick=$("#cs-sick").val()
		var dead=$("#cs-dead").val()
		var year=$("#cs-year").val()
		var month=$("#cs-month").val()
		var week=$("#cs-week").val()
		var arr=[{fn:"Year",val:year,ft:"sel"},{fn:"Month",val:month,ft:"sel"},{fn:"Week",val:week,ft:"sel"},{fn:"No. of Healthy Chicks",val:healthy},{fn:"No. of Sick Chicks",val:sick},{fn:"No. of Dead Chicks",val:dead}]
		var vr=check_empty(arr)
		
		if(!vr)
			return 0;

		var data={url:"/group",rq:adata.axn,year:year,month:month,week:week,healthy:healthy,sick:sick,dead:dead,member_id:member_id}
		data.id=adata.id;
		ajax_go(data,function (rst) {
			$("#cs-modal").modal("hide")
			load_chicken_status(rst)
		})
		
	})
	$("#add-group-member-btn").click(function () {
		var userid=adata.userid
		var group_id=adata.group_id
		var role=$("#role").val()
		var phone=$("#phone").val()
		var name=$("#member-name").val();
		email=$("#email").val()
		var arr=[]
		var data = new FormData();
		 var data2={url:"/group",rq:adata.memaxn}
		data.append("group_id",group_id)
		data.append("rq",adata.memaxn)
		data.append("role",role)
		arr[arr.length]={fn:"Member's Name ",val:name};data.append("name",name);
		arr[arr.length]={fn:"Email",val:email,ft:"email"};data.append("email",email)
		arr[arr.length]={fn:"Phone",val:phone,ft:"phone"};data.append("phone",phone)
		phoneb=$("#other-phone").val();arr[arr.length]={fn:"Other Phone",val:phoneb,ft:"phone"};data.append("phoneb",phoneb)
		var dob=$("#year").val()+"-"+$("#month").val()+"-"+$("#day").val()
		arr[arr.length]={fn:"Date of Birth",val:dob};data.append("dob",dob);
		var gender=$("#gender").val();arr[arr.length]={fn:"Gender",val:gender,ft:"sel"};data.append("gender",gender)
		var marital_status=$("#marital-status").val();arr[arr.length]={fn:"Marital status",val:marital_status,ft:"sel"};data.append("marital_status",marital_status)
		var spouse=$("#spouse").val();
		if(marital_status=="Married")
			arr[arr.length]={fn:"Name of Spouse",val:spouse};
		var dependants=$("#dependants").val();arr[arr.length]={fn:"No. of Dependants",val:dependants};data.append("dependants",dependants)
		data.append("spouse",spouse);
		var disability_status=$("#disability-status").val();arr[arr.length]={fn:"Disability Status",val:disability_status,ft:"sel"};data.append("disability_status",disability_status)
		var disability_type=$("#disability-type").val();data.append("disability_type",disability_type);
		if(disability_status=="Disabled")
			arr[arr.length]={fn:"Disability Type",val:disability_type,ft:"sel"};
		var district=$("#member-district").val();arr[arr.length]={fn:"District",val:district,ft:"sel"};data.append("district",district);
		var county=$("#member-county").val();arr[arr.length]={fn:"County",val:county,ft:"sel"};data.append("county",county);
		var subcounty=$("#member-subcounty").val();arr[arr.length]={fn:"Subcounty",val:subcounty,ft:"sel"};data.append("subcounty",subcounty);

		var parish=$("#member-parish").val();arr[arr.length]={fn:"Parish",val:parish,ft:"sel"};data.append("parish",parish);
		var village=$("#member-village").val();arr[arr.length]={fn:"Village",val:village,ft:"sel"};data.append("village",village);
		var edu_level=$("#edu-level").val();arr[arr.length]={fn:"Education Level",val:edu_level,ft:"sel"};data.append("edu_level",edu_level);
		var income_source=$("#income-source").val();arr[arr.length]={fn:"Source of Income",val:income_source};data.append("income_source",income_source);
		var place_of_operation=$("#place-of-operation").val();arr[arr.length]={fn:"Place of Operation",val:place_of_operation};data.append("place_of_operation",place_of_operation);
		var id_no=$("#id-no").val();arr[arr.length]={fn:"ID No",val:id_no};data.append("id_no",id_no);
		var id_photo=$("#id-photo")[0].files
		var profile_photo=$("#profile-photo")[0].files
		if(adata.memaxn=="add-group-member"){
			arr[arr.length]={fn:"Id Photo",val:id_photo,ft:"photo"};
			arr[arr.length]={fn:"Profile Photo",val:profile_photo,ft:"photo"};
		}
		else{
			arr[arr.length]={fn:"Id Photo",val:id_photo,ft:"photo",op:1};
			arr[arr.length]={fn:"Profile Photo",val:profile_photo,ft:"photo",op:1};
		}
		
		var nok=$("#nok").val();arr[arr.length]={fn:"Next of Kin Name",val:nok};data.append("nok",nok);
		var nok_phone=$("#nok-phone").val();arr[arr.length]={fn:"Next of kin Primary Phone",val:nok_phone,ft:"phone"};data.append("nok_phone",nok_phone)
		var nok_phoneb=$("#nok-phoneb").val();arr[arr.length]={fn:"Next of kin Other Phone",val:nok_phoneb,ft:"phone"};data.append("nok_phoneb",nok_phoneb)
		arr[arr.length]={fn:"Role",val:role,ft:"sel"};
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		if(id_photo.length)
			data.append("profile_photo",$("#profile-photo")[0].files[0])
		if(profile_photo.length)
			data.append("id_photo",$("#id-photo")[0].files[0])
		data.append("member_id",adata.member_id)
		ajax_file(data,data2,function (rst) {
			if(rst.errmsg){
			}
			else{
				display_succ("Operation successful")
				$("#add-new-member-div").modal("hide")
				var group_members=rst.group_members
				load_group_members(group_members)
			}
		})
	})
	$("#a-add-new-member").click(function () {
		$("#member-name").text("")
		$("#member-name-2").text("")
		$("#agm-phone").val("")
		$("#add-new-member-div").modal("show")
		adata.memaxn="add-group-member"
		
		$("#add-new-member-hdr").text("Add New Member")
		clear_fields()
	})
	$("#change-role-btn").click(function (argument) {
		var id=adata.id;
		var group_id=$("#h-group-id").val()
		var role=$("#role-2").val()
		var arr=[{fn:"Role",val:role,ft:"sel"}]
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		var data={group_id:group_id,id:id,role:role,url:"/group",rq:"change-role"}
		ajax_go(data,function (rst) {
				display_succ("Role change successfully")
				var group_members=rst.group_members
				load_group_members(group_members)
				$("#change-role-div").modal("hide")
		})
	})
	$(".a-add-stock").click(function () {
		
		$(".child-div").hide()
		$("#stock-div").show()
		$("#new-stock-div").modal("show")
		clear_fields()
	})
	$(".a-add-order").click(function () {
		
		$(".child-div").hide()
		$("#orders-div").show()
		$("#new-order-div").modal("show")
		clear_fields()
	})
	
	$("#add-stock-btn").click(function () {
		var group_id=adata.group_id
		if(adata.me.role=="Chairperson")
			var member_id=$("#member-id").val()
		else
			member_id=adata.me.id;
			
		var qty=$("#n-qty").val()

		var arr=[{fn:"Quantity",val:qty},{fn:"Member",val:member_id,ft:"sel"}]
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		var data={group_id:group_id,url:"/group",rq:"add-stock",member_id:member_id}
		
		data.qty=qty;
		ajax_go(data,function (rst) {
			$("#new-stock-div").modal("hide")
			var es=rst.egg_stock;
			load_egg_stock(es)
			load_stock_sum(rst.stock_sum)
		})

	})
	$("#edit-stock-btn").click(function () {
		var group_id=adata.group_id
		var data={group_id:group_id,url:"/group",rq:"edit-stock"}
		var qty=$("#e-qty").val()
		var arr=[{fn:"Quantity",val:qty}]
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		data.qty=qty;
		data.id=adata.id;
		ajax_go(data,function (rst) {
			$("#edit-stock-div").modal("hide")
			display_succ("Stock updated successfully")
			var es=rst.egg_stock;
			load_egg_stock(es)
			load_stock_sum(rst.stock_sum)

		})

	})
	$("#add-order-btn").click(function () {
		var group_id=adata.group_id
		
		if(adata.me.role=="Chairperson")
			var member_id=$("#order-member-id").val()
		else
			member_id=adata.me.id;
		var qty=$("#n-order-qty").val()
		var arr=[{fn:"Quantity",val:qty},{fn:"Member",val:member_id,ft:"sel"}]
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		var data={group_id:group_id,url:"/group",rq:"add-order",member_id:member_id}
		
		data.qty=qty;
		ajax_go(data,function (rst) {
			$("#new-order-div").modal("hide")
			display_succ("Order added successfully")
			var es=rst.orders;
			load_orders(es)
		})
	})
	$("#edit-order-btn").click(function () {
		var group_id=adata.group_id
		var data={group_id:group_id,url:"/group",rq:"edit-order"}
		var qty=$("#e-order-qty").val()
		var arr=[{fn:"Quantity",val:qty}]
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		data.qty=qty;
		data.id=adata.id;
		ajax_go(data,function (rst) {
			$("#edit-order-div").modal("hide")
			display_succ("Order Item updated successfully")
			var es=rst.orders;
			load_orders(es)

		})

	})
	$(".view-stock").click(function () {
		
		view_egg_stock()

	})
	$(".view-orders").click(function () {
		view_orders()

	})
	$(".a-members").click(function () {
		var group_id=$("#h-group-id").val()
		var data={group_id:group_id,url:"/group",rq:"get-members"}
		$(".child-div").hide()
		$("#members-div").show()
		clear_fields()

	})

})
function view_orders() {
	var group_id=$("#h-group-id").val()
	var data={group_id:group_id,url:"/group",rq:"view-orders"}
	ajax_go(data,function (rst) {
		var orders=rst.orders;
		$(".child-div").hide()
		$("#orders-div").show()
		load_orders(orders)
	})
}
function view_egg_stock() {
	var group_id=$("#h-group-id").val()
	var data={group_id:group_id,url:"/group",rq:"view-egg-stock"}
	ajax_go(data,function (rst) {
		var es=rst.egg_stock;
		$(".child-div").hide()
		$("#stock-div").show()
		load_egg_stock(es)
	})
}
function load_egg_stock(es) {
	adata.es=es;
	if(!es.length)
	{
		$("#no-stock").show()
		$("#stock-table").hide()
		return 0
	}
	$("#no-stock").hide()
	$("#stock-table").show()
	var tr="<thead><tr><th>Stock No</th><th>Recorded on</th><th>Quantity</th><th>Amount</th><th class='leader-item'>Member</th><th>Status</th><th></th></tr></thead><tbody>"
	for(var i=0;i<es.length;i++){
		var op="<div>"
		var qty=es[i].trays;
		var time_recorded=es[i].time_recorded
		var id=es[i].id;
		var stock_no=es[i].stock_no
		var amount=cx(es[i].amount)
		var status=es[i].status;
		var member_name=es[i].member_name
		if(status=="Pending Approval"){
			op+="<button class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Options</button>"
			op+=" <div class='dropdown-menu'>"
			op+="<a class='dropdown-item' href='#' onclick='edit_stock_dl("+i+")'>Edit</a>"
			op+="<a class='dropdown-item' href='#' onclick='remove_stock("+id+")'>Delete</a>"
			op+="</div></div>"
		}
		
		
		
		tr+="<tr><td>"+stock_no+"</td><td>"+time_recorded+"</td><td>"+qty+"</td><td>"+amount+"</td><td class='leader-item'>"+member_name+"</td><td>"+status+"</td><td class='leader-item'>"+op+"</td></tr>"
	}
	$("#stock-table").html("</tbody>"+tr)
	if(adata.me.role=="Chairperson"){
		$(".leader-item").show()
	}
	else{
		$(".leader-item").hide()
	}
	
}
function load_orders(es) {
	adata.orders=es;
	if(!es.length)
	{
		$("#no-orders").show()
		$("#orders-table").hide()
		return 0
	}
	$("#no-orders").hide()
	$("#orders-table").show()
	var tr="<thead><tr><th>Order No</th><th>Recorded on</th><th>Quantity</th><th>Amount</th><th class='leader-item'>Member</th><th>Status</th><th></th></tr></thead><tbody>"
	for(var i=0;i<es.length;i++){
		var op=""
		var qty=es[i].qty;
		var time_recorded=es[i].time_recorded
		var id=es[i].id;
		var order_no=es[i].order_no
		var amount=cx(es[i].amount);
		var status=es[i].status;
		var member_name=es[i].member_name
		if(status=="Pending Approval"){
			op+="<button class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Options</button>"
			op+=" <div class='dropdown-menu'>"
			op+="<a class='dropdown-item' href='#' onclick='edit_orders_dl("+i+")'>Edit</a>"
			op+="<a class='dropdown-item' href='#' onclick='remove_order("+id+")'>Delete</a>"
		}
		op+="</div></div>"
		tr+="<tr><td>"+order_no+"</td><td>"+time_recorded+"</td><td>"+qty+"</td><td>"+amount+"</td><td class='leader-item'>"+member_name+"</td><td>"+status+"</td><td class='leader-item'>"+op+"</td></tr>"
	}
	$("#orders-table").html("</tbody>"+tr)
	if(adata.me.role=="Chairperson"){
		$(".leader-item").show()
	}
	else{
		$(".leader-item").hide()
	}
	
}
function edit_stock_dl(index) {
	var es=adata.es;
	var qty=es[index].trays;
	adata.id=es[index].id;
	$("#e-qty").val(qty)
	$("#edit-stock-div").modal("show")
}
function edit_orders_dl(index) {
	var es=adata.orders;
	var qty=es[index].qty;
	adata.id=es[index].id;
	$("#e-order-qty").val(qty)
	$("#edit-order-div").modal("show")
}
function remove_stock(id) {

	var cfm=confirm("Are you sure you want to remove this entry?")
	if(cfm)
	{
		var group_id=adata.group_id
		var data={group_id:group_id,id:id,url:"/group",rq:"remove-stock"}
		ajax_go(data,function (rst) {
			display_succ("Stock entry removed successfully")
			var es=rst.egg_stock
			load_egg_stock(es)
			load_stock_sum(rst.stock_sum)
			
		})
	}
}
function remove_order(id) {

	var cfm=confirm("Are you sure you want to remove this order entry?")
	if(cfm)
	{
		var group_id=adata.group_id
		var data={group_id:group_id,id:id,url:"/group",rq:"remove-order"}
		ajax_go(data,function (rst) {
			display_succ("Order entry removed successfully")
			var es=rst.orders
			load_orders(es)
		})
	}
}

function get_defaults() {
	var group_id=$("#h-group-id").val()

	var data={group_id:group_id,url:"/group",rq:"get-defaults"}
	ajax_go(data,function (rst) {
		var group_members=rst.group_members
		adata.user=rst.user;
		var gd=rst.group_details;
		adata.gd=gd;
		$("#group-name").text(gd[0].group_name)
		$("#my-name").text(" "+rst.me.name)
		adata.me=rst.me
		$("#db-members-count").text(group_members.length)
		var stock_sum=rst.stock_sum;
		load_stock_sum(stock_sum,role)
		load_group_members(group_members,1)
		load_orders_sum(rst.orders_sum)
		load_districts(rst.districts)

	})
}
function load_stock_sum(stock_sum) {
	$("#db-pending-approval").html("0 Eggs <hr>UGX 0")
	$("#db-paid").html("0 Eggs <hr>UGX 0")
	$("#db-pending-payment").html("0 Eggs <hr>UGX 0")
	for(var i=0;i<stock_sum.length;i++){
		var amount=cx(stock_sum[i].amount)
		var qty=cx(stock_sum[i].trays)
		if(stock_sum[i].status=="Pending Approval")
			$("#db-pending-approval").html(qty+" Eggs  <hr> UGX"+ amount)
		if(stock_sum[i].status=="Paid")
			$("#db-paid").html(qty+" Eggs <hr> UGX "+amount)
		if(stock_sum[i].status=="Pending Payment")
			$("#db-pending-payment").html(qty+" Eggs  <hr> UGX "+amount)
	}
}
function load_orders_sum(stock_sum) {
	$("#db-orders-pending-approval").html("0 Orders<hr> 0 Chicks<hr>UGX 0")
	$("#db-orders-pending-delivery").html("0 Orders<hr> 0 Chicks<hr>UGX 0")
	$("#db-orders-out-for-delivery").html("0 Orders<hr> 0 Chicks<hr>UGX 0")
	$("#db-orders-delivered").html("0 Orders<hr>0 Chicks <hr>UGX 0")
	for(var i=0;i<stock_sum.length;i++){
		var amount=cx(stock_sum[i].amount)
		var qty=cx(stock_sum[i].qty)
		var no=stock_sum[i].no
		if(stock_sum[i].status=="Pending Approval")
			$("#db-orders-pending-approval").html(no+" Orders <hr>"+qty+" Chicks  <hr>UGX "+ amount)
		if(stock_sum[i].status=="Pending Delivery")
			$("#db-orders-pending-delivery").html(no+" Orders <hr>"+qty+" Chicks  <hr>UGX "+ amount)
		if(stock_sum[i].status=="Out for Delivery")
			$("#db-orders-out-for-delivery").html(no+" Orders <hr>"+qty+" Chicks <hr>UGX "+ amount)
		if(stock_sum[i].status=="Delivered")
			$("#db-orders-delivered").html(qty+" Chicks  <hr>UGX "+ amount)
	}
}
function change_role_dl(index) {
	var group_members=adata.group_members
	var role=group_members[index].role;
	
	
	$("#role-2").val(role)
	$("#change-role-div").modal("show")
	var id=group_members[index].id;
	adata.id=id;
}
function remove_member(id) {
	var cfm=confirm("Confirm Removal")
	var group_id=$("#h-group-id").val()
	if(cfm){
		var data={group_id:group_id,id:id,url:"/group",rq:"remove-member"}
		ajax_go(data,function (rst) {
			display_succ("Member removed successfully")
			var group_members=rst.group_members
			load_group_members(group_members)
			
		})
	}



}

function load_group_members(group_members,sel) {
	//$(".child-div").hide()
	//$("#members-div").show()
	if(group_members.length==0){
		$("#no-group-members").show()
		$("#members-table").hide()
		return 0
	}
	else{
		$("#no-group-members").hide()
		$("#members-table").show()
	}	
	adata.group_members=group_members;
	var ops="<option value=0>Select a member</option>"

	var tr="<thead><tr><th>#</th><th></th><th>Name</th><th class='leader-item'>Member No.</th><th class='leader-item'>Password</th><th>Role</th><th>Phone</th><th></th></tr></thead><tbody>"
	for(var i=0;i<group_members.length;i++){
		var name=group_members[i].name;
		var phone=group_members[i].phone
		var id=group_members[i].id;
		var userid=group_members[i].id;
		var role=group_members[i].role
		var member_no=group_members[i].member_no
		var reset_code=group_members[i].reset_code
		var status=group_members[i].status;
		if(status==1)
			reset_code="******"
		var ts=new Date()
		var op="<div class='btn-group' >"
		op+="<button class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Options</button>"
		op+=" <div class='dropdown-menu'>"
		op+="<a class='dropdown-item' href='#' onclick='change_role_dl("+i+")'>Change Role</a>"
		op+="<a class='dropdown-item' href='#' onclick='edit_user_dl("+i+")'>Edit Details</a>"
		op+="<a class='dropdown-item' href='#' onclick='remove_member("+id+")'>Remove Member</a>"
		op+="</div></div>"
		tr+="<tr><td>"+(i+1)+"</td><td><img onerror='no_image(this)' style='width:50px;height:50px' src=\"/uploads/profiles/gm-"+id+"?ts="+ts+"\"></td><td>"+name+"</td><td class='leader-item'>"+member_no+"</td><td class='leader-item'>"+reset_code+"</td><td>"+role+"</td><td>"+phone+"</td><td class='leader-item'>"+op+"</td></tr>"
		ops+="<option value="+userid+">"+name+"</option>"
	}
	$("#members-table").html("</tbody>"+tr)
	if(!sel)
		$("#members-div").show()

	$("#member-id,#order-member-id,#cs-member-id").html(ops)
	if(adata.me.role=="Chairperson"){
		$(".leader-item").show()
	}
	else{
		
		$(".leader-item").hide()
	}
}
function edit_user_dl(i){
		clear_fields()
		adata.memaxn="edit-group-member"
		var gm=adata.group_members[i];
		adata.member_id=gm.id;
		$("#add-new-member-hdr").text("Update Member Details")
		$("#role").val(gm.role)
		$("#phone").val(gm.phone)
		$("#member-name").val(gm.name);
		$("#email").val(gm.email)
		$("#other-phone").val(gm.phoneb);
		var dob2=gm.dob2.split("-")
		$("#year").val(dob2[0])
		$("#month").val(dob2[1])
		$("#day").val(dob2[2])
		$("#gender").val(gm.gender);
		$("#marital-status").val(gm.marital_status);
		$("#dependants").val(gm.no_of_dependants);
		$("#spouse").val(gm.name_of_spouse);
		$("#disability-status").val(gm.disability_status)
		$("#member-district").val(gm.district);
		$("#member-village").val(gm.village);
		$("#edu-level").val(gm.education_level);
		$("#income-source").val(gm.souce_of_income);
		$("#place-of-operation").val(gm.place_of_operation);
		$("#id-no").val(gm.id_no);
		$("#nok").val(gm.nok_name);
		$("#nok-phone").val(gm.nok_primary_phone)
		$("#nok-phoneb").val(gm.nok_other_phone)
		$("#add-new-member-div").modal("show")
		get_counties(gm.district,"member-",function () {
		$("#member-county").val(gm.county)
		})
		get_subcounties(gm.district,gm.county,"member-",function () {
			$("#member-subcounty").val(gm.subcounty)
		})
		get_parishes(gm.district,gm.county,gm.subcounty,"member-",function(){
			$("#member-parish").val(gm.parish)
		})

}
function load_chicken_status(rst) {
	var cs=rst.chicken_status;

	if(cs.length==0){
		$("#no-chicken-status").show()
		$("#chicken-status-table").hide()
		return 0
	}
	else{
		$("#no-chicken-status").hide()
		$("#chicken-status-table").show()
	}	
	adata.chicken_status=cs;
	
	var tr="<thead><tr><th>#</th><th>Member</th><th>Healthy</th><th>Sick</th><th>Dead</th><th>Period</th><th>Recorded on</th><th></th></tr></thead><tbody>"
	for(var i=0;i<cs.length;i++){
		var member_name=cs[i].member_name
		var healthy=cs[i].healthy;
		var sick=cs[i].sick
		var dead=cs[i].dead;
		var time_recorded=cs[i].time_recorded
		var period="Week "+cs[i].week+", "+cs[i].month+", "+cs[i].year
		var op=""
		var id=cs[i].id;
		var op="<div class='btn-group' >"
		op+="<button class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Options</button>"
		op+=" <div class='dropdown-menu'>"
		op+="<a class='dropdown-item' href='#' onclick='edit_cs_dl("+i+")'>Edit</a>"
		op+="<a class='dropdown-item' href='#' onclick='remove_cs("+id+")'>Delete</a>"
		op+="</div></div>"
		tr+="<tr><td>"+(i+1)+"</td><td>"+member_name+"</td><td>"+healthy+"</td><td>"+sick+"</td><td>"+dead+"</td><td>"+period+"</td><td>"+time_recorded+"</td><td>"+op+"</td></tr>"
	}
	$("#chicken-status-table").html("</tbody>"+tr)
	
}
function edit_cs_dl(i) {
	clear_fields()
	var cs=adata.chicken_status
	var healthy=cs[i].healthy;
	var sick=cs[i].sick
	var dead=cs[i].dead;
	var member_id=cs[i].member_id
	var year=cs[i].year;
	var month=cs[i].month;
	var week=cs[i].week;
	$("#cs-healthy").val(healthy)
	$("#cs-sick").val(sick)
	$("#cs-dead").val(dead)
	$("#cs-member-id").val(member_id)
	$("#cs-year").val(year)
	$("#cs-month").val(month)
	$("#cs-week").val(week)
	adata.axn="edit-cs"
	adata.id=cs[i].id;
	$("#cs-modal").modal("show")
}
function remove_cs(id) {
	var cfm=confirm("Confirm Removal")
	
	if(cfm){
		var data={id:id,url:"/group",rq:"remove-cs"}
		ajax_go(data,function (rst) {
			display_succ("Status removed successfully")
			load_chicken_status(rst)
			
		})
	}
}