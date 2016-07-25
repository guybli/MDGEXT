/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesChange");jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate");jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesChange={oMaterialMARASalesTable:"",oMaterialSalesDistributionChainTable:"",oMaterialSalesTaxTable:"",oMaterialSalesTextTable:"",aDetailData:"",nodata:"",oAttachment:"",vLinkPressed:"",oS3Controller:"",strDistributionChain:"",strSalesTax:"",strSalesText:"",oMaterialS4SalesForm:"",oSalesTableS4Details:"",vAdded:"",vNotMaint:"",vDeleted:"",vNewDisbChainsAdded:[],sMARAChangeresults:[],sDisbChainChangeresults:[],sTaxChangeresults:[],sTextChangeresults:[],i18n:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),initializeTables:function(s){this.oS3Controller=s;sap.ui.getCore().byId("matCreateSalesDataLayout").removeAllContent();sap.ui.getCore().byId("matCreateSalesDataLayout").destroy();sap.ui.getCore().byId("matChangeSalesDataLayout").removeAllContent();this.vAdded=this.i18n.getText("PC_ADDED");this.vNotMaint="("+this.i18n.getText("PC_NOT_MAIN")+")";this.vDeleted=this.i18n.getText("PC_DELETED");},displayTableData:function(i,v){var I=this.createTableTemplate();var o=this.createTableTemplate();var a=this.createTableTemplate();var b=this.createSalesTextTableTemplate();this.bindSalesNDistributionChainTable(v,I,o,a,b);},bindSalesNDistributionChainTable:function(v,i,I,o,a){var d={Attr:"",EntityDesc:"",EntityName:"",AttributeDesc:"",NewValue:"",OldValue:"",NewValueText:"",OldValueText:"",VKORG:"",VTWEG:"",ALAND:"",TATYP:""};var m=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMARASalesDetailData();var s=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getSalesNDisbDetailData();var S=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMVKESalesTaxDetailData();var b=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMVKESalesTextDetailData();this.workOnMARASalesData(m,d,i,v);d=[];this.workOnSalesNDisbData(s,d,I,v);d=[];this.workOnSalesTaxData(S,d,o,v);d=[];this.workOnSalesTextData(b,d,a,v);if(this.sMARAChangeresults.length===0&&this.sDisbChainChangeresults.length===0&&this.sTaxChangeresults.length===0&&this.sTextChangeresults.length===0){sap.ui.getCore().byId("matChangeSalesDataLayout").removeAllContent();var n=this.i18n.getText("NodataChanged");var M=sap.ui.getCore().byId("matChangeSalesDataLayout");fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(M,n);}},workOnMARASalesData:function(m,d,I,v){var s={results:[]};var a=["MSTAV","KUNNR","TRAGR","VHART"];var A=["GEWTO","VOLTO","STFAK","ERVOL","ERGEW","ERGEI","ERVOE"];var b=["MSTDV"];var c=["KZGVH"];var e="";var o="";var O="";var n="";var N="";var f="";var g="";var u=false;var V=false;var U=false;var w=false;var h;var M=m.data.ChangeData;var l=fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(m.data.MATERIAL);for(var k=0;k<M.results.length;k++){if(M.results[k].EntityAction===fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vUpdatedEntity){d.AttributeDesc=M.results[k].AttributeDesc;e=M.results[k].Attribute;d.Attr=e;o=M.results[k].OldValue;O=M.results[k].OldValueText;n=M.results[k].NewValue;N=m.data.ChangeData.results[k].NewValueText;if(a.indexOf(e)!==-1){if(n!==o){if(o===""){o=this.vNotMaint;}else{o=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(o,O);}if(n===""&&o!==""){n=this.vDeleted;}else if(n!==""){n=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(n,N);}}d.NewValue=n;d.OldValue=o;d.EntityDesc=m.data.MATERIAL__TXT+" ("+l+")";s.results.push(d);d=[];}else if(A.indexOf(e)!==-1){if(n!==o){f=fcg.mdg.approvecrv2.util.Formatter.defaultValue(o);g=fcg.mdg.approvecrv2.util.Formatter.defaultValue(n);if(f===false){o=this.vNotMaint;}else{o=o;}if(g===false){n="("+this.vDeleted+")";}else{n=n;}}if(e==="ERVOL"){V=true;h=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.data.ERVOE,m.data.ERVOE__TXT);d.NewValue=n+" "+h;if(M.results[k].OldValue!=="0,000"){d.OldValue=o+" "+O;}else{d.OldValue=o;}}else if(e==="ERGEW"){w=true;h=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.data.ERGEI,m.data.ERGEI__TXT);d.NewValue=n+" "+h;if(M.results[k].OldValue!=="0,000"){d.OldValue=o+" "+O;}else{d.OldValue=o;}}else if(e==="ERVOE"||e==="ERGEI"){if(e==="ERVOE"){u=true;}if(e==="ERGEI"){U=true;}d.NewValue=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(n,N);if(M.results[k].OldValue!==""){d.OldValue=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(o,O);}else{d.OldValue=o;}}else{d.NewValue=n;d.OldValue=o;}d.EntityDesc=m.data.MATERIAL__TXT+" ("+l+")";s.results.push(d);d=[];}else if(b.indexOf(e)!==-1){if(n!==o){if(o===""||o==="00.00.0000"||o==="00,00,0000"){o=this.vNotMaint;}if(n===""||n==="00.00.0000"||n==="00,00,0000"){n=this.vDeleted;}}d.NewValue=n;d.OldValue=o;d.EntityDesc=m.data.MATERIAL__TXT+" ("+l+")";s.results.push(d);d=[];}else if(c.indexOf(e)!==-1){if(n!==o){if(o===""){o=this.vNotMaint;}if(n===""&&o!==""){o=fcg.mdg.approvecrv2.util.Formatter.checkBox(o);n="("+this.vDeleted+")";}else if(n!==""){n=fcg.mdg.approvecrv2.util.Formatter.checkBox(n);}}d.NewValue=n;d.OldValue=o;d.EntityDesc=m.data.MATERIAL__TXT+" ("+l+")";s.results.push(d);d=[];}}}var i=s.results.length;if(u===true&&V===true){while(i--){if(s.results[i]&&s.results[i].Attr==="ERVOE"){s.results.splice(i,1);break;}}}if(U===true&&w===true){i=s.results.length;while(i--){if(s.results[i]&&s.results[i].Attr==="ERGEI"){s.results.splice(i,1);break;}}}I.attachPress({Entity:m,name:'matSalesChangeDataDetail'},v.navtoSubDetail,v);var j=this.oS3Controller.matHookgetMARASalesResults(s);if(j!==undefined){s=j;}this.bindMaraSalesFormData(s,I);},workOnSalesNDisbData:function(s,d,I,v){var a={results:[]};var b="";var c="";var e="";var A="";var o="";var O="";var n="";var N="";var f="";var g="";var h=["MTPOS","DWERK","VMSTA","VRKME","MEGRU","SCHME","RDPRF","VERSG","BONUS","PROVG","PMATN","KONDM","PRODH","KTGRM","MTPOS","MVGR1","MVGR2","MVGR3","MVGR4","MVGR5","WRKSALES","PRAT1","PRAT2","PRAT3","PRAT4","PRAT5","PRAT6","PRAT7","PRAT8","PRAT9","PRATA","MEGSALES","RDPSALES"];var k=["SKTOF","VAVME"];var l=["AUMNG","LFMNG","SCMNG","EFMNG"];var m=["VMSTD"];var M=s.data.MATERIAL2MVKERel;for(var i=0;i<M.results.length;i++){if(M.results[i].ChangeData.results.length>0){switch(M.results[i].ChangeData.results[0].EntityAction){case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vNewEntity:{d.NewValue=this.vAdded;d.OldValue="";d.AttributeDesc="";d.VKORG=M.results[i].VKORG;d.VTWEG=M.results[i].VTWEG;b=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.results[i].VKORG,M.results[i].VKORG__TXT);c=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.results[i].VTWEG,M.results[i].VTWEG__TXT);d.EntityDesc=b+", "+c;d.EntityName=this.i18n.getText("SL_DIST_CHN");a.results.push(d);e=M.results[i].VKORG+M.results[i].VTWEG;this.vNewDisbChainsAdded.push(e);d=[];break;}case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vUpdatedEntity:{for(var j=0;j<M.results[i].ChangeData.results.length;j++){d.AttributeDesc=M.results[i].ChangeData.results[j].AttributeDesc;A=M.results[i].ChangeData.results[j].Attribute;o=M.results[i].ChangeData.results[j].OldValue;O=M.results[i].ChangeData.results[j].OldValueText;n=M.results[i].ChangeData.results[j].NewValue;N=M.results[i].ChangeData.results[j].NewValueText;if(h.indexOf(A)!==-1){if(n!==o){if(o===""){o=this.vNotMaint;}else{o=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(o,O);}if(n===""&&o!==""){n="("+this.vDeleted+")";}else if(n!==""){n=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(n,N);}}d.NewValue=n;d.OldValue=o;b=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.results[i].VKORG,M.results[i].VKORG__TXT);c=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.results[i].VTWEG,M.results[i].VTWEG__TXT);d.EntityDesc=b+", "+c;d.EntityName=this.i18n.getText("SL_DIST_CHN");d.VKORG=M.results[i].VKORG;d.VTWEG=M.results[i].VTWEG;a.results.push(d);d=[];}else if(k.indexOf(A)!==-1){if(n!==o){if(o===""){o=this.vNotMaint;}if(n===""&&o!==""){o=fcg.mdg.approvecrv2.util.Formatter.checkBox(o);n="("+this.vDeleted+")";}else if(n!==""){n=fcg.mdg.approvecrv2.util.Formatter.checkBox(n);}}d.NewValue=n;d.OldValue=o;b=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.results[i].VKORG,M.results[i].VKORG__TXT);c=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.results[i].VTWEG,M.results[i].VTWEG__TXT);d.EntityDesc=b+", "+c;d.EntityName=this.i18n.getText("SL_DIST_CHN");d.VKORG=M.results[i].VKORG;d.VTWEG=M.results[i].VTWEG;a.results.push(d);d=[];}else if(l.indexOf(A)!==-1){if(n!==o){f=fcg.mdg.approvecrv2.util.Formatter.defaultValue(o);g=fcg.mdg.approvecrv2.util.Formatter.defaultValue(n);if(f===false){o=this.vNotMaint;}else{o=o;}if(g===false){n="("+this.vDeleted+")";}else{n=n;}}if(A==="SCMNG"){d.AttributeDesc=this.i18n.getText("SL_DLVR_UNIT");}d.NewValue=n;d.OldValue=o;b=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.results[i].VKORG,M.results[i].VKORG__TXT);c=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.results[i].VTWEG,M.results[i].VTWEG__TXT);d.EntityDesc=b+", "+c;d.EntityName=this.i18n.getText("SL_DIST_CHN");d.VKORG=M.results[i].VKORG;d.VTWEG=M.results[i].VTWEG;a.results.push(d);d=[];}else if(m.indexOf(A)!==-1){if(n!==o){if(o===""||o==="00.00.0000"||o==="00,00,0000"){o=this.vNotMaint;}if(n===""||n==="00.00.0000"||n==="00,00,0000"){n=this.vDeleted;}}d.NewValue=n;d.OldValue=o;b=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.results[i].VKORG,M.results[i].VKORG__TXT);c=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(M.results[i].VTWEG,M.results[i].VTWEG__TXT);d.EntityDesc=b+", "+c;d.EntityName=this.i18n.getText("SL_DIST_CHN");d.VKORG=M.results[i].VKORG;d.VTWEG=M.results[i].VTWEG;a.results.push(d);d=[];}}}default:break;}}}I.attachPress({Entity:s,name:'matSalesNDisbChangeDataDetail'},v.navtoSubDetail,v);var p=this.oS3Controller.matHookgetChangeDisbChainResults(a);if(p!==undefined){a=p;}this.bindDistChainFormData(a,I);},workOnSalesTaxData:function(s,d,I,v){var D;var a={results:[]};var m=s.data.MATERIAL2MVKESALESRel;for(var i=0;i<m.results.length;i++){for(var j=0;j<m.results[i].MVKESALES2MLANSALESRel.results.length;j++){D=m.results[i].VKORG+m.results[i].VTWEG;if((this.vNewDisbChainsAdded.indexOf(D)===-1)){if(m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[0]!==undefined&&m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[0].EntityAction===fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vNewEntity){d.NewValue=this.vAdded;d.OldValue="";d.VKORG=m.results[i].VKORG;d.VTWEG=m.results[i].VTWEG;d.ALAND=m.results[i].MVKESALES2MLANSALESRel.results[j].ALAND;d.TATYP=m.results[i].MVKESALES2MLANSALESRel.results[j].TATYP;d.EntityDesc=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].MVKESALES2MLANSALESRel.results[j].ALAND,m.results[i].MVKESALES2MLANSALESRel.results[j].ALAND__TXT)+" / "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].MVKESALES2MLANSALESRel.results[j].TATYP,m.results[i].MVKESALES2MLANSALESRel.results[j].TATYP__TXT)+", "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].VKORG,m.results[i].VKORG__TXT)+" / "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].VTWEG,m.results[i].VTWEG__TXT);d.EntityName=this.i18n.getText("taxcat")+", "+this.i18n.getText("SL_DIST_CHN");a.results.push(d);d=[];}else if(m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[0]!==undefined&&m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[0].EntityAction===fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vUpdatedEntity){for(var k=0;k<m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results.length;k++){d.AttributeDesc=m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].AttributeDesc;d.NewValue=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].NewValue,m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].NewValueText);d.OldValue=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].OldValue,m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].OldValueText);if(m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].OldValue===""){d.OldValue=this.vNotMaint;}else{d.OldValue=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].OldValue,m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].OldValueText);}if(m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].NewValue===""&&m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].OldValue!==""){d.NewValue=this.vDeleted;}else if(m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].NewValue!==""){d.NewValue=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].NewValue,m.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].NewValueText);}d.VKORG=m.results[i].VKORG;d.VTWEG=m.results[i].VTWEG;d.ALAND=m.results[i].MVKESALES2MLANSALESRel.results[j].ALAND;d.TATYP=m.results[i].MVKESALES2MLANSALESRel.results[j].TATYP;d.EntityDesc=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].MVKESALES2MLANSALESRel.results[j].ALAND,m.results[i].MVKESALES2MLANSALESRel.results[j].ALAND__TXT)+" / "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].MVKESALES2MLANSALESRel.results[j].TATYP,m.results[i].MVKESALES2MLANSALESRel.results[j].TATYP__TXT)+", "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].VKORG,m.results[i].VKORG__TXT)+" / "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].VTWEG,m.results[i].VTWEG__TXT);d.EntityName=this.i18n.getText("taxcat")+", "+this.i18n.getText("SL_DIST_CHN");a.results.push(d);d=[];}}}}}I.attachPress({Entity:s,name:'matSalesTaxChangeDataDetail'},v.navtoSubDetail,v);var e=this.oS3Controller.matHookgetChangeSalesTaxResults(a);if(e!==undefined){a=e;}this.bindSalesTaxFormData(a,I);},workOnSalesTextData:function(s,d,I,v){var D;var a={results:[]};var m=s.data.MATERIAL2MVKESALESRel;for(var i=0;i<m.results.length;i++){for(var j=0;j<m.results[i].MVKESALES2SALESTXTRel.results.length;j++){D=m.results[i].VKORG+m.results[i].VTWEG;if((this.vNewDisbChainsAdded.indexOf(D)===-1)){if(m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0]!==undefined&&m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0].EntityAction===fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vNewEntity){d.NewValue=this.vAdded;d.OldValue="";d.EntityDesc=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE,m.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE__TXT)+", "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].VKORG,m.results[i].VKORG__TXT)+" / "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].VTWEG,m.results[i].VTWEG__TXT);d.EntityName=this.i18n.getText("Mat_Language")+", "+this.i18n.getText("SL_DIST_CHN");d.VKORG=m.results[i].VKORG;d.VTWEG=m.results[i].VTWEG;d.LANGUCODE=m.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE;a.results.push(d);d=[];}else if(m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0]!==undefined&&m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0].EntityAction===fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vUpdatedEntity){for(var k=0;k<m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results.length;k++){d.NewValue=fcg.mdg.approvecrv2.util.Formatter.Truncate(m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].NewValue);d.OldValue=fcg.mdg.approvecrv2.util.Formatter.Truncate(m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].OldValue);if(m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].OldValue===""){d.OldValue=this.vNotMaint;}else{d.OldValue=fcg.mdg.approvecrv2.util.Formatter.Truncate(m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].OldValue);}if(m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].NewValue===""&&m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].OldValue!==""){d.NewValue=this.vDeleted;}else if(m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].NewValue!==""){d.NewValue=fcg.mdg.approvecrv2.util.Formatter.Truncate(m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].NewValue);}d.EntityDesc=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE,m.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE__TXT)+", "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].VKORG,m.results[i].VKORG__TXT)+" / "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].VTWEG,m.results[i].VTWEG__TXT);d.EntityName=this.i18n.getText("Mat_Language")+", "+this.i18n.getText("SL_DIST_CHN");d.VKORG=m.results[i].VKORG;d.VTWEG=m.results[i].VTWEG;d.LANGUCODE=m.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE;a.results.push(d);d=[];}}else if(m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0]!==undefined&&m.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0].EntityAction===fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vDeletedEntity){d.NewValue=this.vDeleted;d.OldValue=m.results[i].MVKESALES2SALESTXTRel.results[j].TXTSALES;d.EntityDesc=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE,m.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE__TXT)+", "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].VKORG,m.results[i].VKORG__TXT)+" / "+fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(m.results[i].VTWEG,m.results[i].VTWEG__TXT);d.EntityName=this.i18n.getText("Mat_Language")+", "+this.i18n.getText("SL_DIST_CHN");d.VKORG=m.results[i].VKORG;d.VTWEG=m.results[i].VTWEG;d.LANGUCODE=m.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE;a.results.push(d);d=[];}}}}I.attachPress({Entity:s,name:'matSalesTextChangeDetail'},v.navtoSubDetail,v);var e=this.oS3Controller.matHookgetChangeSalesTextResults(a);if(e!==undefined){a=e;}this.bindSalesTextFormData(a,I);},bindMaraSalesFormData:function(g,i){if(g.results.length!==0){this.oMaterialMARASalesTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse',this);sap.ui.getCore().byId("matChangeSalesDataLayout").addContent(this.oMaterialMARASalesTable);this.oMaterialMARASalesTable.setGrowing(true);var s=new sap.ui.model.json.JSONModel();s.setData(g);this.oMaterialMARASalesTable.setModel(s);this.oMaterialMARASalesTable.bindItems('/results',i,'','');this.sMARAChangeresults=g;}},bindDistChainFormData:function(g,i){if(g.results.length!==0){this.oMaterialSalesDistributionChainTable="";this.strDistributionChain=this.i18n.getText("SL_DISTR");this.oMaterialSalesDistributionChainTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse',this);sap.ui.getCore().byId("matChangeSalesDataLayout").addContent(this.oMaterialSalesDistributionChainTable);this.oMaterialSalesDistributionChainTable.setGrowing(true);fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.oMaterialSalesDistributionChainTable,this.strDistributionChain);var s=new sap.ui.model.json.JSONModel();s.setData(g);this.oMaterialSalesDistributionChainTable.setModel(s);this.oMaterialSalesDistributionChainTable.bindItems('/results',i,'','');this.sDisbChainChangeresults=g;}},bindSalesTaxFormData:function(g,i){if(g.results.length!==0){this.oMaterialSalesTaxTable="";this.strSalesTax=this.i18n.getText("SL_TAX");this.oMaterialSalesTaxTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse',this);sap.ui.getCore().byId("matChangeSalesDataLayout").addContent(this.oMaterialSalesTaxTable);this.oMaterialSalesTaxTable.setGrowing(true);fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.oMaterialSalesTaxTable,this.strSalesTax);var s=new sap.ui.model.json.JSONModel();s.setData(g);this.oMaterialSalesTaxTable.setModel(s);this.oMaterialSalesTaxTable.bindItems('/results',i,'','');this.sTaxChangeresults=g;}},bindSalesTextFormData:function(g,i){if(g.results.length!==0){this.oMaterialSalesTextTable="";this.strSalesText=this.i18n.getText("SL_TEXT");this.oMaterialSalesTextTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse',this);sap.ui.getCore().byId("matChangeSalesDataLayout").addContent(this.oMaterialSalesTextTable);this.oMaterialSalesTextTable.setGrowing(true);fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.oMaterialSalesTextTable,this.strSalesText);var s=new sap.ui.model.json.JSONModel();s.setData(g);this.oMaterialSalesTextTable.setModel(s);this.oMaterialSalesTextTable.bindItems('/results',i,'','');this.sTextChangeresults=g;}},createTableTemplate:function(){var i=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.ObjectIdentifier({text:{path:"EntityName"},title:{path:"EntityDesc"}}).addStyleClass("text_bold"),new sap.m.ObjectIdentifier({text:{path:"AttributeDesc"},title:{path:"NewValue"}}),new sap.m.Text({text:{path:"OldValue"}})]});var e=this.oS3Controller.matHookchangeMatSalesTableTemplate(i);if(e!==undefined){i=e;}return i;},createSalesTextTableTemplate:function(){var i=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.ObjectIdentifier({text:{path:"EntityName"},title:{path:"EntityDesc"}}).addStyleClass("text_bold"),new sap.m.Text({text:{path:"NewValue"}}).addStyleClass("text_bold"),new sap.m.Text({text:{path:"OldValue"}})]});var e=this.oS3Controller.matHookchangeMatSalesTextTableTemplate(i);if(e!==undefined){i=e;}return i;}};
