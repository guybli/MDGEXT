/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.util.Formatter");jQuery.sap.require("sap.ca.ui.model.format.DateFormat");jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");fcg.mdg.approvecrv2.util.Formatter={descriptionAndCode:function(d,c){if((d===""||d===undefined||d===null)&&(c===""||c===undefined||c===null)){return false;}else{if(d!==""&&c==="")return d;else if(d===""&&c!=="")return c;else if(d!==""&&c!=="")return d+'('+c+')';}},dateTime:function(v){if(v===""||v===undefined||v===null){return false;}else{var l=new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);var d=sap.ca.ui.model.format.DateFormat.getDateInstance(l).format(v);var t=sap.ca.ui.model.format.DateFormat.getTimeInstance().format(v);var a=d+" "+t;return a;}},getMatVisibiltyBasedOnParameter:function(c){var p=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getPSTAT();if(p===""){return true;}if(p.indexOf(c)>=0){return true;}else{return false;}},matPurchDays:function(v){if(v!==''){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;var p=v+' '+i.getProperty('MAT_PURCH_DAYS');return p;}},checkBox:function(v){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;var n="";if(v==="X"){n=i.getProperty('PC_YES');}return n;},validityFormatter:function(v,V){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;var f="";var t="";var l=new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);if(v===""||v===null||v===undefined||V===""||V===null||V===undefined)return"";if(v){f=sap.ca.ui.model.format.DateFormat.getDateInstance(l).format(v);}if(V){t=sap.ca.ui.model.format.DateFormat.getDateInstance(l).format(V);}var r=i.getProperty("Validity")+": "+f+" - "+t;return r;},description:function(v,V){if(v===null&&V===null)return"";if(v!==undefined&&V!==undefined){var f="";if(v!==""&&V!==""){f=V+" ("+v+")";}else if(v===""&&V!==""){f=V;}else if(v!==""&&V===""){f=v;}return f;}},currency:function(v,V){if(v!==undefined){var f="";if(v!=="0.00"&&v!=="0,00"&&V!==undefined&&V!==""){f=sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(v)+" "+V;return f;}else if(v!=="0.00"&&v!=="0,00"&&v!==""){f=sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(v);return f;}return v;}},defaultValue:function(v){if(v==="00000000"||v==="0.0"||v==="0,0"||v==="00"||v==="0"||v==="0.00"||v==="0,00"||v==="0,000"||v==="000"||v==="0.000"||v==="0,000"||v==="0.0000"||v==="0,0000"||v==="0000"||v==="000000"||v===""||v===null){return false;}else{return true;}},defaultValueChange:function(v){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;if(v==="00000000"||v==="0.0"||v==="00"||v==="0"||v==="0.00"||v==="000"||v==="0000"||v==="000000"||v==="00.00.0000"||v==="00/00/0000"||v==="00-00-0000"||v==="0000.00.00"||v==="0000/00/00"||v==="0000-00-00"||v==="000.00.00"||v==="000/00/00"||v==="000-00-00"){var r='('+i.getProperty('CC_NOT_MAIN')+')';return r;}else return"";},noValue:function(v){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;var n="";if(v===""){n="("+i.getProperty("CC_NOT_MAIN")+")";}else{n=v;}return n;},defaultMatValueChange:function(v){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;if(v==="00000000"||v==="0.0"||v==="0,0"||v==="00"||v==="0"||v==="0.00"||v==="0,00"||v==="000"||v==="0.000"||v==="0,000"||v==="0.0000"||v==="0,0000"||v==="0000"||v==="000000"||v===""||v===null){var r='('+i.getProperty('CC_NOT_MAIN')+')';return r;}else{return v;}},noValueNull:function(v){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;var n="";if(v===""||v===null){n="("+i.getProperty("CC_NOT_MAIN")+")";}else{n=v;}return n;},ModifyAttributeDescriptions:function(e,c){if(e==='Address'){for(var i=0;i<c.length;i++){if(c[i].Attribute==="TEL_NO"){c.splice(i,1);break;}else if(c[i].Attribute==="FAX_NO"){c.splice(i,1);break;}else if(c[i].Attribute==="URI_TYPE"){c.splice(i,1);break;}if(c[i].Entity==="BP_PersonVersion"){if(c[i].Attribute==="ADDR_VERS"){c.splice(i,1);break;}else if(c[i].Attribute==="SORT1_P"){c.splice(i,1);break;}else if(c[i].Attribute==="SORT2_P"){c.splice(i,1);break;}}if(c[i]!==undefined)c[i].AttributeDesc=this.getAttrbibuteDescription(c[i].Attribute,c[i].AttributeDesc);}}return c;},getAttrbibuteDescription:function(a,A){var o=sap.ca.scfld.md.app.Application.getImpl();var i=o.AppI18nModel;var b="";if(a==='REFLEXIVE'){b=i.getProperty('samepartner');}else if(a==='Responsible Institn'){b=i.getProperty('ResponsibleInst');}else if(a==='URI'){b=i.getProperty('WebSite');}else if(a==='ZSABE'){b=i.getProperty('ClerkaTCust');}else if(a==='PERRL'){b=i.getProperty('InvoicingDateList');}else if(a==='EIKTO'){b=i.getProperty('AcntCust');}else if(a==='LIPRE'){b=i.getProperty('SP_PriceMarking');}else if(a==='STENR'){b=i.getProperty('TaxNum');}else if(a==='TIME_ZONE'){b=i.getProperty('TIME_ZONE');}else if(a==='TRANSPZONE'){b=i.getProperty('TRANSPZONE');}else if(a==='LIFN2'){b=i.getProperty('Partner');}else if(a==='XERSR'){b=i.getProperty('Evalrecsettlereturn');}else if(a==='XERSY'){b=i.getProperty('Evalrecdel');}else if(a==='KTGRD'){b=i.getProperty('AcntAsigmntGrp');}else if(a==='FISKU'){b=i.getProperty('TaxOffice');}else if(a==='ESRNR'){b=i.getProperty('ISRNumber');}else if(a==='TITLE_ACA1'){b=i.getProperty('AcademicTitle');}else b=A;return b;},visibility:function(v,V){if((v===undefined||v===""||v===null||v==="|#|"||v==="|#-#|")&&(V===undefined||V===""||V===null||v==="|#|"||v==="|#-#|")){return false;}else{return true;}},visibilityERPTitle:function(v,V,s){if(v===""&&V===""&&s===""){return false;}else{return true;}},getPlantDetailHdr:function(t,s,T){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;var r=i.getProperty("DETAIL_TITLE");var m=i.getProperty("MATERIAL");var p=i.getProperty("plant");var d="";if(t==="Plant"){d=r+": "+m+" - "+p+" ("+s+"/"+T+")";return d;}else if(t==="Storage"){var S=i.getProperty("StorageLoctn");d=r+": "+m+" - "+p+" - "+S+" ("+s+"/"+T+")";return d;}else if(t==="MRP"){d=r+": "+m+" - "+p+" - "+T;return d;}else if(t==="InspctnType"){var I=i.getProperty("Mat_InspctnType");d=r+": "+m+" - "+p+" - "+I+" ("+s+"/"+T+")";return d;}else if(t==="MRPArea"){var M=i.getProperty("Mat_PlntMRPArea");d=r+": "+m+" - "+p+" - "+M+" ("+s+"/"+T+")";return d;}else if(t==="PrdVersn"){var P=i.getProperty("Mat_Prd_Ver");d=r+": "+m+" - "+p+" - "+P+" ("+s+"/"+T+")";return d;}else if(t==="Valuation"){var V=i.getProperty("Mat_Val_Type");d=r+": "+m+" - "+p+" - "+V+" ("+s+"/"+T+")";return d;}else if(t==="Dimension"){var D=i.getProperty("Mat_Dimension");if(s!==undefined&&T!==undefined){d=r+": "+m+" - "+D+" ("+s+"/"+T+")";}else{d=r+": "+m+" - "+D;}return d;}else if(t==="BasicTxt"){var B=i.getProperty("Mat_Basic_Txt");if(s!==undefined&&T!==undefined){d=r+": "+m+" - "+B+" ("+s+"/"+T+")";}else{d=r+": "+m+" - "+B;}return d;}else if(t==="Descr"){var b=i.getProperty("Mat_Txt_Description");if(s!==undefined&&T!==undefined){d=r+": "+m+" - "+b+" ("+s+"/"+T+")";}else{d=r+": "+m+" - "+b;}return d;}else if(t==="PurchOrderTxt"){var c=i.getProperty("Mat_Purch_Order_Txt");if(s!==undefined&&T!==undefined){d=r+": "+m+" - "+c+" ("+s+"/"+T+")";}else{d=r+": "+m+" - "+c;}return d;}else if(t==="IntComnt"){var e=i.getProperty("Mat_Internal_Comment");if(s!==undefined&&T!==undefined){d=r+": "+m+" - "+e+" ("+s+"/"+T+")";}else{d=r+": "+m+" - "+e;}return d;}else if(t==="Quality"){var Q=i.getProperty("Mat_Quality_Inspection");if(s!==undefined&&T!==undefined){d=r+": "+m+" - "+Q+" ("+s+"/"+T+")";}else{d=r+": "+m+" - "+Q;}return d;}else if(t==="Material"){d=r+": "+m;return d;}else if(t==="Purchasing"){var f=i.getProperty("Mat_Purchasing");d=r+": "+m+" - "+f;return d;}else if(t==="Classification"){var C=i.getProperty("Mat_Classification");if(s!==undefined&&T!==undefined){d=r+": "+m+" - "+C+" ("+s+"/"+T+")";}else{d=r+": "+m+" - "+C;}return d;}},getChngPlantDetailHdr:function(t){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;var r=i.getProperty("DETAIL_TITLE");var m=i.getProperty("MATERIAL");var p=i.getProperty("plant");var M=i.getProperty("Plant_MRPTxt");var d="";if(t==="Plant"){d=r+": "+m+" - "+p;return d;}else if(t==="Storage"){var S=i.getProperty("StorageLoctn");d=r+": "+m+" - "+p+" - "+S;return d;}else if(t==="MRP"){d=r+": "+m+" - "+p+" - "+M;return d;}else if(t==="InspctnType"){var I=i.getProperty("Mat_InspctnType");d=r+": "+m+" - "+p+" - "+I;return d;}else if(t==="MRPArea"){var b=i.getProperty("Mat_PlntMRPArea");d=r+": "+m+" - "+p+" - "+b;return d;}else if(t==="PrdVersn"){var P=i.getProperty("Mat_Prd_Ver");d=r+": "+m+" - "+p+" - "+P;return d;}else if(t==="Valuation"){var V=i.getProperty("Mat_Val_Type");d=r+": "+m+" - "+p+" - "+V;return d;}},getWsPnlCntntTtl:function(p,s){var t="";t=p+" - "+s;return t;},Date:function(v){if(v){return sap.ca.ui.model.format.DateFormat.getDateInstance().format(v);}else{return"";}},statusState:function(v){if(v){if(v==="E0001"){return"None";}if(v==="E0002"){return"Warning";}if(v==="E0003"){return"Success";}if(v==="E0004"){return"Error";}}else return"None";},dateFormatter:function(v){if(v===""||v===null||v===undefined)return"";var l=new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);var f=sap.ca.ui.model.format.DateFormat.getDateInstance({style:"medium"},l);return f.format(v);},mimeTypeFormatter:function(v){var i="";if(!v){return"sap-icon://document";}if(v.indexOf('image')===0){i="sap-icon://attachment-photo";}else if(v.indexOf('video')===0){i="sap-icon://attachment-video";}else if(v.indexOf('text')===0){i="sap-icon://attachment-text-file";}else if(v.indexOf('audio')===0){i="sap-icon://attachment-audio";}else if(v.indexOf('application')===0){switch(v){case'application/vnd.openxmlformats-officedocument.presentationml.presentation':case'application/vnd.ms-powerpoint':case'application/vnd.openxmlformats-officedocument.presentationml.template':i="sap-icon://ppt-attachment";break;case'application/msword':case'application/vnd.openxmlformats-officedocument.wordprocessingml.document':case'application/vnd.openxmlformats-officedocument.wordprocessingml.template':i="sap-icon://doc-attachment";break;case'application/vnd.ms-excel':case'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':case'application/vnd.openxmlformats-officedocument.spreadsheetml.template':i="sap-icon://excel-attachment";break;case'application/pdf':i="sap-icon://pdf-attachment";break;case'application/xhtml+xml':i="sap-icon://attachment-html";break;case'application/zip':case'application/gzip':i="sap-icon://attachment-zip-file";break;default:i="sap-icon://document";}}else{i="sap-icon://document";}return i;},mediumDate:function(v){if(v){return sap.ca.ui.model.format.DateFormat.getDateInstance({style:"medium"}).format(v);}else{return"";}},handleCellBolding:function(c,m,e){var s="text_bold";var r="sapThemeText";c.removeStyleClass(s);var a=c.getBindingContext();if(m.oData.hasOwnProperty('results')===true){var i=a.sPath.slice(9,12);if(i<m.oData.results.length){if(m.oData.results.length>0&&m.oData.results[i].hasOwnProperty('ChangeData')===true){var C=m.oData.results[i].ChangeData;if(C.results!==undefined&&C.results.length!==0){for(var j=0;j<C.results.length;j++){if((C.results[j].Attribute===e&&C.results[j].OldValue!==C.results[j].NewValue)||(C.results[j].Attribute===""&&C.results[j].EntityAction==="C")){c.addStyleClass(s);}else if((C.results[j].Attribute===e&&C.results[j].OldValue!==C.results[j].NewValue)||(C.results[j].Attribute===""&&C.results[j].EntityAction==="D")){c.addStyleClass(r);}}}}}}},handleMatCellBolding:function(c,m,e,E){var s="text_bold";var r="sapThemeText";c.removeStyleClass(s);var a=c.getBindingContext();if(m.oData.hasOwnProperty('results')===true){var i=a.sPath.slice(9,12);if(i<m.oData.results.length){if(m.oData.results.length>0&&m.oData.results[i].hasOwnProperty('ChangeData')===true){var C=m.oData.results[i].ChangeData;if(C.results!==undefined&&C.results.length!==0){for(var j=0;j<C.results.length;j++){if(C.results[j].Attribute===e&&C.results[j].EntityAction==="U"){c.addStyleClass(s);}else if(E==="U"&&C.results[j].EntityAction==="C"){c.addStyleClass(s);}else if((E==="C"&&C.results[j].EntityAction==="C")){return;}else if((C.results[j].Attribute===e&&C.results[j].OldValue!==C.results[j].NewValue)||(C.results[j].Attribute===""&&C.results[j].EntityAction==="D")){c.addStyleClass(r);}}}}}}},handleCellBoldingDunningTax:function(c,m){c.removeStyleClass();c.addStyleClass();var p=c.getBindingContext().getPath().split("/")[2];for(var j=0;j<m.oData.ChangeData.length;j++){if(m.oData.dataitems[p]!==undefined){if(m.oData.dataitems[p].Dunning===m.oData.ChangeData[j].changeId||m.oData.dataitems[p].withhld===m.oData.ChangeData[j].changeId){var s="text_bold";c.addStyleClass(s);}}}},resetFormBolding:function(v){var V=v.getContent();var h='';var i="";for(i=0;i<V.length;i++){try{h='X';V[i].getContent();}catch(e){h='';}if(h==='X'){V=V.concat(V[i].getContent());}}for(i=0;i<V.length;i++){try{V[i].setDesign("Standard");}catch(e){}try{V[i].removeStyleClass("text_bold");}catch(e){}}},getSalesOrgHeader:function(k,d,a,b){return d+' ('+k+')/'+b+' ('+a+' )';},getKeyDesc:function(k,d){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;if(k==="X"&&d===i.getProperty('PC_YES')){return i.getProperty('PC_YES');}if(d===""||d===undefined||d===null){return k;}else if(k===""||k===undefined||k===null){return k;}else{return d+' ('+k+')';}},getValuationDesc:function(k,d){if(k==="X"&&d!==""){var D=d;return D;}else{return d;}},getUnitDesc:function(v,u,d){if(d===""||d===undefined||d===null)return v+' '+u;else return v+' '+d+' ('+u+')';},Truncate:function(T){if(T.length>40){var t=T.substring(0,30)+"...";return t;}else{return T;}},checkBoxTable:function(v){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;var n="";if(v==="X"){n=i.getProperty('PC_YES');}else{n=i.getProperty('PC_NO');}return n;},removeLeadingZeros:function(v){if(v===""||v===undefined||v===null){return"";}var r=isNaN(parseInt(v),10)?v:parseInt(v,10);return r;},descriptionWithRemoveZeros:function(v,V){if(v===null&&V===null)return"";if(v!==undefined&&V!==undefined){var f="";v=isNaN(parseInt(v,10))?v:parseInt(v,10);V=isNaN(parseInt(V,10))?V:parseInt(V,10);if(v!==""&&V!==""){f=V+" ("+v+")";}else if(v===""&&V!==""){f=V;}else if(v!==""&&V===""){f=v;}return f;}},handleCellBoldingSubrange:function(c,m){c.removeStyleClass();c.addStyleClass();var p=c.getBindingContext().getPath().split("/")[2];for(var j=0;j<m.oData.ChangeData.length;j++){if(m.oData.dataitems[p]!==undefined){if(m.oData.dataitems[p].Key===m.oData.ChangeData[j].changeId||m.oData.dataitems[p].Key.indexOf(m.oData.ChangeData[j].changeId)>-1){var s="text_bold";c.addStyleClass(s);}if(m.oData.dataitems[p].SubrangeDeleted){var s="sapThemeText";c.addStyleClass(s);}}}},visibilityERPTitleFour:function(v,V,s,a){if(fcg.mdg.approvecrv2.util.Formatter.isNull(v)&&fcg.mdg.approvecrv2.util.Formatter.isNull(V)&&fcg.mdg.approvecrv2.util.Formatter.isNull(s)&&fcg.mdg.approvecrv2.util.Formatter.isNull(a)){return false;}else{return true;}},visibilityERPTitleFive:function(v,V,s,a,b){if(v===""&&V===""&&s===""&&a===""&&b===""){return false;}else{return true;}},visibilityERPTitleSix:function(v,V,s,a,b,c){if(fcg.mdg.approvecrv2.util.Formatter.isNull(v)&&fcg.mdg.approvecrv2.util.Formatter.isNull(V)&&fcg.mdg.approvecrv2.util.Formatter.isNull(s)&&fcg.mdg.approvecrv2.util.Formatter.isNull(a)&&fcg.mdg.approvecrv2.util.Formatter.isNull(b)&&fcg.mdg.approvecrv2.util.Formatter.isNull(c)){return false;}else{return true;}},isNull:function(v){return typeof v==="undefined"||v==='unknown'||v===null||v==='null'||v===''||parseInt(v)===0;},visibilityERPTitleSeven:function(v,V,s,a,b,c,d){if(v===""&&V===""&&s===""&&a===""&&b===""&&c===""&&d===""){return false;}else{return true;}},visibilityERPTitleTen:function(v,V,s,a,b,c,d,e,f,g){if(v===""&&V===""&&s===""&&a===""&&b===""&&c===""&&d===""&&e===""&&f===""&&g===""){return false;}else{return true;}},handleCellMatBolding:function(c,m,e,n){if(n!=="Added"&&n!=="Deleted"){var s="text_bold";c.removeStyleClass(s);var a=c.getBindingContext();if(m.oData.hasOwnProperty('results')===true){var k=a.sPath.slice(9,10);if(k<m.oData.results.length){for(var i=0;i<m.oData.results.length;i++){for(var j=0;j<m.oData.results[i].ChangeData.results.length;j++){if((m.oData.results[i].ChangeData.results[j].Attribute===e&&m.oData.results[i].ChangeData.results[j].OldValue!==m.oData.results[i].ChangeData.results[j].NewValue)||(m.oData.results[i].ChangeData.results[j].Attribute===""&&m.oData.results[i].ChangeData.results[j].EntityAction==="C")){c.addStyleClass(s);}}}}}}},handleCellMatclassBolding:function(c,m,e,C){if(C!==undefined){var s="text_bold";c.removeStyleClass(s);var a=c.getBindingContext();var k=a.sPath.slice(11,12);var b=m.oData.dataitems[k].classdata;for(var i=0;i<C.oData.data.MATERIAL2CLASSTYPERel.results.length;i++){for(var j=0;j<C.oData.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results.length;j++){if((C.oData.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results[j].Attribute===e&&C.oData.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results[j].NewValue===b)){c.addStyleClass(s);}}}}},handleCellMatcharBolding:function(c,m,e,C){if(C!==undefined){var s="text_bold";c.removeStyleClass(s);var a=c.getBindingContext();var k=a.sPath.slice(11,12);var b=m.oData.dataitems[k].charvalue;for(var i=0;i<C.oData.data.MATERIAL2CLASSTYPERel.results.length;i++){for(var j=0;j<C.oData.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results.length;j++){if((C.oData.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results[j].Entity===e&&C.oData.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results[j].NewValue===b)){c.addStyleClass(s);}}}}},matDateFormat:function(v){if(v){var d=sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:"dd.MM.yyyy"});return d.format(new Date(v));}else{return v;}},MatZerovisibility:function(v){if(v===undefined||v===""||v==="0.00"||v==="0.000"||v===null||v==="|#|"||v==="|#-#|"||v==="0,00"||v==="0,000"){return false;}else{return true;}},ParseObjKey:function(v){var n=v.lastIndexOf("(");var j=v.lastIndexOf(")");var k=v.substring(n+1,j);k=k.replace(/\s+/g,'');return k;},getWarehouseDetailHdr:function(t,s,T){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;var r=i.getProperty("DETAIL_TITLE");var m=i.getProperty("MATERIAL");var w=i.getProperty("Warehouse");var d="";if(t==="Warehouse"){d=r+": "+m+" - "+w+" ("+s+"/"+T+")";return d;}},getDocAssignmentDetailHdr:function(t,s,T){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;var r=i.getProperty("DETAIL_TITLE");var m=i.getProperty("MATERIAL");var d=i.getProperty("Mat_Document");var b=i.getProperty("Mat_Txt");var D="";if(t==="Document Assignment"){if(s!==undefined&&T!==undefined){D=r+": "+m+" - "+d+" ("+s+"/"+T+")";}else{D=r+": "+m+" - "+d;}return D;}else if(t==="Text"){if(s!==undefined&&T!==undefined){D=r+": "+m+" - "+d+" - "+b+" ("+s+"/"+T+")";}else{D=r+": "+m+" - "+d+" - "+b;}return D;}},getValuationHeader:function(v){var a=sap.ca.scfld.md.app.Application.getImpl();var i=a.AppI18nModel;var n="";if(v===""){n=i.getProperty("Valuation_Header");}else{n=i.getProperty("Mat_Val_Split")+" ("+v+")";}return n;},handleCellMatSalesBolding:function(c,m,u){var s="text_bold";c.removeStyleClass(s);if(m.oData.hasOwnProperty('items')===true){for(var i=0;i<m.oData.items.length;i++){if(m.oData.items[i].EntityAction===u){c.addStyleClass(s);}}}},matDateDoc:function(v){if(v!==null&&v!==""&&v!==undefined&&v!=='00000000000000'){var y=v.substring(0,4);var m=v.substring(4,6);var d=v.substring(6,8);var D=d+"."+m+"."+y;return D;}else{return"";}},convertBytesToHigherOrder:function(b){var v=typeof b==="string"?parseInt(b):b;var e=parseInt(Math.log(v)/Math.log(1024));var c=(v/Math.pow(1024,e)).toFixed(2);switch(e){case 0:if(c<100){return parseInt(c)+"bytes";}else{var c=(c/1024).toFixed(2);var i=parseInt(c)+1;return i+" KB";}case 1:return parseInt(c)+" KB";case 2:return parseInt(c)+" MB";case 3:return parseInt(c)+" GB";case 4:return parseInt(c)+" TB";case 5:return parseInt(c)+" PB";case 6:return parseInt(c)+" EB";case 7:return parseInt(c)+" ZB";case 8:return parseInt(c)+" YB";}},handlePlantCellBolding:function(c,m,e){var s="text_bold";var r="sapThemeText";c.removeStyleClass(s);c.removeStyleClass(r);var a=c.getBindingContext();if(m.oData.hasOwnProperty('results')===true){var i=a.sPath.slice(9,12);if(i<m.oData.results.length){if(m.oData.results.length>0&&m.oData.results[i].hasOwnProperty('ChangeData')===true){var C=m.oData.results[i].ChangeData;if(C.results!==undefined&&C.results.length!==0){if(C.results[0].EntityAction==='D'){c.addStyleClass(r);}else if(C.results[0].EntityAction==='C'){c.addStyleClass(s);}else if(C.results[0].EntityAction==='U'){for(var j=0;j<C.results.length;j++){if(C.results[j].Attribute===e){c.addStyleClass(s);}}}}}}}},handlePlantMrpTxtCellBolding:function(c,m,e){var s="text_bold";c.removeStyleClass(s);if(m.oData.hasOwnProperty('data')===true){if(m.oData.data!==null&&m.oData.data.hasOwnProperty('ChangeData')===true){var C=m.oData.data.ChangeData;if(C.results!==undefined&&C.results.length!==0){if(C.results[0].EntityAction==='C'){c.addStyleClass(s);}else if(C.results[0].EntityAction==='U'){for(var j=0;j<C.results.length;j++){if(C.results[j].Attribute===e){c.addStyleClass(s);}}}}}}},handleStrgLocCellBolding:function(c,m,e,E){var s="text_bold";c.removeStyleClass(s);var a=c.getBindingContext();if(m.oData.hasOwnProperty('results')===true){var i=a.sPath.slice(9,12);if(i<m.oData.results.length){if(m.oData.results.length>0&&m.oData.results[i].hasOwnProperty('ChangeData')===true){var C=m.oData.results[i].ChangeData;if(C.results!==undefined&&C.results.length!==0){for(var j=0;j<C.results.length;j++){if(C.results[j].Entity===E&&C.results[j].Attribute===e){c.removeStyleClass(s);c.addStyleClass(s);}}if(E==="MARDMRP"&&C.results[0].Entity==="MARDSTOR"&&C.results[0].EntityAction==="C"){c.removeStyleClass(s);c.addStyleClass(s);}}}}}},handlePlantvalLdgrCellBolding:function(c,m,e){var s="text_bold";c.removeStyleClass(s);var a=c.getBindingContext();if(m.oData.hasOwnProperty('results')===true){var i=a.sPath.slice(9,12);if(i<m.oData.results.length){if(m.oData.results.length>0&&m.oData.results[i].hasOwnProperty('ChangeData')===true){var C=m.oData.results[i].ChangeData;if(C.results!==undefined&&C.results.length!==0){if(C.results[0].EntityAction==='U'){for(var j=0;j<C.results.length;j++){if(C.results[j].Attribute===e){c.addStyleClass(s);}}}}}}}}};
