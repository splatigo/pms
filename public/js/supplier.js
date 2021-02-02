var adata={}
$(function () {
	get_defaults()
	$(".a-dashboard").click(function () {
		$(".child-div").hide()
		get_defaults()
	})
	$(".a-profile").click(function(){
		$("#profile-div").modal("show")
	})
	
})

function get_defaults() {
	var data={url:"/supplier",rq:"get-defaults"}
	ajax_go(data,function (rst) {
		adata.settings=rst.settings
		adata.user=rst.user;
		$("#my-name").text(" "+rst.me.business_name)
		$("#business-name").text(rst.me.business_name)
		$(".user-li").show()
		var mygroups=rst.mygroups;
		var clms=[
		{cn:"Supplier No.",fn:"supplier_no"},
		{cn:"Business Name",fn:"business_name"},
		{cn:"Primary Phone",fn:"phone"},
		{cn:"Other Phone",fn:"phoneb"},
		{cn:"Email",fn:"email"},
		{cn:"Registration Date",fn:"reg_date",ft:"date"},{cn:"District",fn:"district"},
		{cn:"County",fn:"county"},{cn:"Subcounty",fn:"subcounty"},
		{cn:"Parish",fn:"parish"},{cn:"Village",fn:"village"},
		{cn:"Address",fn:"address"}]
		load_profile(rst.me,clms)
		load_chicken_orders_sum(rst.chicken_orders_sum)
		load_stock_sum(rst.stock_sum)
		$(".child-div").hide()
		$("#dashboard").show()
	})
}

function load_chicken_orders_sum(stock_sum) {
	
	$("#db-chicken-orders-out-for-delivery").html("0 Orders<hr> 0 Chicks<hr>UGX 0")
	$("#db-chicken-orders-delivered").html("0 Orders<hr>0 Chicks <hr>UGX 0")
	for(var i=0;i<stock_sum.length;i++){
		var amount=cx(stock_sum[i].amount)
		var qty=cx(stock_sum[i].qty)
		var no=stock_sum[i].no
		if(stock_sum[i].status=="Out for Delivery")
			$("#db-chicken-orders-out-for-delivery").html(no+" Orders <hr>"+qty+" Chicks <hr>UGX "+ amount)
		if(stock_sum[i].status=="Delivered")
			$("#db-chicken-orders-delivered").html(no+" Orders <hr>"+qty+" Chicks  <hr>UGX "+ amount)
	}
}
function load_stock_sum(rs) {
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
		rx+=status+": "+qty+"<hr>"
	}
	$("#db-stock").html(rx)
}
function change_chicken_orders_status(status) {
	var oid=[];var k=0; //order id ; oid
	$(".chicken-orders-status-cb").each(function () {
		var val=$(this).val()
		if(this.checked==true){
			oid[k++]=val;
		}	
	})
	if(oid.length==0)
		return display_err("No order item selected",5000)
	var data={url:"/supplier",rq:"change-chicken-order-status",status:status,oid:oid}
	ajax_go(data,function (rst) {
		var orders=rst.orders;
		if(data.status=="Out for Delivery")
			xstatus="Pending Orders"
		else
			xstatus="Delivered"
		$("#chicken-orders-curr-status").text(" "+xstatus)
		load_chicken_orders(orders,status)
	})

	
}
function view_chicken_orders(status){
	var data={url:"/supplier",rq:"get-chicken-orders",status:status}
	ajax_go(data,function (rst) {
		if(data.status=="Out for Delivery")
			xstatus="Pending Delivery"
		else
			xstatus="Delivered"
		$("#chicken-orders-curr-status").text(" "+xstatus)
		var orders=rst.orders;
		load_chicken_orders(orders,status)
		
	})
}

