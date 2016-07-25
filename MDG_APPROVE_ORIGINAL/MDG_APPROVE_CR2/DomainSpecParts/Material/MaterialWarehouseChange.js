/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseChange");jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseChange={oMaterialWHChangeTable:"",oMaterialSalesDistributionChainTable:"",oMaterialSalesTaxTable:"",oMaterialSalesTextTable:"",oMaterialStorageTypeChangeTable:"",vAdded:"",vNotMaint:"",vDeleted:"",oWhChangedData:"",oWHGenDataModel:"",oWHChangedLayout:"",strStorageType:"",vCreated:"",vUpdated:"",oS3Controller:"",i18n:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),initializeWarehouseChangeTables:function(s){this.oS3Controller=s;sap.ui.getCore().byId("matChangeWarehouseDataLayout").removeAllContent();this.oMaterialWHChangeTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse',this);this.oMaterialStorageTypeChangeTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse',this);sap.ui.getCore().byId("matChangeWarehouseDataLayout").addContent(this.oMaterialWHChangeTable);sap.ui.getCore().byId("matChangeWarehouseDataLayout").addContent(this.oMaterialStorageTypeChangeTable);if(sap.ui.getCore().byId("matCreateWarehouseDataLayout")!==undefined){sap.ui.getCore().byId("matCreateWarehouseDataLayout").destroy();}this.oMaterialWHChangeTable.setGrowing(true);this.oMaterialStorageTypeChangeTable.setGrowing(true);fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.oMaterialStorageTypeChangeTable,this.i18n.getText("Mat_Warehouse_StorageType"));this.oMaterialStorageTypeChangeTable.setHeaderText(this.strStorageType);this.vCreated=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getCreateEntityAction();this.vUpdated=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getUpdateEntityAction();this.vAdded=this.i18n.getText("PC_ADDED");this.vNotMaint="("+this.i18n.getText("PC_NOT_MAIN")+")";this.vDeleted=this.i18n.getText("PC_DELETED");},displayWarehouseChangedTableData:function(v){this.bindWHTable(v,this.createTableTemplate());this.bindStorageTypeTable(v,this.createTableTemplate());},createTableTemplate:function(){var i=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.ObjectIdentifier({text:{path:"EntityName"},title:{path:"EntityDesc"}}).addStyleClass("text_bold"),new sap.m.ObjectIdentifier({text:{path:"AttributeDesc"},title:{path:"NewValue"}}),new sap.m.Text({text:{path:"OldValue"}})]});var e=this.oS3Controller.matHookgetWarehouseChangeTemplate(i);if(e!==undefined){i=e;}return i;},bindStorageTypeTable:function(v,s){var d={EntityDesc:"",EntityName:"",AttributeDesc:"",NewValue:"",OldValue:"",NewValueText:"",OldValueText:"",LGNUM:"",LGTYP:""};this.workOnStorageTypeChangedData(this.oWhChangedData,d,s,v);},bindWHTable:function(v,w){var d={EntityDesc:"",EntityName:"",AttributeDesc:"",NewValue:"",OldValue:"",NewValueText:"",OldValueText:"",LGNUM:"",LGTYP:""};this.oWhChangedData=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getWarehouseChangedData();this.workOnWHChangedData(this.oWhChangedData,d,w,v);},workOnWHChangedData:function(w,d,W,v){var s={results:[]};var a=["LVSME","VOMEM","BEZME","PLKMLGNST","LHME1","LE1MLGNST","LHME2","LE2MLGNST","LHME3","LE3MLGNST","LTAMLGNST","LTEMLGNST","LGBMLGNST","LGBKZ","BLOMLGNST","BSSMLGNST","L2SKR"];var A=["MKAPV","LHMG1","LHMG2","LHMG3"];var b=["KZMBF","KZZUL"];var c="";var o="";var O="";var n="";var N="";var e="";var f="";var g;var h=w.results;var k;for(var i=0;i<h.length;i++){k=h[i].ChangeData.results;if(k.length>0){switch(k[0].EntityAction){case this.vCreated:{d.NewValue=this.vAdded;d.OldValue="";d.AttributeDesc="";d.LGNUM=h[i].LGNUM;d.LGTYP=h[i].LGTYP;g=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(h[i].LGNUM,h[i].LGNUM__TXT);d.EntityDesc=g;d.EntityName=this.i18n.getText("Warehouse");s.results.push(d);d=[];break;}case this.vUpdated:{for(var j=0;j<k.length;j++){if(k[j].Attribute==="LHMG1"){d.AttributeDesc=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Load_Equip_Qty1");}else if(k[j].Attribute==="LHMG2"){d.AttributeDesc=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Load_Equip_Qty2");}else if(k[j].Attribute==="LHMG3"){d.AttributeDesc=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Load_Equip_Qty3");}else if(k[j].Attribute==="LE1MLGNST"){d.AttributeDesc=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Storage_Unit_Type1");}else if(k[j].Attribute==="LE2MLGNST"){d.AttributeDesc=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Storage_Unit_Type2");}else if(k[j].Attribute==="LE3MLGNST"){d.AttributeDesc=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Storage_Unit_Type3");}else if(k[j].Attribute==="LGBMLGNST"){d.AttributeDesc=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Storage_Section_Key");}else if(k[j].Attribute==="VOMEM"){d.AttributeDesc=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Prop_UOM");}else{d.AttributeDesc=k[j].AttributeDesc;}c=k[j].Attribute;o=k[j].OldValue;O=k[j].OldValueText;n=k[j].NewValue;N=k[j].NewValueText;if(n===""||n==="X"){n=N;N="";}if(o===""||o==="X"){o=O;O="";}if(a.indexOf(c)!==-1){if(n!==o){if(o===""){o=this.vNotMaint;}else{o=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(o,O);}if(n===""&&o!==""){n="("+this.vDeleted+")";}else if(n!==""){n=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(n,N);}}d.NewValue=n;d.OldValue=o;d.LGNUM=h[i].LGNUM;d.LGTYP=h[i].LGTYP;g=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(h[i].LGNUM,h[i].LGNUM__TXT);d.EntityDesc=g;d.EntityName=this.i18n.getText("Warehouse");s.results.push(d);d=[];}else if(b.indexOf(c)!==-1){if(n!==o){if(o==="No"){o=this.vNotMaint;}if(n==="No"){n="("+this.vDeleted+")";}}d.NewValue=n;d.OldValue=o;d.LGNUM=h[i].LGNUM;d.LGTYP=h[i].LGTYP;g=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(h[i].LGNUM,h[i].LGNUM__TXT);d.EntityDesc=g;d.EntityName=this.i18n.getText("Warehouse");s.results.push(d);d=[];}else if(A.indexOf(c)!==-1){if(n!==o){e=fcg.mdg.approvecrv2.util.Formatter.defaultValue(o);f=fcg.mdg.approvecrv2.util.Formatter.defaultValue(n);if(e===false){o=this.vNotMaint;}else{o=o+' '+O;}if(f===false){n="("+this.vDeleted+")";}else{n=n+' '+N;}}d.NewValue=n;d.OldValue=o;d.LGNUM=h[i].LGNUM;d.LGTYP=h[i].LGTYP;g=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(h[i].LGNUM,h[i].LGNUM__TXT);d.EntityDesc=g;d.EntityName=this.i18n.getText("Warehouse");s.results.push(d);d=[];}}}default:break;}}}var l=this.oS3Controller.matHookgetWarehouseResults(s);if(l!==undefined){s=l;}W.attachPress({Entity:w,name:'matWarehouseChangeDataDetail'},v.navtoSubDetail,v);this.bindWarehouseFormData(s,W);},workOnStorageTypeChangedData:function(w,d,s,v){var a={results:[]};var b;var c;var D;var C;var e=w.results;var n;var o;var O;var N;for(var i=0;i<e.length;i++){D=e[i].MLGNSTOR2MLGTSTORRel.results;for(var j=0;j<D.length;j++){C=D[j].ChangeData.results;if(C[0]!==undefined&&C[0].EntityAction===this.vCreated&&e[i].ChangeData.results[0].EntityAction===this.vUpdated){d.NewValue=this.vAdded;d.OldValue="";d.LGNUM=e[i].LGNUM;d.LGTYP=D[j].LGTYP;b=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(e[i].LGNUM,e[i].LGNUM__TXT);c=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(D[j].LGTYP,D[j].LGTYP__TXT);d.EntityDesc=c+", "+b;d.EntityName=this.i18n.getText("Mat_Warehouse_StorageType")+", "+this.i18n.getText("Warehouse");a.results.push(d);d=[];}else if(C[0]!==undefined&&C[0].EntityAction===this.vUpdated){for(var k=0;k<C.length;k++){n=C[k].NewValue;o=C[k].OldValue;if(n!==o){O=fcg.mdg.approvecrv2.util.Formatter.defaultValue(o);N=fcg.mdg.approvecrv2.util.Formatter.defaultValue(n);if(O===false){o=this.vNotMaint;}else{o=o;}if(N===false){n="("+this.vDeleted+")";}else{n=n;}}d.NewValue=n;d.OldValue=o;d.AttributeDesc=C[k].AttributeDesc;d.LGNUM=e[i].LGNUM;d.LGTYP=D[j].LGTYP;b=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(e[i].LGNUM,e[i].LGNUM__TXT);c=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(D[j].LGTYP,D[j].LGTYP__TXT);d.EntityDesc=c+", "+b;d.EntityName=this.i18n.getText("Mat_Warehouse_StorageType")+", "+this.i18n.getText("Warehouse");a.results.push(d);d=[];}}}var f=this.oS3Controller.matHookgetStorageTypeResults(a);if(f!==undefined){a=f;}s.attachPress({Entity:w,name:'matStorageTypeChangeDataDetail'},v.navtoSubDetail,v);this.bindStoargeTypeData(a,s);}},bindWarehouseFormData:function(w,W){if(w.results.length===0){sap.ui.getCore().byId("matChangeWarehouseDataLayout").removeAllContent();var n=this.i18n.getText("NodataChanged");this.oWHChangedLayout=sap.ui.getCore().byId("matChangeWarehouseDataLayout");fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(this.oWHChangedLayout,n);}else{var o=new sap.ui.model.json.JSONModel();o.setData(w);this.oMaterialWHChangeTable.setModel(o);this.oMaterialWHChangeTable.bindItems('/results',W,'','');}},bindStoargeTypeData:function(s,S){if(s.results.length!==0){var o=new sap.ui.model.json.JSONModel();o.setData(s);this.oMaterialStorageTypeChangeTable.setModel(o);this.oMaterialStorageTypeChangeTable.bindItems('/results',S,'','');}else{if(this.oMaterialStorageTypeChangeTable!==undefined){this.oMaterialStorageTypeChangeTable.destroy();}}}};