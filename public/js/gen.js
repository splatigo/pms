var adatax={}
$(function (argument) {
  try{
   populate_date()
    populate_cs_day()
    $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
      if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
      }
      var $subMenu = $(this).next('.dropdown-menu');
      $subMenu.toggleClass('show');


      $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
        $('.dropdown-submenu .show').removeClass('show');
      });


      return false;
    });

  }
  catch(e){
   
  }
  $("form").attr("autocomplete","off")
  $("#marital-status").change(function(){
    var ms=$("#marital-status").val()
   
    if(ms=="Married")
      $(".spouse-div").show()
    else
      $(".spouse-div").hide()
  })
  $("#disability-status").change(function(){
    var ms=$("#disability-status").val()

    if(ms=="Disabled")
      $(".disability-type-div").show()
    else
      $(".disability-type-div").hide()
  })
	$(".close-x,input,.alert-msg").click(function (argument) {
		$(".success-msg,.err-msg").hide(1000)
	})
  $('.collapse-navbar').on('click', function(){
    $('.navbar-collapse').collapse('hide');
  });
  $(".confirm-axn").click(function () {
    var axn=$(this).attr("axn")
    adatax.axn=axn;
    if(axn=="signout"){
      $("#confirm-axn-content").text("Are you sure you want to sign out?")
    }
    $("#confirm-axn-div").modal("show")
  })
  $("#yeah").click(function () {
    //action confirmed
    var axn=adatax.axn

    if(axn=="signout"){

      window.location="/signout"
    }
  })
})