function load_chicken_orders(orders) {
	adata.go=orders
	$(".child-div").hide()
	$("#chicken-orders-div").show()
	if(orders.length==0)
		$("#change-chicken-order-status-btn").hide()
	else
		$("#change-chicken-order-status-btn").show()
	var th=[]
	th[th.length]={cn:"",ft:"cb",cl:"tb chicken-orders-status-cb",fn:"order_no"}
	th[th.length]={cn:"Order No",fn:"order_no"}
	th[th.length]={cn:"Group",fn:"group_name"}
	th[th.length]={cn:"Qty",fn:"qty"}
	th[th.length]={cn:"Amount",fn:"amount",ft:"money"}
	th[th.length]={cn:"Payment Method",fn:"method"}
	th[th.length]={cn:"Payment Phone",fn:"phone"}
	th[th.length]={cn:"Ordered on",fn:"order_time"}
	gen_table(th,orders,"chicken-orders-table","no-chicken-orders")
}
function view_chicken_order_bd(index) {
	var group_order_no=adata.go[index].order_no;
	var group_id=adata.go[index].group_id
	var data={group_id:group_id,url:"/supplier",rq:"get-chicken-order-bd",group_order_no:group_order_no}
	ajax_go(data,function (rst) {
		var orders=rst.orders;
		$(".child-div").hide()
		$("#chicken-order-bd-div").show()
		var hd=[{cn:"Order No.",fn:"order_no"},{cn:"Qty",fn:"qty"},{cn:"Amount",fn:"amount",ft:"money"},{cn:"Member",fn:"member_name"},{cn:"Time Ordered",fn:"time_recorded"},{cn:"Status",fn:"status"}]
		gen_table(hd,orders,"chicken-order-bd-table","no-chicken-order-bd")
	})
}



//stock
function get_stock() {
	var data={rq:"get-stock",url:"/supplier"}
	ajax_go(data,function (rst) {
		$(".child-div").hide()
		$("#stock-div").show()
		load_stock(rst.stock)
	})
}

function new_stock_dl(){
	$("#stock-hdr").text("Update Stock")
	adata.axn="add-stock"
	$("#new-stock-div").modal("show")
}
function load_stock(rs){
	//cn; column name
	adata.stock=rs;
	var hd=[{cn:"Stock No.",fn:"stock_no"},{cn:"Qty",fn:"qty"},{cn:"Age",fn:"age"},{cn:"Status",fn:"status"},{cn:"Time Recorded",fn:"tr"},{cn:"Options",ft:"options"}]
	var options=[{method:"edit_stock_dl",text:"Edit"},{text:"Mark as Sold-off",method:"mark_as_sold_off",fn:"id"},{method:"delete_stock",text:"Delete",fn:"id"}]
	for(var i=0;i<rs.length;i++){
		var age=rs[i].age;

		if(age==0)
			age="Less than a day old"
		else if(age==1)
			age="1 Day old"
		else
			age=age+" days"
		rs[i].age=age
		var status=rs[i].status
		if(age>60&&status!="Sold-off")
			rs[i].status="Ready for Sale"
	}

	gen_table(hd,rs,"stock-table","no-stock",options)
}
function add_stock(){
	var qty=$("#stock-qty").val()
	var arr=[{fn:"Stock Quantity",val:qty}]
	var vr=check_empty(arr)
	if(!vr)
		return 0;
	var data={rq:adata.axn,url:"/supplier",qty:qty,id:adata.id}
	ajax_go(data,function(rst){
		$("#new-stock-div").modal("hide")
		load_stock(rst.stock)
	})
}


function delete_stock(id) {
	
	var data={rq:"change-chicken-stock-status",url:"/supplier",id:id,status:"Deleted"}
	var cfm=confirm("Are you sure you want to remove this entry?")
	if(!cfm)
		return 0;
	ajax_go(data,function(rst){
		clear_fields()
		load_stock(rst.stock)
	})

}
function edit_stock_dl(i) {
	var id=adata.stock[i].id;
	var qty=adata.stock[i].qty;
	adata.axn="edit-stock"
	adata.id=id;

	$("#stock-hdr").text("Update Stock")
	$("#stock-qty").val(qty)
	$("#new-stock-div").modal("show")
}
function mark_as_sold_off(id) {
	var data={rq:"change-chicken-stock-status",url:"/supplier",id:id,status:"Sold-off"}
	var cfm=confirm("Are you sure you want to mark this as Sold-off?")
	if(!cfm)
		return 0;
	ajax_go(data,function(rst){
		clear_fields()
		load_stock(rst.stock)
	})
}