/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPChange");fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange={oChangetitle:"",oChangeauthorization:"",vAddrTabResults:{aAddressDetails:[]},vAddrUsgResults:{aAddrUsages:[]},oAddressItemTemp:"",aAddresses:[],aAddressUsages:[],noCompcodeData:"",noSalesData:"",vRelTabResults:{aRelDetails:[]},oItemTempRel:"",aRelations:[],oS3Controller:"",getCompanyCodeData:function(c,p,s){this.oS3Controller=s;var C=p;var b='BP_Root/CU_MultipleAssignmentsRel/';var v=',';var a='/ChangeData';C=C+b+"CU_AssignedCompanyCodesRel"+a;C=C+v+b+"CU_AssignedCompanyCodesRel/CU_CompDunningAreasRel"+a;C=C+v+b+"CU_AssignedCompanyCodesRel/CU_CompWithholdingTaxesRel"+a;var e=s.custHookChangeCompCodeQuery(C);if(e!==undefined){C=e;}return C;},getSalesData:function(c,p,s){this.oS3Controller=s;var C=p;var b='BP_Root/CU_MultipleAssignmentsRel/';var v='/ChangeData';var a=',';C=C+b+"CU_AssignedSalesAreasRel"+v;C=C+a+b+"CU_AssignedSalesAreasRel/CU_SalesPartnerFunctionsRel"+v;C=C+a+b+"CU_AssignedSalesAreasRel/CU_SalesTaxIndicatorsRel"+v;var e=s.custHookChangeSalesQuery(C);if(e!==undefined){C=e;}return C;},displayCompanyCodeData:function(a,s,h){var b=false;var c="";var n="";var o="";var d="";var e="";var f="";var g="";var m="";var k,l;var D="";var p="";var q="";var t="";var K="";var u="";var A="";var B=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();var I=this.getTableTemplate();if(a.BP_Root.CU_MultipleAssignmentsRel.results!==undefined&&a.BP_Root.CU_MultipleAssignmentsRel.results.length>0){if(a.BP_Root.CU_MultipleAssignmentsRel.results.length>1){b=true;}var v={dataitems:[]};for(var i=0;i<a.BP_Root.CU_MultipleAssignmentsRel.results.length;i++){var M=a.BP_Root.CU_MultipleAssignmentsRel.results[i];if(a.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCompanyCodesRel.results!==undefined){for(var j=0;j<a.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCompanyCodesRel.results.length;j++){var w=a.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCompanyCodesRel.results[j];if(w.ChangeData.results!==undefined){var x="";for(k=0;k<w.ChangeData.results.length;k++){n=w.ChangeData.results[k].NewValue;o=w.ChangeData.results[k].OldValue;d=w.ChangeData.results[k].NewValueText;e=w.ChangeData.results[k].OldValueText;A=w.ChangeData.results[k].Attribute;var y=w.BUKRS;m=w.ASSIGNMENT_ID;x=m+y;f=this.getValue(n,d,A,"new");g=this.getValue(o,e,A,"old");if(b===true){var z=M.STANDARD;var C=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.OBJECT_ID,M.OBJECT_ID__TXT);var E=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.REASON_ID,M.REASON_ID__TXT);var F="";var G=M.CU_AssignedCustomerRel;if(!this.isNull(G)){if(!this.isNull(G.KTOKD)&&!this.isNull(G.KTOKD__TXT)){F=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(G.KTOKD,G.KTOKD__TXT);}}c=this.getSubheaderWithAccGrp(z,C,E,F);}else{c="";}var H=w.ChangeData.results[k].Attribute;var J=w.ChangeData.results[k].AttributeDesc;var L=fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(H,J);D={"Context":w.ChangeData.results[k].Context,"Dunning":"","Key":x,"Withhld":"","KeyValue":c,"EntityDesc":B.getText("GL_COMP_CODE"),"AttributeDesc":L,"EntityAction":w.ChangeData.results[k].EntityAction,"NewValueText":f,"OldValue":g,"ParentContext":"","ParentEntityDesc":"","ParentEntityVisible":false};p=s.custHookCompCodeChangeData(a,this);if(p!==undefined){D=p;}v.dataitems.push(D);s.oCompCode.aCompCode.push(D);}}if(w.CU_CompDunningAreasRel.results!==undefined&&w.CU_CompDunningAreasRel.results.length>0){for(k=0;k<w.CU_CompDunningAreasRel.results.length;k++){var N=w.CU_CompDunningAreasRel.results[k];if(N.ChangeData.results!==undefined){for(l=0;l<N.ChangeData.results.length;l++){n=N.ChangeData.results[l].NewValue;o=N.ChangeData.results[l].OldValue;d=N.ChangeData.results[l].NewValueText;e=N.ChangeData.results[l].OldValueText;A=N.ChangeData.results[l].Attribute;f=this.getValue(n,d,A,"new");g=this.getValue(o,e,A,"old");var O=N.MABER;q=N.MABER__TXT;if(q===""){q=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DefaultDunning");}var P=w.BUKRS__TXT+"("+w.BUKRS+")";t=N.BUKRS;m=N.ASSIGNMENT_ID;var Q=m+t+O;K=m+t;u=this.getValue(O,q);if(w.ChangeData.results.length===0){if(u===""){u=N.ChangeData.results[l].Context;}}if(b===true){var z=M.STANDARD;var C=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.OBJECT_ID,M.OBJECT_ID__TXT);var E=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.REASON_ID,M.REASON_ID__TXT);var F="";var G=M.CU_AssignedCustomerRel;if(!this.isNull(G)){if(!this.isNull(G.KTOKD)&&!this.isNull(G.KTOKD__TXT)){F=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(G.KTOKD,G.KTOKD__TXT);}}c=this.getSubheaderWithAccGrp(z,C,E,F);}else{c="";}D={"Context":u,"Key":K,"KeyValue":c,"Dunning":Q,"Withhld":"","EntityDesc":B.getText("DunningArea"),"AttributeDesc":N.ChangeData.results[l].AttributeDesc,"EntityAction":N.ChangeData.results[l].EntityAction,"NewValueText":f,"OldValue":g,"ParentContext":P,"ParentEntityDesc":B.getText("GL_COMP_CODE"),"ParentEntityVisible":true};p=s.custHookDunningChangeData(a,this);if(p!==undefined){D=p;}v.dataitems.push(D);s.oCompCode.aCompCode.push(D);}}}}if(w.CU_CompWithholdingTaxesRel.results!==undefined&&w.CU_CompWithholdingTaxesRel.results.length>0){for(k=0;k<w.CU_CompWithholdingTaxesRel.results.length;k++){var W=w.CU_CompWithholdingTaxesRel.results[k];if(W.ChangeData.results!==undefined){for(l=0;l<W.ChangeData.results.length;l++){n=W.ChangeData.results[l].NewValue;o=W.ChangeData.results[l].OldValue;d=W.ChangeData.results[l].NewValueText;e=W.ChangeData.results[l].OldValueText;A=W.ChangeData.results[l].Attribute;f=this.getValue(n,d,A,"new");g=this.getValue(o,e,A,"old");var R=W.WITHT;q=W.WITHT__TXT;t=W.BUKRS;m=W.ASSIGNMENT_ID;var S=m+t+R;K=m+t;u=this.getValue(R,q);var P=w.BUKRS__TXT+"("+w.BUKRS+")";if(w.ChangeData.results.length===0){if(u===""){u=W.ChangeData.results[l].Context;}}if(b===true){var z=M.STANDARD;var C=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.OBJECT_ID,M.OBJECT_ID__TXT);var E=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.REASON_ID,M.REASON_ID__TXT);var F="";var G=M.CU_AssignedCustomerRel;if(!this.isNull(G)){if(!this.isNull(G.KTOKD)&&!this.isNull(G.KTOKD__TXT)){F=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(G.KTOKD,G.KTOKD__TXT);}}c=this.getSubheaderWithAccGrp(z,C,E,F);}else{c="";}D={"Context":u,"Key":K,"KeyValue":c,"Dunning":"","Withhld":S,"EntityDesc":B.getText("Withhldtax"),"EntityAction":W.ChangeData.results[l].EntityAction,"AttributeDesc":W.ChangeData.results[l].AttributeDesc,"NewValueText":f,"OldValue":g,"ParentContext":P,"ParentEntityDesc":B.getText("GL_COMP_CODE"),"ParentEntityVisible":true};p=s.custHookWithTaxChangeData(a,this);if(p!==undefined){D=p;}v.dataitems.push(D);s.oCompCode.aCompCode.push(D);}}}}}}}var T=[];s.compCodeResults={dataitems:[]};for(l=0;l<s.oCompCode.aCompCode.length;l++){T.push(s.oCompCode.aCompCode[l].Key);}T.sort();s.aUniqueCompcode=this.eliminateDuplicatesRecords(T);for(var r=0;r<s.aUniqueCompcode.length;r++){for(l=0;l<s.oCompCode.aCompCode.length;l++){if(s.aUniqueCompcode[r]===s.oCompCode.aCompCode[l].Key){s.compCodeResults.dataitems.push(s.oCompCode.aCompCode[l]);}}}s.compCodeResults.dataitems.sort();s.compCodeResults.dataitems.reverse();if(s.compCodeResults.dataitems.length>0){var U="";var V="";var X="";var Y=new sap.ui.model.json.JSONModel();Y.setData(s.compCodeResults);sap.ui.getCore().byId("CCompCodeLayout").removeAllContent();sap.ui.getCore().byId("CDunningLayout").removeAllContent();sap.ui.getCore().byId("CWithhldTaxLayout").removeAllContent();sap.ui.getCore().byId("CCompCodeLayout").setVisible(true);sap.ui.getCore().byId("CDunningLayout").setVisible(true);sap.ui.getCore().byId("CWithhldTaxLayout").setVisible(true);s.oCompcodeTable="";s.oCompcodeTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse',s);sap.ui.getCore().byId("CCompCodeLayout").addContent(s.oCompcodeTable);s.oCompcodeTable.setGrowing(true);s.oCompcodeTable.setModel(Y);I.attachPress({Entity:"CompanyCode",Key:s.compCodeResults.dataitems,EntityData:a.BP_Root.CU_MultipleAssignmentsRel},s.navtoSubDetail,s);if(b===true){U=[];V=new sap.ui.model.Sorter("KeyValue",false,true);X=new sap.ui.model.Sorter("Key",false,false);U.push(V);U.push(X);s.oCompcodeTable.bindItems('/dataitems',I,U,'');}else{U=[];X=new sap.ui.model.Sorter("Key",true,false);V=new sap.ui.model.Sorter("Context",true,false);U.push(X);U.push(V);s.oCompcodeTable.bindItems('/dataitems',I,U,'');}}else{this.showNodataCCMsg();}s.aUniqueCompcode=[];return;}else{this.showNodataCCMsg();}s.oCompCode={aCompCode:[]};},displaySalesData:function(a,s,h){var b=false;var c="";var I=this.getTableTemplate();var d="";var k="";var e="";var f="";var g="";var K="";var m="";var n="";var A="";var o="";var D="";var l="";var p="";var q="";var t="";var u="";var v="";var w="";var B=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();if(a.BP_Root.CU_MultipleAssignmentsRel.results!==undefined&&a.BP_Root.CU_MultipleAssignmentsRel.results.length>0){if(a.BP_Root.CU_MultipleAssignmentsRel.results.length>1){b=true;}var x={dataitems:[]};for(var i=0;i<a.BP_Root.CU_MultipleAssignmentsRel.results.length;i++){var M=a.BP_Root.CU_MultipleAssignmentsRel.results[i];if(a.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedSalesAreasRel.results!==undefined){for(var j=0;j<a.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedSalesAreasRel.results.length;j++){var y=a.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedSalesAreasRel.results[j];if(y.ChangeData.results!==undefined){for(k=0;k<y.ChangeData.results.length;k++){q=y.ChangeData.results[k].NewValue;t=y.ChangeData.results[k].OldValue;u=y.ChangeData.results[k].NewValueText;v=y.ChangeData.results[k].OldValueText;w=y.ChangeData.results[k].Attribute;e=y.VKORG;f=y.VTWEG;g=y.SPART;d=y.ASSIGNMENT_ID;K=d+e+f+g;var z=this.getValue(q,u,w,"new");var C=this.getValue(t,v,w,"old");if(b===true){var E=M.STANDARD;var F=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.OBJECT_ID,M.OBJECT_ID__TXT);var G=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.REASON_ID,M.REASON_ID__TXT);var H="";var J=M.CU_AssignedCustomerRel;if(!this.isNull(J)){if(!this.isNull(J.KTOKD)&&!this.isNull(J.KTOKD__TXT)){H=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(J.KTOKD,J.KTOKD__TXT);}}c=this.getSubheaderWithAccGrp(E,F,G,H);}else{c="";}m=y.ChangeData.results[k].Attribute;n=y.ChangeData.results[k].AttributeDesc;A=fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(m,n);D={"Context":y.ChangeData.results[k].Context,"Key":K,"KeyValue":c,"AttributeDesc":A,"EntityDesc":B.getText("salesarea"),"EntityAction":y.ChangeData.results[k].EntityAction,"NewValueText":z,"OldValue":C,"ParentContext":"","ParentEntityDesc":"","ParentEntityVisible":false};o=s.custHookSalesChangeData(a,this);if(o!==undefined){D=o;}x.dataitems.push(D);s.oSalesArea.aSalesArea.push(D);}}if(y.CU_SalesPartnerFunctionsRel.results!==undefined&&y.CU_SalesPartnerFunctionsRel.results.length>0){for(k=0;k<y.CU_SalesPartnerFunctionsRel.results.length;k++){var P=y.CU_SalesPartnerFunctionsRel.results[k];for(l=0;l<P.ChangeData.results.length;l++){q=P.ChangeData.results[l].NewValue;t=P.ChangeData.results[l].OldValue;u=P.ChangeData.results[l].NewValueText;v=P.ChangeData.results[l].OldValueText;w=P.ChangeData.results[l].Attribute;z=this.getValue(q,u,w,"new");C=this.getValue(t,v,w,"old");e=y.VKORG;f=y.VTWEG;g=y.SPART;d=y.ASSIGNMENT_ID;K=d+e+f+g;var L=P.PARVW;var N=P.PARVW__TXT;p=this.getValue(L,N);var S=y.VKORG__TXT+"("+e+")"+","+y.VTWEG__TXT+"("+f+")"+","+y.SPART__TXT+"("+g+")";if(y.ChangeData.results.length===0){if(p===""){p=P.ChangeData.results[l].Context;}}if(b===true){var E=M.STANDARD;var F=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.OBJECT_ID,M.OBJECT_ID__TXT);var G=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.REASON_ID,M.REASON_ID__TXT);var H="";var J=M.CU_AssignedCustomerRel;if(!this.isNull(J)){if(!this.isNull(J.KTOKD)&&!this.isNull(J.KTOKD__TXT)){H=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(J.KTOKD,J.KTOKD__TXT);}}c=this.getSubheaderWithAccGrp(E,F,G,H);}else{c="";}m=P.ChangeData.results[l].Attribute;n=P.ChangeData.results[l].AttributeDesc;A=fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(m,n);D={"Context":p,"Key":K,"KeyValue":c,"AttributeDesc":A,"EntityDesc":B.getText("PartnerFunc"),"EntityAction":P.ChangeData.results[l].EntityAction,"NewValueText":z,"OldValue":C,"ParentContext":S,"ParentEntityDesc":B.getText("salesarea"),"ParentEntityVisible":true};o=s.custHookPFChangeData(a,this);if(o!==undefined){D=o;}x.dataitems.push(D);s.oSalesArea.aSalesArea.push(D);}}}if(y.CU_SalesTaxIndicatorsRel.results!==undefined&&y.CU_SalesTaxIndicatorsRel.results.length>0){for(k=0;k<y.CU_SalesTaxIndicatorsRel.results.length;k++){var O=y.CU_SalesTaxIndicatorsRel.results[k];for(l=0;l<O.ChangeData.results.length;l++){q=O.ChangeData.results[l].NewValue;t=O.ChangeData.results[l].OldValue;u=O.ChangeData.results[l].NewValueText;v=O.ChangeData.results[l].OldValueText;w=O.ChangeData.results[l].Attribute;if(O.ChangeData.results[l].Attribute==="TAXKD"){if(q==='0'){u=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("taxexempt");v=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("liabletax");}else{u=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("liabletax");v=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("taxexempt");}}z=this.getValue(q,u,w,"new");C=this.getValue(t,v,w,"old");e=y.VKORG;f=y.VTWEG;g=y.SPART;d=y.ASSIGNMENT_ID;K=d+e+f+g;var Q=O.TAXKD;var R=O.TAXKD__TXT;var T=O.ALAND;var U=O.ALAND__TXT;var V=O.TATYP;var W=O.TATYP__TXT;p=this.getValue(T,U)+","+this.getValue(V,W)+","+this.getValue(Q,R);var S=y.VKORG__TXT+"("+e+")"+","+y.VTWEG__TXT+"("+f+")"+","+y.SPART__TXT+"("+g+")";if(b===true){var E=M.STANDARD;var F=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.OBJECT_ID,M.OBJECT_ID__TXT);var G=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.REASON_ID,M.REASON_ID__TXT);var H="";var J=M.CU_AssignedCustomerRel;if(!this.isNull(J)){if(!this.isNull(J.KTOKD)&&!this.isNull(J.KTOKD__TXT)){H=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(J.KTOKD,J.KTOKD__TXT);}}c=this.getSubheaderWithAccGrp(E,F,G,H);}else{c="";}D={"Context":p,"Key":K,"KeyValue":c,"EntityDesc":B.getText("Tax Indicators"),"AttributeDesc":O.ChangeData.results[l].AttributeDesc,"EntityAction":O.ChangeData.results[l].EntityAction,"NewValueText":z,"OldValue":C,"ParentContext":S,"ParentEntityDesc":B.getText("salesarea"),"ParentEntityVisible":true};o=s.custHookTaxClassChangeData(a,this);if(o!==undefined){D=o;}x.dataitems.push(D);s.oSalesArea.aSalesArea.push(D);}}}}}}var X=[];s.SalesAreaResults={dataitems:[]};for(l=0;l<s.oSalesArea.aSalesArea.length;l++){X.push(s.oSalesArea.aSalesArea[l].Key);}X.sort();s.aUniqueCompcode=this.eliminateDuplicatesRecords(X);for(var r=0;r<s.aUniqueCompcode.length;r++){for(l=0;l<s.oSalesArea.aSalesArea.length;l++){if(s.aUniqueCompcode[r]===s.oSalesArea.aSalesArea[l].Key){s.SalesAreaResults.dataitems.push(s.oSalesArea.aSalesArea[l]);}}}if(s.SalesAreaResults.dataitems.length>0){var Y=new sap.ui.model.json.JSONModel();Y.setData(s.SalesAreaResults);sap.ui.getCore().byId("CSaleLayout").removeAllContent();sap.ui.getCore().byId("CSaleLayout").setVisible(true);s.oSalesTable="";s.oSalesTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse',s);sap.ui.getCore().byId("CSaleLayout").addContent(s.oSalesTable);s.oSalesTable.setGrowing(true);s.oSalesTable.setModel(Y);I.attachPress({Entity:"SalesArea",Key:s.SalesAreaResults.dataitems,EntityData:a.BP_Root.CU_MultipleAssignmentsRel},s.navtoSubDetail,s);if(b===true){var Z=[];var $=new sap.ui.model.Sorter("KeyValue",false,true);var _=new sap.ui.model.Sorter("Key",false,false);Z.push($);Z.push(_);s.oSalesTable.bindItems('/dataitems',I,Z,'');}else{s.oSalesTable.bindItems('/dataitems',I,'','');}}else{this.showNoDataSaleMsg();}s.aUniqueCompcode=[];return;}else{this.showNoDataSaleMsg();}s.oSalesArea={aSalesArea:[]};},getTableTemplate:function(){var i=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.VBox({items:[new sap.m.ObjectIdentifier({text:{path:"EntityDesc"},title:{path:"Context"}}).addStyleClass("objectIdentifier_text"),new sap.m.ObjectIdentifier({text:{path:"ParentEntityDesc"},title:{path:"ParentContext"},visible:"{ParentEntityVisible}"}).addStyleClass("objIdentifier_margin").addStyleClass("objectIdentifier_text")]}),new sap.m.ObjectIdentifier({text:{path:"AttributeDesc"},title:{path:"NewValueText"}}),new sap.m.Text({text:{path:"OldValue"}})]});var e=this.oS3Controller.custHookgetTableTemplate(i);if(e!==undefined){i=e;}return i;},getAddressTableTemplate:function(m){var i=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.ObjectIdentifier({text:{path:"Context"},title:{path:"EntityDesc"}}),new sap.m.ObjectIdentifier({text:{path:"AttributeDesc"},title:{path:"NewValueText",formatter:function(){var c=this.getBindingContext();var n=m.getProperty("NewValue",c);var N=m.getProperty("NewValueText",c);if(n==='X')return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");else if(N!==''&&n!=='')return N+'('+n+')';else if(n===''&&N!=='')return N;else return n;}}}),new sap.m.Text({text:{path:"OldValue",formatter:function(){var c=this.getBindingContext();var o=m.getProperty("OldValue",c);var O=m.getProperty("OldValueText",c);if(o==='X')return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");else if(O!==''&&o!=='')return O+'('+o+')';else if(o===''&&O!=='')return O;else return o;}}})]});var e=this.oS3Controller.custHookgetAddressTableTemplate(i);if(e!==undefined){i=e;}return i;},getChangeTableTemplate:function(m){var i=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.ObjectIdentifier({text:{path:"Context"},title:{path:"EntityDesc"}}),new sap.m.ObjectIdentifier({text:{path:"AttributeDesc"},title:{path:"NewValueText",formatter:function(){var c=this.getBindingContext();var n=m.getProperty("NewValue",c);var N=m.getProperty("NewValueText",c);if(N!==''&&n!=='')return N+'('+n+')';else if(n===''&&N!=='')return N;else return n;}}}),new sap.m.Text({text:{path:"OldValue",formatter:function(){var c=this.getBindingContext();var o=m.getProperty("OldValue",c);var O=m.getProperty("OldValueText",c);if(O!==''&&o!=='')return O+'('+o+')';else if(o===''&&O!=='')return O;else return o;}}})]});var e=this.oS3Controller.custHookgetChangeTableTemplate(i);if(e!==undefined){i=e;}return i;},getValue:function(V,a,A,c){var f="";if(V!==""&&a!==""){if(V==="X"||A==="FRGRP"||A==="KVGR1"||A==="ZINRT"||A==="ZAHLS"||A==="KVGR2"||A==="KZTLF"||A==="XAUSZ"||A==="VRSDG"||A==="KVGR3"||A==="PVKSM"||A==="MGRUP"||A==="URLID"||A==="KVGR4"||A==="SREGL"||A==="ZGRUP"||A==="KVGR5")f=a;else f=a+"("+V+")";}if(V===""&&a!==""){f=a;}if(V!==""&&a===""){if(A!=="DTAWS"){var n=fcg.mdg.approvecrv2.util.Formatter.defaultValueChange(V);if(n!==""){f=n;}else f=V;}else f=V;}if(V==="X"&&(a===""||a===sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES"))){f=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");}if((A==="WT_AGTDF"||A==="WT_AGTDT"||A==="WEBTR"||A==="LPRIO"||A==="JMZAH"||A==="VLIBB"||A==="AWAHR"||A==="ANTLF"||A==="VRSZL"||A==="UEBTO"||A==="UNTTO"||A==="VRSPR")&&(V==="00.00.0000"||V==="0000.00.00"||V.trim()==="0,00"||V.trim()==="0,0"||parseInt(V)===0)&&a===""){if(c==="new")f="("+sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_DELETED")+")";else if(c==="old")f="("+sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_NOT_MAIN")+")";}return f;},eliminateDuplicatesRecords:function(I){var i;var l=I.length,o=[],O={};for(i=0;i<l;i++)O[I[i]]=0;for(i in O)o.push(i);return o;},showNodataCCMsg:function(){if(this.ccText)this.ccText.destroy();this.ccText=new sap.m.Text("ccTxt");this.ccText.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Nodata"));sap.ui.getCore().byId("CCompCodeLayout").removeAllContent();sap.ui.getCore().byId("CDunningLayout").removeAllContent();sap.ui.getCore().byId("CWithhldTaxLayout").removeAllContent();sap.ui.getCore().byId("CCompCodeLayout").setVisible(true);sap.ui.getCore().byId("CCompCodeLayout").addContent(this.ccText);},showNoDataSaleMsg:function(){if(this.saleText)this.saleText.destroy();this.saleText=new sap.m.Text("saleTxt");this.saleText.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Nodata"));sap.ui.getCore().byId("CSaleLayout").removeAllContent();sap.ui.getCore().byId("CSaleLayout").setVisible(true);sap.ui.getCore().byId("CSaleLayout").addContent(this.saleText);},getSubheaderWithAccGrp:function(s,o,r,a){var b="";var c=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Reason");var d=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("AccountGroup");var e=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ERPCustomer");var f=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Standard");b=e;if(o!==""){if(b!=="")b=b+", "+"("+o+")";else b=e+"("+o+")";}if(r!==""){if(b!=="")b=b+", "+c+": "+r;else b=c+": "+r;}if(a!==""){if(b!=="")b=b+", "+d+": "+a;else b=d+": "+a;}if(s==='X'){if(b!=="")b=b+", "+f;else b=f;}return b;},isNull:function(v){return typeof v==="undefined"||v==='unknown'||v===null||v==='null'||parseInt(v)===0;}};
