import{j as e}from"./index-BI6CqlW9.js";import{r as s}from"./vendor-CPsC1ogL.js";import{L as r,I as t,S as d,h as c,E as a}from"./jspdf.es.min-ILeGbfip.js";import{S as x,a as l,b as m,c as o,d as n}from"./select-CO9Qt6ES.js";import{T as i,a as b,b as p,c as h,d as j,e as u}from"./table-QNZ-I2EH.js";import{G as N}from"./GradingGuidelines-CSLMrvoi.js";const f=({seriesNumber:s,category:d,setCategory:c,artistName:a,setArtistName:i,workTitle:b,setWorkTitle:p})=>e.jsxs("div",{className:"form-header mb-4 sm:mb-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4",children:[e.jsxs("div",{children:[e.jsx(r,{htmlFor:"series-number",className:"block text-xs sm:text-sm font-medium text-gray-700 mb-1",children:"심사번호"}),e.jsx(t,{id:"series-number",value:s,readOnly:!0,className:"w-full bg-[#e9ecef] cursor-not-allowed text-xs sm:text-sm py-1.5 sm:py-2"})]}),e.jsxs("div",{children:[e.jsx(r,{htmlFor:"category",className:"block text-xs sm:text-sm font-medium text-gray-700 mb-1",children:"부 문"}),e.jsxs(x,{value:d,onValueChange:c,children:[e.jsx(l,{id:"category",className:"text-xs sm:text-sm py-1.5 sm:py-2",children:e.jsx(m,{placeholder:"부문 선택..."})}),e.jsxs(o,{children:[e.jsx(n,{value:"한글서예",className:"text-xs sm:text-sm",children:"한글서예"}),e.jsx(n,{value:"한문서예",className:"text-xs sm:text-sm",children:"한문서예"}),e.jsx(n,{value:"현대서예",className:"text-xs sm:text-sm",children:"현대서예"}),e.jsx(n,{value:"캘리그라피",className:"text-xs sm:text-sm",children:"캘리그라피"}),e.jsx(n,{value:"전각・서각",className:"text-xs sm:text-sm",children:"전각・서각"}),e.jsx(n,{value:"문인화・동양화・민화",className:"text-xs sm:text-sm",children:"문인화・동양화・민화"})]})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4",children:[e.jsxs("div",{children:[e.jsx(r,{htmlFor:"artist-name",className:"block text-xs sm:text-sm font-medium text-gray-700 mb-1",children:"작가이름"}),e.jsx(t,{id:"artist-name",value:a,onChange:e=>i(e.target.value),className:"w-full text-xs sm:text-sm py-1.5 sm:py-2"})]}),e.jsxs("div",{children:[e.jsx(r,{htmlFor:"work-title",className:"block text-xs sm:text-sm font-medium text-gray-700 mb-1",children:"작품명제"}),e.jsx(t,{id:"work-title",value:b,onChange:e=>p(e.target.value),className:"w-full text-xs sm:text-sm py-1.5 sm:py-2"})]})]})]}),g=()=>e.jsxs("div",{className:"criteria-section mb-6 border-b border-border pb-4",children:[e.jsx("h3",{className:"text-base sm:text-lg md:text-xl font-medium mb-2 text-foreground border-b border-primary pb-2 inline-block",children:"심사기준"}),e.jsxs("ol",{className:"ml-4 sm:ml-5 pl-2 mb-4 text-xs sm:text-sm",children:[e.jsx("li",{className:"mb-1",children:"옛 법첩 기준 작품을 선정하되 서체별 구성, 여백, 조화, 묵색에 중점을 두고 작품성의 우열을 결정합니다."}),e.jsx("li",{className:"mb-1",children:"점획ㆍ결구ㆍ장법ㆍ조화의 완성미를 심사하되 아래 표의 여러 요소들을 비교 심사합니다."})]}),e.jsx("div",{className:"overflow-x-auto -mx-4 sm:mx-0",children:e.jsx("div",{className:"inline-block min-w-full align-middle p-1.5 sm:p-0",children:e.jsxs("table",{className:"w-full border-collapse border border-border mb-4 min-w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-muted",children:[e.jsx("th",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"점획(點劃)"}),e.jsx("th",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"결구(結構)"}),e.jsx("th",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"장법(章法)"}),e.jsx("th",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"조화(調和)"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"bg-card",children:[e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"방원(方圓)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"대소(大小)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"농담(濃淡)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"기운(氣韻)"})]}),e.jsxs("tr",{className:"bg-card",children:[e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"곡직(曲直)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"소밀(疏密)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"강유(剛柔)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"아속(雅俗)"})]}),e.jsxs("tr",{className:"bg-card",children:[e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"경중(輕重)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"허실(虛實)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"완급(緩急)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"미추(美醜)"})]}),e.jsxs("tr",{className:"bg-card",children:[e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"장로(藏露)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"향배(向背)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"여백(餘白)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"통변(通變)"})]}),e.jsxs("tr",{className:"bg-card",children:[e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"형질(形質)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"호응(呼應)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"구성(構成)"}),e.jsx("td",{className:"border border-border p-1 sm:p-2 text-center text-xs sm:text-sm",children:"창신(創新)"})]})]})]})})}),e.jsx("table",{className:"w-full border-collapse border border-border",children:e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"border border-border p-1 sm:p-2 text-center bg-muted w-[100px] text-xs sm:text-sm",children:"등급 기준"}),e.jsxs("td",{className:"border border-border p-1 sm:p-2 text-left pl-4 text-xs sm:text-sm",children:["A 등급: 90점 이상",e.jsx("br",{}),"B 등급: 80점 이상",e.jsx("br",{}),"C 등급: 70점 이상",e.jsx("br",{}),"D 등급: 70점 미만"]})]})})})]}),y=({pointsScore:s,structureScore:r,compositionScore:d,harmonyScore:c,totalScore:a,handleScoreClick:x,renderScoreRange:l})=>e.jsx("div",{className:"mb-6 border-b border-border pb-4",children:e.jsx("div",{className:"overflow-x-auto -mx-4 sm:mx-0",children:e.jsx("div",{className:"inline-block min-w-full align-middle p-1.5 sm:p-0",children:e.jsxs(i,{className:"border border-border min-w-full",children:[e.jsxs(b,{children:[e.jsxs(p,{children:[e.jsx(h,{rowSpan:2,className:"text-center bg-muted border border-border w-[20%] sm:w-[15%] text-xs sm:text-sm",children:"평가항목"}),e.jsx(h,{colSpan:5,className:"text-center bg-muted border border-border text-xs sm:text-sm",children:"득점 범위"}),e.jsx(h,{rowSpan:2,className:"text-center bg-muted border border-border w-[15%] sm:w-[12%] text-xs sm:text-sm",children:"획득점수"})]}),e.jsxs(p,{children:[e.jsx(h,{className:"text-center bg-muted border border-border w-[12%] text-xs",children:"1-5"}),e.jsx(h,{className:"text-center bg-muted border border-border w-[12%] text-xs",children:"6-10"}),e.jsx(h,{className:"text-center bg-muted border border-border w-[12%] text-xs",children:"11-15"}),e.jsx(h,{className:"text-center bg-muted border border-border w-[12%] text-xs",children:"16-20"}),e.jsx(h,{className:"text-center bg-muted border border-border w-[12%] text-xs",children:"21-25"})]})]}),e.jsxs(j,{children:[e.jsxs(p,{children:[e.jsx(u,{className:"text-center border border-border text-xs sm:text-sm",children:"점획(點劃)"}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("points",1,5)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("points",6,10)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("points",11,15)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("points",16,20)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("points",21,25)})}),e.jsx(u,{className:"text-center border border-border",children:e.jsx(t,{value:null!==s?s.toString():"",readOnly:!0,className:"text-center font-bold bg-muted w-[80%] mx-auto text-xs sm:text-sm"})})]}),e.jsxs(p,{children:[e.jsx(u,{className:"text-center border border-border text-xs sm:text-sm",children:"결구(結構)"}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("structure",1,5)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("structure",6,10)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("structure",11,15)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("structure",16,20)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("structure",21,25)})}),e.jsx(u,{className:"text-center border border-border",children:e.jsx(t,{value:null!==r?r.toString():"",readOnly:!0,className:"text-center font-bold bg-muted w-[80%] mx-auto text-xs sm:text-sm"})})]}),e.jsxs(p,{children:[e.jsx(u,{className:"text-center border border-border text-xs sm:text-sm",children:"장법(章法)"}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("composition",1,5)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("composition",6,10)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("composition",11,15)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("composition",16,20)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("composition",21,25)})}),e.jsx(u,{className:"text-center border border-border",children:e.jsx(t,{value:null!==d?d.toString():"",readOnly:!0,className:"text-center font-bold bg-muted w-[80%] mx-auto text-xs sm:text-sm"})})]}),e.jsxs(p,{children:[e.jsx(u,{className:"text-center border border-border text-xs sm:text-sm",children:"조화(調和)"}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("harmony",1,5)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("harmony",6,10)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("harmony",11,15)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("harmony",16,20)})}),e.jsx(u,{className:"text-center border border-border p-0.5 sm:p-1",children:e.jsx("div",{className:"flex justify-center space-x-0.5 sm:space-x-1",children:l("harmony",21,25)})}),e.jsx(u,{className:"text-center border border-border",children:e.jsx(t,{value:null!==c?c.toString():"",readOnly:!0,className:"text-center font-bold bg-muted w-[80%] mx-auto text-xs sm:text-sm"})})]}),e.jsxs(p,{children:[e.jsx(u,{colSpan:6,className:"text-right font-bold bg-muted border border-border text-xs sm:text-sm",children:"총점"}),e.jsx(u,{className:"text-center border border-border",children:e.jsx(t,{value:a.toString(),readOnly:!0,className:"text-center font-bold bg-muted w-[80%] mx-auto text-sm sm:text-base"})})]})]})]})})})}),v=()=>{const r=s.useRef(null),[t,x]=s.useState(""),[l,m]=s.useState(""),[o,n]=s.useState(""),[i,b]=s.useState(""),[p,h]=s.useState(""),[j,u]=s.useState(""),[v,S]=s.useState(null),[w,$]=s.useState(null),[k,_]=s.useState(null),[C,D]=s.useState(null),[F,O]=s.useState(0);s.useEffect((()=>{R(),L()}),[]),s.useEffect((()=>{T()}),[v,w,k,C]);const R=()=>{const e=new Date,s=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),t=String(e.getDate()).padStart(2,"0"),d=String(e.getHours()).padStart(2,"0"),c=String(e.getMinutes()).padStart(2,"0"),a=String(e.getSeconds()).padStart(2,"0");x(`${s}-${r}-${t}-${d}${c}${a}`)},L=()=>{const e=new Date,s=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),t=String(e.getDate()).padStart(2,"0");h(`${s}년 ${r}월 ${t}일`)},T=()=>{O((v||0)+(w||0)+(k||0)+(C||0))},A=(e,s)=>{switch(e){case"points":S(s);break;case"structure":$(s);break;case"composition":_(s);break;case"harmony":D(s)}};return e.jsxs("section",{className:"calligraphy-section",id:"evaluation-score-form",ref:r,children:[e.jsx("h2",{className:"calligraphy-section-title",children:"심사표"}),e.jsx(f,{seriesNumber:t,category:l,setCategory:m,artistName:o,setArtistName:n,workTitle:i,setWorkTitle:b}),e.jsx(g,{}),e.jsx(y,{pointsScore:v,structureScore:w,compositionScore:k,harmonyScore:C,totalScore:F,handleScoreClick:A,renderScoreRange:(s,r,t)=>{const d=[];for(let c=r;c<=t;c++)d.push(e.jsx("button",{onClick:()=>A(s,c),className:"w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center text-[9px] sm:text-[10px] md:text-xs border border-border rounded-md hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors \n            "+("points"===s&&v===c||"structure"===s&&w===c||"composition"===s&&k===c||"harmony"===s&&C===c?"bg-primary text-primary-foreground border-primary":"bg-card text-foreground"),children:c},c));return d}}),e.jsx(N,{}),e.jsx(d,{currentDate:p,signature:j,setSignature:u,handlePdfDownload:async()=>{if(r.current)try{const e=r.current;e.classList.add("pdf-generating");const s=e.querySelectorAll(".button-container");s.forEach((e=>e.style.display="none"));const t=await c(e,{scale:2,useCORS:!0,logging:!1,backgroundColor:"#ffffff"});s.forEach((e=>e.style.display=""));const d=new a({orientation:"portrait",unit:"mm",format:"a4"}),x=t.toDataURL("image/png"),m=d.internal.pageSize.getWidth(),n=d.internal.pageSize.getHeight(),i=t.width/t.height,b=15;d.setFontSize(16),d.text("심사표",m/2,b,{align:"center"});const h=m-2*b,u=h/i;d.addImage(x,"PNG",b,b+10,h,u);const N=n-b;d.setFontSize(10),d.text(`작성일: ${p}`,b,N-5),d.text(`심사위원장: ${j||"_______________"} (서명)`,m-b-80,N-5);const f=`심사표_${l||"전체"}_${o||"무제"}_${(new Date).toISOString().split("T")[0]}.pdf`;d.save(f),alert("심사표가 PDF로 저장되었습니다.")}catch(e){console.error("PDF 생성 오류:",e),alert("PDF 파일을 생성하는 중 오류가 발생했습니다.")}finally{r.current&&r.current.classList.remove("pdf-generating")}},handleCsvExport:()=>{try{let e=`\ufeff작성일:,${p}\n`;e+=`심사 부문:,${l}\n`,e+=`작품 번호:,${t}\n`,e+=`작가명:,${o}\n`,e+=`작품명:,${i}\n\n`,e+="평가 항목,배점,점수\n",e+=`필획의 정확성과 유창성,40,${v||0}\n`,e+=`구조와 자간,25,${w||0}\n`,e+=`구도와 여백,20,${k||0}\n`,e+=`조화와 창의성,15,${C||0}\n`,e+=`총점,100,${F}\n\n`,e+=`심사위원장:,${j}`;const s=new Blob([e],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(s),d=document.createElement("a"),c=`심사표_${l||"전체"}_${o||"무제"}_${(new Date).toISOString().split("T")[0]}.csv`;d.setAttribute("href",r),d.setAttribute("download",c),d.style.visibility="hidden",document.body.appendChild(d),d.click(),document.body.removeChild(d),URL.revokeObjectURL(r)}catch(e){console.error("CSV 생성 오류:",e),alert("CSV 파일을 생성하는 중 오류가 발생했습니다.")}}})]})};export{v as default};
