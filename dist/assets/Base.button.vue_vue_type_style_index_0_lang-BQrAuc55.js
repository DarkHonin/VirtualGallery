import{d as i,c as v,o as l,a as o,r as c,H as h,t as y,j as r,g as b,B as f,C as B,p as m,h as V}from"./index-DqsONkSA.js";const $={class:"base-input"},w={key:0,class:"base-input__label text-label-primary py-2 underline"},k={class:"base-input__control text-input-primary"},N=["type","required","placeholder","value"],I=i({__name:"Base.input",props:{type:{default:()=>"text"},required:{type:Boolean},label:{},placeholder:{},modelValue:{type:[String,Number,Boolean,null,Object,Array]}},emits:["update:modelValue"],setup(n,{emit:t}){const e=n,s=t,_=v(()=>{const a=e.type;switch(a){case"float":case"int":return"number";default:return a}}),u=a=>{const p=a.target,g=e.type,d=p.value;switch(g){case"float":return s("update:modelValue",parseFloat(d));case"int":return s("update:modelValue",parseInt(d));default:s("update:modelValue",d)}};return(a,p)=>(l(),o("label",$,[a.label||a.$slots.label?(l(),o("div",w,[c(a.$slots,"label",{},()=>[h(y(a.label),1)])])):r("",!0),b("div",k,[c(a.$slots,"control",f(B({handleUpdate:u})),()=>[b("input",{class:"px-2 invalid:border-red-500 w-full",type:_.value,required:a.required,placeholder:a.placeholder,value:a.modelValue,onInput:u},null,40,N)])])]))}}),q={key:0,class:"loader-base absolute h-1 w-full inline-flex animate-pulse bg-primary"},z=i({__name:"Base.loader",props:{loading:{type:Boolean},size:{},message:{}},setup(n){return(t,e)=>t.loading?(l(),o("div",q)):r("",!0)}}),C={class:"relative button-base"},P=["disabled"],S=["value","disabled"],T=i({__name:"Base.button",props:{type:{default:()=>"button"},disabled:{type:Boolean},label:{},color:{default:()=>"primary"},loading:{type:Boolean},size:{},message:{}},setup(n){const t={primary:"bg-button-primary",positive:"bg-button-positive",negative:"bg-button-negative"};return(e,s)=>(l(),o("div",C,[e.type=="button"?(l(),o("button",{key:0,class:m(["button-base__control border-button-border border-2 p-2 rounded my-2 active:bg-primary-active select-none text-center disabled:cursor-not-allowed",t[e.color]]),disabled:e.disabled||e.loading},y(e.label),11,P)):r("",!0),e.type=="submit"?(l(),o("input",{key:1,value:e.label,disabled:e.disabled||e.loading,type:"submit",class:m(["button-base__control p-2 rounded my-2 w-full active:bg-primary-active select-none text-center disabled:bg-primary-disabled disabled:cursor-not-allowed",t[e.color]])},null,10,S)):r("",!0),V(z,{class:"absolute bottom-1 left-0",loading:e.loading},null,8,["loading"])]))}});export{I as _,T as a};