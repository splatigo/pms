var adata={}
//window.localStorage.removeItem("cart")
function  remove_from_cart(index) {
	var cart=window.localStorage.getItem("cart")
	if(cart==null||cart=="null")
		cart=[]
	else
		cart=JSON.parse(cart)
	var ncart=[];var k=0;
	for(var i=0;i<cart.length;i++){
		if(i==index){

		}
		else
			ncart[k++]=cart[i]
	}
	cart=ncart;
	window.localStorage.setItem("cart",JSON.stringify(cart))
	load_cart()
}

function load_cart() {
	var cart=window.localStorage.getItem("cart")
	if(cart==null||cart=="null")
		cart=[]
	else
		cart=JSON.parse(cart)

	if(cart.length==0){
		$("#no-cart").text("")
		$("#cart-modal").modal("show")
		$(".cart-div,#cart-footer").hide()
		$("#empty-cart-div").show()
		return 0
	}
	$("#cart-div,#cart-footer").show()
	$("#empty-cart-div").hide()
	var tno=0
	for(var i=0;i<cart.length;i++){
		tno+=Number(cart[i].qty);
	}
	if(tno==0)
		tno=""
	$("#no-cart").text(tno)
	var ttotal=0;
	
	for(var i=0;i<cart.length;i++){
		var qty=cart[i].qty;
		var price=adata.settings.chicken_price
		cart[i].unit=price;
		cart[i].total=total=qty*price;
		ttotal+=total;
		cart[i].trash="<button class='btn btn-primary'><span class='fa fa-trash' onclick=\"remove_from_cart("+i+")\"></span></button>"
	}
	adata.ttotal=ttotal;
	adata.tqty=tno
	load_checkout_page(cart.length,tno,ttotal)
	var hd=[{cn:"",fn:"trash"},{cn:"Member",fn:"member_name"},{cn:"Qty",fn:"qty"},{cn:"Unit",fn:"unit"},{cn:"Total",fn:"total",ft:"money"}]
	gen_table(hd,cart,"cart-table","empty-cart-div")
	$("#cart-modal").modal("show")
}
function load_checkout_page(no,tqty,ttotal) {
	var ortx="Orders"
	if(no==1)
		ortx="Order"
	var cktx="Chicks"
	if(tqty==1)
		cktx="Chick"
	$("#purchase-details").text("Payment for "+no+" "+ortx+", "+tqty+" "+cktx)
	$("#purchase-amount").text(cx(ttotal))
}
$(function () {
	get_defaults()

	var cart=window.localStorage.getItem("cart")
	if(cart==null||cart=="null")
		cart=[]
	else
		cart=JSON.parse(cart);

	var tno=0
	for(var i=0;i<cart.length;i++){
		tno+=Number(cart[i].qty);
	}
	if(tno==0)
		tno=""
	$("#no-cart").text(tno)

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
		var sold=$("#cs-sold").val()
		var healthy_nl=$("#cs-healthy-nl").val()
		var sick_nl=$("#cs-sick-nl").val()
		var dead_nl=$("#cs-dead-nl").val()
		var sold_nl=$("#cs-sold-nl").val()
		var arr=[
		{fn:"No. of Healthy, Laying Chicks ",val:healthy},{fn:"No. of Healthy Non-laying Chicks",val:healthy_nl},
		{fn:"No. of Sick, Laying Chicks",val:sick},{fn:"No. of Sick Non-laying Chicks",val:sick_nl},
		{fn:"No. of Dead, Laying Chicks",val:dead},{fn:"No. of Dead, Non-laying Chicks",val:dead_nl},
		{fn:"No. of Sold,Laying Chicks",val:sold},{fn:"No. of Sold,Non-laying Chicks",val:sold_nl}
		]

		var vr=check_empty(arr)
		
		if(!vr)
			return 0;

		var data={url:"/group",rq:adata.axn,
		healthy:healthy,sick:sick,dead:dead,sold:sold,
		healthy_nl:healthy_nl,sick_nl:sick_nl,dead_nl:dead_nl,sold_nl:sold_nl,
		member_id:member_id}
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
		if(profile_photo.length)
			data.append("profile_photo",$("#profile-photo")[0].files[0])
		if(id_photo.length)
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
		$("#gp-orders-div").show()
		$("#new-order-div").modal("show")
		adata.rq="add-order"
		clear_fields()
	})
	$(".a-order-forms").click(function () {
		$(".child-div").hide()
		$("#order-forms-div").show()
		var data={url:"/group",rq:"get-group-orders"}

		ajax_go(data,function (rst) {
			
			
		})
	
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
	$(".view-cart").click(function(){
		$("#cart-modal").modal("show")
		$(".cart-div,.cart-btn").hide()
		$("#cart-div,#check-out-btn").show()
		load_cart()
	})
	$("#add-order-btn").click(function () {
		var cart=window.localStorage.getItem("cart")
		if(cart==null||cart=="null")
			cart=[]
		else
			cart=JSON.parse(cart)
		if(adata.me.role=="Chairperson")
			var member_id=$("#order-member-id").val()
		else
			member_id=adata.me.id;
		var qty=$("#n-order-qty").val()
		var arr=[{fn:"Quantity",val:qty},{fn:"Member",val:member_id,ft:"sel"}]
		var vr=check_empty(arr)
		if(!vr)
			return 0;
		var member_name=$("#order-member-id :selected").text()

		cart[cart.length]={member_id:member_id,member_name:member_name,qty:qty}
		window.localStorage.setItem("cart",JSON.stringify(cart))
		var tno=0
		for(var i=0;i<cart.length;i++){
			tno+=Number(cart[i].qty);
		}
		if(tno==0)
			tno=""
		$("#no-cart").text(tno)
		$("#new-order-div").modal("hide")
		return 0;
		
	})
	$("#check-out-btn").click(function () {
		
		return 0
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
	
	var hd=[{cn:"Stock No.",fn:"stock_no"},{cn:"Qty",fn:"trays"},{cn:"Amount",fn:"amount",ft:"money"},{cn:"Status",fn:"status"}]
	if(adata.me.role=="Chairperson"){
		hd.splice(3,0,{cn:"Member",fn:"member_name"})
		hd.push({cn:"",ft:"options",cond:[{val:"Paid",nval:"",fn:"status",ct:"skip"}]})
		options=[{text:"Edit",method:"edit_stock_dl"},{text:"Delete",method:"remove_stock",fn:"id"}]
		
	}
	else{
		var options=0
	}
	gen_table(hd,es,"stock-table","no-stock",options)
}
function load_orders_by_order_no(es) {
	adata.orders=es;
	if(!es.length)
	{
		$("#no-orders").show()
		$("#orders-table").hide()
		return 0
	}
	$("#no-orders").hide()
	$("#orders-table").show()
	var tr="<thead><tr><th>Order No</th><th>Recorded on</th><th>Quantity</th><th>Amount</th><th class='leader-item'>Member</th><th>Status</th><th>Age</th><th></th></tr></thead><tbody>"
	for(var i=0;i<es.length;i++){
		var op=""
		var qty=es[i].qty;
		var time_recorded=es[i].time_recorded
		var id=es[i].id;
		var order_no=es[i].order_no
		var amount=cx(es[i].amount);
		var status=es[i].status;
		var member_name=es[i].member_name
		var time_received=es[i].tr
		var age=es[i].age+es[i].age2
		months=age/30
		days=age%30

		if(months>=1)
		{
			age=months
			if(months<=6){
				if(months==1)
					months="1 month"
				else
					months=months+", months"

				if(days>0)
					age=months+","+days+" days"

				else
					age=months
			}
			else{
				age="-"
			}
		}
		else{

			if(age==1)
				age="1 Day"
			else
				age=age+" days"
		}
		if(time_received)
			status="Received"
		else
			age="#NA"
		if(status=="Pending Approval"){
			op+="<button class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Options</button>"
			op+=" <div class='dropdown-menu'>"
			op+="<a class='dropdown-item' href='#' onclick='remove_order("+id+")'>Cancel order</a>"
		}
		else if(status=="Delivered"){
			op+="<button class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Options</button>"
			op+=" <div class='dropdown-menu'>"
			op+="<a class='dropdown-item' href='#' onclick='receive_order_dl("+id+")'>Receive Order</a>"
		}

		op+="</div></div>"
		tr+="<tr><td>"+order_no+"</td><td>"+time_recorded+"</td><td>"+qty+"</td><td>"+amount+"</td><td class='leader-item'>"+member_name+"</td><td>"+status+"</td><td>"+age+"</td><td class='leader-item'>"+op+"</td></tr>"

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
function receive_order_dl(id) {
	adata.id=id;
	$("#receive-order-div").modal("show")
}
function receive_order() {
	var age=$("#r-age").val()
	var id=adata.id;
	
		var group_id=adata.group_id
		var data={group_id:group_id,id:id,url:"/group",rq:"receive-order",age:age}
		ajax_go(data,function (rst) {
			$("#receive-order-div").modal("hide")
			display_succ("Order marked as received successfully")
			var es=rst.orders
			load_orders(es)
		})
	
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
		$(".db-wallet").text("UGX "+cx(rst.wallet))
		var clms=[{cn:"Name",fn:"name"},{cn:"Member No.",fn:"member_no"},{cn:"Primary Phone",fn:"phone"},
			{cn:"Other Phone",fn:"phoneb"},{cn:"Email",fn:"email"},{cn:"Date of Birth",fn:"dob",ft:"date"},
			{cn:"Registration Date",fn:"reg_date",ft:"date"},{cn:"Gender",fn:"gender"},
			{cn:"District",fn:"district"},
			{cn:"County",fn:"county"},
			{cn:"Subcounty",fn:"subcounty"},{cn:"Parish",fn:"parish"},
			{cn:"Village",fn:"village"},{cn:"Marital Status",fn:"marital_status"},
			{cn:"Dependants",fn:"no_of_dependants"},{cn:"Name of Spouse",fn:"name_of_spouse"},
			{cn:"Disability Status",fn:"disability_status"},
			{cn:"Education Level",fn:"education_level"},
			{cn:"Place of Operation",fn:"place_of_operation"},
			{cn:"Next of Kin",fn:"nok_name"},
			{cn:"Next of Kin Primary Contact",fn:"nok_primary_phone"},
			{cn:"Next of Kin Other Phone",fn:"nok_other_phone"}]
		load_profile(rst.me,clms)
		var stock_sum=rst.stock_sum;
		load_stock_sum(stock_sum,role)
		load_group_members(group_members,1)
		load_orders_sum(rst.orders_sum)
		load_cs_sum(rst)
		load_districts(rst.districts)
		adata.settings=rst.settings;

	})
}

function view_profile() {
	$("#profile-modal").modal("show")
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
function load_cs_sum(rst) {
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

	var ops="<option value=0>Select a member</option>"
	var rs=group_members
	for(var i=0;i<group_members.length;i++){
		var phone=group_members[i].phone
		if(phone==null)
			phone="#NA"
		rs[i].phone=phone
		var id=group_members[i].id;
		var userid=group_members[i].id;
		rs[i].member_no="GM"+group_members[i].member_no
		var gender=group_members[i].gender
		var reset_code=group_members[i].reset_code
		var status=group_members[i].status
		var ts=new Date()
		if(status==1)
			reset_code="******"
		rs[i].pp="<img gender="+gender+" onerror='no_image(this)' style='width:50px;height:50px' src=\"/uploads/profiles/gm-"+id+"?ts="+ts+"\">"
		ops+="<option value="+userid+">"+group_members[i].name+"</option>"
	}
	adata.group_members=group_members;
	var th=[{cn:"Name",fn:"name"},{cn:"Profile",fn:"pp"},{cn:"Member No.",fn:"member_no"},{cn:"Role",fn:"role"},{cn:"Phone",fn:"phone"}]
	if(adata.me.role=="Chairperson"){
		th.splice(3,0,{cn:"Password",fn:"reset_code"})
		th.push({cn:"",ft:"options"})
	}
	else{
	}
	if(!sel)
		$("#members-div").show()
	$("#member-id,#order-member-id,#cs-member-id").html(ops)
	var options=[{text:"Change Role",method:"change_role_dl"},{text:"Edit Details",method:"edit_user_dl"},{text:"Remove Member",method:"remove_member",fn:"id"}]

	gen_table(th,rs,"members-table","no-group-members",options)
}
function load_group_members_8(group_members,sel) {
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
	adata.chicken_status=cs;	
	for(var i=0;i<cs.length;i++){
		var healthy=cs[i].healthy;
		var sick=cs[i].sick
		var dead=cs[i].dead;
		var sold=cs[i].sold;
		var healthy_nl=cs[i].healthy_nl;
		var sick_nl=cs[i].sick_nl
		var dead_nl=cs[i].dead_nl;
		var sold_nl=cs[i].sold_nl;
		var h="["+healthy+"],["+healthy_nl+"],["+(healthy+healthy_nl)+"]"
		var s="["+sick+"],["+sick_nl+"],["+(sick+sick_nl)+"]"
		var d="["+dead+"],["+dead_nl+"],["+(dead+dead_nl)+"]"
		var sl="["+sold+"],["+sold_nl+"],["+(sold+sold_nl)+"]"
		cs[i].h=h;cs[i].s=s;cs[i].d=d;cs[i].sl=sl;
	}
	var options=[{text:"Edit",method:"edit_cs_dl"},{text:"Delete",method:"remove_cs",fn:"id"}]
	var hd=[{cn:"Member",fn:"member_name"},{cn:"Healthy",fn:"h"},{cn:"Sick",fn:"s"},{cn:"Dead",fn:"d"},{cn:"Sold",fn:"sl"},{cn:"Recorded on",fn:"time_recorded"}]
	gen_table(hd,cs,"chicken-status-table","no-chicken-status",options);
	
	
}
function edit_cs_dl(i) {
	clear_fields()
	var cs=adata.chicken_status
	var healthy=cs[i].healthy;
	var sick=cs[i].sick
	var dead=cs[i].dead;
	var sold=cs[i].sold
	var healthy_nl=cs[i].healthy;
	var sick_nl=cs[i].sick_nl
	var dead_nl=cs[i].dead_nl;
	var sold_nl=cs[i].sold_nl
	var member_id=cs[i].member_id
	$("#cs-healthy").val(healthy)
	$("#cs-sick").val(sick)
	$("#cs-dead").val(dead)
	$("#cs-sold").val(sold)
	$("#cs-healthy-nl").val(healthy_nl)
	$("#cs-sick-nl").val(sick_nl)
	$("#cs-dead-nl").val(dead_nl)
	$("#cs-sold-nl").val(sold_nl)
	$("#cs-member-id").val(member_id)
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
function view_orders() {
	var group_id=$("#h-group-id").val()
	var data={group_id:group_id,url:"/group",rq:"view-orders"}
	ajax_go(data,function (rst) {
		var orders=rst.group_orders;
		$(".child-div").hide()
		$("#gp-orders-div").show()

		load_orders(orders)
	})
}
function load_orders(rst) {
	var go=rst
	adata.go=go;
	var hd=[{cn:"Order No.",fn:"order_no"},{cn:"Qty",fn:"qty"},{cn:"No. of Orders",fn:"no"},{cn:"Total",fn:"total",ft:"money"},{cn:"Method",fn:"method"},{cn:"Time Ordered",fn:"order_time"},{cn:"Status",fn:"status"},{cn:"Options",ft:"options"}]
	var options=[{text:"Retry Paying",method:"retry_paying",cond:[{val:"Failed",fn:"status"}]},{text:"Order Details",method:"chicken_order_details"},{text:"Members' Orders",method:"view_order_breakdown"},{text:"Order Form",method:"view_order_form"}]
	gen_table(hd,go,"gp-orders-table","no-gp-orders",options)
}
function view_order_breakdown(index) {
	var group_order_no=adata.go[index].order_no;
	var group_id=$("#h-group-id").val()
	var data={group_id:group_id,url:"/group",rq:"view-order-breakdown",group_order_no:group_order_no}
	ajax_go(data,function (rst) {
		var orders=rst.orders;
		$(".child-div").hide()
		$("#orders-div").show()
		var hd=[{cn:"Order No.",fn:"order_no"},{cn:"Qty",fn:"qty"},{cn:"Amount",fn:"amount",ft:"money"},{cn:"Member",fn:"member_name"},{cn:"Time Ordered",fn:"time_recorded"},{cn:"Status",fn:"status"}]
		gen_table(hd,orders,"orders-table","no-orders")
	})
}
function chicken_order_details(index) {
	var order=adata.go[index]

	var hd=[{cn:"Order No.",fn:"order_no"},{cn:"Qty",fn:"qty"},{cn:"No. of Orders",fn:"no"},{cn:"Total",fn:"total",ft:"money"},{cn:"Method",fn:"method"},{cn:"Time Ordered",fn:"order_time"},{cn:"Status",fn:"status"},{cn:"Description",fn:"message",cond:[{val:"",nval:"#NA",ct:'text'}]}]
	gen_table_mobile(hd,[order],'chicken-order-details-div')
	$("#chicken-order-details").modal("show")
}


function select_order_form_img(){
	$("#order-form-file").trigger("click")
}
function upload_order_form() {
	var data=new FormData()
	var form_photo=$("#order-form-file")[0].files

	var arr=[{fn:"Order Form Photo",val:form_photo,ft:"photo"}]
	var vr=check_empty(arr)
	if(!vr)
		return 0
	form_photo=$("#order-form-file")[0].files[0];
	data.append("form_photo",form_photo)
	data.append("rq","upload-order-form")
	data.append("file_name",adata.gon)
	var data2={url:"/group"}
	ajax_file(data,data2,function () {
		var ts=new Date()
		$("#order-form-img").attr("src","/uploads/forms/form-"+adata.gon+"?ts="+ts)
	})
}


function wallet_div() {
	var data={url:"/group",rq:"wallet-transactions"}
	ajax_go(data,function (rst) {
		load_wallet_transactions(rst)
	})
}
function topup_div(argument) {
	$("#topup-div").modal("show")
}
function topup_wallet(argument) {
	var phone=$("#topup-phone").val()
	var amount=$("#topup-amount").val()
	var arr=[{fn:"Mobile Number",ft:"phone",val:phone},{fn:"Amount",val:amount}]
	var vr=check_empty(arr)
	if(!vr)
		return 0;
	var data={url:"/group",rq:"topup-wallet",phone:phone,amount:amount}
	ajax_go(data,function (rst) {
		$("#topup-div").modal("hide")
		clear_fields()
		load_wallet_transactions(rst)

	})
	
}
function load_wallet_transactions(rst) {
	$(".db-wallet").text("UGX "+cx(rst.wallet))
	var th=[{cn:"Transaction Date",fn:"tr"},{cn:"Transaction ID",fn:"trans_id"},{cn:"Type",fn:"type"},{cn:"Amount",fn:"amount",ft:"money"},{cn:"Description",fn:"description"},{cn:"Status",fn:"status"}]
		gen_table(th,rst.wallet_transactions,'wallet-transactions-table','no-wallet-transactions')
		$(".child-div").hide()
		$("#wallet-div").show()
}
function change_pay_method(method) {
	$("#pay-method-"+method).prop("checked",true)
	if(method=="mm"){
		$(".mm-el").show()
	}
	else{
		$(".mm-el").hide()
	}
	adata.method=method
}
function close_cart(){
	$("#cart-modal").modal("hide")
	adata.cart_open=0
	view_orders()
}

function complete_payment() {
	
		var group_id=adata.group_id
		var phone=$("#mm-phone").val()
		var method=adata.method
		if(!method){
			method="mm"
		}
		if(method=="mm"){
			var arr=[{fn:"Phone Number",val:phone,ft:"phone"}]
			var vr=check_empty(arr)
			
			if(!vr)
				return 0;
			
		}
		var data={group_id:group_id,url:"/group",rq:"add-order",member_id:[],qty:[],price:adata.settings.chicken_price,phone:phone,tamount:adata.ttotal,tqty:adata.tqty,method:method}
		var cart=JSON.parse(window.localStorage.getItem("cart"))
		
		if(adata.rq=="retry-paying"){
			//retrying payment
			data.rq="retry-paying"
			data.order_no=adata.order_no
		}
		else{
			data.rq="add-order"
			data.order_no=0;
			for(var i=0;i<cart.length;i++){
				data.member_id[i]=cart[i].member_id;
				data.qty[i]=cart[i].qty;

			}
			data.no=cart.length
		}
		
		
		ajax_go(data,function (rst) {
			
			//display_succ("Order has been received")
			$("#no-cart").text("")
			window.localStorage.removeItem("cart")
			cart=[]
			$(".cart-div,.cart-btn").hide()
			$("#cart-finished").show()
			$("#order-status").text(rst.status)
			$("#cart-close").show()
			if(rst.order_err){
				$("#order-err-div").show()
				$("#order-err").text(rst.order_err)
				$("#cart-retry").show()
				adata.order_no=rst.order_no
			}
			else{
				$("#cart-retry").hide()
				$("#order-err-div").hide()
			}
			if(method=="mm"){

				adata.cart_open=1
				if(rst.order_err)
					return 0
				setTimeout(function() {
					check_chicken_order_payment_status(rst.order_no,rst.phone)
				}, 5000);
			}
			
		})
}

function check_chicken_order_payment_status(order_no,phone){
	if(adata.cart_open==0)
		return 0;
	var data={rq:"check-chicken-order-payment-status",order_no:order_no,phone:phone,url:"/group"}
	$("#loading-text").text("Checking Order payment status...")
	ajax_go(data,function (rst) {
		$("#order-status").text(rst.status)

		if(rst.status=="Pending Approval")
		{
			setTimeout(function() {
				check_chicken_order_payment_status(order_no,phone)
			}, 5000);

		}
		else{

			if(rst.order_err){
				$("#order-err-div").show()
				$("#order-err").text(rst.order_err)
				$("#cart-retry").show()
			}
			else{
				$("#cart-retry").hide()
				$("#order-err-div").hide()
			}
			adata.cart_open=0;
		}
	})
}
function checkout_btn(rq){
	$(".cart-div,.cart-btn").hide()
	$("#cart-checkout,#complete-payment-btn").show()
	adata.rq=rq
}
function retry_paying(index){
	var order=adata.go[index];
	var tqty=order.qty
	var ttotal=order.total;
	var no=order.no;
	adata.order_no=order.order_no

	adata.rq="retry-paying"

	adata.ttotal=ttotal;
	adata.tqty=tqty
	adata.no=no;

	var method=order.method;
	var phone=order.phone;
	if(method=="Wallet"){
		adata.method="wallet"
	}
	else{
		$("#mm-phone").val(phone)
		adata.method="mm"

	}
	change_pay_method(adata.method)
	
	$("#cart-modal").modal("show")
	load_checkout_page(no,tqty,ttotal)
	checkout_btn('retry-paying')

}