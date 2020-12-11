
var adata={}
function get_cs(){
	var year=$("#cs-year").val()
	var month=$("#cs-month").val()
	var week=$("#cs-week").val()
	
	if(adata.latest=="0"){
		var arr=[{fn:"Year",val:year,ft:"sel"},{fn:"Month",val:month,ft:"sel"},{fn:"Week",val:week,ft:"sel"}]
		var vr=check_empty(arr)
		if(!vr)
			return 0;
	}
	var data={url:"/admin",rq:"get-cs",year:year,month:month,week:week,latest:adata.latest}
	ajax_go(data,function (rst) {
		clear_fields()
		$("#cs-modal").modal("hide")
		load_cs(rst)

	})
}
$(function () {
	
	load_days()
	get_defaults()
	$(".a-dashboard").click(function () {
		$(".cd").hide()
		get_defaults()
		
	})
	$("#cs-filter").click(function(){
		$("#cs-modal").modal("show")
	})
	$(".get-cs").click(function(){
		adata.latest=1
		get_cs()
	})
	$("#get-cs").click(function(){
		adata.latest=0
		get_cs()
	})
	$("#a-set-price").click(function () {
		var price=adata.settings.selling_price
		$("#n-price").val(price)
		$("#egg-price-div").modal("show")
	})	

	$("#a-set-buying-price").click(function () {
		var price=adata.settings.buying_price

		$("#n-bying-price").val(price)
		$("#egg-buying-price-div").modal("show")
	})	
	$("#set-price-btn").click(function () {
		var selling_price=$("#n-price").val()
		var arr=[{fn:"Selling Price",val:selling_price}]
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		var data={price:selling_price,url:"/admin",rq:"set-egg-price",field:"selling_price"}
		ajax_go(data,function (rst) {
			$("#egg-price-div").modal("hide")
			display_succ("New price set successfully")
			$("#curr-price").text(cx(selling_price))
			adata.settings.selling_price=selling_price;

		})
	})
	$("#set-buying-price-btn").click(function () {
		var buying_price=$("#n-buying-price").val()
		var arr=[{fn:"Buying Price",val:buying_price}]
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		var data={price:buying_price,url:"/admin",rq:"set-egg-price",field:"buying_price"}
		ajax_go(data,function (rst) {
			$("#egg-buying-price-div").modal("hide")
			display_succ("New price set successfully")
			$("#curr-buying-price").text(cx(buying_price))
			adata.settings.buying_price=buying_price;

		})

	})
	$(".a-create-group").click(function () {
		$("#create-group-div").modal("show")
		adata.axn="create-group"
		$("#create-group-hdr").text("Create New Group")
		clear_fields()
	})

	$(".get-groups").click(function () {
		var data={url:"/admin",rq:"get-groups"}
		ajax_go(data,function (rst) {
			var groups=rst.groups;
			adata.groups=groups
			load_groups(groups)
		})
		
	})
	$(".a-create-supplier").click(function () {
		$("#create-supplier-btn").text("Submit")
		$("#create-supplier-hdr").text("New Supplier")
		$("#create-supplier-div").modal("show")
		adata.suppaxn="create-supplier"
		clear_fields()
	})
	$(".get-suppliers").click(function () {
		var data={url:"/admin",rq:"get-suppliers"}
		ajax_go(data,function (rst) {
			var suppliers=rst.suppliers;
			adata.suppliers=suppliers
			load_suppliers(suppliers)
		})
		
	})
	$("#create-group-btn").click(function () {
		var district=$("#district").val();
		var county=$("#county").val()
		var subcounty=$("#subcounty").val()
		var parish=$("#parish").val()
		var group_name=$("#group-name").val().trim();
		var village=$("#village").val().trim()
		var meeting_place=$("#meeting-place").val()
		var secretary=$("#secretary-name").attr("userid")
		var treasurer=$("#treasurer-name").attr("userid")
		var chairperson=$("#chairperson-name").attr("userid")
		var meeting_day=$("#meeting-day").val()
		var cert_photo=$("#cert-photo")[0].files
		var arr=[{fn:"Group Name",val:group_name},{fn:"District",val:district,ft:"sel"},{fn:"County",val:county,ft:"sel"},{fn:"Subcounty",val:subcounty,ft:"sel"},{fn:"Parish",val:parish,ft:"sel"},{fn:"Village",val:village},{fn:"Meeting Place",val:meeting_place},{fn:"Meeting Day",val:meeting_day,ft:"sel"}]
		if(adata.axn=="create-group")
			arr[arr.length]={fn:"Registration Certificate",val:cert_photo,ft:"photo"}
		else
			arr[arr.length]={fn:"Registration Certificate",val:cert_photo,ft:"photo",op:1}
		var vr=check_empty(arr)
		if(!vr)
			return 0;

		var data2={url:"/admin"}
		var data=new FormData()
		data.append("district",district);
		data.append("county",county);
		data.append("subcounty",subcounty);
		data.append("parish",parish);
		data.append("village",village)
		data.append("group_name",group_name)
		data.append("meeting_place",meeting_place)
		data.append("meeting_day",meeting_day)
		data.append("group_id",adata.group_id)
		data.append("rq",adata.axn)

		if(cert_photo.length)
			data.append("cert_photo",cert_photo[0])

		ajax_file(data,data2,function (rst) {
			var groups=rst.groups
			load_groups(groups)
			adata.groups=groups
			clear_fields()
			if(adata.axn=="edit-group")
				msg="Group details updatd successfully"
			else
				var msg="Group created successfully";
			display_succ(msg)
			$("#create-group-div").modal("hide")
		})
	})
	
	$("#create-supplier-btn").click(function () {
		var district=$("#supp-district").val();
		var county=$("#supp-county").val()
		var subcounty=$("#supp-subcounty").val()
		var parish=$("#supp-parish").val()
		var business_name=$("#business-name").val().trim();
		var address=$("#business-address").val().trim()
		var phone=$("#supp-phone").val()
		var phoneb=$("#supp-other-phone").val()
		var email=$("#supp-email").val()
		var name=$("#supp-name").val()
		var village=$("#supp-village").val().trim()
		var gender=$("#supp-gender").val()
		var id_photo=$("#supp-id-photo")[0].files
		var profile_photo=$("#supp-profile-photo")[0].files
		var arr=[{fn:"Supplier's Name",val:name},{fn:"Gender",val:gender,ft:"sel"},{fn:"Supplier's Phone",val:phone,ft:"phone"},{fn:"Other Phone",val:phoneb,ft:"phone",op:1},{fn:"Email",val:email,ft:"email"},{fn:"Business Name",val:business_name},{fn:"District",val:district,ft:"sel"},{fn:"County",val:county,ft:"sel"},{fn:"County",val:county,ft:"sel"},{fn:"Parish",val:parish,ft:"sel"},{fn:"Village",val:village},{fn:"Business address",val:address}]

		if(adata.suppaxn=="create-supplier"){
			arr[arr.length]={fn:"ID Photo",val:id_photo,ft:"photo"};
			arr[arr.length]={fn:"Profile Photo",val:profile_photo,ft:"photo"}
		}
		else{
			arr[arr.length]={fn:"ID Photo",val:id_photo,ft:"photo",op:1};
			arr[arr.length]={fn:"Profile Photo",val:profile_photo,ft:"photo",op:1}
		}
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		var data2={rq:adata.suppaxn,url:"/admin"}
		var data=new FormData()
		data.append("rq",adata.suppaxn)
		data.append("district",district)
		data.append("county",county)
		data.append("subcounty",subcounty)
		data.append("parish",parish)
		data.append("village",village)
		data.append("business_name",business_name)
		data.append("address",address);
		data.append("email",email)
		data.append("name",name)
		data.append("phone",phone);
		data.append("phoneb",phoneb)
		data.append("gender",gender)
		data.append("supplier_id",adata.supplier_id)
		if(profile_photo.length)
			data.append("profile_photo",$("#supp-profile-photo")[0].files[0])
		if(id_photo.length)
			data.append("id_photo",$("#supp-id-photo")[0].files[0])

		ajax_file(data,data2,function (rst) {
			var suppliers=rst.suppliers
			load_suppliers(suppliers)
			adata.suppliers=suppliers
			clear_fields()
			if(adata.suppaxn=="edit-supplier")
				msg="Supplier updated successfully"
			else
				msg="Supplier created successfully"
			display_succ(msg)
			$("#create-supplier-div").modal("hide")
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
		 var data2={url:"/admin",rq:adata.memaxn}
		data.append("group_id",group_id)
		data.append("rq",adata.memaxn)
		data.append("role",role)
		arr[arr.length]={fn:"Member's Name ",val:name};data.append("name",name);
		arr[arr.length]={fn:"Email",val:email,ft:"email"};data.append("email",email)
		arr[arr.length]={fn:"Phone",val:phone,ft:"phone"};data.append("phone",phone)
		phoneb=$("#other-phone").val();arr[arr.length]={fn:"Other Phone",val:phoneb,ft:"phone",op:1};data.append("phoneb",phoneb)
		var dob=$("#year").val()+"-"+$("#month").val()+"-"+$("#day").val()
		arr[arr.length]={fn:"Date of Birth",val:dob,ft:"date"};data.append("dob",dob);
		
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
		var nok_phoneb=$("#nok-phoneb").val();arr[arr.length]={fn:"Next of kin Other Phone",val:nok_phoneb,ft:"phone",op:1};data.append("nok_phoneb",nok_phoneb)
		arr[arr.length]={fn:"Role",val:role,ft:"sel"};
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		if(profile_photo.length)
			data.append("profile_photo",$("#profile-photo")[0].files[0])
		if(id_photo.length)
			data.append("id_photo",$("#id-photo")[0].files[0])
		data.append("member_id",adata.member_id)
		ajax_file(data,data2,function (rst) {
			if(rst.errmsg){
			}
			else{
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
		var group_id=adata.group_id
		var role=$("#role-2").val()
		
		var arr=[{fn:"Role",val:role,ft:"sel"}]

		var vr=check_empty(arr)
		if(!vr)
			return 0;
		var data={group_id:group_id,id:id,role:role,url:"/admin",rq:"change-role"}
		ajax_go(data,function (rst) {
				display_succ("Role change successfully")
				var group_members=rst.group_members
				load_group_members(group_members)
				$("#change-role-div").modal("hide")
		})
	})
})

function get_defaults() {
	var data={url:"/admin",rq:"get-defaults"}
	ajax_go(data,function (rst) {
		adata.settings=rst.settings
		adata.user=rst.user;

		$("#my-name").text(" "+rst.me.name)
		$(".user-li").show()
		var price=cx(rst.settings.selling_price)
		var districts=rst.districts;
		load_districts(districts)
		$("#curr-price,#db-selling-price").text("UGX "+ price)
		$("#curr-buying-price,#db-buying-price").text("UGX "+cx(rst.settings.buying_price))
		load_stock_sum(rst.stock_sum,rst.instock,rst.instockb)
		load_orders_sum(rst.orders_sum)
		load_supply_orders_sum(rst.supply_orders_sum)
		load_suppliers(rst.suppliers,1)
		var mbrs=" Group Members"
		var gps=" Groups"
		var sps=" Suppliers"
		if(rst.members_count==1)
			mbrs=" Group Member"
		if(rst.group_count==1)
			gps="Group"
		if(rst.suppliers_count==1)
			sps="Supplier"
		$("#db-members-count").text(rst.members_count+mbrs)
		$("#db-group-count").text(rst.group_count+gps)
		$("#db-suppliers-count").text(rst.suppliers_count+sps)

		var healthy=rst.cs_sum[0].healthy;
		var sick=rst.cs_sum[0].sick;
		var dead=rst.cs_sum[0].dead;
		if(healthy==null)
		{
			healthy=0;
			sick=0
			dead=0;
		}

		$("#db-cs").html("Healthy: "+healthy+"<hr>Sick: "+sick+"<hr>Dead: "+dead)
		$(".cd").hide()
		$("#dashboard").show()
	})
}
function load_supply_orders_sum(stock_sum) {
	$("#db-supply-orders-pending-approval").html("0 Orders<hr> 0 Chicks<hr>UGX 0")
	$("#db-supply-orders-pending-delivery").html("0 Orders<hr> 0 Chicks<hr>UGX 0")
	$("#db-supply-orders-out-for-delivery").html("0 Orders<hr> 0 Chicks<hr>UGX 0")
	$("#db-supply-orders-delivered").html("0 Orders<hr>0 Chicks <hr>UGX 0")
	for(var i=0;i<stock_sum.length;i++){
		var amount=cx(stock_sum[i].amount)
		var qty=cx(stock_sum[i].qty)
		var no=stock_sum[i].no
		if(stock_sum[i].status=="Pending Approval")
			$("#db-supply-orders-pending-approval").html(no+" Orders <hr>"+qty+" Chicks  <hr>UGX "+ amount)
		if(stock_sum[i].status=="Pending Delivery")
			$("#db-supply-orders-pending-delivery").html(no+" Orders <hr>"+qty+" Chicks  <hr>UGX "+ amount)
		if(stock_sum[i].status=="Out for Delivery")
			$("#db-supply-orders-out-for-delivery").html(no+" Orders <hr>"+qty+" Chicks <hr>UGX "+ amount)
		if(stock_sum[i].status=="Delivered")
			$("#db-supply-orders-delivered").html(no+" Orders <hr>"+qty+" Chicks  <hr>UGX "+ amount)
	}
}
function load_stock_sum(stock_sum,instock,instockb) {
	if(instock<=1)
		tray="Tray"
	else
		tray="Trays"
	if(instockb&&instockb<30)
		instock="<1"

	$("#db-instock").html((instock)+" "+tray+"<hr><span>"+instockb+" Eggs<span>")
	$("#db-pending-approval").html("0 Eggs<hr>UGX 0")
	$("#db-paid").text("UGX 0")
	$("#db-pending-payment").html("0 Eggs<hr>UGX 0")
	for(var i=0;i<stock_sum.length;i++){
		var amount=cx(stock_sum[i].amount)
		if(stock_sum[i].status=="Pending Approval")
			$("#db-pending-approval").html(stock_sum[i].trays+" Eggs <hr>UGX "+ amount)
		if(stock_sum[i].status=="Paid")
			$("#db-paid").html(stock_sum[i].trays+" Eggs<hr> UGX "+amount)
		if(stock_sum[i].status=="Pending Payment")
			$("#db-pending-payment").html(stock_sum[i].trays+" Eggs<hr> UGX "+amount)
	}
}
function load_orders_sum(order_sum) {

	$("#db-orders-pending-delivery").html("0 Trays<hr>UGX 0")
	$("#db-orders-delivered").html("0 Trays<hr>UGX 0")
	$("#db-orders-out-for-delivery").html("0 Trays<hr>UGX 0")
	for(var i=0;i<order_sum.length;i++){
		var amount=cx(order_sum[i].amount)
		var qty=order_sum[i].trays/30+" Trays, "
		if(order_sum[i].status=="Awaiting Delivery")
			$("#db-orders-pending-delivery").html(qty+"<hr>UGX "+ amount)
		if(order_sum[i].status=="Delivered")
			$("#db-orders-delivered").html(qty+"<hr>UGX "+amount)
		if(order_sum[i].status=="Out for Delivery")
			$("#db-orders-out-for-delivery").html(qty+"<hr>UGX "+amount)
	}
}
function load_groups(groups,msg,hdr) {
	if(!msg)
		$("#no-groups").text("No groups added")
	else
		$("#no-groups").text(msg)

	if(!hdr)
		$("#groups-hdr").text("Groups List")
	else{
		
		$("#groups-hdr").text(hdr)
	}
	if(groups.length){
		$("#no-groups").hide()
		$("#groups-table").show()
	}
	else{
		$("#no-groups").show()
		$("#groups-table").hide()
		return 0;
	}
	$(".cd").hide()
	$("#groups-div").show()
	var tr="<thead><tr><th>#</th> <th>Group No.</th> <th>Group Name</th> <th></th></tr></thead><tbody>"
	for(var i=0;i<groups.length;i++){
		var group_name=groups[i].group_name;
		var location=groups[i].district+", "+groups[i].subcounty+", "+groups[i].parish
		var status=groups[i].status
		var group_id=groups[i].id;
		var group_no=groups[i].group_no
		if(status==0)
			status="Unapproved"
		var dpd="<div class='dropdown'> <button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>Options</button><div class='dropdown-menu'><a  href='#' class='dropdown-item' onclick=\"view_group_members("+group_id+","+i+")\"><i class='fa fa-group'></i> Members</a><a href='#' class='dropdown-item' onclick=\"show_edit_group_dialog("+i+")\"><i class='fa fa-edit'></i> Edit</a><a href='#' class='dropdown-item' onclick=\"show_delete_group_dialog("+group_id+")\"><i class='fa fa-edit'></i> Delete</a></div>"

		tr+="<tr><td>"+(i+1)+"</td> <td>"+group_no+"</td> <td>"+group_name+"</td>  <td>"+dpd+"</td></tr>"
	}
	tr+="</tbody>"
	$("#groups-table").html(tr)
}

function load_suppliers(suppliers,sel) {
	// body...
	if(!sel){
		$(".cd").hide()
		$("#suppliers-div").show()
	}
	if(suppliers.length){
		$("#no-suppliers").hide()
		$("#suppliers-table").show()
	}
	else{
		$("#no-suppliers").show()
		$("#suppliers-table").hide()
		return 0;
	}
	var ops="<option value=0>Select a supplier</option>"
	var tr="<thead><tr><th>#</th> <th></th> <th>Supplier No.</th> <th>Password</th><th>Supplier Name</th><th>Business Name</th> <th>Phone</th> <th></th> </tr></thead><tbody>"
	for(var i=0;i<suppliers.length;i++){
		var supplier_name=suppliers[i].supplier_name;
		var business_name=suppliers[i].business_name
		var location=suppliers[i].district+", "+suppliers[i].subcounty+", "+suppliers[i].parish
		var status=suppliers[i].status
		var supplier_id=suppliers[i].id;
		var supplier_no="SP"+suppliers[i].supplier_no
		var phone=suppliers[i].phone;
		var reset_code=suppliers[i].reset_code
		var ts=new Date()
		if(suppliers[i].status==1)
			reset_code="******"
		var dpd="<div class='dropdown'> <button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>Options</button><div class='dropdown-menu'><a href='#' class='dropdown-item' onclick=\"show_edit_supplier_dialog("+i+")\"><i class='fa fa-edit'></i> Edit</a><a href='#' class='dropdown-item' onclick=\"show_delete_supplier_dialog("+supplier_id+")\"><i class='fa fa-edit'></i> Delete</a></div></div>"

		tr+="<tr><td>"+(i+1)+"</td> <td><img onerror='no_image(this)' style='width:50px;height:50px' src=\"/uploads/profiles/supp-"+supplier_id+"?ts="+ts+"\"></td><td>"+supplier_no+"</td><td>"+reset_code+"</td> <td>"+supplier_name+"</td>  <td>"+business_name+"</td><td>"+phone+"</td><td>"+dpd+"<td></tr>"
		ops+="<option value="+supplier_id+">"+business_name+"</option>"
	}
	tr+="</tbody>"
	$("#suppliers-table").html(tr)

	$("#supplier-id").html(ops)
}
function view_group_members(group_id,i) {
	var group_name=adata.groups[i].group_name
	adata.group_id=group_id
	$("#group-name-2").text(group_name)
	var data={url:"/admin",group_id:group_id,rq:"get-group-members",status:status}
	ajax_go(data,function (rst) {
		var group_members=rst.group_members
		load_group_members(group_members)
		
	})
}
function show_delete_group_dialog(group_id) {

	var cfm=confirm("Confirm Removal of this group")
	if(cfm){
		var data={url:"/admin",group_id:group_id,rq:"remove-group"}
		ajax_go(data,function (rst) {
			var groups=rst.groups;
			load_groups(groups)
			display_succ("Group removed updated successfully")
		})
	}
}
function show_edit_group_dialog(i) {
	var group=adata.groups[i]
	adata.group_id=group.id;
	adata.axn="edit-group"
	clear_fields()
	$("#create-group-hdr").text("Update Group Details")
	$("#group-name").val(group.group_name)
	$("#district").val(group.district)
	$("#village").val(group.village)
	$("#meeting-place").val(group.meeting_place)
	var meeting_day=group.meeting_day
	if(!meeting_day)
		$("#meeting-day").val(0)
	else
		$("#meeting-day").val(meeting_day)
	$("#create-group-div").modal("show")
	get_counties(group.district,0,function () {
		$("#county").val(group.county)
	})
	get_subcounties(group.district,group.county,0,function () {
		
		$("#subcounty").val(group.subcounty)
	})
	get_parishes(group.district,group.county,group.subcounty,0,function(){
		
		$("#parish").val(group.parish)
	})

}
function show_delete_supplier_dialog(supplier_id) {

	var cfm=confirm("Confirm Removal of this supplier")
	if(cfm){
		var data={url:"/admin",group_id:supplier_id,rq:"remove-supplier"}
		ajax_go(data,function (rst) {
			var suppliers=rst.suppliers;
			load_suppliers(suppliers)
			display_succ("Supplier removed updated successfully")
		})
	}
}
function show_edit_supplier_dialog(i) {
	var supplier=adata.suppliers[i]
	adata.supplier_id=supplier.id;
	adata.suppaxn="edit-supplier"
	clear_fields()
	$("#create-supplier-div").modal("show")
	$("#create-supplier-btn").text("Update")
	$("#create-supplier-hdr").text("Update Supplier Details")
	$("#business-name").val(supplier.business_name)
	$("#supp-district").val(supplier.district)
	$("#supp-county").val(supplier.county)
	$("#supp-village").val(supplier.village)
	$("#business-address").val(supplier.address)
	$("#supp-name").val(supplier.supplier_name)
	$("#supp-phone").val(supplier.phone)
	$("#supp-other-phone").val(supplier.phoneb)
	$("#supp-subcounty").val(supplier.subcounty)
	$("#supp-parish").val(supplier.parish)
	$("#supp-email").val(supplier.email)
	$("#supp-gender").val(supplier.gender)
	get_counties(supplier.district,"supp-",function () {
		$("#supp-county").val(supplier.county)
	})
	get_subcounties(supplier.district,supplier.county,"supp-",function () {
		$("#supp-subcounty").val(supplier.subcounty)
	})
	get_parishes(supplier.district,supplier.county,supplier.subcounty,"supp-",function(){
		$("#supp-parish").val(supplier.parish)
	})

}
function load_group_members(group_members) {
	$(".cd").hide()
	$("#members-div").show()
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
	var tr="<thead><tr><th>#</th><th></th><th>Name</th><th>Member No.</th><th>Password</th><th>Password</th><th>Role</th><th>Phone</th><th></th></tr></thead><tbody>"
	for(var i=0;i<group_members.length;i++){
		var name=group_members[i].name;
		var phone=group_members[i].phone
		var id=group_members[i].id;
		var userid=group_members[i].userid;
		var role=group_members[i].role
		var member_no="GM"+group_members[i].member_no
		
		var status=group_members[i].status;
		var reset_code=group_members[i].reset_code
		var ts=new Date()
		if(status==1)
			reset_code="******"
		var op="<div class='btn-group' >"
		op+="<button class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Options</button>"
		op+=" <div class='dropdown-menu'>"
		op+="<a class='dropdown-item' href='#' onclick='change_role_dl("+i+")'>Change Role</a>"
		op+="<a class='dropdown-item' href='#' onclick='edit_user_dl("+i+")'>Edit Details</a>"
		op+="<a class='dropdown-item' href='#' onclick='remove_member("+id+")'>Remove Member</a>"
		op+="</div></div>"
		tr+="<tr><td>"+(i+1)+"</td><td><img onerror='no_image(this)' style='width:50px;height:50px' src=\"/uploads/profiles/gm-"+id+"?ts="+ts+"\"></td><td>"+name+"</td><td>"+member_no+"</td><td>"+reset_code+"</td><td>"+role+"</td><td>"+phone+"</td><td>"+op+"</td></tr>"
	}
	$("#members-table").html("</tbody>"+tr)
	

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
function remove_member(id) {
	var cfm=confirm("Confirm Removal")
	var group_id=adata.group_id
	if(cfm){
		var data={group_id:group_id,id:id,url:"/admin",rq:"remove-member"}
		ajax_go(data,function (rst) {
			display_succ("Member removed successfully")
			var group_members=rst.group_members
			adata.group_members=group_members
			load_group_members(group_members)
			
		})
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


function view_orders(status,nstatus){
	
	adata.nstatus=nstatus
	var data={url:"/admin",rq:"get-orders",status:status}
	ajax_go(data,function (rst) {
		$("#curr-status").text(" "+status)
		if(nstatus){
			$("#chx-status-btn").show()
			$("#chx-status-btn").text("Mark as, "+nstatus)

		}
		if(!nstatus||!rst.orders.length){
			$("#chx-status-btn").hide()
		}

		var orders=rst.orders;
		load_orders(orders)
	})
}
function load_orders(orders) {
	$(".cd").hide()
	$("#orders-div").show()
	if(orders.length==0){
		$("#orders-table").hide()
		$("#no-orders").show()
		$("#chx-status-btn").hide()
		
	}
	else{
		$("#no-orders").hide()
		$("#orders-table").show()
	}
	var tr="<thead><tr><th></th><th>Order No.</th> <th>Customer</th> <th>Quantity</th><th>Amount</th><th>Payment Method</th><th>Ordered on</th></tr></thead><tbody>"
	for(var i=0;i<orders.length;i++){
		var order_no=orders[i].order_no
		var id=orders[i].id;
		var customer=orders[i].customer
		var qty=orders[i].trays
		var amount=orders[i].amount;
		order_time=orders[i].order_time
		var method=orders[i].method
		if(method=="mobile-money")
			method="Mobile Money"
		else
			method="Transpay"
		tr+="<tr><td><input type='checkbox' value="+id+" class='tb status-cb'></td></td> <td>"+order_no+"</td> <td>"+customer+"</td> <td>"+qty+" trays</td><td>"+cx(amount)+"</td><td>"+method+"</td><td>"+order_time+"</td></tr>"
	}
	tr+="</tbody>"
	$("#orders-table").html(tr)
}

function view_supply_orders(status){
	var data={url:"/admin",rq:"get-supply-orders",status:status}
	ajax_go(data,function (rst) {

		$("#supply-orders-curr-status").text(" "+status)
		var orders=rst.orders;
		load_supply_orders(orders)
	})
}
function load_supply_orders(orders) {
	$(".cd").hide()
	$("#supply-orders-div").show()
	if(orders.length==0){
		$("#supply-orders-table").hide()
		$("#no-supply-orders").show()
		$("#change-supply-order-status-parent").hide()
		return 0;
	}
	else{
		$("#no-supply-orders").hide()
		$("#supply-orders-table").show()
		$("#change-supply-order-status-parent").show()
	}
	supp_th=""

	if(orders[0].supplier)
		var supp_th="<th>Supplier</th>"
	var tr="<thead><tr><th></th><th>Order No.</th> <th>Group</th> <th>Member</th><th>Quantity</th><th>Amount</th>"+supp_th+"<th>Ordered on</th></tr></thead><tbody>"
	for(var i=0;i<orders.length;i++){
		var order_no=orders[i].order_no
		var id=orders[i].id;
		var group_name=orders[i].group_name
		var qty=orders[i].qty
		var amount=orders[i].amount;
		order_time=orders[i].order_time;
		var member_name=orders[i].member_name;
		var supp_td=""
		if(orders[i].supplier){
			var supplier=orders[i].supplier;
			var supp_td="<td>"+supplier+"</td>"
			
		}

		tr+="<tr><td><input type='checkbox' value="+id+" class='tb supply-orders-status-cb'></td></td> <td>"+order_no+"</td> <td>"+group_name+"</td><td>"+member_name+"</td> <td>"+qty+" Chicks</td><td>"+cx(amount)+"</td>"+supp_td+"<td>"+order_time+"</td></tr>"
	}
	tr+="</tbody>"
	$("#supply-orders-table").html(tr)
}

function view_stock(status,nstatus){
	
	adata.nstatus=nstatus
	var data={url:"/admin",rq:"get-stock",status:status}
	ajax_go(data,function (rst) {
		$("#curr-stock-status").text(" "+status)

		if(nstatus){
			$("#chx-stock-status-btn").show()
			$("#chx-stock-status-btn").text("Mark as, "+nstatus)

		}
		else if(!nstatus||rst.stock.length==0){
			
			$("#chx-stock-status-btn").hide()
		}

		var stock=rst.stock;
		load_stock(stock)
	})
}
function load_stock(stock) {
	$(".cd").hide()
	$("#stock-div").show()
	if(stock.length==0){
		$("#stock-table").hide()
		$("#no-stock").show()
		$("#chx-stock-status-btn").hide()
	}
	else{
		$("#no-stock").hide()
		$("#stock-table").show()
	}
	var tr="<thead><tr><th></th><th>Stock No.</th> <th>Group</th> <th>Group Location</th><th>Qty</th><th>Payment</th><th>Posted on</th></tr></thead><tbody>"
	for(var i=0;i<stock.length;i++){
		var stock_no=stock[i].stock_no
		var id=stock[i].id;
		var group_name=stock[i].group_name
		var location=stock[i].location
		var qty=stock[i].trays
		var amount=stock[i].amount;
		posted_on=stock[i].posted_on
		tr+="<tr><td><input type='checkbox' value="+id+" class='tb stock-status-cb'></td></td> <td>"+stock_no+"</td> <td>"+group_name+"</td> <td>"+location+"</td> <td>"+qty+"</td><td>"+cx(amount)+"</td><td>"+posted_on+"</td></tr>"
	}
	tr+="</tbody>"
	$("#stock-table").html(tr)
}
function change_status() {
	var oid=[];var k=0; //order id ; oid
	$(".status-cb").each(function () {
		var val=$(this).val()
		if(this.checked==true){
			oid[k++]=val;

		}	
	})
	if(oid.length==0)
		return display_err("No order item selected",5000)
	var data={url:"/admin",rq:"change-order-status",status:adata.nstatus,oid:oid}

	ajax_go(data,function (rst) {
		clear_fields()
		var orders=rst.orders;
		if(adata.nstatus=="")
			adata.nstatus="Delivered"
		else
			nstatus=adata.nstatus
		$("#curr-status").text(" "+nstatus)
		if(adata.nstatus=="Out for Delivery"){
			adata.nstatus="Delivered"
			status="Delivered"
			$("#chx-status-btn").show()
		}
		else{
			$("#chx-status-btn").hide()
		}
		$("#chx-status-btn").text("Mark as, "+status)
		load_orders(orders)

	})
}
function load_days(argument) {
	var days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
	var op="<option value=0></option>"
	for(var i=0;i<days.length;i++){
		op+="<option value=\""+days[i]+"\">"+days[i]+"</option>"
	}
	
	$("#meeting-day,#e-meeting-day").html(op)
}
function change_supply_orders_status(status) {
	var oid=[];var k=0; //order id ; oid
	$(".supply-orders-status-cb").each(function () {
		var val=$(this).val()
		if(this.checked==true){
			oid[k++]=val;

		}	
	})
	if(oid.length==0)
		return display_err("No order item selected",5000)
	var data={url:"/admin",rq:"change-supply-order-status",status:status,oid:oid}
	adata.data=data;
	if(status=="Out for Delivery"){
		return $("#assign-supplier-div").modal("show")
	}
	
	effect_change_supply_order_status(data)

	
}
$(function(){
	$("#assign-supplier-btn").click(function(){

		var supplier_id=$("#supplier-id").val()
		if(supplier_id.length==0){
			return display_err("Please enter the supplier ID")
		}
		data=adata.data;
		data.supplier_id=supplier_id;
		$("#assign-supplier-div").modal("hide")
		effect_change_supply_order_status(data)
	})
})
function effect_change_supply_order_status(data){
	ajax_go(data,function (rst) {
		var orders=rst.orders;
		$("#supply-orders-curr-status").text(" "+data.status)
		load_supply_orders(orders,status)
	})
}
function change_stock_status() {
	var oid=[];var k=0; //order id ; oid
	$(".stock-status-cb").each(function () {
		var val=$(this).val()
		if(this.checked==true){
			oid[k++]=val;

		}	
	})
	if(oid.length==0)
		return display_err("No stock item selected")
	
	var data={url:"/admin",rq:"change-stock-status",status:adata.nstatus,oid:oid}
	ajax_go(data,function (rst) {
		var stock=rst.stock;
		var nstatus=adata.nstatus
		$("#curr-stock-status").text(" "+nstatus)
		if(nstatus=="Pending Payment"){
			status="Paid"
			adata.nstatus=status
			$("#chx-stock-status-btn").text("Mark as,  "+adata.nstatus)
			$("#chx-stock-status-btn").show()
		}
		if(nstatus=="Paid"){
			$("#chx-stock-status-btn").hide()
		}
		
		load_stock(stock)

	})
}
function filter_group_dl(filter) {
	// body...
	adata.filter=filter;
	if(filter=="clear"){
		return filter_group()
	}
	$("#group-filter-div").modal("show")
	$(".group-filter-cd").hide()
	if(filter=="district")
		$("#group-filter-by-district").show()
	if(filter=="no")
		$("#group-filter-by-no").show()
	if(filter=="name")
		$("#group-filter-by-name").show()
	
}
function filter_group() {
	var filter=adata.filter

	$("#group-filter-div").modal("hide")
	var data={url:"/admin",rq:"get-groups",filter:filter}
	msg="No groups added"
	hdr="Groups List"
	if(filter=="district"){
			var district=$("#group-filter-district").val()
			data.district=district
			hdr="Groups in \""+district+"\" District";
			msg="No groups in \""+district+"\" District";
	}
	if(filter=="no"){
		var group_no=$("#group-filter-no").val();
		data.group_no=group_no
		msg="No group with Group No \""+group_no+"\""
		hdr="Group with Group No. \""+group_no+"\"";
	}
	if(filter=="name"){
		var group_name=$("#group-filter-name").val()
		data.group_name=group_name
		msg="No group with a name similar to \""+group_name+"\""
		hdr="Groups with Name similar to \""+group_name+"\"";
	}
	ajax_go(data,function (rst) {
		var groups=rst.groups;
		adata.groups=groups
	
		if(groups.length==0)
		{
			msg=msg
		}
		else{
			
			msg=0;
		}
		load_groups(groups,msg,hdr)
	})
}

function load_cs(rst) {
	$("#cs-hdr").text(rst.cshdr)
	
	$(".cd").hide()
	$("#cs-div").show()
	var cs=rst.chicken_status;
	if(cs.length==0){
		$("#no-cs").show()
		$("#cs-table").hide()
		return 0
	}
	else{
		$("#no-cs").hide()
		$("#cs-table").show()
	}	
	adata.chicken_status=cs;
	var tr="<thead><tr><th>#</th><th>Group No.</th><th>Group</th><th>Healthy</th><th>Sick</th><th>Dead</th></tr></thead><tbody>"
	for(var i=0;i<cs.length;i++){
		var healthy=cs[i].healthy;
		var sick=cs[i].sick
		var dead=cs[i].dead;
		var time_recorded=cs[i].time_recorded
		var group_name=cs[i].group_name
		var group_no=cs[i].group_no
		tr+="<tr><td>"+(i+1)+"</td><td>"+group_no+"</td><td>"+group_name+"</td><td>"+healthy+"</td><td>"+sick+"</td><td>"+dead+"</td></tr>"
	}
	$("#cs-table").html("</tbody>"+tr)
	
}