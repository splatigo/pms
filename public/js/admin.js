
var adata={}

function get_cs(){
	
	
	if(adata.latest=="0"){
		var arr=[]
		var vr=check_empty(arr)
		if(!vr)
			return 0;
	}
	var data={url:"/admin",rq:"get-cs"}
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
		$(".child-div").hide()
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
	$("#a-set-chicken-price").click(function () {
		var price=adata.settings.chicken_price;

		$("#n-chicken-price").val(price)
		$("#chicken-price-div").modal("show")
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
	$("#set-chicken-price-btn").click(function () {
		var price=$("#n-chicken-price").val()
		var arr=[{fn:"Chicken Price",val:price}]
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		var data={price:price,url:"/admin",rq:"set-egg-price",field:"chicken_price"}
		ajax_go(data,function (rst) {
			$("#chicken-price-div").modal("hide")
			display_succ("New price set successfully")
			$("#curr-chicken-price").text(cx(price))
			adata.settings.chicken_price=price;

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
	$(".get-funders").click(function () {

		load_funders(adata.funders,adata.me.priv,1)
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
		var funder=$("#group-funder").val()
		if(adata.me.priv=="funder")
			funder=adata.me.id
		var arr=[{fn:"Group Name",val:group_name},{fn:"Organization",val:funder},{fn:"District",val:district,ft:"sel"},{fn:"County",val:county,ft:"sel"},{fn:"Subcounty",val:subcounty,ft:"sel"},{fn:"Parish",val:parish,ft:"sel"},{fn:"Village",val:village},{fn:"Meeting Place",val:meeting_place},{fn:"Meeting Day",val:meeting_day,ft:"sel"}]
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
		data.append("funder_id",funder)
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
		//arr[arr.length]={fn:"Email",val:email,ft:"email"};
		data.append("email",email)
		//arr[arr.length]={fn:"Phone",val:phone,ft:"phone"};
		data.append("phone",phone)
		phoneb=$("#other-phone").val();
		//arr[arr.length]={fn:"Other Phone",val:phoneb,ft:"phone",op:1};
		data.append("phoneb",phoneb)
		var dob=$("#year").val()+"-"+$("#month").val()+"-"+$("#day").val()
		if($("#year").val()==null||$("#month").val()==null||$("#day").val()==null)
			dob="-"

		arr[arr.length]={fn:"Date of Birth",val:dob,ft:"date"};data.append("dob",dob);
		
		var gender=$("#gender").val();
		data.append("gender",gender)
		var marital_status=$("#marital-status").val();arr[arr.length]={fn:"Marital status",val:marital_status,ft:"sel"};data.append("marital_status",marital_status)
		var spouse=$("#spouse").val();
		if(marital_status=="Married")
			arr[arr.length]={fn:"Name of Spouse",val:spouse};
		var dependants=$("#dependants").val();//arr[arr.length]={fn:"No. of Dependants",val:dependants};
		data.append("dependants",dependants)
		data.append("spouse",spouse);
		var disability_status=$("#disability-status").val();//arr[arr.length]={fn:"Disability Status",val:disability_status,ft:"sel"};
		data.append("disability_status",disability_status)
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
		arr=[]
		arr[arr.length]={fn:"Member's Name ",val:name};
		arr[arr.length]={fn:"Gender",val:gender,ft:"sel"};
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
		adata.me=rst.me;
		if(rst.me.priv=="admin"){
			$("#my-name").text(" "+rst.me.name)
			$(".admin-tp").show()
		}
		else{
			$("#my-name").text(" "+rst.me.business_name)
			$(".admin-tp").hide()
		}
		
		$(".user-li").show()
		var price=cx(rst.settings.selling_price)
		var districts=rst.districts;
		load_districts(districts)
		$("#curr-price,#db-selling-price").text("UGX "+ price)

		$("#curr-buying-price,#db-buying-price").text("UGX "+cx(rst.settings.buying_price))
		$("#curr-chicken-price,#db-chicken-price").text("UGX "+ cx(rst.settings.chicken_price))
		var clms=[]
		if(adata.me.priv=="admin")
			clms[clms.length]={cn:"Name",fn:"name"}
		if(adata.me.priv=="funder")
			clms[clms.length]={cn:"Organization Name",fn:"business_name"}
		clms[clms.length]={cn:"Primary Phone",fn:"phone"}
		clms[clms.length]={cn:"Other Phone",fn:"phoneb"}
		clms[clms.length]={cn:"Email",fn:"email"}
		clms[clms.length]={cn:"Registration Date",fn:"reg_date",ft:"date"}
		if(adata.me.priv=="admin")
			clms[clms.length]={cn:"Gender",fn:"gender"}
		
		load_profile(rst.me,clms)
		load_stock_sum(rst.stock_sum,rst.instock,rst.instockb)
		load_orders_sum(rst.orders_sum)
		load_chicken_orders_sum(rst.chicken_orders_sum)
		load_suppliers(rst.suppliers,1)
		load_chicken_stock_sum(rst.chicken_stock_sum)
		adata.funders=rst.funders
		load_funders(rst.funders,rst.me.priv)
		var mbrs=" Group Members"
		var gps=" Groups"
		var sps=" Suppliers"
		var fds=" Organizations"
		if(rst.members_count==1)
			mbrs=" Group Member"
		if(rst.group_count==1)
			gps=" Group"
		if(rst.suppliers_count==1)
			sps=" Supplier"
		if(rst.funders.length==1)
			sps=" Organizations"

		$("#db-members-count").text(rst.members_count+mbrs)
		$("#db-group-count").text(rst.group_count+gps)
		$("#db-suppliers-count").text(rst.suppliers_count+sps)
		$("#db-funders-count").text(rst.funders.length+fds)

		var healthy=rst.cs_sum[0].healthy;
		var sick=rst.cs_sum[0].sick;
		var dead=rst.cs_sum[0].dead;
		var sold=rst.cs_sum[0].sold
		var healthy_nl=rst.cs_sum[0].healthy_nl;
		var sick_nl=rst.cs_sum[0].sick_nl;
		var dead_nl=rst.cs_sum[0].dead_nl;
		var sold_nl=rst.cs_sum[0].sold_nl
		if(healthy==null)
		{
			healthy=0;
			sick=0
			dead=0;
			sold=0
			healthy_nl=0;
			sick_nl=0
			dead_nl=0;
			sold_nl=0
		}
		var cstatus="Healthy: ["+healthy+"]["+healthy_nl+"]["+(healthy+healthy_nl)+"]"
		cstatus+="<hr>Sick: ["+sick+"]["+sick_nl+"]["+(sick+sick_nl)+"]"
		cstatus+="<hr>Dead: ["+dead+"]["+dead_nl+"]["+(dead+dead_nl)+"]"
		cstatus+="<hr>Sold: ["+sold+"]]"+sold_nl+"]["+(sold+sold_nl)+"]"
		cstatus2=healthy+sick
		cstatus2_nl=healthy_nl+sick_nl
		$("#db-cs").html(cstatus)
		$("#db-cs-2").html("Laying Chicks: "+cstatus2+"<hr>Non-Laying Chicks:"+cstatus2_nl)
		$(".child-div").hide()
		$("#dashboard").show()
	})
}

function load_chicken_orders_sum(stock_sum) {
	$("#db-chicken-orders-pending-approval").html("0 Orders<hr> 0 Chicks<hr>UGX 0")
	$("#db-chicken-orders-pending-delivery").html("0 Orders<hr> 0 Chicks<hr>UGX 0")
	$("#db-chicken-orders-out-for-delivery").html("0 Orders<hr> 0 Chicks<hr>UGX 0")
	$("#db-chicken-orders-delivered").html("0 Orders<hr>0 Chicks <hr>UGX 0")
	for(var i=0;i<stock_sum.length;i++){
		var amount=cx(stock_sum[i].amount)
		var qty=cx(stock_sum[i].qty)
		var no=stock_sum[i].no
		if(stock_sum[i].status=="Pending Approval")
			$("#db-chicken-orders-pending-approval").html(no+" Orders <hr>"+qty+" Chicks  <hr>UGX "+ amount)
		if(stock_sum[i].status=="Pending Delivery")
			$("#db-chicken-orders-pending-delivery").html(no+" Orders <hr>"+qty+" Chicks  <hr>UGX "+ amount)
		if(stock_sum[i].status=="Out for Delivery")
			$("#db-chicken-orders-out-for-delivery").html(no+" Orders <hr>"+qty+" Chicks <hr>UGX "+ amount)
		if(stock_sum[i].status=="Delivered")
			$("#db-chicken-orders-delivered").html(no+" Orders <hr>"+qty+" Chicks  <hr>UGX "+ amount)
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
	$(".child-div").hide()
	$("#groups-div").show()
	if(!msg)
		$("#no-groups").text("No groups added")
	else
		$("#no-groups").text(msg)

	if(!hdr)
		$("#groups-hdr").text("Groups List")
	else{
		
		$("#groups-hdr").text(hdr)
	}
	adata.groups=groups
	var hd=[{cn:"Group No.",fn:"group_no"},{cn:"Group Name",fn:"group_name"}]
	if(adata.me.priv=="admin")
		hd[hd.length]={cn:"Organization",fn:"funder"}
	hd[hd.length]={cn:"Location",fn:"location"}
	hd[hd.length]={cn:"",ft:"options"}
	var options=[{text:"Group Members",method:"view_group_members"},{text:"Edit",method:"show_edit_group_dialog"},{text:"Delete",method:"show_delete_group_dialog"}]
	
	for(var i=0;i<groups.length;i++){
		var status=groups[i].status	
		var funder=groups[i].business_name
		if(funder==null)
			funder="-"
		groups[i].funder=funder;
		var location=groups[i].district+", "+groups[i].county+", "+groups[i].subcounty+", "+groups[i].parish
		groups[i].location=location
		if(status==0)
			groups[i].status="Unapproved"
	}

	gen_table(hd,groups,"groups-table","no-groups",options)
}

function load_suppliers(suppliers,sel) {
	// body...
	if(!sel){
		$(".child-div").hide()
		$("#suppliers-div").show()
	}
	var ops="<option value=0>Select a supplier</option>"
	var hd=[{cn:"Supplier No.",fn:"supplier_no"},{cn:"Business Name",fn:"business_name"},{cn:"Password",fn:"reset_code"},{cn:"Phone",fn:"phone"},{cn:"",ft:"options"}]
	var options=[{text:"Edit",method:"show_edit_supplier_dialog"},{text:"Delete",method:"show_delete_supplier_dialog",fn:"id"}]
	for(var i=0;i<suppliers.length;i++){
		var supplier_no="SP"+suppliers[i].supplier_no
		suppliers[i].supplier_no=supplier_no
		var reset_code=suppliers[i].reset_code
		if(suppliers[i].status==1)
			reset_code="******"
		suppliers[i].reset_code=reset_code

		ops+="<option value="+suppliers[i].id+">"+suppliers[i].business_name+"</option>"
	}
	gen_table(hd,suppliers,"suppliers-table","no-suppliers",options)
	$("#supplier-id").html(ops)
}
function load_funders(funders,priv,tb) {
	if(priv=="funder"){
		$(".group-funder").hide()
	}
	var op="<option value=0></option>"
	for(var i=0;i<funders.length;i++){
		var sl=""
		
		op+="<option value="+funders[i].id+">"+funders[i].business_name+"</option>"
	}
	$("#group-funder").html(op)
	if(tb){
		$(".child-div").hide()
		$("#funders-div").show()
		var hd=[{cn:"#",ft:"serial"},{cn:"Org. No.",fn:"funder_no"},{cn:"Org. Name",fn:"business_name"},{cn:"Password",fn:"reset_code"},{cn:"",ft:"options"}]
		var rs=funders;
		var options=[{method:"edit_funder_dl",text:"Edit"},{method:"delete_funder",text:"Delete"}]
		for(var i=0;i<rs.length;i++){
			var reset_code=rs[i].reset_code

			if(rs[i].status==1){

				rs[i].reset_code="******"
			}
			else{

				rs[i].reset_code=reset_code
			}
			rs[i].funder_no="FD"+rs[i].funder_no
		}


		gen_table(hd,rs,"funders-table","no-funders",options)
	}
}
function create_funder(){
	var funder_name=$("#funder-name").val()
	var funder_phone=$("#funder-phone").val()
	var funder_email=$("#funder-email").val()

	var arr=[{fn:"Org. Name",val:funder_name},{fn:"Org. Phone",val:funder_phone,ft:"phone"},{fn:"Org. Email",val:funder_email,ft:"email"}]
	var vr=check_empty(arr)
	if(!vr)
		return 0;
	var data={rq:adata.axn,url:"/admin",funder_name:funder_name,funder_id:adata.id,funder_email:funder_email,funder_phone:funder_phone}
	ajax_go(data,function(rst){
		$("#create-funder-div").modal("hide")
		adata.funders=rst.funders;
		load_funders(rst.funders,rst.me.priv,1)
	})
}
function delete_funder(i) {
	var id=adata.funders[i].id;
	var data={rq:"remove-funder",url:"/admin",id:id}
	var cfm=confirm("Are you sure you want to remove this entry?")
	if(!cfm)
		return 0;
	ajax_go(data,function(rst){
		clear_fields()
		adata.funders=rst.funders
		load_funders(rst.funders,adata.me.priv,1)
	})


}
function create_funder_dl(){
	$("#create-funder-div").modal("show")
	adata.axn="create-funder"
	clear_fields()
}
function edit_funder_dl(i) {
	var funders=adata.funders
	var id=adata.funders[i].id;
	adata.axn="edit-funder"
	adata.id=id;
	$("#funder-name").val(funders[i].business_name)
	$("#funder-phone").val(funders[i].phone)
	$("#funder-email").val(funders[i].email)
	$("#create-funder-div").modal("show")
}
function load_chicken_stock_sum(rs) {
	var rx=""
	var rb=["Under Brooding","Ready for Sale","Sold-off"]
	for(var i=0;i<rb.length;i++){
		var status=rb[i]
		var qty=0;
		for(var j=0;j<rs.length;j++){
			if(rs[j].status==status){
				qty=cx(rs[j].qty)
				
				break;
			}
		}
		rx+="<span onclick=\"get_chicken_stock('"+status+"')\">"+status+": "+qty+"</span><hr>"
	}
	$("#db-stock").html(rx)
}
function view_group_members(i) {
	var group_name=adata.groups[i].group_name
	var group_id=adata.groups[i].id;
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
	$(".child-div").hide()
	$("#members-div").show()
	var rs=group_members
	for(var i=0;i<group_members.length;i++){
		var phone=group_members[i].phone
		if(phone==null)
			phone="#NA"
		rs[i].phone=phone
		var id=group_members[i].id;
		var userid=group_members[i].userid;
		rs[i].member_no="GM"+group_members[i].member_no
		var gender=group_members[i].gender
		var reset_code=group_members[i].reset_code
		var status=group_members[i].status
		var ts=new Date()
		if(status==1)
			reset_code="******"
		rs[i].pp="<img gender="+gender+" onerror='no_image(this)' style='width:50px;height:50px' src=\"/uploads/profiles/gm-"+id+"?ts="+ts+"\">"
	}
	adata.group_members=group_members;
	var th=[{cn:"Name",fn:"name"},{cn:"Profile",fn:"pp"},{cn:"Member No.",fn:"member_no"},{cn:"Password",fn:"reset_code"},{cn:"Role",fn:"role"},{cn:"Phone",fn:"phone"},{cn:"",ft:"options"}]
	
	var options=[{text:"Change Role",method:"change_role_dl"},{text:"Edit Details",method:"edit_user_dl"},{text:"Remove Member",method:"remove_member",fn:"id"}]
	gen_table(th,rs,"members-table","no-group-members",options)
	
	
	

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
		try{
			var dob2=gm.dob2.split("-")
			$("#year").val(dob2[0])
			$("#month").val(dob2[1])
			$("#day").val(dob2[2])
		}
		catch(e){}
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
	$(".child-div").hide()
	$("#orders-div").show()
	var hd=[{ft:"cb",cl:"tb status-cb",fn:"id"},{cn:"Order No.",fn:"order_no"},{cn:"Customer",fn:"customer"},{cn:"Qty",fn:"trays"},{cn:"Amount",fn:"amount"},{cn:"Method",fn:"method"}]
	gen_table(hd,orders,"orders-table","no-orders")
	
}

function view_chicken_orders(status){
	var data={url:"/admin",rq:"get-chicken-orders",status:status}
	ajax_go(data,function (rst) {

		$("#chicken-orders-curr-status").text(" "+status)
		var orders=rst.orders;
		load_chicken_orders(orders)
	})
}
function load_chicken_orders(orders) {
	var go=orders;
	for(var i=0;i<go.length;i++){
		var age=go[i].age;
		if(age==null){
			go[i].age2="#NA"
			continue;
		}
		var age2=go[i].age2+age;
		age2=convert_from_days(age2)
		go[i].age2=age2=age2
	}
	adata.go=go;
	$(".child-div").hide()
	$("#chicken-orders-div").show()
	if(orders.length==0){
		$("#change-chicken-order-status-parent").hide()
	}
	else{
		$("#change-chicken-order-status-parent").show()
	}
	var th=[]
	if(adata.me.priv=="admin")
		th[th.length]={cn:"",fn:"order_no",ft:"cb",cl:"tb chicken-orders-status-cb"}
	th[th.length]={cn:"Order No",fn:"order_no"}
	th[th.length]={cn:"No. of Orders",fn:"no"}
	th[th.length]={cn:"Group",fn:"group_name"}
	th[th.length]={cn:"Qty",fn:"qty"}
	th[th.length]={cn:"Amount",fn:"amount",ft:"money"}
	th[th.length]={cn:"Payment Method",fn:"method"}
	th[th.length]={cn:"Status",fn:"status"}
	if(orders.length&&orders[0].supplier)
		th[th.length]={cn:"Supplier",fn:"supplier"}
	th[th.length]={cn:"Ordered on",fn:"order_time"}
	th[th.length]={cn:"",ft:"options"}
	var options=[{text:"Order Details",method:"chicken_order_details"},{text:"Members' Orders",method:"view_chicken_order_breakdown"},{text:"Order Form",method:"view_order_form"}]
	gen_table(th,orders,"chicken-orders-table","no-chicken-orders",options)

}
function chicken_order_details(index) {
	var order=adata.go[index]

	var hd=[{cn:"Order No.",fn:"order_no"},{cn:"Qty",fn:"qty"},{cn:"No. of Orders",fn:"no"},{cn:"Total",fn:"amount",ft:"money"},{cn:"Payment Phone:",fn:"phone",cond:[{val:"",nval:"#NA"}]},{cn:"Method",fn:"method"},{cn:"Time Ordered",fn:"order_time"},{cn:"Status",fn:"status"},{cn:"Age",fn:"age2"},{cn:"Description",fn:"message",cond:[{val:"",nval:"#NA",ct:'text'}]}]
	gen_table_mobile(hd,[order],'chicken-order-details-div')
	$("#chicken-order-details").modal("show")
}
function view_chicken_order_breakdown(index) {
	var group_order_no=adata.go[index].order_no;
	var group_id=adata.go[index].group_id
	var data={group_id:group_id,url:"/admin",rq:"get-chicken-order-breakdown",group_order_no:group_order_no}
	ajax_go(data,function (rst) {
		var orders=rst.orders_bd;
		$(".child-div").hide()
		$("#chicken-orders-bd-div").show()
		var hd=[{cn:"Order No.",fn:"order_no"},{cn:"Qty",fn:"qty"},{cn:"Amount",fn:"amount",ft:"money"},{cn:"Member",fn:"member_name"},{cn:"Time Ordered",fn:"time_recorded"}]
		gen_table(hd,orders,"chicken-orders-bd-table","no-chicken-orders-bd")
	})
}

function view_stock(status){
	var data={url:"/admin",rq:"get-stock",status:status}
	ajax_go(data,function (rst) {
		var stock=rst.stock;
		load_stock(stock,status)
	})
}
function load_stock(stock,status) {
	adata.egg_stock=stock;
	adata.ostatus=status;
	$(".child-div").hide()
	$("#stock-div").show()
	$("#curr-stock-status").text(" "+status)
	if(stock.length==0){
		$("#chx-stock-status-btn").hide()
	}
	else{
		$("#chx-stock-status-btn").show()
	}
	var hd=[{cn:"Stock No.",fn:"stock_no"},{cn:"Group",fn:"group_name"},{cn:"Member",fn:"member_name"},{cn:"Qty",fn:"trays"},{cn:"Payment",fn:"amount",ft:"money"},{cn:"Posted on",fn:"posted_on"}]
	if(adata.me.priv=="admin")
		hd.unshift({cn:"",fn:"id",ft:"cb",cl:"tb stock-status-cb"})
	gen_table(hd,stock,"stock-table","no-stock")
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
function change_chicken_orders_status(status) {
	var oid=[];var k=0; //order id ; oid
	var amount=[]
	var acc=[]
	$(".chicken-orders-status-cb").each(function () {
		var val=$(this).val()
		if(this.checked==true){
			oid[k++]=val;
		}	
	})
	if(oid.length==0)
		return display_err("No order item selected",5000)
	var data={url:"/admin",rq:"change-chicken-order-status",status:status,oid:oid}
	adata.data=data;
	if(status=="Out for Delivery"){
		return $("#assign-supplier-div").modal("show")
	}
	
	effect_change_chicken_order_status(data)

	
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
		effect_change_chicken_order_status(data)
	})
})
function effect_change_chicken_order_status(data){
	ajax_go(data,function (rst) {
		var orders=rst.orders;
		$("#chicken-orders-curr-status").text(" "+data.status)
		load_chicken_orders(orders,status)
	})
}
function change_stock_status(nstatus) {
	var oid=[];var k=0; //order id ; oid
	var egg_stock=adata.egg_stock
	var i=0;
	$(".stock-status-cb").each(function () {
		var val=$(this).val()
		if(this.checked==true){
			amount=egg_stock[i].amount
			acc="GM"+egg_stock[i].member_no
			var stock_no=egg_stock[i].stock_no
			oid[k++]={id:val,amount:amount,acc:acc,stock_no:stock_no};

		}	
		i++;
	})
	if(oid.length==0)
		return display_err("No stock item selected")
	
	var data={url:"/admin",rq:"change-stock-status",status:nstatus,oid:oid,ostatus:adata.ostatus}
	ajax_go(data,function (rst) {
		var stock=rst.stock;
		load_stock(stock,nstatus)
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
	$(".child-div").hide()
	$("#cs-div").show()
	var cs=rst.chicken_status;	
	adata.chicken_status=cs;
	for(var i=0;i<cs.length;i++){
		var healthy=cs[i].healthy;
		var sick=cs[i].sick
		var dead=cs[i].dead;
		var sold=cs[i].sold
		var healthy_nl=cs[i].healthy_nl;
		var sick_nl=cs[i].sick_nl
		var dead_nl=cs[i].dead_nl;
		var sold_nl=cs[i].sold_nl
		var time_recorded=cs[i].time_recorded
		var group_name=cs[i].group_name
		var group_no=cs[i].group_no
		var h="["+healthy+"],["+healthy_nl+"],["+(healthy+healthy_nl)+"]"
		var s="["+sick+"],["+sick_nl+"],["+(sick+sick_nl)+"]"
		var d="["+dead+"],["+dead_nl+"],["+(dead+dead_nl)+"]"
		var sl="["+sold+"],["+sold_nl+"],["+(sold+sold_nl)+"]"
		cs[i].h=h;cs[i].s=s;cs[i].d=d;cs[i].sl=sl;
		
	}
	var hd=[{cn:"Group No.",fn:"group_no"},{cn:"Group",fn:"group_name"},{cn:"Healthy",fn:"h"},{cn:"Sick",fn:"s"},{cn:"Dead",fn:"d"},{cn:"Sold",fn:"sl"}]
	gen_table(hd,cs,"cs-table","no-cs");	
}

function get_chicken_stock(status) {
	
	var data={rq:"get-chicken-stock",url:"/admin",status:status}
	ajax_go(data,function (rst) {
		$(".child-div").hide()
		$("#chicken-stock-div").show()
		$("#chicken-stock-hdr").text(status)
		load_chicken_stock(rst.chicken_stock)
	})
}
function load_chicken_stock(rs){
	//cn; column name
	adata.chicken_stock=rs;

	var hd=[{cn:"Stock No.",fn:"stock_no"},{cn:"Qty",fn:"qty"},{cn:"Supplier",fn:"business_name"},{cn:"Age",fn:"age"},{cn:"Status",fn:"status"},{cn:"Time Recorded",fn:"tr"}]
	for(var i=0;i<rs.length;i++){
		var age=rs[i].age;

		if(age==0)
			age="Less than a day old"
		if(age==1)
			age="1 Day old"
		else
			age=age+" days"
		rs[i].age=age
		var status=rs[i].status
		if(age>60&&status!="Sold-off")
			rs[i].status="Ready for Sale"
	}
	gen_table(hd,rs,"chicken-stock-table","no-chicken-stock")
}