//var host="http://localhost:3000"
var host=window.location.origin
//var host="https://"+window.location.host
function clear_fields(argument) {
  $('input[type="text"').val("")
  $('input[type="number"').val("")
   $('input[type="file"').val("")
  $("select").val("0")
 
}
function check_empty(arr) {

    for(var i=0;i<arr.length;i++){
      var val=arr[i].val
      var fn=arr[i].fn
      var op=arr[i].op;//optional field
        if(!arr[i].ft&&arr[i].val==""){
            var msg="\""+arr[i].fn+"\" is not filled"
            display_err(msg,6000)
            return false;
        }
        else if((arr[i].val=="0"||arr[i].val==null||arr[i].val=="")&&arr[i].ft=="sel"){
         
           var msg="Please select the \""+arr[i].fn+"\" field"
            display_err(msg,6000)
            return false;
        }
        else if(arr[i].ft=="photo"){
          if(val.length==0&&!op){
            display_err(arr[i].fn+" is required",6000)
            return false;
          }
          else if(val.length==0&&op){

          }
          else{
            var kind=val[0].type.split("/")[0]
            var type=val[0].type.split("/")[1]
            if(kind=="image"){
              if(type=="png"||type=="jpeg"||type=="jpg")
                  ;
              else{
                display_err(fn+" should be use PNG, JPG image file")
                return false
              }
            }
            else{
              display_err(fn+" should be a photo-file")
              return false
            }
          }
          
        }
        else if(arr[i].ft=="email"){
          if(val==""){
            return display_err(arr[i].fn+" is not filled")
            return false
          }
         
          var vr=ValidateEmail(val)
          if(!vr){
            display_err("You entered an invalid email address")
            return false;
          }
        }
        else if(arr[i].ft=="phone"){

          if(val==""&&!op){
            return display_err(arr[i].fn+" is not filled")
            return false
          }
          else if(val==""){
           
          }
          else{
            var vr=validate_phone(val)

            if(!vr){
              display_err(arr[i].fn+ " is in wrong format or invalid")
              return false;
            }
          }
        }
        else if(arr[i].ft=="date"){

          var vr=validate_date(val)

          if(!vr){
            display_err("Please recheck the field \""+arr[i].fn+"\"")
             return false;
          }
        }
    }

    return true;

}
function ValidateEmail(mail) 
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    
    return (false)
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

	        		display_err("Incorrect Username or password")

	        	}
	        	else{
	        		callback(data)
	        	}

	        },

	        error  : function(err) {

	        	display_err("Unable to connect to server")

	        }

		});
}
function validate_phone(phone,ierr) {
  //ierr; ignore display of error from here
	if(phone.length!=10)
	{	
    if(!ierr)
		  display_err("Incorrect phone number. Ensure number makes 10 Digits")
		return false;
	}
	var pref=phone.substring(0,3)
	if(pref=="079"||pref=="077"||pref=="075"||pref=="074"||pref=="071"||pref=="078"||pref=="070"){
		//correct
		return true;
	}
	else{
		//incorrect number
    if(!ierr)
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
    
      $(".err-msg").show()
    if(!duration)
      duration=8000
    setTimeout(function() {
      $(".err-msg").hide(1000)
    }, duration);
}

function display_succ(msg,duration) {

    $(".loading-div,.err-msg,.info-msg").hide()

    $(".success-content").html(msg)

    $(".success-msg").show()
    if(!duration)
      duration=8000
    setTimeout(function() {
      $(".success-msg").hide(1000)
    }, duration);

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
   
    if(data.rq=="get-defaults")
      $(".container").hide()
    $("#loading-div").show()
  
    $.ajax({

            url: url,

            data: data,

            cache: false,

            type: "GET",

            success: function(result) {
              setTimeout(function() {
                $("#loading-div").hide()
                $(".container").show()

                if(result.errmsg){

                  display_err(result.errmsg)
                  if(result.et=="session-expired"){
                      setTimeout(function() {
                          window.location="/"
                      }, 4000);
                    return 0;
                  }
                  if(!data.return)
                      return 0;
                }
                callback(result)

              }, 1000);
                
            },

            error: function(e) {
            	//console.log(JSON.stringify(e))
              $(".container").show()
                setTimeout(function() {
                $("#loading-div").hide()

              }, 2000);
              //setTimeout(function() {}, 2000);
               // ajax_go(data,callback)
                //display_err("Unable to connect to server",3000)
            }

    });

}
function no_image(el){
  var gender=$(el).attr("gender")
  if(gender=="Male")
    $(el).attr("src","/img/male-ava.jpg")
  else if(gender=="Female")
    $(el).attr("src","/img/female-ava.jpg")
  else
    $(el).attr("src","/img/neutral.png")
}
function ajax_file(data,data2,callback) {

    var url=host

    data.append("ajax",1)
    if(data2.url)
        url=url+data2.url
    if(data2.rq=="get-defaults")
      $(".container").hide()
    $("#loading-div").show()
  
    $.ajax({

            url: url,

            data: data,
            contentType: false,
            processData: false,
            type: "POST",

            success: function(result) {
              setTimeout(function() {
                $("#loading-div").hide()
                $(".container").show()

                if(result.errmsg){
                  display_err(result.errmsg)
                  if(!data.return)
                      return 0;
                }
               callback(result)

              }, 1000);
                
            },

            error: function(e) {
             // console.log(JSON.stringify(e))
              $(".container").show()
                setTimeout(function() {
                $("#loading-div").hide()

              }, 1000);
              setTimeout(function() {}, 2000);
                //ajax_(data,callback)
                //display_err("Unable to connect to server, you are probably offline",3000)
            }

    });

}

$(function (argument) {
    $(".curr").each(function  () {

          
            m=$(this).val();

            

            n=m.split("")
           g="";
           t=0;
           for(var i=n.length-1;i>-1;i--){
             t++;
            if(t%3==0 &&m>=1000){
                g+=n[i]+","

            }
            else{
                g+=n[i]
            }
           }
          
           k="";

           for(var i=g.length-1;i>-1;i--){

              k+=g[i];
           }
          if(k[0]==","){
            k=k.split("")
            k[0]=""
            k=k.join("")
    
            }

           $(this).val(k);
    })
    $(".curr-td").each(function  () {

          //convert for table ; for data created using server renders
            m=$(this).html();
            n=m.split("")
           g="";
           t=0;
           for(var i=n.length-1;i>-1;i--){
             t++;
            if(t%3==0 &&m>=1000){
                g+=n[i]+","

            }
            else{
                g+=n[i]
            }
           }
          
           k="";

           for(var i=g.length-1;i>-1;i--){

              k+=g[i];
           }
          if(k[0]==","){
            k=k.split("")
            k[0]=""
            k=k.join("")
    
            }

           $(this).text(k);
   })
})

function cx(m) {
    //convert to money value; doesn't handle key up
    m=m.toString()
    n=m.split("")
    g="";
    t=0;
    for(var i=n.length-1;i>-1;i--){
        t++;
        if(t%3==0 &&m>=1000){
            g+=n[i]+","

        }
        else{
            g+=n[i]
        }
   }
      
   k="";
    for(var i=g.length-1;i>-1;i--){

      k+=g[i];
    }
    if(k[0]==","){
        k=k.split("")
        k[0]=""
        k=k.join("")
    }
    return k;
}
function dcx(m) {
   m=m.split(",").join("")
   return m;
}
function cx_ku (el) {
  //key up; formating text input for money values
       var m= el.value
        m=m.split(",").join("")
        ts=Number(m).toString()
        if(ts=="NaN")
        {
          m=m.substring(0,m.length-1)
         
        }
        n=m.split("")
        g="";
        t=0;
        for(var i=n.length-1;i>-1;i--){
            t++;
            if(t%3==0 &&m>=1000){
                g+=n[i]+","

            }
            else{
                g+=n[i]
            }
        }

        k="";
        for(var i=g.length-1;i>-1;i--){
            k+=g[i];
        }
        if(k[0]==","){
            k=k.split("")
            k[0]=""
            k=k.join("")
    
        }

        el.value=k;
}
function check_whole_number (el,ml) {
  //key up; formating text input for money values

       var cn= Number(el.value).toString()
       var m=el.value;
        if(cn=="NaN"||(ml&&m.length>ml))
        {
          m=m.substring(0,m.length-1)
         
        }
       el.value=m;

       return m;

}
function capitalizeFLetter(string) { 
    
    return string.replace(/^./, string[0].toUpperCase()); 
} 

function check_phone(phone,eid,type) {
  if(!eid){
    eid="member-name"
  }
  adata.userid=0
  $("#"+eid).text("")
  if(phone.length==10){
    get_user(phone,eid,type)
  }
}
function reset_password_dl(){
  $("#reset-password-div").modal("show")

}
function reset_password(){
  var old_pass=$("#old-pass").val()
  var new_pass=$("#new-pass").val()
  //Reset password for logged in uses; lg
  if(new_pass.length<6)
      return display_err("Password should be 6 characters or more")
  var data={rq:"reset-password-lg",old_pass:old_pass,new_pass:new_pass}
  ajax_go(data,function (rst) {
    clear_fields()
    $("#reset-password-div").modal("hide")
    display_succ("Password reset succesfully")
  })

}
function load_profile(me,clms) {
  
  var tr=""
  for(var i=0;i<clms.length;i++){
    var fn=clms[i].fn;
    var cn=clms[i].cn;
    var ft=clms[i].ft;
    var fv=me[fn]
    if(fv=="null"||fv==null||fv==undefined||fv=="")
      fv="-"
    if(ft=="date")
      fv=new Date(fv).toDateString()
    me[fn]=fv;
   
  }

  gen_table_mobile(clms,[me],"profile-table","no-profile")

}
function view_profile() {
  $("#profile-modal").modal("show")
}
function gen_table(hd,rs,tid,nid,options){
  var w=document.body.clientWidth
  if(w<=768)
    return gen_table_mobile(hd,rs,tid,nid,options)
  if(!rs.length){
    $("#"+nid).show()
    $("#"+tid).hide()
    return 0
  }
  else{
    $("#"+nid).hide()
    $("#"+tid).show()
  }
  var th=""
  for(var i=0;i<hd.length;i++){
    var cn=hd[i].cn;
    th+="<th>"+cn+"</th>"
  }
  var thead="<thead>"+th+"</thead>"
  var tr=""
  for(var i=0;i<rs.length;i++){
    
    var td=""
    for(var j=0;j<hd.length;j++){
      var fn=hd[j].fn;
      var cn=hd[j].cn
      var ft=hd[j].ft

      if(ft=="serial"){
        fv=i+1
      }

      else if(ft=="options"){
        fv=load_options(options,i,rs)
      }
      else if(ft=="cb"){
        cl=hd[j].cl;
        var id=rs[i][fn];
        fv="<input type='checkbox' value=\""+id+"\" class=\""+cl+"\">"
      }
      else if(ft=="money"){
        fv=cx(rs[i][fn])

      }
      else
      {
        var fv=rs[i][fn]
        if(fv==undefined)
          fv=""
      }
      var cond=hd[j].cond
      var ct=0
      if(cond){
        for(var k=0;k<cond.length;k++){
          if(rs[i][cond[k].fn]==cond[k].val){
            ct=cond[k].ct;
            fv=cond[k].nval
            break;

          }
        }
      }
      if(ct=="skip")
        continue;

      td+="<td>"+fv+"</td>"
    }
    tr+="<tr>"+td+"</tr>"
    
  }
  var tbody="<tbody>"+tr+"</tbody>"
  var table=thead+tbody

  $("#"+tid).html("<div class='table-responsive'><table class='table table-striped'>"+table+"</table></div>")
}
function gen_table_mobile(hd,rs,tid,nid,options){

  if(!rs.length){
    $("#"+nid).show()
    $("#"+tid).hide()
    return 0
  }
  else{
    $("#"+nid).hide()
    $("#"+tid).show()
  }
  var div=""
  for(var i=0;i<rs.length;i++){
    if(i%2!=0)
      var style="background:#eee;padding:20px;"
    else
      style="padding:20px;border-radius:3px;"
     div+="<div style=\""+style+"\">"
     if(options){
        v=load_options(options,i,rs)
        //div+="<div style='text-align:right'>"+v+"</div>"
     }
     var tr=""
      for(var j=0;j<hd.length;j++){
        var fn=hd[j].fn;
        var cn=hd[j].cn;
        var fv=rs[i][fn]
        var ft=hd[j].ft;

        var cond=hd[j].cond;
        if(ft=="money"){

          fv=cx(rs[i][fn])
        }
        else if(ft=="cb"){
        cl=hd[j].cl;
        var id=rs[i][fn];
        fv="<input type='checkbox' value=\""+id+"\" class=\""+cl+"\">"
        cn=""
      }
      else if(ft=="options"){
          continue;
      }
      if(cond){

          for(var k=0;k<cond.length;k++){
            if(fv==cond[k].val){
              fv=cond[k].nval
              break;
            }
          }
      }
       var cs=2
        if(options&&j==0){
          cs=1
          var ct=0;//conditin type
          var cond=hd[hd.length-1].cond;//option conditions
          if(cond){
              for(var k=0;k<cond.length;k++){
                if(rs[i][cond[k].fn]==cond[k].val){
                  ct=cond[k].ct;
                  break;

                }
              }
          }
          if(ct=="skip")
              cs=2
        }
        else if(options)
          cs=2

        tr+="<tr style='border-bottom:0.3px;border-bottom-style:solid;border-color:#dee2e6'><td colspan="+cs+"><span class='bld' style='font-size:10px'>"+cn+"</span><br><span>"+fv+"</span></td>"
        if(options&&j==0){
         
          if(ct=="skip")
            continue;

          v=load_options(options,i,rs)
          tr+="<td style='text-align:right;'>"+v+"</td>"
        }
        tr+="</tr>"

      }
      var table="<table style='table-layout:auto;width:100%' >"+tr+"</table>"
      div+=table+"</div>"

  }
  $("#"+tid).html(div)
}

function load_options(arr,index,rs) {
  var op="<div class='btn-group dropleft' >"
    op+="<button class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='fa fa-bars'></i></button>"
    op+=" <div class='dropdown-menu'>"
    for(var i=0;i<arr.length;i++){
      var cond=arr[i].cond;
      if(cond){

        for(var j=0;j<cond.length;j++){
          var fv=rs[index][cond[j].fn]
          
          if(cond[j].val==fv){
            op+="<a class='dropdown-item' href='#' onclick='"+arr[i].method+"("+index+")'>"+arr[i].text+"</a>"
          }
        }
      }
      else{
        if(arr[i].fn){

          index=rs[index][arr[i].fn]
        }
        op+="<a class='dropdown-item' href='#' onclick='"+arr[i].method+"("+index+")'>"+arr[i].text+"</a>"
      }
    }
    op+="</div></div>"
    return op
}
function get_user(phone,eid,type) {
  var data={url:"/market",rq:"get-user",phone:phone}
  adata.userid=0;
  var userid=0;
  ajax_go(data,function (rst) {
    if(rst.user.length){
      var userid=rst.user[0].id
      adata.userid=userid;
      var name=rst.user[0].name;
      if(type)
        $("#"+eid).val(name)
      else
        $("#"+eid).text(name)
    }
    else{
      if(type)
        $("#"+eid).val("")
      else
        $("#"+eid).text("")
      
    }
    $("#"+eid).attr("userid",userid)
    
  })
}
function load_mygroups(mygroups) {
  if(mygroups.length)
    $("#my-groups-li").show()
  else
    $("#my-groups-li").hide()
  var a=""
  for(var i=0;i<mygroups.length;i++){
    var group_name=mygroups[i].group_name;
    var group_id=mygroups[i].group_id
    a+="<a class='dropdown-item' onclick=\"goto_group("+group_id+")\" href='#''>"+group_name+"</a>"
  }
  $("#my-groups-div").html(a)
}

function goto_group(group_id) {
  $("#group-id").val(group_id)
  $("#goto-group-form").submit()
}
function load_districts(districts) {
  var op="<option></option>"
  for(var i=0;i<districts.length;i++){
    var district=districts[i].district;
    op+="<option value='"+district+"'>"+district+"</option>"
  }
  $("#district,#supp-district").html(op)
  $("#e-district,#e-supp-district,#group-filter-district,.district").html(op)
}
function get_counties(district,ext,cb) {
  if(!ext)
    ext=""
  var data={rq:"get-counties",url:"/gen",district:district}
  ajax_go(data,function (rst) {
    var counties=rst.counties;
    var op="<option></option>"
    for(var i=0;i<counties.length;i++){
      var county=counties[i].county;
      op+="<option value='"+county+"'>"+county+"</option>"
    }
    $("#"+ext+"county").html(op)
    if(cb)
      cb()
  })
}
function get_subcounties(district,county,ext,cb) {
  if(!ext)
    ext=""
  var data={rq:"get-subcounties",url:"/gen",district:district,county:county}
  ajax_go(data,function (rst) {
    var subcounties=rst.subcounties;
    var op="<option></option>"
    for(var i=0;i<subcounties.length;i++){
      var subcounty=subcounties[i].sub_county;
      op+="<option value='"+subcounty+"'>"+subcounty+"</option>"
    }
    $("#"+ext+"subcounty").html(op)
    if(cb)
      cb()
  })
}
function get_parishes(district,county,subcounty,ext,cb) {

  var data={rq:"get-parishes",url:"/gen",district:district,county:county,subcounty:subcounty}
  ajax_go(data,function (rst) {
    var parishes=rst.parishes;
    var op="<option></option>"
    for(var i=0;i<parishes.length;i++){
      var parish=parishes[i].parish;
      op+="<option value='"+parish+"'>"+parish+"</option>"
    }
    if(ext){

      $("#"+ext+"parish").html(op)
    }
    else
      $("#parish").html(op)
    if(cb)
      cb()
  })
}

function district_changed(el,ext) {
  if(ext==0)
    ext=""
  var district=$(el).val()
  get_counties(district,ext)
}
function county_changed(el,ext) {
  if(ext==0)
    ext=""
  var district=$("#"+ext+"district").val()
  var county=$(el).val()
  
  get_subcounties(district,county,ext)
}
function subcounty_changed(el,ext) {
  if(ext==0)
    ext=""
  var district=$("#"+ext+"district").val()
  var county=$("#"+ext+"county").val()
 
  var subcounty=$(el).val()

  
  get_parishes(district,county,subcounty,ext)
}


function populate_date(){
  var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
  var op=""
  for(var i=2021;i>1939;i--){
    op+="<option value="+i+">"+i+"</option>"
  }
  $(".year").html(op)
  var op=""
  for(var i=0;i<months.length;i++){
    op+="<option value="+(i+1)+">"+months[i]+"</option>"
  }
  $(".month").html(op)
  var op=""
  for(var i=1;i<31;i++){
    op+="<option value="+i+">"+i+"</option>"
  }
  $(".day").html(op)
}
function populate_cs_day(){
  var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
  var op="<option value='0'></option>"
  for(var i=2020;i<2026;i++){
    op+="<option value="+i+">"+i+"</option>"
  }
  $(".cs-year").html(op)
  op="<option value='0'></option>"
  for(var i=0;i<months.length;i++){
    op+="<option value="+(i+1)+">"+months[i]+"</option>"
  }
  $(".cs-month").html(op)
  var op=""
}


function validate_date(inputText)
  {
  
    var opera1 = inputText.split('/');
    var opera2 = inputText.split('-');
    lopera1 = opera1.length;
    lopera2 = opera2.length;
    // Extract the string into month, date and year
    if (lopera1>1)
    {
    var pdate = inputText.split('/');
    }
    else if (lopera2>1)
    {
     var pdate = inputText.split('-');
    }
    if(pdate[2]=="null"||pdate[1]=="null"||pdate[0]=="null")
      return false
    var dd = parseInt(pdate[2]);
    var mm  = parseInt(pdate[1]);
    var yy = parseInt(pdate[0]);

     

  // Create list of days of a month [assume there is no leap year by default]
    var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
    if (mm==1 || mm>2)
    {
      if (dd>ListofDays[mm-1])
      {
       
        return false;
      }
    }
    if (mm==2)
    {
      var lyear = false;
      if ( (!(yy % 4) && yy % 100) || !(yy % 400)) 
      {
        lyear = true;
      }
      if ((lyear==false) && (dd>=29))
      {
        
        return false;
      }
      if ((lyear==true) && (dd>29))
      {

     
      return false;

      }
    }

    return true;
  }


  
function back(elid) {
  $(".child-div").hide()
  $("#"+elid).show()
}
function order_form_load(rst){

  if(rst=="error"){
    $("#no-form-div").show()
    $("#order-form-img").hide()
  }
  else{
    $("#no-form-div").hide()
    $("#order-form-img").show()
  }
  
}
function view_order_form(index){
  var gon=adata.go[index].order_no
  adata.gon=gon;
  $("#order-form-img").hide()
  $("#order-form-modal").modal("show")
  var ts=new Date()
  var src="/uploads/forms/form-"+gon+"?ts="+ts;
  $("#order-form-img").attr("src",src)


}